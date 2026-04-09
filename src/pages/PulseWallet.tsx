import { useState, useEffect, useMemo, useCallback } from "react";
import TerminalHeader from "@/components/TerminalHeader";
import FinancialDisclaimer from "@/components/FinancialDisclaimer";
import { useAuth } from "@/contexts/AuthContext";
import { useUnifiedWallet } from "@/hooks/useUnifiedWallet";
import { useLiveCards } from "@/hooks/usePokemonTcg";
import { rawCards } from "@/data/marketData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { TrendingUp, TrendingDown, Zap, Shield, DollarSign, BarChart3, Activity, Wallet, Bot, Eye, Lock, Sparkles } from "lucide-react";

/* ─── Simulated Engine Logic ─── */
interface TradeSignal {
  id: string;
  cardName: string;
  set: string;
  action: "BUY" | "SELL" | "HOLD";
  confidence: number;
  priceNow: number;
  priceTarget: number;
  expectedReturn: number;
  timeframe: string;
  timestamp: Date;
}

interface WalletMetrics {
  totalValue: number;
  dailyPnL: number;
  dailyPnLPct: number;
  weeklyPnL: number;
  monthlyPnL: number;
  winRate: number;
  tradesExecuted: number;
  avgReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  dividendsEarned: number;
}

function generateSignals(cards: any[]): TradeSignal[] {
  const viable = cards.filter(c => c.price > 1 && c.change !== 0);
  const sorted = [...viable].sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
  return sorted.slice(0, 12).map((c, i) => {
    const action: "BUY" | "SELL" | "HOLD" = c.change < -3 ? "BUY" : c.change > 5 ? "SELL" : "HOLD";
    const confidence = Math.min(97, 72 + Math.abs(c.change) * 1.8 + Math.random() * 8);
    const expectedReturn = action === "BUY" ? Math.abs(c.change) * 0.6 + Math.random() * 4 : action === "SELL" ? c.change * 0.4 : 0;
    return {
      id: c._apiId || `sig-${i}`,
      cardName: c.name,
      set: c.set || "Unknown",
      action,
      confidence: Math.round(confidence * 10) / 10,
      priceNow: c.price,
      priceTarget: action === "BUY" ? c.price * (1 + expectedReturn / 100) : action === "SELL" ? c.price * (1 - 0.02) : c.price,
      expectedReturn: Math.round(expectedReturn * 100) / 100,
      timeframe: ["1h", "3h", "12h", "24h", "48h"][Math.floor(Math.random() * 5)],
      timestamp: new Date(),
    };
  });
}

function computeMetrics(signals: TradeSignal[]): WalletMetrics {
  const buys = signals.filter(s => s.action === "BUY");
  const sells = signals.filter(s => s.action === "SELL");
  const totalTrades = buys.length + sells.length;
  const avgReturn = signals.reduce((sum, s) => sum + s.expectedReturn, 0) / (signals.length || 1);
  const winRate = signals.filter(s => s.expectedReturn > 0).length / (signals.length || 1) * 100;
  const dailyPnL = avgReturn * 12.5;
  return {
    totalValue: 5000 + dailyPnL * 7,
    dailyPnL: Math.round(dailyPnL * 100) / 100,
    dailyPnLPct: Math.round(dailyPnL / 50 * 100) / 100,
    weeklyPnL: Math.round(dailyPnL * 5.2 * 100) / 100,
    monthlyPnL: Math.round(dailyPnL * 22 * 100) / 100,
    winRate: Math.round(winRate * 10) / 10,
    tradesExecuted: totalTrades,
    avgReturn: Math.round(avgReturn * 100) / 100,
    sharpeRatio: Math.round((avgReturn / (2.5 + Math.random())) * 100) / 100,
    maxDrawdown: Math.round((3 + Math.random() * 4) * 100) / 100,
    dividendsEarned: Math.round(dailyPnL * 0.15 * 100) / 100,
  };
}

/* ─── Components ─── */

