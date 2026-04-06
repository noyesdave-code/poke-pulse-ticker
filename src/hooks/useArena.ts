import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { rawCards, type CardData } from "@/data/marketData";

export interface ArenaWallet {
  id: string;
  balance: number;
  lifetime_earned: number;
  lifetime_wagered: number;
  lifetime_won: number;
}

export interface PriceBet {
  id: string;
  card_api_id: string;
  card_name: string;
  card_set: string;
  card_image: string | null;
  index_type: string;
  prediction: string;
  wager: number;
  odds: number;
  snapshot_price: number;
  resolved_price: number | null;
  payout: number | null;
  status: string;
  resolves_at: string;
  resolved_at: string | null;
  created_at: string;
}

export interface PackOpen {
  id: string;
  pack_type: string;
  cost: number;
  cards_pulled: any[];
  total_value: number;
  rarity_hit: string | null;
  created_at: string;
}

export interface ArenaTournament {
  id: string;
  name: string;
  description: string | null;
  game_type: string;
  entry_cost: number;
  prize_pool: number;
  prize_description: string | null;
  max_entries: number;
  current_entries: number;
  status: string;
  starts_at: string;
  ends_at: string;
}

// Pack rarity weights
const PACK_RARITIES = [
  { rarity: "common", weight: 45, multiplier: 0.5 },
  { rarity: "uncommon", weight: 25, multiplier: 1.0 },
  { rarity: "rare", weight: 15, multiplier: 2.5 },
  { rarity: "ultra_rare", weight: 10, multiplier: 5 },
  { rarity: "secret_rare", weight: 4, multiplier: 15 },
  { rarity: "legendary", weight: 1, multiplier: 50 },
];

const PACK_TYPES = {
  standard: { cost: 500, cards: 5, label: "Standard Pack" },
  premium: { cost: 1500, cards: 8, label: "Premium Pack" },
  ultra: { cost: 5000, cards: 10, label: "Ultra Pack" },
} as const;

function pickRarity() {
  const total = PACK_RARITIES.reduce((s, r) => s + r.weight, 0);
  let roll = Math.random() * total;
  for (const r of PACK_RARITIES) {
    roll -= r.weight;
    if (roll <= 0) return r;
  }
  return PACK_RARITIES[0];
}

