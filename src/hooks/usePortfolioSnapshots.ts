import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface PortfolioSnapshot {
  id: string;
  user_id: string;
  total_value: number;
  total_cost: number;
  card_count: number;
  snapshot_date: string;
  created_at: string;
}

export function usePortfolioSnapshots(days = 90) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["portfolio-snapshots", user?.id, days],
    queryFn: async () => {
      if (!user) return [];
      const since = new Date();
      since.setDate(since.getDate() - days);

      const { data, error } = await supabase
        .from("portfolio_snapshots")
        .select("*")
        .gte("snapshot_date", since.toISOString().split("T")[0])
        .order("snapshot_date", { ascending: true });

      if (error) throw error;
      return data as PortfolioSnapshot[];
    },
    enabled: !!user,
  });
}

export function useSaveSnapshot() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (snapshot: { total_value: number; total_cost: number; card_count: number }) => {
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("portfolio_snapshots").upsert(
        {
          user_id: user.id,
          total_value: snapshot.total_value,
          total_cost: snapshot.total_cost,
          card_count: snapshot.card_count,
          snapshot_date: new Date().toISOString().split("T")[0],
        },
        { onConflict: "user_id,snapshot_date" }
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio-snapshots"] });
    },
  });
}
