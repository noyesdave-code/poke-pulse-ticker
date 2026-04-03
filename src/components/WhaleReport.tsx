import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Loader2, Lock, TrendingUp, TrendingDown, AlertTriangle, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { CardData } from "@/data/marketData";
import { getCardSignal } from "@/hooks/useSignalIndicator";

interface WhaleReportProps {
  cards: CardData[];
}

interface AIReport {
  cardOfTheWeek: {
    name: string;
    set: string;
    image?: string;
    currentPrice: number;
    prediction: string;
    confidence: number;
    reasoning: string[];
  };
  marketOutlook: string;
  topOpportunities: { name: string; reason: string; signal: string }[];
  riskAlerts: string[];
  generatedAt: string;
}

const generateReport = (cards: CardData[]): AIReport => {
  const sorted = [...cards].sort((a, b) => b.market - a.market);
  const bullish = cards.filter((c) => c.change > 2).sort((a, b) => b.change - a.change);
  const bearish = cards.filter((c) => c.change < -1.5).sort((a, b) => a.change - b.change);

  const cotw = bullish[0] || sorted[0];
  const signal = getCardSignal(cotw);

  return {
    cardOfTheWeek: {
      name: cotw.name,
      set: cotw.set,
      image: (cotw as any)._image,
      currentPrice: cotw.market,
      prediction: cotw.change > 0 ? "Continued upward momentum expected over 2-4 weeks" : "Price stabilization likely after recent correction",
      confidence: Math.min(92, 65 + Math.abs(cotw.change) * 5),
      reasoning: [
        `${signal.signal} signal at ${signal.strength}% strength based on 30-day SMA crossover`,
        `${signal.volatility} volatility environment ${signal.volatility === "low" ? "favors steady accumulation" : "suggests caution on position sizing"}`,
        `Current price ${cotw.market > signal.ma30 ? "above" : "below"} MA30 ($${signal.ma30.toFixed(2)}) — ${cotw.market > signal.ma30 ? "bullish positioning" : "value entry zone"}`,
        `Momentum score: ${signal.momentum >= 0 ? "+" : ""}${signal.momentum.toFixed(2)}% — ${Math.abs(signal.momentum) > 1 ? "strong directional bias" : "consolidation phase"}`,
      ],
    },
    marketOutlook: bullish.length > bearish.length
      ? `The Poké TCG market is showing bullish momentum with ${bullish.length} cards trending up vs ${bearish.length} declining. The RAW 500 index breadth is ${((bullish.length / cards.length) * 100).toFixed(0)}% positive, suggesting broad market strength rather than isolated moves.`
      : `Mixed market conditions with ${bearish.length} cards showing weakness. Consider defensive positioning and focus on high-grade vintage with strong floor prices.`,
    topOpportunities: bearish.slice(0, 3).map((c) => ({
      name: c.name,
      reason: `Down ${c.change.toFixed(1)}% — ${Math.abs(c.market - c.mid) / c.mid > 0.1 ? "trading below fair value" : "approaching support level"}`,
      signal: getCardSignal(c).signal,
    })),
    riskAlerts: [
      bearish.length > bullish.length ? "⚠️ Market breadth deteriorating — more cards declining than advancing" : "✅ Healthy market breadth — majority of tracked cards positive",
      sorted[0]?.change < -2 ? `⚠️ Blue-chip weakness: ${sorted[0].name} down ${sorted[0].change.toFixed(1)}%` : `✅ Blue-chip stability: Top card ${sorted[0]?.name} holding`,
      `📊 Volatility index: ${cards.filter((c) => Math.abs(c.change) > 3).length} cards with >3% daily moves`,
    ],
    generatedAt: new Date().toISOString(),
  };
};

