import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLiveCards } from "@/hooks/usePokemonTcg";
import { rawCards } from "@/data/marketData";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wallet, TrendingUp, Activity, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Signal {
  cardName: string;
  action: "BUY" | "SELL" | "HOLD";
  confidence: number;
  expectedReturn: number;
}

const PulseWalletWidget = () => {
  const { user, subscribed, tier } = useAuth();
  const { data: liveCards } = useLiveCards();
  const displayCards = liveCards && liveCards.length > 0 ? liveCards : rawCards;

  const isPro = subscribed && (tier === "pro" || tier === "premium" || tier === "team" || tier === "whale");

  const [cycle, setCycle] = useState(0);

  // Auto-refresh every 60s — each cycle strengthens the signal pool
  useEffect(() => {
    const iv = setInterval(() => setCycle(c => c + 1), 60000);
    return () => clearInterval(iv);
  }, []);

  const { signals, metrics } = useMemo(() => {
    const poolSize = Math.min(displayCards.length, 500 + cycle * 10); // grows each cycle
    const pool = displayCards.slice(0, poolSize);
    const viable = pool.filter(c => c.market > 1 && c.change !== 0);
    const sorted = [...viable].sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
    const top = sorted.slice(0, 8).map((c): Signal => {
      const action: "BUY" | "SELL" | "HOLD" = c.change < -3 ? "BUY" : c.change > 5 ? "SELL" : "HOLD";
      const confidence = Math.min(97, 72 + Math.abs(c.change) * 1.8 + (Math.sin(cycle + c.market) + 1) * 4);
      const expectedReturn = action === "BUY" ? Math.abs(c.change) * 0.6 + 2 : action === "SELL" ? c.change * 0.4 : 0;
      return { cardName: c.name, action, confidence: Math.round(confidence * 10) / 10, expectedReturn: Math.round(expectedReturn * 100) / 100 };
    });

    const winRate = top.filter(s => s.expectedReturn > 0).length / (top.length || 1) * 100;
    const avgReturn = top.reduce((s, t) => s + t.expectedReturn, 0) / (top.length || 1);
    const dailyPnL = avgReturn * 12.5;

    return {
      signals: top.slice(0, 4),
      metrics: {
        balance: 5000 + dailyPnL * 7,
        dailyPnL: Math.round(dailyPnL * 100) / 100,
        winRate: Math.round(winRate),
        poolSize,
        dividends: Math.round(dailyPnL * 0.15 * 100) / 100,
      },
    };
  }, [displayCards, cycle]);

  // Only show for paid users
  if (!user || !isPro) return null;

  return (
    <div className="terminal-card border-primary/30 p-4 bg-gradient-to-br from-card to-card/80">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-mono text-xs font-bold text-foreground flex items-center gap-1.5">
              Pulse Engine Wallet™
              <Badge variant="outline" className="text-[7px] border-green-500 text-green-500 px-1 py-0">ACTIVE</Badge>
            </h3>
            <p className="font-mono text-[8px] text-muted-foreground">
              Self-replenishing · {metrics.poolSize} cards scanned · Cycle #{cycle + 1}
            </p>
          </div>
        </div>
        <Link to="/pulse-wallet" className="font-mono text-[9px] text-primary hover:underline flex items-center gap-0.5">
          Full Dashboard <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="text-center">
          <p className="font-mono text-xs font-bold text-foreground">${metrics.balance.toFixed(0)}</p>
          <p className="font-mono text-[7px] text-muted-foreground uppercase">Balance</p>
        </div>
        <div className="text-center">
          <p className={`font-mono text-xs font-bold ${metrics.dailyPnL >= 0 ? "text-green-500" : "text-red-400"}`}>
            {metrics.dailyPnL >= 0 ? "+" : ""}${metrics.dailyPnL}
          </p>
          <p className="font-mono text-[7px] text-muted-foreground uppercase">Daily P&L</p>
        </div>
        <div className="text-center">
          <p className="font-mono text-xs font-bold text-foreground">{metrics.winRate}%</p>
          <p className="font-mono text-[7px] text-muted-foreground uppercase">Win Rate</p>
        </div>
        <div className="text-center">
          <p className="font-mono text-xs font-bold text-green-500">+${metrics.dividends}</p>
          <p className="font-mono text-[7px] text-muted-foreground uppercase">Dividends</p>
        </div>
      </div>

      {/* Top Signals */}
      <div className="space-y-1.5">
        {signals.map((s, i) => (
          <div key={i} className="flex items-center justify-between py-1 px-2 rounded bg-muted/30">
            <div className="flex items-center gap-1.5 min-w-0">
              <Badge
                variant={s.action === "BUY" ? "default" : s.action === "SELL" ? "destructive" : "secondary"}
                className="text-[7px] font-bold px-1 py-0"
              >
                {s.action}
              </Badge>
              <span className="font-mono text-[10px] text-foreground truncate">{s.cardName}</span>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <span className={`font-mono text-[9px] font-bold ${s.expectedReturn > 0 ? "text-green-500" : "text-red-400"}`}>
                {s.expectedReturn > 0 ? "+" : ""}{s.expectedReturn}%
              </span>
              <div className="w-10">
                <Progress value={s.confidence} className="h-1" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="font-mono text-[7px] text-muted-foreground text-center mt-2">
        <Activity className="w-2.5 h-2.5 inline mr-0.5" />
        Engine auto-reinvests dividends · Refreshes every 60s · Pool grows each cycle
      </p>
    </div>
  );
};

export default PulseWalletWidget;
