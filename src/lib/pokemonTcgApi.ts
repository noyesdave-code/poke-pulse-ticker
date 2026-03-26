import { supabase } from "@/integrations/supabase/client";
import type { CardData } from "@/data/marketData";

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const PROXY_URL = `https://${PROJECT_ID}.supabase.co/functions/v1/pokemon-proxy`;

export interface PokemonTCGSet {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  releaseDate: string;
  updatedAt: string;
  images: {
    symbol: string;
    logo: string;
  };
  legalities?: Record<string, string>;
}

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

async function proxyFetch(path: string, params?: Record<string, string>): Promise<any> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(PROXY_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ path, params }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `Proxy error: ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch all sets
 */
export async function fetchSets(): Promise<PokemonTCGSet[]> {
  const data = await proxyFetch("/sets", {
    orderBy: "-releaseDate",
    pageSize: "250",
  });
  return data.data;
}

/**
 * Fetch cards for a specific set
 */
export async function fetchSetCards(setId: string, page = 1, pageSize = 50): Promise<{ cards: PokemonTCGCard[]; totalCount: number }> {
  const data: APIResponse = await proxyFetch("/cards", {
    q: `set.id:${setId}`,
    pageSize: String(pageSize),
    page: String(page),
    orderBy: "number",
  });
  return { cards: data.data, totalCount: data.totalCount };
}

/**
 * Fetch cards from the Pokémon TCG API
 */
export async function fetchCards(query: string, pageSize = 50, page = 1): Promise<APIResponse> {
  return proxyFetch("/cards", {
    q: query,
    pageSize: String(pageSize),
    page: String(page),
    orderBy: "-tcgplayer.prices.holofoil.market",
  });
}

/**
 * Search cards by name
 */
export async function searchCards(name: string, pageSize = 20): Promise<PokemonTCGCard[]> {
  const data: APIResponse = await proxyFetch("/cards", {
    q: `name:"${name}"`,
    pageSize: String(pageSize),
    orderBy: "-tcgplayer.prices.holofoil.market",
  });
  return data.data;
}

/**
 * Get a single card by ID
 */
export async function fetchCardById(id: string): Promise<PokemonTCGCard> {
  const data = await proxyFetch(`/cards/${id}`);
  return data.data;
}

/**
 * Fetch high-value cards with pricing data.
 * Supports fetching large sets by paginating automatically (API max 250/page).
 */
export async function fetchHighValueCards(total = 500): Promise<PokemonTCGCard[]> {
  const sets = [
    // Base era
    "base1", "base2", "base3", "base4", "base5", "base6",
    // Gym era
    "gym1", "gym2",
    // Neo era
    "neo1", "neo2", "neo3", "neo4",
    // e-Card era
    "ecard1", "ecard2", "ecard3",
    // EX era (Ruby & Sapphire through Power Keepers)
    "ex1", "ex2", "ex3", "ex4", "ex5", "ex6", "ex7", "ex8", "ex9", "ex10", "ex11", "ex12", "ex13", "ex14", "ex15", "ex16",
    // Diamond & Pearl era
    "dp1", "dp2", "dp3", "dp4", "dp5", "dp6", "dp7",
    // Platinum era
    "pl1", "pl2", "pl3", "pl4",
    // HeartGold SoulSilver era
    "hgss1", "hgss2", "hgss3", "hgss4",
    // Black & White era
    "bw1", "bw2", "bw3", "bw4", "bw5", "bw6", "bw7", "bw8", "bw9", "bw10", "bw11",
    // XY era (includes Mega Evolutions)
    "xy0", "xy1", "xy2", "xy3", "xy4", "xy5", "xy6", "xy7", "xy8", "xy9", "xy10", "xy11", "xy12",
  ];
  const setFilter = sets.map((s) => `set.id:${s}`).join(" OR ");
  const query = `(${setFilter})`;

  const PAGE_SIZE = 250;
  const pages = Math.ceil(total / PAGE_SIZE);
  const allCards: PokemonTCGCard[] = [];

  for (let page = 1; page <= pages; page++) {
    const data: APIResponse = await proxyFetch("/cards", {
      q: query,
      pageSize: String(Math.min(PAGE_SIZE, total - allCards.length)),
      page: String(page),
    });
    allCards.push(...data.data);
    if (allCards.length >= data.totalCount) break;
  }

  return allCards.slice(0, total);
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

  const hash = card.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const change = ((hash % 1000) / 100 - 5);

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
