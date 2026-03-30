import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTraderGame } from "@/hooks/useTraderGame";
import TerminalHeader from "@/components/TerminalHeader";
import FinancialDisclaimer from "@/components/FinancialDisclaimer";
import AuthModal from "@/components/AuthModal";
import { TrendingUp, TrendingDown, DollarSign, Package, BarChart3, Clock, Zap, Shield, Trophy, Lock, Gamepad2, Bot, Crown, Medal } from "lucide-react";
import { STRIPE_TIERS } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import type { CardData } from "@/data/marketData";
import { getContestLeaderboard, type LeaderboardEntry, type BotDifficulty } from "@/data/tradingBots";

const TraderGate = ({ children }: { children: React.ReactNode }) => {
  const { user, subscribed, tier } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const isTrader = subscribed && tier === "trader";
  if (isTrader) return <>{children}</>;

  const handleUpgrade = async () => {
    if (!user) { setShowAuth(true); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: STRIPE_TIERS.trader.price_id },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch {} finally { setLoading(false); }
  };

  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-sm opacity-50">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="terminal-card border-primary/30 bg-background/95 backdrop-blur-sm p-6 text-center max-w-md mx-auto">
          <div className="flex justify-center mb-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
              <Gamepad2 className="h-5 w-5 text-primary" />
            </div>
          </div>
          <h3 className="font-mono text-sm font-bold text-foreground mb-1">🎮 TRADER Tier — Play Now</h3>
          <p className="text-xs text-muted-foreground mb-3">SimTrader requires a Trader subscription ($499/mo).</p>
          <ul className="text-left max-w-xs mx-auto space-y-1.5 mb-4 font-mono text-[11px]">
            <li className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-primary flex-shrink-0" /> $100K virtual trading balance</li>
            <li className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-primary flex-shrink-0" /> Limit orders & stop-losses</li>
            <li className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-primary flex-shrink-0" /> Daily contests & leaderboards</li>
          </ul>
          <button onClick={handleUpgrade} disabled={loading} className="w-full py-3 rounded-lg font-mono text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            <Gamepad2 className="h-4 w-4" />
            {loading ? "Loading..." : "Subscribe to Trader — $499/mo"}
          </button>
          {!user && <p className="text-[10px] text-muted-foreground mt-2">Sign in required to subscribe</p>}
          <a href="/pricing" className="block font-mono text-[10px] text-primary hover:underline mt-2">Compare all plans →</a>
        </motion.div>
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
};

