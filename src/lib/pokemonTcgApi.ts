import type { CardData, SealedProduct } from "@/data/marketData";

const BASE_URL = "https://api.pokemontcg.io/v2";

export interface PokemonTCGCard {
  id: string;
  name: string;
  number: string;
  set: {
    id: string;
    name: string;
    series: string;
  };
  images: {
    small: string;
    large: string;
  };
  tcgplayer?: {
    url: string;
    updatedAt: string;
    prices: {
      normal?: { low: number; mid: number; high: number; market: number; directLow?: number };
      holofoil?: { low: number; mid: number; high: number; market: number; directLow?: number };
      reverseHolofoil?: { low: number; mid: number; high: number; market: number; directLow?: number };
      "1stEditionHolofoil"?: { low: number; mid: number; high: number; market: number; directLow?: number };
      "1stEditionNormal"?: { low: number; mid: number; high: number; market: number; directLow?: number };
    };
  };
  rarity?: string;
  supertype: string;
}

interface APIResponse {
  data: PokemonTCGCard[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
}

const headers: Record<string, string> = {};

/**
 * Fetch cards from the Pokémon TCG API
 */
export async function fetchCards(query: string, pageSize = 50, page = 1): Promise<APIResponse> {
  const params = new URLSearchParams({
    q: query,
    pageSize: String(pageSize),
    page: String(page),
    orderBy: "-tcgplayer.prices.holofoil.market",
  });

  const res = await fetch(`${BASE_URL}/cards?${params}`, { headers });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

/**
 * Search cards by name
 */
export async function searchCards(name: string, pageSize = 20): Promise<PokemonTCGCard[]> {
  const params = new URLSearchParams({
    q: `name:"${name}"`,
    pageSize: String(pageSize),
    orderBy: "-tcgplayer.prices.holofoil.market",
  });

  const res = await fetch(`${BASE_URL}/cards?${params}`, { headers });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data: APIResponse = await res.json();
  return data.data;
}

/**
 * Get a single card by ID
 */
export async function fetchCardById(id: string): Promise<PokemonTCGCard> {
  const res = await fetch(`${BASE_URL}/cards/${id}`, { headers });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data.data;
}

/**
 * Fetch high-value vintage cards with pricing data
 */
export async function fetchHighValueCards(pageSize = 30): Promise<PokemonTCGCard[]> {
  // Fetch vintage holo rares that tend to have prices
  const sets = [
    "base1", "base2", "base3", "base4", "base5", "base6",
    "neo1", "neo2", "neo3", "neo4",
    "ecard1", "ecard2", "ecard3",
    "gym1", "gym2",
  ];
  const setFilter = sets.map((s) => `set.id:${s}`).join(" OR ");

  const params = new URLSearchParams({
    q: `(${setFilter}) rarity:"Rare Holo"`,
    pageSize: String(pageSize),
    page: "1",
  });

  const res = await fetch(`${BASE_URL}/cards?${params}`, { headers });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data: APIResponse = await res.json();
  return data.data;
}

/**
 * Get the best available price from a card's tcgplayer data
 */
export function getBestPrice(card: PokemonTCGCard): {
  market: number;
  low: number;
  mid: number;
  high: number;
  variant: string;
} | null {
  if (!card.tcgplayer?.prices) return null;

  const priorities = [
    "1stEditionHolofoil",
    "holofoil",
    "1stEditionNormal",
    "reverseHolofoil",
    "normal",
  ] as const;

  for (const variant of priorities) {
    const p = card.tcgplayer.prices[variant];
    if (p?.market) {
      return {
        market: p.market,
        low: p.low ?? p.market * 0.8,
        mid: p.mid ?? p.market,
        high: p.high ?? p.market * 1.2,
        variant,
      };
    }
  }
  return null;
}

/**
 * Convert a PokemonTCGCard into our local CardData format
 */
export function toCardData(card: PokemonTCGCard): CardData | null {
  const price = getBestPrice(card);
  if (!price) return null;

  // Generate a pseudo-random change percentage based on card id hash
  const hash = card.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const change = ((hash % 1000) / 100 - 5); // -5% to +5%

  return {
    name: card.name,
    set: card.set.name,
    number: card.number,
    market: price.market,
    low: price.low,
    mid: price.mid,
    change: Math.round(change * 100) / 100,
    volume: Math.floor((hash % 50) + 5),
    _apiId: card.id,
    _image: card.images.small,
    _variant: price.variant,
  } as CardData & { _apiId: string; _image: string; _variant: string };
}
