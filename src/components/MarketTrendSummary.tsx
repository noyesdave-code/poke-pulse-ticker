import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, Activity, Zap } from "lucide-react";
import type { CardData } from "@/data/marketData";
import { getCardSignal } from "@/hooks/useSignalIndicator";
import FinancialDisclaimer from "@/components/FinancialDisclaimer";

interface MarketTrendSummaryProps {
  cards: CardData[];
}

const MarketTrendSummary = ({ cards }: MarketTrendSummaryProps) => {
  const signals = cards.map(c => getCardSignal(c));
  const buys = signals.filter(s => s.signal === "BUY").length;
  const sells = signals.filter(s => s.signal === "SELL").length;
  const holds = signals.filter(s => s.signal === "HOLD").length;

  const avgChange = cards.reduce((s, c) => s + c.change, 0) / cards.length;
  const gainers = cards.filter(c => c.change > 0).length;
  const losers = cards.filter(c => c.change < 0).length;

  const highVol = signals.filter(s => s.volatility === "high").length;
  const lowVol = signals.filter(s => s.volatility === "low").length;

  const overallSentiment = buys > sells ? "BULLISH" : buys < sells ? "BEARISH" : "NEUTRAL";
  const sentimentColor = overallSentiment === "BULLISH" ? "text-terminal-green" : overallSentiment === "BEARISH" ? "text-terminal-red" : "text-terminal-amber";

  const stats = [
    { label: "Market Direction", value: overallSentiment, color: sentimentColor, icon: Activity },
    { label: "Avg Change", value: `${avgChange >= 0 ? "+" : ""}${avgChange.toFixed(2)}%`, color: avgChange >= 0 ? "text-terminal-green" : "text-terminal-red", icon: avgChange >= 0 ? TrendingUp : TrendingDown },
    { label: "Gainers / Losers", value: `${gainers} / ${losers}`, color: gainers > losers ? "text-terminal-green" : "text-terminal-red", icon: BarChart3 },
    { label: "Volatility", value: `${highVol} High / ${lowVol} Low`, color: highVol > cards.length * 0.3 ? "text-terminal-amber" : "text-terminal-green", icon: Zap },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="terminal-card overflow-hidden"
    >
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-wide text-secondary uppercase flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5" /> Market Trend Summary
        </h2>
        <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
          Predictability Index
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="px-3 py-4 text-center space-y-1.5 hover:bg-muted/20 transition-colors"
            >
              <div className="w-8 h-8 rounded-md bg-muted mx-auto flex items-center justify-center">
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className={`font-mono text-sm font-bold ${stat.color}`}>{stat.value}</p>
              <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Signal distribution */}
      <div className="border-t border-border px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
            AI Signal Distribution
          </span>
        </div>
        <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(buys / cards.length) * 100}%` }}
            transition={{ duration: 0.8 }}
            className="bg-terminal-green rounded-l-full"
            title={`${buys} BUY signals`}
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(holds / cards.length) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="bg-terminal-amber"
            title={`${holds} HOLD signals`}
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(sells / cards.length) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-terminal-red rounded-r-full"
            title={`${sells} SELL signals`}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="font-mono text-[9px] text-terminal-green">{buys} BUY</span>
          <span className="font-mono text-[9px] text-terminal-amber">{holds} HOLD</span>
          <span className="font-mono text-[9px] text-terminal-red">{sells} SELL</span>
        </div>
      </div>

      <div className="border-t border-border p-3">
        <FinancialDisclaimer compact />
      </div>
    </motion.div>
  );
};

export default MarketTrendSummary;
