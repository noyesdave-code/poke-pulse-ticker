import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { RARITY_WEIGHTS, RARITY_VALUES, type ProductType } from "@/data/ripzData";

// Wallet
export function useRipzWallet() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["ripz-wallet", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("ripz_wallets" as any)
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        const { data: newWallet, error: insertErr } = await supabase
          .from("ripz_wallets" as any)
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

// Digital portfolio
export function useDigitalPortfolio() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["digital-portfolio", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("digital_portfolio_cards" as any)
        .select("*")
        .eq("user_id", user.id)
        .order("ripped_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    enabled: !!user,
  });
}

// Rip sessions
export function useRipSessions() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["rip-sessions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("rip_sessions" as any)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as any[];
    },
    enabled: !!user,
  });
}

// Simulate rip — generate cards with weighted rarities
function simulateRip(cardsPerPack: number, packCount: number, setName: string, setId: string) {
  const totalCards = cardsPerPack * packCount;
  const cards: Array<{
    card_name: string;
    card_set: string;
    card_number: string;
    card_rarity: string;
    rip_value: number;
    card_image: string | null;
    card_api_id: string;
  }> = [];

  const rarities = Object.entries(RARITY_WEIGHTS);
  const totalWeight = rarities.reduce((s, [, w]) => s + w, 0);

  for (let i = 0; i < totalCards; i++) {
    let rand = Math.random() * totalWeight;
    let selectedRarity = 'common';
    for (const [rarity, weight] of rarities) {
      rand -= weight;
      if (rand <= 0) { selectedRarity = rarity; break; }
    }

    const range = RARITY_VALUES[selectedRarity];
    const value = Math.round(range.min + Math.random() * (range.max - range.min));
    const cardNum = String(Math.floor(Math.random() * 200) + 1).padStart(3, '0');

    cards.push({
      card_name: `${setName} #${cardNum}`,
      card_set: setName,
      card_number: cardNum,
      card_rarity: selectedRarity,
      rip_value: value,
      card_image: null,
      card_api_id: `${setId}-${cardNum}-${Date.now()}-${i}`,
    });
  }

  return cards;
}

// Rip mutation
export function useRipPacks() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      productType, setId, setName, era, coinCost, cardsPerPack, packCount,
    }: {
      productType: ProductType;
      setId: string;
      setName: string;
      era: string;
      coinCost: number;
      cardsPerPack: number;
      packCount: number;
    }) => {
      if (!user) throw new Error("Not authenticated");

      // Check wallet balance
      const { data: wallet } = await supabase
        .from("ripz_wallets" as any)
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!wallet || (wallet as any).balance < coinCost) {
        throw new Error("Insufficient coins! Buy more to keep ripping.");
      }

      // Simulate the rip
      const cards = simulateRip(cardsPerPack, packCount, setName, setId);
      const totalValue = cards.reduce((s, c) => s + c.rip_value, 0);

      // Deduct coins
      await supabase
        .from("ripz_wallets" as any)
        .update({
          balance: (wallet as any).balance - coinCost,
          lifetime_spent: (wallet as any).lifetime_spent + coinCost,
          lifetime_ripped: (wallet as any).lifetime_ripped + cards.length,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      // Save rip session
      const { data: session } = await supabase
        .from("rip_sessions" as any)
        .insert({
          user_id: user.id,
          product_type: productType,
          set_id: setId,
          set_name: setName,
          era,
          coin_cost: coinCost,
          cards_pulled: cards,
          total_rip_value: totalValue,
        })
        .select()
        .single();

      // Save cards to digital portfolio
      const digitalCards = cards.map((c) => ({
        user_id: user.id,
        card_api_id: c.card_api_id,
        card_name: c.card_name,
        card_set: c.card_set,
        card_number: c.card_number,
        card_image: c.card_image,
        card_rarity: c.card_rarity,
        rip_value: c.rip_value,
        rip_session_id: (session as any)?.id || null,
      }));

      await supabase.from("digital_portfolio_cards" as any).insert(digitalCards);

      return { cards, totalValue, coinCost, session };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["ripz-wallet"] });
      queryClient.invalidateQueries({ queryKey: ["digital-portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["rip-sessions"] });
      const hitCount = data.cards.filter((c) => ['ultra_rare', 'secret_rare', 'illustration_rare', 'hyper_rare'].includes(c.card_rarity)).length;
      toast({
        title: hitCount > 0 ? `🔥 ${hitCount} BIG HIT${hitCount > 1 ? 'S' : ''}!` : "Rip Complete!",
        description: `${data.cards.length} cards pulled — Total value: ${data.totalValue.toLocaleString()} coins`,
      });
    },
    onError: (err: Error) => {
      toast({ title: "Rip Failed", description: err.message, variant: "destructive" });
    },
  });
}
