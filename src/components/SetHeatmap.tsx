import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import type { CardData } from "@/data/marketData";

interface SetHeatmapProps {
  cards: CardData[];
}

const SetHeatmap = ({ cards }: SetHeatmapProps) => {
  const setPerformance = useMemo(() => {
    const map = new Map<string, { total: number; change: number; count: number }>();
    for (const c of cards) {
      const entry = map.get(c.set) || { total: 0, change: 0, count: 0 };
      entry.total += c.market;
      entry.change += c.change;
      entry.count += 1;
      map.set(c.set, entry);
    }
    return Array.from(map.entries())
      .map(([set, data]) => ({
        set,
        avgChange: data.change / data.count,
        totalValue: data.total,
        count: data.count,
      }))
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 24);
  }, [cards]);

  const maxVal = Math.max(...setPerformance.map((s) => s.totalValue), 1);

  const getColor = (change: number) => {
    if (change > 3) return "bg-green-500/80 text-white";
    if (change > 1) return "bg-green-500/40 text-green-200";
    if (change > 0) return "bg-green-500/20 text-green-300";
    if (change > -1) return "bg-red-500/20 text-red-300";
    if (change > -3) return "bg-red-500/40 text-red-200";
    return "bg-red-500/80 text-white";
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="terminal-card overflow-hidden">
        <div className="border-b border-border px-4 py-3 flex items-center justify-between">
          <h3 className="text-sm font-bold tracking-wide text-secondary uppercase flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5" /> Set Performance Heatmap
          </h3>
          <span className="font-mono text-[8px] text-muted-foreground px-2 py-0.5 rounded bg-muted border border-border">
            S&P 500 STYLE
          </span>
        </div>
        <div className="p-3 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1">
          {setPerformance.map((s) => {
            const sizeRatio = Math.max(0.6, s.totalValue / maxVal);
            return (
              <div
                key={s.set}
                className={`rounded p-1.5 flex flex-col items-center justify-center text-center cursor-default transition-transform hover:scale-105 ${getColor(s.avgChange)}`}
                style={{ minHeight: `${40 + sizeRatio * 30}px` }}
                title={`${s.set}: ${s.avgChange >= 0 ? "+" : ""}${s.avgChange.toFixed(1)}% | $${s.totalValue.toFixed(0)} | ${s.count} cards`}
              >
                <span className="font-mono text-[7px] font-bold leading-tight truncate w-full">
                  {s.set.length > 12 ? s.set.slice(0, 11) + "…" : s.set}
                </span>
                <span className="font-mono text-[9px] font-bold">
                  {s.avgChange >= 0 ? "+" : ""}{s.avgChange.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
        <div className="border-t border-border px-4 py-1.5 flex items-center justify-between">
          <span className="font-mono text-[8px] text-muted-foreground">
            Size = total set value · Color = avg % change · {setPerformance.length} sets tracked
          </span>
          <span className="font-mono text-[8px] text-primary">PGVA Verified™</span>
        </div>
      </div>
    </motion.section>
  );
};

export default SetHeatmap;
