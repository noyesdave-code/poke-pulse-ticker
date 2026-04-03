import { motion } from "framer-motion";
import { Calendar, TrendingUp, TrendingDown, Minus, Trophy } from "lucide-react";
import { getSeasonalTrend, getGradeSpread } from "@/components/VolumeConfidence";
import type { CardData } from "@/data/marketData";

interface MarketIntelWidgetProps {
  cards: CardData[];
}

/** Combined Market Intelligence widget covering Seasonality, Grade Spreads, and Adaptability */
const MarketIntelWidget = ({ cards }: MarketIntelWidgetProps) => {
  const seasonal = getSeasonalTrend();
  const topCard = cards[0];
  const gradeSpread = topCard ? getGradeSpread(topCard.market) : null;

  // Auto-detected set count (market adaptability indicator)
  const uniqueSets = new Set(cards.map(c => c.set)).size;

  const SeasonIcon = seasonal.direction === "up" ? TrendingUp : seasonal.direction === "down" ? TrendingDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="terminal-card overflow-hidden"
    >
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-bold tracking-wide text-secondary uppercase flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" /> Market Intelligence
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {/* Seasonality */}
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <SeasonIcon className={`w-4 h-4 ${seasonal.direction === "up" ? "text-terminal-green" : seasonal.direction === "down" ? "text-terminal-red" : "text-terminal-amber"}`} />
            <span className={`font-mono text-xs font-bold ${seasonal.direction === "up" ? "text-terminal-green" : seasonal.direction === "down" ? "text-terminal-red" : "text-terminal-amber"}`}>
              {seasonal.label}
            </span>
          </div>
          <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">{seasonal.description}</p>
          <span className="font-mono text-[8px] text-muted-foreground/60 uppercase tracking-wider">Historical Seasonality</span>
        </div>

        {/* Grade Spread */}
        {gradeSpread && topCard && (
          <div className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-terminal-amber" />
              <span className="font-mono text-xs font-bold text-foreground">Grade Spread</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="font-mono text-[10px] text-muted-foreground">PSA 10/9 Ratio</span>
                <span className="font-mono text-[10px] text-foreground font-semibold">{gradeSpread.ratio}x</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-[10px] text-muted-foreground">Spread</span>
                <span className="font-mono text-[10px] text-terminal-amber font-semibold">{gradeSpread.spread}</span>
              </div>
            </div>
            <p className="font-mono text-[9px] text-muted-foreground">{gradeSpread.signal}</p>
          </div>
        )}

        {/* Market Adaptability */}
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs font-bold text-foreground">Auto-Tracked</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="font-mono text-[10px] text-muted-foreground">Active Sets</span>
              <span className="font-mono text-[10px] text-primary font-semibold">{uniqueSets}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-[10px] text-muted-foreground">Refresh Cycle</span>
              <span className="font-mono text-[10px] text-foreground font-semibold">60 min</span>
            </div>
          </div>
          <p className="font-mono text-[9px] text-muted-foreground">New sets auto-detected from pokemontcg.io API</p>
        </div>
      </div>

      <div className="border-t border-border px-4 py-1.5 flex items-center gap-1.5">
        <span className="font-mono text-[8px] text-muted-foreground/60">
          Seasonality data based on historical Poké TCG market patterns. Not financial advice. © PGVA Ventures, LLC.
        </span>
      </div>
    </motion.div>
  );
};

export default MarketIntelWidget;
