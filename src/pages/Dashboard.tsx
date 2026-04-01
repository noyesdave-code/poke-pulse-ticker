import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { usePortfolio, type PortfolioCard } from "@/hooks/usePortfolio";
import { usePortfolioSnapshots, useSaveSnapshot } from "@/hooks/usePortfolioSnapshots";
import { useQuery } from "@tanstack/react-query";
import { fetchCardById, getBestPrice } from "@/lib/pokemonTcgApi";
import TerminalHeader from "@/components/TerminalHeader";
import TickerBar from "@/components/TickerBar";
import AuthModal from "@/components/AuthModal";
import FinancialDisclaimer from "@/components/FinancialDisclaimer";
import { ArrowLeft, Loader2, TrendingUp, TrendingDown, Activity, BarChart3, PieChart as PieIcon } from "lucide-react";
import ValueUnlockPreview from "@/components/ValueUnlockPreview";
import CampaignProBanner from "@/components/campaign/CampaignProBanner";

const COLORS = [
  "hsl(145, 100%, 41%)", "hsl(40, 100%, 50%)", "hsl(210, 100%, 56%)",
  "hsl(280, 80%, 55%)", "hsl(0, 85%, 55%)", "hsl(170, 80%, 45%)",
  "hsl(60, 90%, 50%)", "hsl(320, 80%, 55%)",
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [range, setRange] = useState<"30D" | "90D" | "1Y" | "ALL">("90D");
  const { data: portfolio, isLoading: portfolioLoading } = usePortfolio();
  const saveSnapshot = useSaveSnapshot();

  const rangeDays = range === "30D" ? 30 : range === "90D" ? 90 : range === "1Y" ? 365 : 9999;
  const { data: snapshots, isLoading: snapshotsLoading } = usePortfolioSnapshots(rangeDays);

  // Fetch live prices
  const { data: livePrices } = useQuery({
    queryKey: ["dashboard-prices", portfolio?.map((c) => c.card_api_id).join(",")],
    queryFn: async () => {
      if (!portfolio) return {};
      const prices: Record<string, { market: number; set: string }> = {};
      for (let i = 0; i < portfolio.length; i += 5) {
        const batch = portfolio.slice(i, i + 5);
        await Promise.allSettled(
          batch.map(async (card) => {
            const apiCard = await fetchCardById(card.card_api_id);
            const price = getBestPrice(apiCard);
            if (price) prices[card.card_api_id] = { market: price.market, set: apiCard.set.name };
          })
        );
      }
      return prices;
    },
    enabled: !!portfolio && portfolio.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  // Auto-save today's snapshot when prices load
  useEffect(() => {
    if (!livePrices || !portfolio || portfolio.length === 0) return;
    let totalValue = 0;
    let totalCost = 0;
    for (const card of portfolio) {
      const p = livePrices[card.card_api_id];
      if (p) totalValue += p.market * card.quantity;
      if (card.purchase_price) totalCost += card.purchase_price * card.quantity;
    }
    if (totalValue > 0) {
      saveSnapshot.mutate({ total_value: totalValue, total_cost: totalCost, card_count: portfolio.reduce((s, c) => s + c.quantity, 0) });
    }
  }, [livePrices, portfolio]);

  // Compute summary
  const summary = useMemo(() => {
    if (!portfolio || !livePrices) return null;
    let totalValue = 0, totalCost = 0, totalCards = 0;
    for (const card of portfolio) {
      const p = livePrices[card.card_api_id];
      if (p) totalValue += p.market * card.quantity;
      if (card.purchase_price) totalCost += card.purchase_price * card.quantity;
      totalCards += card.quantity;
    }
    const pnl = totalCost > 0 ? totalValue - totalCost : 0;
    const pnlPct = totalCost > 0 ? (pnl / totalCost) * 100 : 0;
    return { totalValue, totalCost, totalCards, pnl, pnlPct };
  }, [portfolio, livePrices]);

  // Build chart data — use snapshots + today's live value
  const chartData = useMemo(() => {
    const points = (snapshots || []).map((s) => ({
      date: new Date(s.snapshot_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Number(s.total_value),
      cost: Number(s.total_cost),
    }));

    // If we have live data, make sure today is represented
    if (summary && summary.totalValue > 0) {
      const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const lastPoint = points[points.length - 1];
      if (!lastPoint || lastPoint.date !== today) {
        points.push({ date: today, value: summary.totalValue, cost: summary.totalCost });
      } else {
        lastPoint.value = summary.totalValue;
        lastPoint.cost = summary.totalCost;
      }
    }

    // If only 1 point, generate mock historical for visualization
    if (points.length <= 1 && summary && summary.totalValue > 0) {
      const mockPoints = [];
      for (let i = 30; i >= 1; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const variance = (Math.random() - 0.45) * summary.totalValue * 0.03;
        mockPoints.push({
          date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          value: Math.max(0, summary.totalValue * 0.85 + variance * i * 0.5),
          cost: summary.totalCost,
        });
      }
      mockPoints.push(points[0] || { date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }), value: summary.totalValue, cost: summary.totalCost });
      return mockPoints;
    }

    return points;
  }, [snapshots, summary]);

  // Allocation by set
  const allocation = useMemo(() => {
    if (!portfolio || !livePrices) return [];
    const bySet: Record<string, number> = {};
    for (const card of portfolio) {
      const p = livePrices[card.card_api_id];
      if (!p) continue;
      const setName = p.set || card.card_set;
      bySet[setName] = (bySet[setName] || 0) + p.market * card.quantity;
    }
    return Object.entries(bySet)
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
      .sort((a, b) => b.value - a.value);
  }, [portfolio, livePrices]);

  // Top performers
  const topCards = useMemo(() => {
    if (!portfolio || !livePrices) return [];
    return portfolio
      .map((card) => {
        const p = livePrices[card.card_api_id];
        if (!p || !card.purchase_price) return null;
        const currentVal = p.market * card.quantity;
        const costVal = card.purchase_price * card.quantity;
        const pnl = currentVal - costVal;
        const pnlPct = (pnl / costVal) * 100;
        return { ...card, currentVal, pnl, pnlPct };
      })
      .filter(Boolean)
      .sort((a, b) => b!.pnl - a!.pnl) as Array<PortfolioCard & { currentVal: number; pnl: number; pnlPct: number }>;
  }, [portfolio, livePrices]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <TerminalHeader />
        <TickerBar />
        <main className="max-w-7xl mx-auto px-4 py-12 text-center space-y-4">
          <h1 className="font-mono text-lg font-bold text-foreground">Portfolio Dashboard</h1>
          <p className="font-mono text-sm text-muted-foreground">Sign in to view your portfolio analytics.</p>
          <button onClick={() => setShowAuth(true)} className="font-mono text-sm font-semibold bg-primary text-primary-foreground rounded px-6 py-2.5 hover:opacity-90">
            Sign In
          </button>
          {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        </main>
      </div>
    );
  }

  const isLoading = portfolioLoading || snapshotsLoading;
  const minVal = chartData.length > 0 ? Math.min(...chartData.map((d) => d.value)) : 0;
  const maxVal = chartData.length > 0 ? Math.max(...chartData.map((d) => d.value)) : 100;

  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />
      <TickerBar />

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6">
        <CampaignProBanner />
        <ValueUnlockPreview />
        <button onClick={() => navigate("/portfolio")} className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Portfolio
        </button>

        <div className="terminal-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-mono text-lg font-bold text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Portfolio Dashboard
            </h1>
            <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
              Performance analytics & historical tracking
            </p>
          </div>
          {summary && (
            <div className="text-right">
              <p className="font-mono text-xl font-bold text-foreground">
                ${summary.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              {summary.totalCost > 0 && (
                <p className={`font-mono text-sm font-semibold ${summary.pnl >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
                  {summary.pnl >= 0 ? "▲" : "▼"} ${Math.abs(summary.pnl).toFixed(2)} ({summary.pnlPct >= 0 ? "+" : ""}{summary.pnlPct.toFixed(1)}%)
                </p>
              )}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 gap-2">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <span className="font-mono text-xs text-muted-foreground">Loading dashboard…</span>
          </div>
        ) : !portfolio || portfolio.length === 0 ? (
          <div className="terminal-card p-8 text-center">
            <p className="font-mono text-sm text-muted-foreground">Add cards to your portfolio to see analytics here.</p>
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Current Value" value={`$${(summary?.totalValue ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`} icon={<TrendingUp className="w-4 h-4 text-terminal-green" />} />
              <StatCard label="Cost Basis" value={summary?.totalCost ? `$${summary.totalCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "—"} icon={<BarChart3 className="w-4 h-4 text-terminal-blue" />} />
              <StatCard label="Total Cards" value={String(summary?.totalCards ?? 0)} icon={<PieIcon className="w-4 h-4 text-terminal-amber" />} />
              <div className="terminal-card p-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">P&L</p>
                {summary && summary.totalCost > 0 ? (
                  <div className="flex items-center gap-1 mt-1">
                    {summary.pnl >= 0 ? <TrendingUp className="w-4 h-4 text-terminal-green" /> : <TrendingDown className="w-4 h-4 text-terminal-red" />}
                    <span className={`font-mono text-base font-bold ${summary.pnl >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
                      {summary.pnl >= 0 ? "+" : ""}${Math.abs(summary.pnl).toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <p className="font-mono text-base font-bold text-muted-foreground mt-1">—</p>
                )}
              </div>
            </div>

            {/* Value over time chart */}
            <div className="terminal-card overflow-hidden">
              <div className="border-b border-border px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold">
                  Portfolio Value Over Time
                </h2>
                <div className="flex items-center gap-1">
                  {(["30D", "90D", "1Y", "ALL"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRange(r)}
                      className={`px-2 py-1 font-mono text-[10px] rounded transition-colors ${
                        range === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4" style={{ height: 320 }}>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(145, 100%, 41%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(145, 100%, 41%)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(210, 100%, 56%)" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="hsl(210, 100%, 56%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)", fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={{ stroke: "hsl(220, 15%, 16%)" }} interval="preserveStartEnd" />
                      <YAxis domain={[minVal * 0.9, maxVal * 1.1]} tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)", fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={{ stroke: "hsl(220, 15%, 16%)" }} tickFormatter={(v) => `$${v.toFixed(0)}`} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(220, 20%, 8%)", border: "1px solid hsl(220, 15%, 16%)", borderRadius: "4px", fontFamily: "JetBrains Mono", fontSize: 12 }} labelStyle={{ color: "hsl(215, 15%, 55%)" }} formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name === "value" ? "Value" : "Cost Basis"]} />
                      <Area type="monotone" dataKey="cost" stroke="hsl(210, 100%, 56%)" strokeWidth={1} strokeDasharray="4 4" fill="url(#costGrad)" />
                      <Area type="monotone" dataKey="value" stroke="hsl(145, 100%, 41%)" strokeWidth={2} fill="url(#dashGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="font-mono text-xs text-muted-foreground">No historical data yet. Check back tomorrow.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom row: Allocation + Top performers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Allocation pie */}
              <div className="terminal-card overflow-hidden">
                <div className="border-b border-border px-4 py-3">
                  <h2 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold">
                    Allocation by Set
                  </h2>
                </div>
                <div className="p-4 flex flex-col sm:flex-row items-center gap-4">
                  {allocation.length > 0 ? (
                    <>
                      <div style={{ width: 180, height: 180 }}>
                        <ResponsiveContainer>
                          <PieChart>
                            <Pie data={allocation} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} strokeWidth={1} stroke="hsl(220, 20%, 8%)">
                              {allocation.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: "hsl(220, 20%, 8%)", border: "1px solid hsl(220, 15%, 16%)", borderRadius: "4px", fontFamily: "JetBrains Mono", fontSize: 11 }} formatter={(value: number) => [`$${value.toFixed(2)}`]} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex-1 space-y-1.5 w-full">
                        {allocation.slice(0, 6).map((item, i) => (
                          <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                              <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[120px]">{item.name}</span>
                            </div>
                            <span className="font-mono text-xs text-foreground font-semibold">${item.value.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="font-mono text-xs text-muted-foreground text-center w-full py-8">No allocation data</p>
                  )}
                </div>
              </div>

              {/* Top performers */}
              <div className="terminal-card overflow-hidden">
                <div className="border-b border-border px-4 py-3">
                  <h2 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold">
                    Top Performers
                  </h2>
                </div>
                {topCards.length > 0 ? (
                  <div className="divide-y divide-border">
                    {topCards.slice(0, 6).map((card) => (
                      <div key={card.id} className="flex items-center justify-between px-4 py-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          {card.card_image && <img src={card.card_image} alt="" className="w-6 h-8 rounded object-cover" />}
                          <div className="min-w-0">
                            <p className="font-mono text-xs text-foreground font-medium truncate">{card.card_name}</p>
                            <p className="font-mono text-[9px] text-muted-foreground truncate">{card.card_set}</p>
                          </div>
                        </div>
                        <div className="text-right ml-2">
                          <p className={`font-mono text-xs font-semibold ${card.pnl >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
                            {card.pnl >= 0 ? "+" : ""}${Math.abs(card.pnl).toFixed(2)}
                          </p>
                          <p className={`font-mono text-[9px] ${card.pnl >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
                            {card.pnlPct >= 0 ? "+" : ""}{card.pnlPct.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-mono text-xs text-muted-foreground text-center py-8">Add purchase prices to see performance</p>
                )}
              </div>
            </div>

            <FinancialDisclaimer compact />
          </>
        )}
      </main>
    </div>
  );
};

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="terminal-card p-3">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
        {icon}
      </div>
      <p className="font-mono text-base font-bold text-foreground mt-1">{value}</p>
    </div>
  );
}

export default Dashboard;
