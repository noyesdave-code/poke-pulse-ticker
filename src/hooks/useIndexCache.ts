import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CachedIndexData {
  rawIndex: number;
  rawChange: number;
  gradedIndex: number;
  gradedChange: number;
  sealedIndex: number;
  sealedChange: number;
  totalMarketValue: number;
  cardCount: number;
  cachedAt: string;
}

export function useIndexCache() {
  return useQuery({
    queryKey: ["index-cache"],
    queryFn: async (): Promise<CachedIndexData | null> => {
      const { data, error } = await supabase
        .from("index_cache")
        .select("data, expires_at")
        .eq("cache_key", "market_indexes")
        .single();

      if (error || !data) return null;

      // Check if cache is expired
      if (new Date(data.expires_at) < new Date()) return null;

      return data.data as unknown as CachedIndexData;
    },
    staleTime: 5 * 60 * 1000, // 5 min
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useTotalMarketValue(
  rawIndex: number,
  gradedIndex: number,
  sealedIndex: number,
  rawCount: number,
  gradedCount: number,
  sealedCount: number
) {
  const totalValue = (rawIndex * rawCount) + (gradedIndex * gradedCount) + (sealedIndex * sealedCount);
  return totalValue;
}
