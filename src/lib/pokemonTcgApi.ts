import { supabase } from "@/integrations/supabase/client";
import type { CardData } from "@/data/marketData";

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const PROXY_URL = `https://${PROJECT_ID}.supabase.co/functions/v1/pokemon-proxy`;

/**
 * Generate set initials from set name, e.g. "Prismatic Evolutions" → "PE"
 */
function getSetInitials(name: string): string {
  const words = name.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].substring(0, 3).toUpperCase();
  return words.map(w => w[0]).join('').toUpperCase();
}

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

  // Generate request timestamp for integrity validation
  const timestamp = Date.now().toString();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    "X-Request-Timestamp": timestamp,
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
  // Fetch cards from multiple price variant queries in parallel to maximise coverage.
  // The pokemontcg.io API limits pages to 250 items, so we paginate each query.
  const PAGE_SIZE = 250;
  const allCards: PokemonTCGCard[] = [];

  // --- Query 1: Holofoil priced cards (4 pages = up to 1000) ---
  const holoPages = 4;
  for (let page = 1; page <= holoPages; page++) {
    try {
      const data: APIResponse = await proxyFetch("/cards", {
        q: "tcgplayer.prices.holofoil.market:[1 TO *]",
        pageSize: String(PAGE_SIZE),
        page: String(page),
        orderBy: "-tcgplayer.prices.holofoil.market",
      });
      allCards.push(...data.data);
      if (allCards.length >= data.totalCount || data.data.length < PAGE_SIZE) break;
    } catch {
      break;
    }
  }

  // --- Query 2: Normal-priced cards (2 pages) ---
  for (let page = 1; page <= 2; page++) {
    try {
      const data: APIResponse = await proxyFetch("/cards", {
        q: "tcgplayer.prices.normal.market:[3 TO *]",
        pageSize: String(PAGE_SIZE),
        page: String(page),
        orderBy: "-tcgplayer.prices.normal.market",
      });
      allCards.push(...data.data);
      if (data.data.length < PAGE_SIZE) break;
    } catch {
      break;
    }
  }

  // --- Query 3: Reverse holofoil priced cards (1 page) ---
  try {
    const data: APIResponse = await proxyFetch("/cards", {
      q: "tcgplayer.prices.reverseHolofoil.market:[5 TO *]",
      pageSize: String(PAGE_SIZE),
      page: "1",
      orderBy: "-tcgplayer.prices.reverseHolofoil.market",
    });
    allCards.push(...data.data);
  } catch {
    // best-effort
  }

  // --- Query 4: 1st Edition holofoil (1 page) ---
  try {
    const data: APIResponse = await proxyFetch("/cards", {
      q: "tcgplayer.prices.1stEditionHolofoil.market:[1 TO *]",
      pageSize: String(PAGE_SIZE),
      page: "1",
      orderBy: "-tcgplayer.prices.1stEditionHolofoil.market",
    });
    allCards.push(...data.data);
  } catch {
    // best-effort
  }

  // --- Query 5: Illustration Rares, Special Illustration Rares, Hyper Rares, etc. ---
  const premiumRarities = [
    "Illustration Rare",
    "Special Art Rare",
    "Hyper Rare",
    "Rare MEGA",
    "Rare Ultra",
    "Rare Secret",
    "Rare Rainbow",
    "Rare Shiny GX",
    "Rare ACE",
    "Amazing Rare",
    "Rare Holo Star",
    "Rare Holo VMAX",
    "Rare Holo VSTAR",
    "Double Rare",
    "Ultra Rare",
  ];

  for (const rarity of premiumRarities) {
    try {
      const data: APIResponse = await proxyFetch("/cards", {
        q: `rarity:"${rarity}"`,
        pageSize: String(PAGE_SIZE),
        page: "1",
        orderBy: "-tcgplayer.prices.holofoil.market",
      });
      allCards.push(...data.data);
    } catch {
      // best-effort
    }
  }

  // Deduplicate by card id
  const seen = new Set<string>();
  const unique = allCards.filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });

  // Sort by best available price descending
  unique.sort((a, b) => {
    const pa = getBestPrice(a)?.market ?? 0;
    const pb = getBestPrice(b)?.market ?? 0;
    return pb - pa;
  });

  return unique.slice(0, total);
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
    setCode: getSetInitials(card.set.name),
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
