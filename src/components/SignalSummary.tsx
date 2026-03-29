import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";
import type { CardData } from "@/data/marketData";
import { getCardSignal, type Signal } from "@/hooks/useSignalIndicator";
import SignalBadge from "@/components/SignalBadge";
import FinancialDisclaimer from "@/components/FinancialDisclaimer";

interface SignalSummaryProps {
  cards: CardData[];
}

const SignalSummary = ({ cards }: SignalSummaryProps) => {
  const signals = cards.map((card) => ({ card, result: getCardSignal(card) }));
  const buys = signals.filter((s) => s.result.signal === "BUY");
  const sells = signals.filter((s) => s.result.signal === "SELL");
  const holds = signals.filter((s) => s.result.signal === "HOLD");

  const topBuys = [...buys].sort((a, b) => b.result.strength - a.result.strength).slice(0, 3);
  const topSells = [...sells].sort((a, b) => b.result.strength - a.result.strength).slice(0, 3);

  const sentimentScore = Math.round(
    (buys.length / Math.max(cards.length, 1)) * 100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="terminal-card overflow-hidden"
    >
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-wide text-secondary uppercase flex items-center gap-2">
          <Activity className="w-3.5 h-3.5" /> AI Signal Indicator
        </h2>
        <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
          30-Day Moving Average
        </span>
      </div>

      {/* Signal distribution bar */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex h-3.5 rounded-full overflow-hidden border border-border">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(buys.length / cards.length) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-terminal-green"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(holds.length / cards.length) * 100}%` }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="bg-terminal-amber"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(sells.length / cards.length) * 100}%` }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="bg-terminal-red"
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="font-mono text-[10px] text-terminal-green font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {buys.length} BUY
          </span>
          <span className="font-mono text-[10px] text-terminal-amber font-semibold flex items-center gap-1">
            <Minus className="w-3 h-3" /> {holds.length} HOLD
          </span>
          <span className="font-mono text-[10px] text-terminal-red font-semibold flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> {sells.length} SELL
          </span>
        </div>
      </div>

      {/* Market sentiment */}
      <div className="px-4 py-3 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
            Market Sentiment
          </span>
          <span className={`font-mono text-sm font-bold ${
            sentimentScore > 60 ? "text-terminal-green" :
            sentimentScore > 40 ? "text-terminal-amber" : "text-terminal-red"
          }`}>
            {sentimentScore > 60 ? "BULLISH" : sentimentScore > 40 ? "NEUTRAL" : "BEARISH"}
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${sentimentScore}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className={`h-full rounded-full ${
              sentimentScore > 60 ? "bg-terminal-green shadow-[0_0_10px_hsl(145_100%_45%/0.3)]" :
              sentimentScore > 40 ? "bg-terminal-amber shadow-[0_0_10px_hsl(40_100%_55%/0.3)]" : "bg-terminal-red shadow-[0_0_10px_hsl(0_90%_58%/0.3)]"
            }`}
          />
        </div>
      </div>

      {/* Top BUY and SELL cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border border-t border-border">
        <div className="p-4">
          <h3 className="font-mono text-[10px] text-terminal-green uppercase tracking-wider font-semibold mb-3">
            Top Buy Opportunities
          </h3>
          <div className="space-y-2">
            {topBuys.map(({ card, result }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className="flex items-center justify-between"
              >
                <div className="min-w-0 flex-1 mr-2">
                  <p className="font-mono text-xs text-foreground font-medium truncate">{card.name}</p>
                  <p className="font-mono text-[9px] text-muted-foreground truncate">{card.set}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-mono text-[10px] text-foreground">
                    ${card.market.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  </span>
                  <SignalBadge result={result} />
                </div>
              </motion.div>
            ))}
            {topBuys.length === 0 && (
              <p className="font-mono text-[10px] text-muted-foreground">No buy signals</p>
            )}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-mono text-[10px] text-terminal-red uppercase tracking-wider font-semibold mb-3">
            Consider Taking Profit
          </h3>
          <div className="space-y-2">
            {topSells.map(({ card, result }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className="flex items-center justify-between"
              >
                <div className="min-w-0 flex-1 mr-2">
                  <p className="font-mono text-xs text-foreground font-medium truncate">{card.name}</p>
                  <p className="font-mono text-[9px] text-muted-foreground truncate">{card.set}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="font-mono text-[10px] text-foreground">
                    ${card.market.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  </span>
                  <SignalBadge result={result} />
                </div>
              </motion.div>
            ))}
            {topSells.length === 0 && (
              <p className="font-mono text-[10px] text-muted-foreground">No sell signals</p>
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-t border-border p-3">
        <FinancialDisclaimer compact />
      </div>
    </motion.div>
  );
};

export default SignalSummary;
