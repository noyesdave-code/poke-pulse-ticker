import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface PortfolioCard {
  id: string;
  user_id: string;
  card_api_id: string;
  card_name: string;
  card_set: string;
  card_number: string;
  card_image: string | null;
  purchase_price: number | null;
  quantity: number;
  added_at: string;
}

export function usePortfolio() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["portfolio", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("portfolio_cards")
        .select("*")
        .order("added_at", { ascending: false });
      if (error) throw error;
      return data as PortfolioCard[];
    },
    enabled: !!user,
  });
}

export function useAddToPortfolio() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (card: {
      card_api_id: string;
      card_name: string;
      card_set: string;
      card_number: string;
      card_image?: string;
      purchase_price?: number;
      quantity?: number;
    }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("portfolio_cards").upsert(
        {
          user_id: user.id,
          card_api_id: card.card_api_id,
          card_name: card.card_name,
          card_set: card.card_set,
          card_number: card.card_number,
          card_image: card.card_image || null,
          purchase_price: card.purchase_price || null,
          quantity: card.quantity || 1,
        },
        { onConflict: "user_id,card_api_id" }
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      toast({ title: "Added to portfolio", description: "Card saved to your collection." });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

export function useRemoveFromPortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("portfolio_cards").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      toast({ title: "Removed", description: "Card removed from portfolio." });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

export function useUpdatePortfolioCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quantity, purchase_price }: { id: string; quantity?: number; purchase_price?: number }) => {
      const updates: { quantity?: number; purchase_price?: number } = {};
      if (quantity !== undefined) updates.quantity = quantity;
      if (purchase_price !== undefined) updates.purchase_price = purchase_price;
      const { error } = await supabase.from("portfolio_cards").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}
