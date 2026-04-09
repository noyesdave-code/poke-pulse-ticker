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
        // Use RPC to create wallet (it handles insert if not found)
        const { data: result, error: rpcErr } = await supabase.rpc("adjust_wallet_balance", {
          _amount: 0,
          _reason: "init",
        });
        if (rpcErr) throw rpcErr;
        // Re-fetch the wallet
        const { data: newWallet, error: fetchErr } = await supabase
          .from("unified_wallets" as any)
          .select("*")
          .eq("user_id", user.id)
          .single();
        if (fetchErr) throw fetchErr;
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
      const { data, error } = await supabase.rpc("adjust_wallet_balance", {
        _amount: -Math.abs(amount),
        _reason: reason,
      });
      if (error) throw error;
      return data as any;
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
      const { data, error } = await supabase.rpc("adjust_wallet_balance", {
        _amount: Math.abs(amount),
        _reason: reason,
      });
      if (error) throw error;
      return data as any;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unified-wallet"] });
    },
  });
}
