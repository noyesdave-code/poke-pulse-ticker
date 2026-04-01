import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchCardById } from "@/lib/pokemonTcgApi";

/**
 * Prefetches card data for trending and top mover cards
 * to eliminate perceived latency on click.
 * Staggers requests to avoid overwhelming the API proxy.
 */
export function usePrefetchCards(cardIds: string[]) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!cardIds || cardIds.length === 0) return;

    // Only prefetch 3 cards, with staggered delays
    const toPrefetch = cardIds.slice(0, 3);
    const timers: ReturnType<typeof setTimeout>[] = [];

    toPrefetch.forEach((id, i) => {
      timers.push(
        setTimeout(() => {
          queryClient.prefetchQuery({
            queryKey: ["card-detail", id],
            queryFn: () => fetchCardById(id),
            staleTime: 10 * 60 * 1000,
          });
        }, 5000 + i * 2000) // Start after 5s, stagger by 2s
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [cardIds.join(",")]);
}
