import { useQuery } from "@tanstack/react-query";

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const CONSENSUS_URL = `https://${PROJECT_ID}.supabase.co/functions/v1/consensus-pricing`;

export interface PriceSource {
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

export interface ConsensusResult {
  consensusPrice: number;
  confidence: number;
  sources: PriceSource[];
  spread: number;
  recommendation: "buy" | "hold" | "wait";
  fairValueRange: { low: number; high: number };
  apiStatus: {
    tcgplayer: boolean;
    ebay: boolean;
    pricecharting: boolean;
  };
}

async function fetchConsensus(cardId: string, cardName: string, setName: string): Promise<ConsensusResult> {
  const res = await fetch(CONSENSUS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({ cardId, cardName, setName }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `Consensus error: ${res.status}`);
  }
  return res.json();
}

export function useConsensusPricing(cardId?: string, cardName?: string, setName?: string) {
  return useQuery({
    queryKey: ["consensus-pricing", cardId],
    queryFn: () => fetchConsensus(cardId!, cardName!, setName || ""),
    enabled: !!cardId && !!cardName,
    staleTime: 10 * 60 * 1000, // 10 min
    retry: 1,
  });
}
