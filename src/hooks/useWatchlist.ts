import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface WatchlistItem {
  id: string;
  card_api_id: string;
  card_name: string;
  card_set: string;
  card_number: string;
  card_image: string | null;
  target_price: number | null;
  added_at: string;
}

export function useWatchlist() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["watchlist", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("watchlist" as any)
        .select("*")
        .eq("user_id", user.id)
        .order("added_at", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as WatchlistItem[];
    },
    enabled: !!user,
  });
}

export function useAddToWatchlist() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (item: {
      card_api_id: string;
      card_name: string;
      card_set: string;
      card_number: string;
      card_image?: string | null;
      target_price?: number | null;
    }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("watchlist" as any).insert({
        user_id: user.id,
        ...item,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["watchlist"] });
      toast.success("Added to watchlist");
    },
    onError: (err: any) => {
      if (err?.code === "23505") {
        toast.info("Already on your watchlist");
      } else {
        toast.error("Failed to add to watchlist");
      }
    },
  });
}

export function useRemoveFromWatchlist() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("watchlist" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["watchlist"] });
      toast.success("Removed from watchlist");
    },
    onError: () => toast.error("Failed to remove"),
  });
}

export function useIsOnWatchlist(cardApiId: string | undefined) {
  const { data: watchlist } = useWatchlist();
  if (!cardApiId || !watchlist) return false;
  return watchlist.some((w) => w.card_api_id === cardApiId);
}