export const useArena = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<ArenaWallet | null>(null);
  const [bets, setBets] = useState<PriceBet[]>([]);
  const [packHistory, setPackHistory] = useState<PackOpen[]>([]);
  const [tournaments, setTournaments] = useState<ArenaTournament[]>([]);
  const [loading, setLoading] = useState(true);

  const tradableCards = rawCards.slice(0, 50);

  // Init wallet
  const initWallet = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: existing } = await (supabase.from("unified_wallets") as any)
        .select("*").eq("user_id", user.id).maybeSingle();
      if (existing) {
        setWallet(existing as ArenaWallet);
      } else {
        const { data: created, error } = await (supabase.from("unified_wallets") as any)
          .insert({ user_id: user.id }).select().single();
        if (error) throw error;
        setWallet(created as ArenaWallet);
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Fetch bets
  const fetchBets = useCallback(async () => {
    if (!user) return;
    const { data } = await (supabase.from("arena_price_bets") as any)
      .select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50);
    setBets((data ?? []) as PriceBet[]);
  }, [user]);

  // Fetch pack history
  const fetchPacks = useCallback(async () => {
    if (!user) return;
    const { data } = await (supabase.from("arena_pack_opens") as any)
      .select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20);
    setPackHistory((data ?? []) as PackOpen[]);
  }, [user]);

  // Fetch tournaments
  const fetchTournaments = useCallback(async () => {
    const { data } = await (supabase.from("arena_tournaments") as any)
      .select("*").order("starts_at", { ascending: true });
    setTournaments((data ?? []) as ArenaTournament[]);
  }, []);

  useEffect(() => { initWallet(); }, [initWallet]);
  useEffect(() => { fetchBets(); }, [fetchBets]);
  useEffect(() => { fetchPacks(); }, [fetchPacks]);
  useEffect(() => { fetchTournaments(); }, [fetchTournaments]);

  // Resolve expired bets (client-side for demo)
  useEffect(() => {
    const resolvable = bets.filter(b => b.status === "active" && new Date(b.resolves_at) <= new Date());
    if (resolvable.length === 0) return;

    const resolve = async () => {
      for (const bet of resolvable) {
        const card = tradableCards.find(c => (c._apiId ?? `${c.set}-${c.number}`) === bet.card_api_id);
        if (!card) continue;
        const currentPrice = card.market;
        const won = bet.prediction === "up" ? currentPrice > bet.snapshot_price : currentPrice < bet.snapshot_price;
        const payout = won ? Math.round(bet.wager * bet.odds) : 0;

        await (supabase.from("arena_price_bets") as any).update({
          resolved_price: currentPrice,
          payout,
          status: won ? "won" : "lost",
          resolved_at: new Date().toISOString(),
        }).eq("id", bet.id);

        if (won && wallet) {
          const newBal = wallet.balance + payout;
          await (supabase.from("unified_wallets") as any).update({
            balance: newBal,
            lifetime_won: wallet.lifetime_won + payout,
            updated_at: new Date().toISOString(),
          }).eq("id", wallet.id);
          setWallet(w => w ? { ...w, balance: newBal, lifetime_won: w.lifetime_won + payout } : w);
          toast({ title: "🎉 Bet Won!", description: `+${payout.toLocaleString()} PokéCoins on ${bet.card_name}!` });
        }
      }
      fetchBets();
    };
    resolve();
  }, [bets]);

  // Place a price prediction bet
  const placeBet = useCallback(async (
    card: CardData,
    prediction: "up" | "down",
    wager: number,
    duration: "1h" | "4h" | "24h" = "1h"
  ) => {
    if (!user || !wallet) return;
    if (wallet.balance < wager) {
      toast({ title: "Insufficient PokéCoins", description: `Need ${wager} but you have ${wallet.balance.toLocaleString()}`, variant: "destructive" });
      return;
    }
    const hours = duration === "1h" ? 1 : duration === "4h" ? 4 : 24;
    const odds = hours === 1 ? 1.95 : hours === 4 ? 2.5 : 3.5;
    const cardApiId = card._apiId ?? `${card.set}-${card.number}`;
    const resolves = new Date(Date.now() + hours * 3600000).toISOString();

    try {
      await (supabase.from("arena_price_bets") as any).insert({
        user_id: user.id,
        card_api_id: cardApiId,
        card_name: card.name,
        card_set: card.set,
        card_image: card._image ?? null,
        prediction,
        wager,
        odds,
        snapshot_price: card.market,
        resolves_at: resolves,
      });

      const newBal = wallet.balance - wager;
      await (supabase.from("unified_wallets") as any).update({
        balance: newBal,
        lifetime_wagered: wallet.lifetime_wagered + wager,
        updated_at: new Date().toISOString(),
      }).eq("id", wallet.id);

      setWallet(w => w ? { ...w, balance: newBal, lifetime_wagered: w.lifetime_wagered + wager } : w);
      toast({ title: "🎰 Bet Placed!", description: `${wager} PokéCoins on ${card.name} going ${prediction} (${duration})` });
      fetchBets();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  }, [user, wallet, toast, fetchBets]);

  // Open a card pack
  const openPack = useCallback(async (packType: keyof typeof PACK_TYPES = "standard") => {
    if (!user || !wallet) return;
    const pack = PACK_TYPES[packType];
    if (wallet.balance < pack.cost) {
      toast({ title: "Insufficient PokéCoins", description: `Need ${pack.cost} for a ${pack.label}`, variant: "destructive" });
      return;
    }

    // Generate cards
    const cards: any[] = [];
    let totalValue = 0;
    let bestRarity = "common";
    const bestMultiplier = 0;

    for (let i = 0; i < pack.cards; i++) {
      const rarity = pickRarity();
      const card = tradableCards[Math.floor(Math.random() * tradableCards.length)];
      const value = Math.round(pack.cost / pack.cards * rarity.multiplier);
      totalValue += value;
      if (PACK_RARITIES.findIndex(r => r.rarity === rarity.rarity) > PACK_RARITIES.findIndex(r => r.rarity === bestRarity)) {
        bestRarity = rarity.rarity;
      }
      cards.push({
        name: card.name,
        set: card.set,
        image: card._image,
        rarity: rarity.rarity,
        value,
      });
    }

    try {
      await (supabase.from("arena_pack_opens") as any).insert({
        user_id: user.id,
        pack_type: packType,
        cost: pack.cost,
        cards_pulled: cards,
        total_value: totalValue,
        rarity_hit: bestRarity === "common" ? null : bestRarity,
      });

      const newBal = wallet.balance - pack.cost + totalValue;
      await (supabase.from("unified_wallets") as any).update({
        balance: newBal,
        lifetime_wagered: wallet.lifetime_wagered + pack.cost,
        lifetime_won: totalValue > pack.cost ? wallet.lifetime_won + (totalValue - pack.cost) : wallet.lifetime_won,
        updated_at: new Date().toISOString(),
      }).eq("id", wallet.id);

      setWallet(w => w ? { ...w, balance: newBal } : w);

      const profit = totalValue - pack.cost;
      toast({
        title: profit > 0 ? "🎉 Great Pull!" : "📦 Pack Opened",
        description: `Worth ${totalValue.toLocaleString()} PokéCoins (${profit >= 0 ? "+" : ""}${profit.toLocaleString()})`,
      });
      fetchPacks();
      return cards;
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
      return null;
    }
  }, [user, wallet, toast, fetchPacks, tradableCards]);

  return {
    wallet,
    bets,
    packHistory,
    tournaments,
    loading,
    tradableCards,
    placeBet,
    openPack,
    PACK_TYPES,
    refreshWallet: initWallet,
    refreshBets: fetchBets,
  };
};
