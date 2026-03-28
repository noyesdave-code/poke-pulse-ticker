import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface PriceAlert {
  id: string;
  user_id: string;
  card_api_id: string;
  card_name: string;
  card_set: string;
  card_number: string;
  card_image: string | null;
  target_price: number;
  direction: string;
  is_triggered: boolean;
  triggered_at: string | null;
  created_at: string;
}

export function usePriceAlerts() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["price-alerts", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("price_alerts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PriceAlert[];
    },
    enabled: !!user,
  });
}

export function useAddPriceAlert() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (alert: {
      card_api_id: string;
      card_name: string;
      card_set: string;
      card_number: string;
      card_image?: string;
      target_price: number;
      direction?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("price_alerts").insert({
        user_id: user.id,
        card_api_id: alert.card_api_id,
        card_name: alert.card_name,
        card_set: alert.card_set,
        card_number: alert.card_number,
        card_image: alert.card_image || null,
        target_price: alert.target_price,
        direction: alert.direction || "below",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["price-alerts"] });
      toast({ title: "Alert created", description: "You'll be notified when the price target is hit." });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

export function useDeletePriceAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("price_alerts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["price-alerts"] });
      toast({ title: "Alert removed" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}
