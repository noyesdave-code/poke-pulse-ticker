import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export function useUnifiedWallet() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["unified-wallet", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("unified_wallets" as any)
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        const { data: newWallet, error: insertErr } = await supabase
          .from("unified_wallets" as any)
          .insert({ user_id: user.id })
          .select()
          .single();
        if (insertErr) throw insertErr;
        return newWallet as any;
      }
      return data as any;
    },
    enabled: !!user,
  });
}

export function useDeductCoins() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ amount, reason }: { amount: number; reason: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { data: wallet } = await supabase
        .from("unified_wallets" as any)
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (!wallet || (wallet as any).balance < amount) {
        throw new Error("Insufficient coins!");
      }
      const updates: any = {
        balance: (wallet as any).balance - amount,
        updated_at: new Date().toISOString(),
      };
      if (reason === "rip") {
        updates.lifetime_spent = (wallet as any).lifetime_spent + amount;
      } else if (reason === "wager") {
        updates.lifetime_wagered = (wallet as any).lifetime_wagered + amount;
      }
      const { error } = await supabase
        .from("unified_wallets" as any)
        .update(updates)
        .eq("user_id", user.id);
      if (error) throw error;
      return { newBalance: updates.balance };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unified-wallet"] });
    },
    onError: (err: Error) => {
      toast({ title: "Transaction Failed", description: err.message, variant: "destructive" });
    },
  });
}

export function useAddCoins() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ amount, reason }: { amount: number; reason: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { data: wallet } = await supabase
        .from("unified_wallets" as any)
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (!wallet) throw new Error("Wallet not found");
      const updates: any = {
        balance: (wallet as any).balance + amount,
        lifetime_earned: (wallet as any).lifetime_earned + amount,
        updated_at: new Date().toISOString(),
      };
      if (reason === "win") {
        updates.lifetime_won = (wallet as any).lifetime_won + amount;
      }
      const { error } = await supabase
        .from("unified_wallets" as any)
        .update(updates)
        .eq("user_id", user.id);
      if (error) throw error;
      return { newBalance: updates.balance };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unified-wallet"] });
    },
  });
}
