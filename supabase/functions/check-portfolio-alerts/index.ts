import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

const POKEMON_TCG_BASE = 'https://api.pokemontcg.io/v2'

interface PortfolioCard {
  card_api_id: string
  card_name: string
  card_set: string
  card_number: string
  quantity: number
  purchase_price: number | null
  user_id: string
}

interface PriceResult {
  market: number
  variant: string
}

function getBestPrice(prices: Record<string, any>): PriceResult | null {
  const priorities = [
    '1stEditionHolofoil',
    'holofoil',
    '1stEditionNormal',
    'reverseHolofoil',
    'normal',
  ]
  for (const variant of priorities) {
    if (prices[variant]?.market) {
      return { market: prices[variant].market, variant }
    }
  }
  return null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const pokemonApiKey = Deno.env.get('POKEMON_TCG_API_KEY')

  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(JSON.stringify({ error: 'Missing env vars' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // 1. Get all users with email alerts enabled
  const { data: prefs, error: prefsErr } = await supabase
    .from('notification_preferences')
    .select('user_id, alert_threshold')
    .eq('email_portfolio_alerts', true)

  if (prefsErr || !prefs?.length) {
    console.log('No users with alerts enabled', prefsErr)
    return new Response(
      JSON.stringify({ processed: 0, reason: prefsErr ? 'error' : 'no_users' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // 2. Get portfolio cards for those users
  const userIds = prefs.map((p) => p.user_id)
  const { data: portfolioCards, error: cardsErr } = await supabase
    .from('portfolio_cards')
    .select('card_api_id, card_name, card_set, card_number, quantity, purchase_price, user_id')
    .in('user_id', userIds)

  if (cardsErr || !portfolioCards?.length) {
    console.log('No portfolio cards found', cardsErr)
    return new Response(
      JSON.stringify({ processed: 0, reason: 'no_cards' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // 3. Get unique card IDs and fetch current prices from Pokémon TCG API
  const uniqueCardIds = [...new Set(portfolioCards.map((c) => c.card_api_id))]

  const priceMap = new Map<string, number>()

  // Fetch in batches of 20
  for (let i = 0; i < uniqueCardIds.length; i += 20) {
    const batch = uniqueCardIds.slice(i, i + 20)
    const query = batch.map((id) => `id:${id}`).join(' OR ')

    try {
      const apiHeaders: Record<string, string> = {}
      if (pokemonApiKey) apiHeaders['X-Api-Key'] = pokemonApiKey

      const res = await fetch(
        `${POKEMON_TCG_BASE}/cards?q=${encodeURIComponent(query)}&pageSize=50&select=id,tcgplayer`,
        { headers: apiHeaders }
      )

      if (!res.ok) {
        console.error('API fetch failed', res.status)
        continue
      }

      const json = await res.json()
      for (const card of json.data || []) {
        if (card.tcgplayer?.prices) {
          const best = getBestPrice(card.tcgplayer.prices)
          if (best) priceMap.set(card.id, best.market)
        }
      }
    } catch (err) {
      console.error('Price fetch error', err)
    }

    // Small delay between batches
    if (i + 20 < uniqueCardIds.length) {
      await new Promise((r) => setTimeout(r, 300))
    }
  }

  // 4. Get user emails from auth
  const { data: { users: authUsers }, error: authErr } = await supabase.auth.admin.listUsers()
  if (authErr) {
    console.error('Failed to list users', authErr)
    return new Response(JSON.stringify({ error: 'Failed to list users' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const emailMap = new Map<string, string>()
  for (const u of authUsers || []) {
    if (u.email) emailMap.set(u.id, u.email)
  }

  // 5. Get display names
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name')
    .in('id', userIds)

  const nameMap = new Map<string, string>()
  for (const p of profiles || []) {
    if (p.display_name) nameMap.set(p.id, p.display_name)
  }

  // 6. Get last snapshot per user to compute change
  const { data: snapshots } = await supabase
    .from('portfolio_snapshots')
    .select('user_id, total_value, snapshot_date')
    .in('user_id', userIds)
    .order('snapshot_date', { ascending: false })

  const lastSnapshotMap = new Map<string, number>()
  for (const s of snapshots || []) {
    if (!lastSnapshotMap.has(s.user_id)) {
      lastSnapshotMap.set(s.user_id, Number(s.total_value))
    }
  }

  // 7. For each user, compute movements and send email if threshold exceeded
  let emailsSent = 0
  const thresholdMap = new Map<string, number>()
  for (const p of prefs) {
    thresholdMap.set(p.user_id, Number(p.alert_threshold))
  }

  // Group cards by user
  const userCards = new Map<string, PortfolioCard[]>()
  for (const card of portfolioCards) {
    if (!userCards.has(card.user_id)) userCards.set(card.user_id, [])
    userCards.get(card.user_id)!.push(card as PortfolioCard)
  }

  for (const [userId, cards] of userCards) {
    const threshold = thresholdMap.get(userId) ?? 5
    const email = emailMap.get(userId)
    if (!email) continue

    // Compute current portfolio value
    let currentValue = 0
    const movements: Array<{
      cardName: string
      cardSet: string
      oldPrice: string
      newPrice: string
      changePercent: string
      direction: string
    }> = []

    for (const card of cards) {
      const currentPrice = priceMap.get(card.card_api_id)
      if (!currentPrice) continue

      currentValue += currentPrice * card.quantity

      // Compare against purchase price if available
      if (card.purchase_price) {
        const purchasePrice = Number(card.purchase_price)
        const changePct = ((currentPrice - purchasePrice) / purchasePrice) * 100

        if (Math.abs(changePct) >= threshold) {
          movements.push({
            cardName: card.card_name,
            cardSet: card.card_set,
            oldPrice: `$${purchasePrice.toFixed(2)}`,
            newPrice: `$${currentPrice.toFixed(2)}`,
            changePercent: `${changePct >= 0 ? '+' : ''}${changePct.toFixed(1)}%`,
            direction: changePct >= 0 ? 'up' : 'down',
          })
        }
      }
    }

    // Also check total portfolio change vs last snapshot
    const lastValue = lastSnapshotMap.get(userId)
    let totalChange: string | undefined
    let portfolioChangePct = 0

    if (lastValue && lastValue > 0) {
      portfolioChangePct = ((currentValue - lastValue) / lastValue) * 100
      totalChange = `${portfolioChangePct >= 0 ? '+' : ''}${portfolioChangePct.toFixed(1)}%`
    }

    // Only send if we have movements or portfolio change exceeds threshold
    const shouldSend =
      movements.length > 0 ||
      (lastValue && Math.abs(portfolioChangePct) >= threshold)

    if (!shouldSend) continue

    // Send email via send-transactional-email
    try {
      await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'portfolio-price-alert',
          recipientEmail: email,
          idempotencyKey: `portfolio-alert-${userId}-${new Date().toISOString().slice(0, 10)}`,
          templateData: {
            displayName: nameMap.get(userId) || undefined,
            totalPortfolioValue: `$${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            totalChange,
            movements: movements.slice(0, 10), // Cap at 10 movements
          },
        },
      })
      emailsSent++
      console.log('Alert sent', { userId, movements: movements.length })
    } catch (err) {
      console.error('Failed to send alert', { userId, error: err })
    }

    // Small delay between sends
    await new Promise((r) => setTimeout(r, 200))
  }

  return new Response(
    JSON.stringify({ processed: userCards.size, emailsSent }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
})
