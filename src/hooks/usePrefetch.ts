import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchCardById } from "@/lib/pokemonTcgApi";

/**
 * Prefetches card data for trending and top mover cards
 * to eliminate perceived latency on click.
 */
export function usePrefetchCards(cardIds: string[]) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!cardIds || cardIds.length === 0) return;

    // Prefetch the first 10 cards (trending / top movers)
    const toPrefetch = cardIds.slice(0, 10);

    toPrefetch.forEach((id) => {
      queryClient.prefetchQuery({
        queryKey: ["card-detail", id],
        queryFn: () => fetchCardById(id),
        staleTime: 5 * 60 * 1000,
      });
    });
  }, [cardIds.join(",")]);
}