const formatUSD = (v: number) => `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const SimTraderPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TerminalHeader />
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center ring-2 ring-primary/30">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-mono text-lg font-bold text-foreground">SIMTRADER™</h1>
            <p className="font-mono text-[10px] text-muted-foreground tracking-wider">POKÉMON STOCK MARKET SIMULATOR · LIVE DATA</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span className="font-mono text-[10px] text-primary font-semibold">SECURE SANDBOX</span>
          </div>
        </div>

        <TraderGate>
          {user ? <TradingDashboard /> : (
            <div className="terminal-card p-8 text-center">
              <p className="font-mono text-sm text-muted-foreground">Sign in to access SimTrader</p>
            </div>
          )}
        </TraderGate>

        <FinancialDisclaimer />
      </main>
    </div>
  );
};

const TradingDashboard = () => {
  const { portfolio, holdings, orders, loading, tradableCards, placeOrder, totalValue, holdingsValue, pnl, pnlPct } = useTraderGame();
  const [tab, setTab] = useState<"market" | "holdings" | "orders" | "contests">("market");
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [orderSide, setOrderSide] = useState<"buy" | "sell">("buy");
  const [orderQty, setOrderQty] = useState(1);
  const [orderType, setOrderType] = useState<"market" | "limit" | "stop_loss">("market");
  const [limitPrice, setLimitPrice] = useState("");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse font-mono text-sm text-muted-foreground">Loading SimTrader...</div>
      </div>
    );
  }

  const handleTrade = () => {
    if (!selectedCard) return;
    placeOrder(
      selectedCard,
      orderSide,
      orderQty,
      orderType,
      orderType === "limit" ? parseFloat(limitPrice) : undefined,
      orderType === "stop_loss" ? parseFloat(limitPrice) : undefined,
    );
    setSelectedCard(null);
    setOrderQty(1);
    setLimitPrice("");
  };

  return (
    <div className="space-y-4">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={<DollarSign className="h-4 w-4" />} label="Cash Balance" value={formatUSD(portfolio?.virtual_balance ?? 0)} />
        <StatCard icon={<Package className="h-4 w-4" />} label="Holdings Value" value={formatUSD(holdingsValue)} />
        <StatCard icon={<BarChart3 className="h-4 w-4" />} label="Total Value" value={formatUSD(totalValue)} />
        <StatCard
          icon={pnl >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          label="P&L"
          value={`${pnl >= 0 ? "+" : ""}${formatUSD(pnl)}`}
          sub={`${pnlPct >= 0 ? "+" : ""}${pnlPct.toFixed(2)}%`}
          positive={pnl >= 0}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {(["market", "holdings", "orders", "contests"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`font-mono text-xs px-3 py-2 border-b-2 transition-colors ${tab === t ? "border-primary text-primary font-bold" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Trade Panel (appears when card selected) */}
      {selectedCard && (
        <div className="terminal-card border-primary/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-sm font-bold">{selectedCard.name}</p>
              <p className="font-mono text-[10px] text-muted-foreground">{selectedCard.set} #{selectedCard.number}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-lg font-bold text-foreground">{formatUSD(selectedCard.market)}</p>
              <span className={`font-mono text-[10px] ${selectedCard.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                {selectedCard.change >= 0 ? "+" : ""}{selectedCard.change.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setOrderSide("buy")} className={`py-2 rounded font-mono text-xs font-bold ${orderSide === "buy" ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/40" : "bg-muted text-muted-foreground"}`}>BUY</button>
            <button onClick={() => setOrderSide("sell")} className={`py-2 rounded font-mono text-xs font-bold ${orderSide === "sell" ? "bg-red-500/20 text-red-400 ring-1 ring-red-500/40" : "bg-muted text-muted-foreground"}`}>SELL</button>
          </div>

          <div className="flex gap-2">
            {(["market", "limit", "stop_loss"] as const).map(t => (
              <button key={t} onClick={() => setOrderType(t)} className={`flex-1 py-1.5 rounded font-mono text-[10px] font-semibold ${orderType === t ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                {t === "stop_loss" ? "STOP-LOSS" : t.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="font-mono text-[10px] text-muted-foreground block mb-1">QTY</label>
              <input type="number" min={1} max={9999} value={orderQty} onChange={e => setOrderQty(Math.max(1, parseInt(e.target.value) || 1))} className="w-full bg-muted border border-border rounded px-2 py-1.5 font-mono text-sm text-foreground" />
            </div>
            {orderType !== "market" && (
              <div className="flex-1">
                <label className="font-mono text-[10px] text-muted-foreground block mb-1">{orderType === "limit" ? "LIMIT $" : "STOP $"}</label>
                <input type="number" min={0.01} step={0.01} value={limitPrice} onChange={e => setLimitPrice(e.target.value)} className="w-full bg-muted border border-border rounded px-2 py-1.5 font-mono text-sm text-foreground" />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
            <span>Est. Total:</span>
            <span className="text-foreground font-bold">{formatUSD(selectedCard.market * orderQty)}</span>
          </div>

          <button onClick={handleTrade} className={`w-full py-2.5 rounded font-mono text-sm font-bold transition-all ${orderSide === "buy" ? "bg-green-500 text-black hover:bg-green-400" : "bg-red-500 text-white hover:bg-red-400"}`}>
            {orderSide === "buy" ? "🟢" : "🔴"} {orderSide.toUpperCase()} {orderQty}x {selectedCard.name}
          </button>

          <button onClick={() => setSelectedCard(null)} className="w-full py-1.5 font-mono text-[10px] text-muted-foreground hover:text-foreground">Cancel</button>
        </div>
      )}

      {/* Market Tab */}
      {tab === "market" && (
        <div className="terminal-card overflow-hidden">
          <div className="grid grid-cols-[1fr_80px_70px_60px] gap-2 px-3 py-2 border-b border-border font-mono text-[10px] text-muted-foreground tracking-wider">
            <span>TOKEN</span><span className="text-right">PRICE</span><span className="text-right">CHG</span><span></span>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {tradableCards.map((card, i) => (
              <div key={i} onClick={() => setSelectedCard(card)} className="grid grid-cols-[1fr_80px_70px_60px] gap-2 px-3 py-2 border-b border-border/50 hover:bg-muted/50 cursor-pointer transition-colors items-center">
                <div>
                  <p className="font-mono text-xs font-semibold text-foreground truncate">{card.name}</p>
                  <p className="font-mono text-[9px] text-muted-foreground">{card.set}</p>
                </div>
                <span className="font-mono text-xs text-right text-foreground">{formatUSD(card.market)}</span>
                <span className={`font-mono text-[10px] text-right font-semibold ${card.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {card.change >= 0 ? "+" : ""}{card.change.toFixed(2)}%
                </span>
                <button className="font-mono text-[9px] bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20">TRADE</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Holdings Tab */}
      {tab === "holdings" && (
        <div className="terminal-card overflow-hidden">
          {holdings.length === 0 ? (
            <div className="p-8 text-center font-mono text-sm text-muted-foreground">
              No holdings yet. Buy your first token from the Market tab!
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[1fr_60px_80px_80px] gap-2 px-3 py-2 border-b border-border font-mono text-[10px] text-muted-foreground">
                <span>TOKEN</span><span className="text-right">QTY</span><span className="text-right">AVG COST</span><span className="text-right">VALUE</span>
              </div>
              {holdings.map(h => {
                const card = tradableCards.find(c => (c._apiId ?? `${c.set}-${c.number}`) === h.card_api_id);
                const currentPrice = card?.market ?? h.avg_cost;
                const value = currentPrice * h.quantity;
                const pnl = (currentPrice - h.avg_cost) * h.quantity;
                return (
                  <div key={h.id} onClick={() => card && setSelectedCard(card)} className="grid grid-cols-[1fr_60px_80px_80px] gap-2 px-3 py-2 border-b border-border/50 hover:bg-muted/50 cursor-pointer items-center">
                    <div>
                      <p className="font-mono text-xs font-semibold truncate">{h.card_name}</p>
                      <p className={`font-mono text-[9px] ${pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {pnl >= 0 ? "+" : ""}{formatUSD(pnl)}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-right">{h.quantity}</span>
                    <span className="font-mono text-[10px] text-right text-muted-foreground">{formatUSD(h.avg_cost)}</span>
                    <span className="font-mono text-xs text-right font-semibold">{formatUSD(value)}</span>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {tab === "orders" && (
        <div className="terminal-card overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-8 text-center font-mono text-sm text-muted-foreground">No trade history yet</div>
          ) : (
            <>
              <div className="grid grid-cols-[1fr_50px_60px_60px_60px] gap-1 px-3 py-2 border-b border-border font-mono text-[9px] text-muted-foreground">
                <span>TOKEN</span><span>SIDE</span><span className="text-right">QTY</span><span className="text-right">PRICE</span><span className="text-right">STATUS</span>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {orders.map(o => (
                  <div key={o.id} className="grid grid-cols-[1fr_50px_60px_60px_60px] gap-1 px-3 py-2 border-b border-border/50 items-center">
                    <div>
                      <p className="font-mono text-[10px] font-semibold truncate">{o.card_name}</p>
                      <p className="font-mono text-[8px] text-muted-foreground">{new Date(o.created_at).toLocaleTimeString()}</p>
                    </div>
                    <span className={`font-mono text-[10px] font-bold ${o.side === "buy" ? "text-green-400" : "text-red-400"}`}>{o.side.toUpperCase()}</span>
                    <span className="font-mono text-[10px] text-right">{o.quantity}</span>
                    <span className="font-mono text-[10px] text-right">{formatUSD(o.price)}</span>
                    <span className={`font-mono text-[8px] text-right font-semibold ${o.status === "filled" ? "text-primary" : "text-yellow-400"}`}>{o.status.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Contests Tab */}
      {tab === "contests" && (
        <ContestsPanel
          userTotalValue={totalValue}
          userPnlPct={pnlPct}
        />
      )}

      {/* Disclaimer */}
      <div className="terminal-card border-yellow-500/30 p-3">
        <p className="font-mono text-[9px] text-yellow-500/80 text-center">
          ⚠️ SIMULATION ONLY — SimTrader uses virtual currency and does not involve real money trading. All trades are simulated based on live market data. No real financial transactions occur. For entertainment and educational purposes only.
        </p>
      </div>

      {/* Legal IP Notice */}
      <div className="terminal-card border-border p-3 space-y-1">
        <p className="font-mono text-[8px] text-muted-foreground/60 text-center leading-relaxed">
          SimTrader™ is the exclusive proprietary intellectual property of PGVA Ventures, LLC, wholly owned by the Noyes Family Trust, managed by David Noyes. All rights reserved under U.S. and international copyright, trade secret, and intellectual property law. Unauthorized copying, reproduction, reverse-engineering, or creation of derivative works is strictly prohibited and will be prosecuted under the DMCA, CFAA, DTSA, and applicable state law. © {new Date().getFullYear()} PGVA Ventures, LLC. All rights reserved.
        </p>
      </div>
    </div>
  );
};

const difficultyColor = (d: BotDifficulty) =>
  d === "easy" ? "text-green-400" : d === "medium" ? "text-yellow-400" : "text-red-400";
const difficultyLabel = (d: BotDifficulty) =>
  d === "easy" ? "EASY" : d === "medium" ? "MED" : "HARD";

const ContestsPanel = ({ userTotalValue, userPnlPct }: { userTotalValue: number; userPnlPct: number }) => {
  const today = new Date().toISOString().slice(0, 10);
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);

  const dailyLeaderboard = useMemo(() =>
    getContestLeaderboard(`daily_${today}`, 50000, Math.max(1, dayOfYear % 7), {
      name: "You",
      totalValue: userTotalValue,
      pnlPct: userPnlPct,
    }), [today, dayOfYear, userTotalValue, userPnlPct]);

  const weekendLeaderboard = useMemo(() =>
    getContestLeaderboard(`weekend_${today}`, 100000, 2, {
      name: "You",
      totalValue: userTotalValue,
      pnlPct: userPnlPct,
    }), [today, userTotalValue, userPnlPct]);

  const [activeContest, setActiveContest] = useState<"daily" | "weekend">("daily");
  const leaderboard = activeContest === "daily" ? dailyLeaderboard : weekendLeaderboard;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Trophy className="h-5 w-5 text-primary" />
        <h3 className="font-mono text-sm font-bold">Trading Contests</h3>
        <div className="ml-auto flex items-center gap-1">
          <Bot className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-mono text-[9px] text-muted-foreground">10 AI OPPONENTS</span>
        </div>
      </div>

      {/* Contest Selector */}
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setActiveContest("daily")} className={`terminal-card p-3 text-left transition-all ${activeContest === "daily" ? "border-primary/50 bg-primary/5" : "hover:bg-muted/50"}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] font-bold text-primary">DAILY BLITZ</span>
            <span className="font-mono text-[8px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">ACTIVE</span>
          </div>
          <p className="font-mono text-[8px] text-muted-foreground">$50K balance · Highest P&L wins</p>
        </button>
        <button onClick={() => setActiveContest("weekend")} className={`terminal-card p-3 text-left transition-all ${activeContest === "weekend" ? "border-primary/50 bg-primary/5" : "hover:bg-muted/50"}`}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] font-bold">WEEKEND WARRIOR</span>
            <span className="font-mono text-[8px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">UPCOMING</span>
          </div>
          <p className="font-mono text-[8px] text-muted-foreground">$100K balance · 48hr marathon</p>
        </button>
      </div>

      {/* Leaderboard */}
      <div className="terminal-card overflow-hidden">
        <div className="grid grid-cols-[30px_1fr_60px_70px] gap-2 px-3 py-2 border-b border-border font-mono text-[9px] text-muted-foreground tracking-wider">
          <span>#</span><span>TRADER</span><span className="text-right">P&L %</span><span className="text-right">VALUE</span>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {leaderboard.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: entry.rank * 0.03 }}
              className={`grid grid-cols-[30px_1fr_60px_70px] gap-2 px-3 py-2.5 border-b border-border/50 items-center ${
                !entry.isBot ? "bg-primary/5 ring-1 ring-primary/20" : "hover:bg-muted/30"
              }`}
            >
              <span className="font-mono text-xs font-bold">
                {entry.rank === 1 ? <Crown className="h-4 w-4 text-yellow-400" /> :
                 entry.rank === 2 ? <Medal className="h-4 w-4 text-gray-400" /> :
                 entry.rank === 3 ? <Medal className="h-4 w-4 text-amber-600" /> :
                 <span className="text-muted-foreground">{entry.rank}</span>}
              </span>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base flex-shrink-0">{entry.avatar}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className={`font-mono text-[11px] font-semibold truncate ${!entry.isBot ? "text-primary" : "text-foreground"}`}>
                      {entry.name}
                    </p>
                    {entry.isBot && (
                      <span className={`font-mono text-[7px] font-bold px-1 py-0.5 rounded ${difficultyColor(entry.difficulty!)}`}>
                        {difficultyLabel(entry.difficulty!)}
                      </span>
                    )}
                    {!entry.isBot && (
                      <span className="font-mono text-[7px] font-bold px-1 py-0.5 rounded bg-primary/20 text-primary">YOU</span>
                    )}
                  </div>
                  <p className="font-mono text-[8px] text-muted-foreground truncate">
                    {entry.isBot ? entry.title : "Human Player"}
                  </p>
                </div>
              </div>
              <span className={`font-mono text-[10px] text-right font-bold ${entry.pnlPct >= 0 ? "text-green-400" : "text-red-400"}`}>
                {entry.pnlPct >= 0 ? "+" : ""}{entry.pnlPct.toFixed(2)}%
              </span>
              <span className="font-mono text-[10px] text-right text-foreground">
                {formatUSD(entry.totalValue)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] text-muted-foreground"><Clock className="inline h-3 w-3 mr-1" />Resets daily at midnight EST</span>
        <span className="font-mono text-[9px] text-primary font-semibold">🏆 Badge + 1 Month Extension</span>
      </div>
      <p className="font-mono text-[8px] text-muted-foreground text-center">Contest prizes are in-app rewards only. No real monetary value. AI bots simulate trading strategies for competitive gameplay.</p>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub, positive }: { icon: React.ReactNode; label: string; value: string; sub?: string; positive?: boolean }) => (
  <div className="terminal-card p-3">
    <div className="flex items-center gap-1.5 mb-1">
      <span className="text-primary">{icon}</span>
      <span className="font-mono text-[9px] text-muted-foreground tracking-wider">{label}</span>
    </div>
    <p className={`font-mono text-sm font-bold ${positive !== undefined ? (positive ? "text-green-400" : "text-red-400") : "text-foreground"}`}>{value}</p>
    {sub && <p className={`font-mono text-[10px] ${positive ? "text-green-400" : "text-red-400"}`}>{sub}</p>}
  </div>
);

export default SimTraderPage;
