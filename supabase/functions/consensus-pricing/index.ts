import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const POKEMON_TCG_BASE = "https://api.pokemontcg.io/v2";

interface PriceSource {
  source: string;
  variant: string;
  price: number;
  low: number;
  high: number;
  shipping: number;
  condition: string;
  url: string;
  isLive: boolean;
  updatedAt: string | null;
}

interface ConsensusResult {
  consensusPrice: number;
  confidence: number; // 0-100
  sources: PriceSource[];
  spread: number; // % difference between highest and lowest
  recommendation: "buy" | "hold" | "wait";
  fairValueRange: { low: number; high: number };
}

/**
 * Deterministic hash for generating consistent simulated prices
 */
function simHash(str: string, offset: number): number {
  let h = offset;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function generateEstimate(base: number, seed: number, biasPercent: number): number {
  const hash = ((seed * 2654435761) >>> 0) / 4294967296;
  const variance = (hash - 0.45) * base * 0.12;
  return Math.max(base * 0.7, base + variance + base * biasPercent / 100);
}

/**
 * Fetch TCGPlayer price from pokemontcg.io
 */
async function fetchTcgPlayerPrice(cardId: string): Promise<PriceSource[]> {
  const apiKey = Deno.env.get("POKEMON_TCG_API_KEY");
  const headers: Record<string, string> = {};
  if (apiKey) headers["X-Api-Key"] = apiKey;

  const res = await fetch(`${POKEMON_TCG_BASE}/cards/${cardId}`, { headers });
  if (!res.ok) {
    await res.text();
    return [];
  }

  const { data: card } = await res.json();
  if (!card?.tcgplayer?.prices) return [];

  const sources: PriceSource[] = [];
  const priorities = ["1stEditionHolofoil", "holofoil", "1stEditionNormal", "reverseHolofoil", "normal"];

  for (const variant of priorities) {
    const p = card.tcgplayer.prices[variant];
    if (p?.market) {
      sources.push({
        source: "TCGPlayer",
        variant,
        price: p.market,
        low: p.low ?? p.market * 0.8,
        high: p.high ?? p.market * 1.2,
        shipping: 0,
        condition: "Near Mint",
        url: card.tcgplayer.url || `https://www.tcgplayer.com/search/pokemon/product?q=${encodeURIComponent(card.name)}`,
        isLive: true,
        updatedAt: card.tcgplayer.updatedAt || null,
      });
    }
  }
  return sources;
}

/**
 * Fetch eBay prices (real if API key set, estimated otherwise)
 */
async function fetchEbayPrice(cardName: string, setName: string, cardId: string, tcgPrice: number): Promise<PriceSource[]> {
  const ebayKey = Deno.env.get("EBAY_API_KEY");
  const seed = simHash(cardId, 42);

  if (ebayKey) {
    // Real eBay Browse API call
    try {
      const query = encodeURIComponent(`${cardName} ${setName} pokemon card`);
      const res = await fetch(
        `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${query}&limit=5&filter=conditionIds:{1000|1500|2000|2500|3000}&sort=-price`,
        {
          headers: {
            Authorization: `Bearer ${ebayKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        const items = data.itemSummaries || [];
        if (items.length > 0) {
          const prices = items
            .map((i: any) => parseFloat(i.price?.value || "0"))
            .filter((p: number) => p > 0);
          if (prices.length > 0) {
            const avg = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;
            return [{
              source: "eBay",
              variant: "Buy It Now",
              price: Math.round(avg * 100) / 100,
              low: Math.round(Math.min(...prices) * 100) / 100,
              high: Math.round(Math.max(...prices) * 100) / 100,
              shipping: 0,
              condition: "Near Mint",
              url: `https://www.ebay.com/sch/i.html?_nkw=${query}`,
              isLive: true,
              updatedAt: new Date().toISOString(),
            }];
          }
        }
      } else {
        await res.text();
      }
    } catch (e) {
      console.error("eBay API error:", e);
    }
  }

  // Estimated eBay prices
  const binPrice = Math.round(generateEstimate(tcgPrice, seed + 1, 5) * 100) / 100;
  const auctionPrice = Math.round(generateEstimate(tcgPrice, seed + 2, -8) * 100) / 100;
  const searchQuery = encodeURIComponent(`${cardName} ${setName} pokemon`);

  return [
    {
      source: "eBay",
      variant: "Buy It Now",
      price: binPrice,
      low: Math.round(binPrice * 0.9 * 100) / 100,
      high: Math.round(binPrice * 1.1 * 100) / 100,
      shipping: seed % 3 === 0 ? 0 : Math.round((2.5 + (seed % 4)) * 100) / 100,
      condition: "Near Mint",
      url: `https://www.ebay.com/sch/i.html?_nkw=${searchQuery}`,
      isLive: false,
      updatedAt: null,
    },
    {
      source: "eBay",
      variant: "Auction Avg",
      price: auctionPrice,
      low: Math.round(auctionPrice * 0.85 * 100) / 100,
      high: Math.round(auctionPrice * 1.15 * 100) / 100,
      shipping: Math.round((3 + (seed % 3)) * 100) / 100,
      condition: "Various",
      url: `https://www.ebay.com/sch/i.html?_nkw=${searchQuery}&LH_Auction=1`,
      isLive: false,
      updatedAt: null,
    },
  ];
}

/**
 * Fetch PriceCharting price (real if API key set, estimated otherwise)
 */
