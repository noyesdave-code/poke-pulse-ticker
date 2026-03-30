import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface DeltaAlert {
  id: string;
  user_id: string;
  card_api_id: string;
  card_name: string;
  card_set: string;
  card_number: string;
  card_image: string | null;
  deviation_threshold: number;
  is_active: boolean;
  last_triggered_at: string | null;
  last_deviation: number | null;
  created_at: string;
}

export function useDeltaAlerts() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["delta-alerts", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("delta_alerts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as DeltaAlert[];
    },
    enabled: !!user,
  });
}

export function useCreateDeltaAlert() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (alert: {
      card_api_id: string;
      card_name: string;
      card_set: string;
      card_number: string;
      card_image?: string;
      deviation_threshold?: number;
    }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("delta_alerts").insert({
        user_id: user.id,
        card_api_id: alert.card_api_id,
        card_name: alert.card_name,
        card_set: alert.card_set,
        card_number: alert.card_number,
        card_image: alert.card_image || null,
        deviation_threshold: alert.deviation_threshold ?? 5.0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delta-alerts"] });
      toast({ title: "Delta Alert Created", description: "You'll be notified when this card's price deviates from its 30-day average." });
    },
    onError: (err: Error) => {
      if (err.message.includes("duplicate")) {
        toast({ title: "Already Watching", description: "You already have a delta alert for this card.", variant: "destructive" });
      } else {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    },
  });
}

export function useUpdateDeltaAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; deviation_threshold?: number; is_active?: boolean }) => {
      const { error } = await supabase.from("delta_alerts").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delta-alerts"] });
    },
  });
}

export function useDeleteDeltaAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("delta_alerts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delta-alerts"] });
      toast({ title: "Alert Removed" });
    },
  });
}