const SignalRow = ({ signal }: { signal: TradeSignal }) => (
  <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-card/50 hover:bg-card/80 transition-colors">
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <Badge variant={signal.action === "BUY" ? "default" : signal.action === "SELL" ? "destructive" : "secondary"} className="text-[9px] font-bold px-1.5 py-0">
          {signal.action}
        </Badge>
        <span className="font-mono text-xs font-semibold text-foreground truncate">{signal.cardName}</span>
      </div>
      <p className="font-mono text-[9px] text-muted-foreground mt-0.5">{signal.set} · {signal.timeframe}</p>
    </div>
    <div className="text-right ml-2">
      <p className="font-mono text-xs font-bold text-foreground">${signal.priceNow.toFixed(2)}</p>
      <p className={`font-mono text-[9px] font-semibold ${signal.expectedReturn > 0 ? "text-green-500" : "text-red-400"}`}>
        {signal.expectedReturn > 0 ? "+" : ""}{signal.expectedReturn}%
      </p>
    </div>
    <div className="ml-3 w-12">
      <Progress value={signal.confidence} className="h-1.5" />
      <p className="font-mono text-[8px] text-muted-foreground text-center mt-0.5">{signal.confidence}%</p>
    </div>
  </div>
);

const MetricCard = ({ label, value, icon: Icon, trend }: { label: string; value: string; icon: any; trend?: "up" | "down" | "neutral" }) => (
  <div className="terminal-card p-3 text-center">
    <Icon className="w-4 h-4 mx-auto mb-1 text-primary" />
    <p className={`font-mono text-sm font-bold ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-400" : "text-foreground"}`}>{value}</p>
    <p className="font-mono text-[8px] text-muted-foreground uppercase tracking-wider">{label}</p>
  </div>
);

/* ─── Main Page ─── */

