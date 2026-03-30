import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { rawCards, type CardData } from "@/data/marketData";

export interface TraderPortfolio {
  id: string;
  virtual_balance: number;
  starting_balance: number;
  total_portfolio_value: number;
  season_id: string;
}

export interface TraderHolding {
  id: string;
  card_api_id: string;
  card_name: string;
  card_set: string;
  card_image: string | null;
  quantity: number;
  avg_cost: number;
}

export interface TradeOrder {
  id: string;
  card_api_id: string;
  card_name: string;
  card_set: string;
  order_type: string;
  side: string;
  quantity: number;
  price: number;
  limit_price: number | null;
  stop_price: number | null;
  status: string;
  created_at: string;
  filled_at: string | null;
}

// Simulate slight price movement for game realism
const getSimulatedPrice = (card: CardData): number => {
  const jitter = (Math.random() - 0.5) * 0.02; // ±1% jitter
  return Math.max(0.01, card.market * (1 + jitter));
};

export const useTraderGame = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [portfolio, setPortfolio] = useState<TraderPortfolio | null>(null);
  const [holdings, setHoldings] = useState<TraderHolding[]>([]);
  const [orders, setOrders] = useState<TradeOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch or create portfolio
  const initPortfolio = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: existing } = await supabase
        .from("trader_portfolios")
        .select("*")
        .eq("user_id", user.id)
        .eq("season_id", "season_1")
        .maybeSingle();

      if (existing) {
        setPortfolio(existing as TraderPortfolio);
      } else {
        const { data: created, error } = await supabase
          .from("trader_portfolios")
          .insert({ user_id: user.id, season_id: "season_1" })
          .select()
          .single();
        if (error) throw error;
        setPortfolio(created as TraderPortfolio);
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Fetch holdings
  const fetchHoldings = useCallback(async () => {
    if (!portfolio) return;
    const { data } = await supabase
      .from("trader_holdings")
      .select("*")
      .eq("portfolio_id", portfolio.id);
    setHoldings((data ?? []) as TraderHolding[]);
  }, [portfolio]);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("trade_orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    setOrders((data ?? []) as TradeOrder[]);
  }, [user]);

  useEffect(() => { initPortfolio(); }, [initPortfolio]);
  useEffect(() => { fetchHoldings(); }, [fetchHoldings]);
  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Execute a market order
  const placeOrder = useCallback(async (
    card: CardData,
    side: "buy" | "sell",
    quantity: number,
    orderType: "market" | "limit" | "stop_loss" = "market",
    limitPrice?: number,
    stopPrice?: number,
  ) => {
    if (!user || !portfolio) return;

    const price = getSimulatedPrice(card);
    const totalCost = price * quantity;

    if (side === "buy" && orderType === "market") {
      if (portfolio.virtual_balance < totalCost) {
        toast({ title: "Insufficient funds", description: `Need $${totalCost.toFixed(2)} but you have $${portfolio.virtual_balance.toFixed(2)}`, variant: "destructive" });
        return;
      }
    }

    if (side === "sell" && orderType === "market") {
      const holding = holdings.find(h => h.card_api_id === (card._apiId ?? `${card.set}-${card.number}`));
      if (!holding || holding.quantity < quantity) {
        toast({ title: "Insufficient holdings", description: "You don't own enough of this card", variant: "destructive" });
        return;
      }
    }

    try {
      const cardApiId = card._apiId ?? `${card.set}-${card.number}`;

      // Insert order
      const { error: orderErr } = await supabase.from("trade_orders").insert({
        user_id: user.id,
        portfolio_id: portfolio.id,
        card_api_id: cardApiId,
        card_name: card.name,
        card_set: card.set,
        card_image: card._image ?? null,
        order_type: orderType,
        side,
        quantity,
        price,
        limit_price: limitPrice ?? null,
        stop_price: stopPrice ?? null,
        status: orderType === "market" ? "filled" : "pending",
        filled_at: orderType === "market" ? new Date().toISOString() : null,
      });
      if (orderErr) throw orderErr;

      // For market orders, execute immediately
      if (orderType === "market") {
        if (side === "buy") {
          const newBalance = portfolio.virtual_balance - totalCost;
          await supabase.from("trader_portfolios").update({
            virtual_balance: newBalance,
            updated_at: new Date().toISOString(),
          }).eq("id", portfolio.id);

          // Upsert holding
          const existing = holdings.find(h => h.card_api_id === cardApiId);
          if (existing) {
            const newQty = existing.quantity + quantity;
            const newAvg = ((existing.avg_cost * existing.quantity) + totalCost) / newQty;
            await supabase.from("trader_holdings").update({
              quantity: newQty,
              avg_cost: newAvg,
              updated_at: new Date().toISOString(),
            }).eq("id", existing.id);
          } else {
            await supabase.from("trader_holdings").insert({
              portfolio_id: portfolio.id,
              user_id: user.id,
              card_api_id: cardApiId,
              card_name: card.name,
              card_set: card.set,
              card_image: card._image ?? null,
              quantity,
              avg_cost: price,
            });
          }

          setPortfolio(p => p ? { ...p, virtual_balance: newBalance } : p);
          toast({ title: "🟢 BUY Filled", description: `Bought ${quantity}x ${card.name} @ $${price.toFixed(2)}` });

        } else {
          const newBalance = portfolio.virtual_balance + totalCost;
          await supabase.from("trader_portfolios").update({
            virtual_balance: newBalance,
            updated_at: new Date().toISOString(),
          }).eq("id", portfolio.id);

          const existing = holdings.find(h => h.card_api_id === cardApiId);
          if (existing) {
            const newQty = existing.quantity - quantity;
            if (newQty <= 0) {
              await supabase.from("trader_holdings").delete().eq("id", existing.id);
            } else {
              await supabase.from("trader_holdings").update({
                quantity: newQty,
                updated_at: new Date().toISOString(),
              }).eq("id", existing.id);
            }
          }

          setPortfolio(p => p ? { ...p, virtual_balance: newBalance } : p);
          toast({ title: "🔴 SELL Filled", description: `Sold ${quantity}x ${card.name} @ $${price.toFixed(2)}` });
        }

        await fetchHoldings();
      } else {
        toast({ title: "📋 Order Placed", description: `${orderType.toUpperCase()} ${side} ${quantity}x ${card.name}` });
      }

      await fetchOrders();
    } catch (e: any) {
      toast({ title: "Trade Error", description: e.message, variant: "destructive" });
    }
  }, [user, portfolio, holdings, toast, fetchHoldings, fetchOrders]);

  // Available cards for trading (from live market data)
  const tradableCards = rawCards.slice(0, 50);

  // Calculate total portfolio value
  const holdingsValue = holdings.reduce((sum, h) => {
    const card = tradableCards.find(c => (c._apiId ?? `${c.set}-${c.number}`) === h.card_api_id);
    return sum + (card ? card.market * h.quantity : h.avg_cost * h.quantity);
  }, 0);

  const totalValue = (portfolio?.virtual_balance ?? 0) + holdingsValue;
  const pnl = totalValue - (portfolio?.starting_balance ?? 100000);
  const pnlPct = ((pnl / (portfolio?.starting_balance ?? 100000)) * 100);

  return {
    portfolio,
    holdings,
    orders,
    loading,
    tradableCards,
    placeOrder,
    totalValue,
    holdingsValue,
    pnl,
    pnlPct,
    refreshHoldings: fetchHoldings,
    refreshOrders: fetchOrders,
  };
};