async function fetchPriceChartingPrice(cardName: string, setName: string, cardId: string, tcgPrice: number): Promise<PriceSource[]> {
  const pcKey = Deno.env.get("PRICECHARTING_API_KEY");
  const seed = simHash(cardId, 99);

  if (pcKey) {
    try {
      const query = encodeURIComponent(`${cardName} ${setName}`);
      const res = await fetch(
        `https://www.pricecharting.com/api/products?t=${pcKey}&q=${query}&type=pokemon-cards`,
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.ok) {
        const data = await res.json();
        const products = data.products || [];
        if (products.length > 0) {
          const p = products[0];
          const price = (p["loose-price"] || p["cib-price"] || 0) / 100; // PriceCharting returns cents
          if (price > 0) {
            return [{
              source: "PriceCharting",
              variant: "Ungraded",
              price: Math.round(price * 100) / 100,
              low: Math.round(price * 0.85 * 100) / 100,
              high: Math.round(price * 1.15 * 100) / 100,
              shipping: 0,
              condition: "Ungraded",
              url: `https://www.pricecharting.com/search-products?q=${query}&type=pokemon-cards`,
              isLive: true,
              updatedAt: new Date().toISOString(),
            }];
          }
        }
      } else {
        await res.text();
      }
    } catch (e) {
      console.error("PriceCharting API error:", e);
    }
  }

  // Estimated PriceCharting prices
  const estPrice = Math.round(generateEstimate(tcgPrice, seed + 3, -3) * 100) / 100;
  const estLow = Math.round(generateEstimate(tcgPrice, seed + 4, -15) * 100) / 100;
  const searchQuery = encodeURIComponent(`${cardName} ${setName}`);

  return [
    {
      source: "PriceCharting",
      variant: "Ungraded",
      price: estPrice,
      low: Math.round(estPrice * 0.85 * 100) / 100,
      high: Math.round(estPrice * 1.15 * 100) / 100,
      shipping: Math.round((1.5 + (seed % 5) * 0.5) * 100) / 100,
      condition: "Ungraded",
      url: `https://www.pricecharting.com/search-products?q=${searchQuery}&type=pokemon-cards`,
      isLive: false,
      updatedAt: null,
    },
    {
      source: "PriceCharting",
      variant: "PSA 10",
      price: Math.round(tcgPrice * (2.5 + (seed % 30) / 10) * 100) / 100,
      low: Math.round(tcgPrice * 2 * 100) / 100,
      high: Math.round(tcgPrice * 5 * 100) / 100,
      shipping: 0,
      condition: "PSA 10",
      url: `https://www.pricecharting.com/search-products?q=${searchQuery}&type=pokemon-cards`,
      isLive: false,
      updatedAt: null,
    },
  ];
}

/**
 * Calculate consensus from multiple sources
 */
function calculateConsensus(sources: PriceSource[]): ConsensusResult {
  const liveSources = sources.filter(s => s.isLive);
  const allPrices = sources.map(s => s.price).filter(p => p > 0);

  if (allPrices.length === 0) {
    return {
      consensusPrice: 0,
      confidence: 0,
      sources,
      spread: 0,
      recommendation: "hold",
      fairValueRange: { low: 0, high: 0 },
    };
  }

  // Weighted average: live sources get 3x weight
  let totalWeight = 0;
  let weightedSum = 0;
  for (const s of sources) {
    if (s.price <= 0) continue;
    const weight = s.isLive ? 3 : 1;
    weightedSum += s.price * weight;
    totalWeight += weight;
  }
  const consensusPrice = Math.round((weightedSum / totalWeight) * 100) / 100;

  // Confidence based on source count + live ratio
  const liveCount = liveSources.length;
  const sourceCount = new Set(sources.map(s => s.source)).size;
  let confidence = Math.min(100, sourceCount * 25 + liveCount * 15);
  
  // Reduce confidence if spread is high
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const spread = maxPrice > 0 ? Math.round(((maxPrice - minPrice) / maxPrice) * 100) : 0;
  if (spread > 20) confidence = Math.max(20, confidence - (spread - 20));

  // Fair value range: 25th to 75th percentile
  const sorted = [...allPrices].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)] || sorted[0];
  const q3 = sorted[Math.floor(sorted.length * 0.75)] || sorted[sorted.length - 1];

  // Recommendation
  const lowestTotal = Math.min(...sources.map(s => s.price + s.shipping));
  let recommendation: "buy" | "hold" | "wait" = "hold";
  if (lowestTotal < consensusPrice * 0.92) recommendation = "buy";
  else if (lowestTotal > consensusPrice * 1.08) recommendation = "wait";

  return {
    consensusPrice,
    confidence,
    sources: sources.sort((a, b) => (a.price + a.shipping) - (b.price + b.shipping)),
    spread,
    recommendation,
    fairValueRange: {
      low: Math.round(q1 * 100) / 100,
      high: Math.round(q3 * 100) / 100,
    },
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cardId, cardName, setName } = await req.json();

    if (!cardId || !cardName) {
      return new Response(
        JSON.stringify({ error: "cardId and cardName are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch from all sources in parallel
    const tcgSources = await fetchTcgPlayerPrice(cardId);
    const tcgBasePrice = tcgSources.length > 0 ? tcgSources[0].price : 0;

    if (tcgBasePrice === 0) {
      return new Response(
        JSON.stringify({ error: "Could not fetch base price for this card" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const [ebaySources, pcSources] = await Promise.all([
      fetchEbayPrice(cardName, setName || "", cardId, tcgBasePrice),
      fetchPriceChartingPrice(cardName, setName || "", cardId, tcgBasePrice),
    ]);

    const allSources = [...tcgSources, ...ebaySources, ...pcSources];
    const consensus = calculateConsensus(allSources);

    // Track which APIs are live
    const apiStatus = {
      tcgplayer: tcgSources.some(s => s.isLive),
      ebay: ebaySources.some(s => s.isLive),
      pricecharting: pcSources.some(s => s.isLive),
    };

    return new Response(
      JSON.stringify({ ...consensus, apiStatus }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Consensus pricing error:", msg);
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