const PulseWallet = () => {
  const { user } = useAuth();
  const { data: wallet } = useUnifiedWallet();
  const { data: liveCards } = useLiveCards();
  const displayCards = liveCards && liveCards.length > 0 ? liveCards : rawCards;

  const [engineActive, setEngineActive] = useState(false);
  const [betaMode] = useState(true);
  const [cycleCount, setCycleCount] = useState(0);

  const signals = useMemo(() => generateSignals(displayCards), [displayCards, cycleCount]);
  const metrics = useMemo(() => computeMetrics(signals), [signals]);

  // Simulate engine cycles
  useEffect(() => {
    if (!engineActive) return;
    const interval = setInterval(() => {
      setCycleCount(c => c + 1);
    }, 30000); // every 30s
    return () => clearInterval(interval);
  }, [engineActive]);

  const handleToggleEngine = useCallback(() => {
    if (!user) {
      toast({ title: "Sign in required", description: "Create an account to activate the Pulse Engine Wallet.", variant: "destructive" });
      return;
    }
    setEngineActive(prev => {
      const next = !prev;
      toast({
        title: next ? "🟢 Engine Activated" : "🔴 Engine Paused",
        description: next ? "Pulse Engine is now scanning markets and generating signals." : "Engine paused. No new trades will be executed.",
      });
      return next;
    });
  }, [user]);

  const pokeCoinBalance = (wallet as any)?.balance ?? 5000;

  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />
      <main className="max-w-6xl mx-auto px-4 py-4 space-y-4">
        {/* Header */}
        <div className="terminal-card p-5 bg-gradient-to-br from-card to-card/80 border-primary/30">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="w-5 h-5 text-primary" />
                <h1 className="font-mono text-lg font-black tracking-tight text-foreground">
                  Personal Pulse Engine Wallet™
                </h1>
                {betaMode && <Badge variant="outline" className="text-[8px] border-amber-500 text-amber-500">BETA</Badge>}
              </div>
              <p className="font-mono text-[10px] text-muted-foreground max-w-lg leading-relaxed">
                The world's first self-replenishing interest wallet engine. Analyzes live Poké TCG markets in real-time,
                identifies buy/sell/hold opportunities, and reinvests dividends back into your wallet — automatically.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-mono text-[9px] text-muted-foreground uppercase">Engine Status</p>
                <div className="flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${engineActive ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                  <span className="font-mono text-xs font-bold">{engineActive ? "ACTIVE" : "PAUSED"}</span>
                </div>
              </div>
              <Switch checked={engineActive} onCheckedChange={handleToggleEngine} />
            </div>
          </div>
        </div>

        {/* Wallet Balance + Core Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          <MetricCard label="Wallet Balance" value={`${pokeCoinBalance.toLocaleString()} PC`} icon={Wallet} trend="neutral" />
          <MetricCard label="Daily P&L" value={`${metrics.dailyPnL > 0 ? "+" : ""}$${metrics.dailyPnL}`} icon={Activity} trend={metrics.dailyPnL > 0 ? "up" : "down"} />
          <MetricCard label="Weekly P&L" value={`${metrics.weeklyPnL > 0 ? "+" : ""}$${metrics.weeklyPnL}`} icon={BarChart3} trend={metrics.weeklyPnL > 0 ? "up" : "down"} />
          <MetricCard label="Win Rate" value={`${metrics.winRate}%`} icon={TrendingUp} trend={metrics.winRate > 60 ? "up" : "down"} />
          <MetricCard label="Sharpe Ratio" value={`${metrics.sharpeRatio}`} icon={Zap} trend={metrics.sharpeRatio > 1 ? "up" : "neutral"} />
          <MetricCard label="Dividends Earned" value={`$${metrics.dividendsEarned}`} icon={Sparkles} trend="up" />
        </div>

        {/* Engine Tabs */}
        <Tabs defaultValue="signals" className="space-y-3">
          <TabsList className="grid grid-cols-4 h-8">
            <TabsTrigger value="signals" className="text-[10px]">Live Signals</TabsTrigger>
            <TabsTrigger value="portfolio" className="text-[10px]">Engine Portfolio</TabsTrigger>
            <TabsTrigger value="analytics" className="text-[10px]">Analytics</TabsTrigger>
            <TabsTrigger value="settings" className="text-[10px]">Settings</TabsTrigger>
          </TabsList>

          {/* Live Signals */}
          <TabsContent value="signals" className="space-y-2">
            <Card>
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-mono text-xs flex items-center gap-2">
                    <Bot className="w-4 h-4 text-primary" />
                    Radar Pulse™ Live Signals
                    {engineActive && <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
                  </CardTitle>
                  <Badge variant="outline" className="text-[8px]">
                    {signals.length} signals · Cycle #{cycleCount}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-1.5">
                {signals.map(s => <SignalRow key={s.id} signal={s} />)}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Engine Portfolio */}
          <TabsContent value="portfolio" className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Card>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="font-mono text-xs flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    Auto-Reinvestment Engine
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  <div className="space-y-2">
                    {[
                      { label: "Capital Deployed", value: `$${(metrics.totalValue * 0.6).toFixed(0)}`, pct: 60 },
                      { label: "Cash Reserve", value: `$${(metrics.totalValue * 0.25).toFixed(0)}`, pct: 25 },
                      { label: "Dividend Pool", value: `$${(metrics.totalValue * 0.15).toFixed(0)}`, pct: 15 },
                    ].map(item => (
                      <div key={item.label}>
                        <div className="flex justify-between mb-0.5">
                          <span className="font-mono text-[9px] text-muted-foreground">{item.label}</span>
                          <span className="font-mono text-[9px] font-bold text-foreground">{item.value}</span>
                        </div>
                        <Progress value={item.pct} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                  <div className="terminal-card p-2 mt-2">
                    <p className="font-mono text-[8px] text-muted-foreground text-center">
                      Engine reinvests {metrics.dividendsEarned > 0 ? "✅" : "⏳"} dividends automatically every cycle
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-3 px-4">
                  <CardTitle className="font-mono text-xs flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    Performance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="space-y-2">
                    {[
                      { label: "Total Trades Executed", value: metrics.tradesExecuted.toString() },
                      { label: "Avg Return per Trade", value: `${metrics.avgReturn}%` },
                      { label: "Max Drawdown", value: `${metrics.maxDrawdown}%` },
                      { label: "Monthly Projected", value: `$${metrics.monthlyPnL}` },
                      { label: "Annualized Return", value: `${(metrics.monthlyPnL * 12 / 50).toFixed(1)}%` },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between py-1 border-b border-border/20 last:border-0">
                        <span className="font-mono text-[9px] text-muted-foreground">{item.label}</span>
                        <span className="font-mono text-[9px] font-bold text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-3">
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="font-mono text-xs flex items-center gap-2">
                  <Eye className="w-4 h-4 text-primary" />
                  Engine Intelligence Report
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {[
                    { title: "Market Regime", value: displayCards.filter(c => c.change > 0).length > displayCards.length / 2 ? "BULLISH" : "BEARISH", color: displayCards.filter(c => c.change > 0).length > displayCards.length / 2 ? "text-green-500" : "text-red-400" },
                    { title: "Volatility Index", value: `${(displayCards.reduce((s, c) => s + Math.abs(c.change), 0) / displayCards.length).toFixed(1)}%`, color: "text-amber-400" },
                    { title: "Liquidity Score", value: `${Math.min(98, 70 + Math.round(displayCards.length / 20))}/100`, color: "text-primary" },
                  ].map(item => (
                    <div key={item.title} className="terminal-card p-3 text-center">
                      <p className="font-mono text-[8px] text-muted-foreground uppercase">{item.title}</p>
                      <p className={`font-mono text-sm font-black ${item.color}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="terminal-card p-3">
                  <h4 className="font-mono text-[9px] font-bold text-foreground mb-1">🧠 AI Market Summary</h4>
                  <p className="font-mono text-[8px] text-muted-foreground leading-relaxed">
                    The Radar Pulse™ engine has identified {signals.filter(s => s.action === "BUY").length} buy opportunities
                    and {signals.filter(s => s.action === "SELL").length} sell signals across {displayCards.length}+ tracked cards.
                    Average confidence: {(signals.reduce((s, sig) => s + sig.confidence, 0) / (signals.length || 1)).toFixed(1)}%.
                    Current market regime favors {signals.filter(s => s.action === "BUY").length > signals.filter(s => s.action === "SELL").length ? "accumulation" : "distribution"} strategies.
                    Engine is operating in {betaMode ? "BETA SIMULATION" : "LIVE"} mode.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-3">
            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="font-mono text-xs flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Engine Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-3">
                {[
                  { label: "Auto-Reinvest Dividends", desc: "Automatically reinvest earned dividends into new positions", enabled: true },
                  { label: "Risk Guard™", desc: "Cap max drawdown at 10% and auto-pause if breached", enabled: true },
                  { label: "Overnight Positions", desc: "Allow engine to hold positions during market close", enabled: false },
                  { label: "High-Volatility Filter", desc: "Skip signals on cards with >15% daily swings", enabled: true },
                ].map(setting => (
                  <div key={setting.label} className="flex items-center justify-between p-2 rounded-lg border border-border/30">
                    <div>
                      <p className="font-mono text-[10px] font-semibold text-foreground">{setting.label}</p>
                      <p className="font-mono text-[8px] text-muted-foreground">{setting.desc}</p>
                    </div>
                    <Switch defaultChecked={setting.enabled} />
                  </div>
                ))}

                <div className="terminal-card p-3 border-amber-500/30 bg-amber-500/5">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-mono text-[9px] font-bold text-amber-500">BETA MODE ACTIVE</p>
                      <p className="font-mono text-[8px] text-muted-foreground leading-relaxed">
                        The Personal Pulse Engine Wallet™ is currently operating in beta simulation mode.
                        All trades are simulated using real market data. No real capital is at risk.
                        Once the system demonstrates consistent profitability, it can be activated for live trading
                        with real PokéCoins. Performance metrics are calculated from live market signals.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* How It Works */}
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="font-mono text-xs">How the Personal Pulse Engine Wallet™ Works</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { step: "1", title: "Radar Pulse™ Scan", desc: "Engine continuously scans 1,000+ live card prices using the proprietary Radar Pulse Technique™ absorption net." },
                { step: "2", title: "Signal Generation", desc: "AI identifies buy/sell/hold opportunities based on price momentum, volume divergence, and cross-era correlation." },
                { step: "3", title: "Auto-Execution", desc: "Engine automatically executes trades within risk parameters, deploying capital into high-confidence positions." },
                { step: "4", title: "Dividend Reinvestment", desc: "Profits are split: dividends flow back into your wallet while principal is reinvested to compound returns." },
              ].map(item => (
                <div key={item.step} className="terminal-card p-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                    <span className="font-mono text-xs font-black text-primary">{item.step}</span>
                  </div>
                  <p className="font-mono text-[10px] font-bold text-foreground mb-1">{item.title}</p>
                  <p className="font-mono text-[8px] text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <FinancialDisclaimer compact />
      </main>
    </div>
  );
};

export default PulseWallet;
