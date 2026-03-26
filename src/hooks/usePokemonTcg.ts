import { useQuery } from "@tanstack/react-query";
import { fetchHighValueCards, searchCards, fetchCardById, toCardData, getBestPrice } from "@/lib/pokemonTcgApi";
import type { PokemonTCGCard } from "@/lib/pokemonTcgApi";
import type { CardData } from "@/data/marketData";

/**
 * Fetch high-value cards with TCGPlayer pricing, converted to CardData[]
 */
export function useLiveCards() {
  return useQuery({
    queryKey: ["live-cards"],
    queryFn: async () => {
      const apiCards = await fetchHighValueCards(500);
      const mapped = apiCards
        .map(toCardData)
        .filter((c): c is CardData & { _apiId: string; _image: string } => c !== null && c.market > 0)
        .sort((a, b) => b.market - a.market);
      return mapped;
    },
    staleTime: 10 * 60 * 1000, // 10 min (larger dataset)
    refetchInterval: 10 * 60 * 1000,
  });
}

/**
 * Search cards by name via the API
 */
export function useCardSearch(query: string) {
  return useQuery({
    queryKey: ["card-search", query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      const apiCards = await searchCards(query, 30);
      return apiCards
        .map(toCardData)
        .filter((c): c is CardData & { _apiId: string; _image: string } => c !== null && c.market > 0)
        .sort((a, b) => b.market - a.market);
    },
    enabled: query.length >= 2,
    staleTime: 60 * 1000,
  });
}

/**
 * Fetch a single card by its API id
 */
export function useCardDetail(apiId: string | undefined) {
  return useQuery({
    queryKey: ["card-detail", apiId],
    queryFn: async () => {
      if (!apiId) throw new Error("No card ID");
      const card = await fetchCardById(apiId);
      return card;
    },
    enabled: !!apiId,
    staleTime: 5 * 60 * 1000,
  });
}

export type { PokemonTCGCard };
