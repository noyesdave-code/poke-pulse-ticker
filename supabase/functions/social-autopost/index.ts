import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TELEGRAM_GATEWAY_URL = 'https://connector-gateway.lovable.dev/telegram';

const PROMOS = [
  {
    tier: 1,
    title: "🎯 Pulse Market Terminal — FREE Tier",
    body: "Real-time Pokémon TCG price tracking, portfolio management, and market signals.\n\nStart for FREE → pulsemarketindex.com\n\n#PokemonTCG #CardInvesting #PulseMarketTerminal #Pokemon #TradingCards",
  },
  {
    tier: 2,
    title: "📊 Pulse Pro — Advanced Analytics",
    body: "Alpha signals, arbitrage finder, whale reports & AI insights. Level up your card investing game.\n\npulsemarketindex.com\n\n#PokemonCards #CardMarket #PulsePro #Investing #TCG",
  },
  {
    tier: 3,
    title: "🏟️ Pulse Arena — Compete & Earn",
    body: "PokéCoin wagering, prediction duels, tournaments & leaderboards. The ultimate card trading arena.\n\npulsemarketindex.com\n\n#PulseArena #PokemonCompetitive #TradingCards #Gaming",
  },
  {
    tier: 4,
    title: "🏢 Pulse Franchise — Own Your Market",
    body: "White-label the entire Pulse engine for ANY collectible vertical. Sports, TCG, vintage — your brand, our tech.\n\npulsemarketindex.com\n\n#Franchise #BusinessOpportunity #Collectibles #Startup",
  },
  {
    tier: 5,
    title: "🏛️ Pulse Philanthropic™ — The National Museum",
    body: "The National Museum of Trading Cards & Collectibles — Washington, D.C.\nFree to the public, forever. A Noyes Family Trust venture.\n\npulsemarketindex.com\n\n#Museum #TradingCards #Culture #Philanthropy",
  },
];

function getCurrentPromo(): typeof PROMOS[0] {
  const hoursSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60));
  const tierIndex = Math.floor(hoursSinceEpoch / 2) % 5;
  return PROMOS[tierIndex];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    const TELEGRAM_API_KEY = Deno.env.get('TELEGRAM_API_KEY');
    if (!TELEGRAM_API_KEY) throw new Error('TELEGRAM_API_KEY is not configured');

    const promo = getCurrentPromo();
    const message = `<b>${promo.title}</b>\n\n${promo.body}`;
    const results: Record<string, any> = {};

    // --- TELEGRAM ---
    // Post to Telegram channel (set your channel ID/username below)
    const TELEGRAM_CHANNEL = Deno.env.get('TELEGRAM_CHANNEL_ID') || '@pokegarageva';

    const tgResponse = await fetch(`${TELEGRAM_GATEWAY_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': TELEGRAM_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHANNEL,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const tgData = await tgResponse.json();
    results.telegram = {
      success: tgResponse.ok,
      message_id: tgData?.result?.message_id,
      error: tgResponse.ok ? null : tgData,
    };

    // --- BUFFER (if configured) ---
    const BUFFER_API_KEY = Deno.env.get('BUFFER_API_KEY');
    if (BUFFER_API_KEY) {
      try {
        // Get Buffer profiles
        const profilesRes = await fetch('https://api.bufferapp.com/1/profiles.json', {
          headers: { 'Authorization': `Bearer ${BUFFER_API_KEY}` },
        });
        const profiles = await profilesRes.json();

        if (Array.isArray(profiles)) {
          for (const profile of profiles) {
            const postRes = await fetch('https://api.bufferapp.com/1/updates/create.json', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${BUFFER_API_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                text: `${promo.title}\n\n${promo.body}`,
                profile_ids: profile.id,
                now: 'true',
              }),
            });
            const postData = await postRes.json();
            results[`buffer_${profile.service}`] = {
              success: postData.success ?? false,
              profile: profile.service,
              error: postData.success ? null : postData.message,
            };
          }
        }
      } catch (bufferErr) {
        results.buffer = { success: false, error: String(bufferErr) };
      }
    } else {
      results.buffer = { skipped: true, reason: 'BUFFER_API_KEY not configured' };
    }

    return new Response(JSON.stringify({
      ok: true,
      tier: promo.tier,
      title: promo.title,
      posted_at: new Date().toISOString(),
      results,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Social autopost error:', msg);
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