const WhaleReport = ({ cards }: WhaleReportProps) => {
  const { tier } = useAuth();
  const [report, setReport] = useState<AIReport | null>(null);
  const [loading, setLoading] = useState(false);

  const isWhale = tier === "premium" || tier === "team";

  const handleGenerate = async () => {
    setLoading(true);
    // Simulate AI processing time
    await new Promise((r) => setTimeout(r, 1500));
    setReport(generateReport(cards));
    setLoading(false);
  };

  if (!isWhale) {
    return (
      <div className="terminal-card overflow-hidden">
        <div className="border-b border-border px-4 py-3 flex items-center justify-between">
          <h3 className="text-sm font-bold tracking-wide text-secondary uppercase flex items-center gap-2">
            <Brain className="w-3.5 h-3.5" /> AI Deep-Dive Report
          </h3>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-terminal-amber/20 text-terminal-amber border border-terminal-amber/30">
            WHALE EXCLUSIVE
          </span>
        </div>
        <div className="p-6 text-center space-y-3">
          <Lock className="w-8 h-8 text-muted-foreground mx-auto" />
          <p className="font-mono text-xs text-muted-foreground">
            Weekly AI-generated market analysis with card-of-the-week picks,<br />
            opportunity scoring, and risk alerts.
          </p>
          <p className="font-mono text-[10px] text-terminal-amber">
            Upgrade to Whale ($19.99/mo) to unlock
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="terminal-card overflow-hidden">
        <div className="border-b border-border px-4 py-3 flex items-center justify-between">
          <h3 className="text-sm font-bold tracking-wide text-secondary uppercase flex items-center gap-2">
            <Brain className="w-3.5 h-3.5" /> AI Deep-Dive Report
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-terminal-amber/20 text-terminal-amber border border-terminal-amber/30">
              WHALE
            </span>
            {!report && (
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center gap-1.5 font-mono text-[10px] font-semibold bg-primary text-primary-foreground rounded px-3 py-1 hover:opacity-90 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                {loading ? "Analyzing…" : "Generate Report"}
              </button>
            )}
          </div>
        </div>

        {report && (
          <div className="divide-y divide-border">
            {/* Card of the Week */}
            <div className="p-4 space-y-3">
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-terminal-amber font-semibold flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3" /> Card of the Week
              </h4>
              <div className="flex items-start gap-4">
                <img src={report.cardOfTheWeek.image || "/icon-192.png"} alt="" className={`w-16 h-22 rounded ${report.cardOfTheWeek.image ? "object-contain" : "object-contain p-1 bg-muted"}`} onError={(e) => { (e.target as HTMLImageElement).src = '/icon-192.png'; }} />
                <div className="flex-1 space-y-2">
                  <div>
                    <p className="font-mono text-sm font-bold text-foreground">{report.cardOfTheWeek.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{report.cardOfTheWeek.set}</p>
                  </div>
                  <p className="font-mono text-xs text-foreground">{report.cardOfTheWeek.prediction}</p>
                  <div className="font-mono text-[10px] text-primary bg-primary/10 rounded px-2 py-1 inline-block">
                    {report.cardOfTheWeek.confidence}% confidence
                  </div>
                  <ul className="space-y-1">
                    {report.cardOfTheWeek.reasoning.map((r, i) => (
                      <li key={i} className="font-mono text-[10px] text-muted-foreground flex items-start gap-1.5">
                        <span className="text-primary mt-0.5">•</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Market Outlook */}
            <div className="p-4 space-y-2">
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-secondary font-semibold">Market Outlook</h4>
              <p className="font-mono text-xs text-foreground leading-relaxed">{report.marketOutlook}</p>
            </div>

            {/* Top Opportunities */}
            <div className="p-4 space-y-2">
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-terminal-green font-semibold flex items-center gap-1.5">
                <TrendingDown className="w-3 h-3" /> Buy Opportunities (Dip Picks)
              </h4>
              {report.topOpportunities.map((opp, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded bg-muted/50">
                  <span className="font-mono text-xs text-foreground font-medium">{opp.name}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{opp.reason}</span>
                </div>
              ))}
            </div>

            {/* Risk Alerts */}
            <div className="p-4 space-y-2">
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-destructive font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" /> Risk Monitor
              </h4>
              {report.riskAlerts.map((alert, i) => (
                <p key={i} className="font-mono text-[10px] text-foreground">{alert}</p>
              ))}
            </div>

            <div className="px-4 py-2 bg-muted/30">
              <p className="font-mono text-[9px] text-muted-foreground">
                Generated {new Date(report.generatedAt).toLocaleString()} • Not financial advice • For entertainment purposes only
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default WhaleReport;
