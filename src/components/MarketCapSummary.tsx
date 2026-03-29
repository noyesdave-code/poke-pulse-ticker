import { motion } from "framer-motion";
import { rawCards, gradedCards, sealedProducts } from "@/data/marketData";
import type { CardData } from "@/data/marketData";
import { TrendingUp, TrendingDown } from "lucide-react";

const calcMarketCap = (items: Array<{ market: number }>) =>
  items.reduce((sum, i) => sum + i.market, 0);

const calcAvgChange = (items: Array<{ change: number }>) =>
  items.reduce((sum, i) => sum + i.change, 0) / items.length;

interface MarketCapSummaryProps {
  liveRawCards?: CardData[];
}

const MarketCapSummary = ({ liveRawCards }: MarketCapSummaryProps) => {
  const rawData = liveRawCards && liveRawCards.length > 0 ? liveRawCards : rawCards;

  const segments = [
    { label: "Raw Cards", items: rawData, color: "bg-terminal-green" },
    { label: "Graded Cards", items: gradedCards, color: "bg-terminal-amber" },
    { label: "Sealed Products", items: sealedProducts, color: "bg-terminal-blue" },
  ];

  const totalCap = segments.reduce((s, seg) => s + calcMarketCap(seg.items), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="terminal-card overflow-hidden"
    >
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-bold tracking-wide text-secondary uppercase">
          Market Capitalization
        </h2>
        <p className="text-xl font-extrabold text-foreground mt-1">
          ${totalCap.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>
        <p className="font-mono text-[10px] text-muted-foreground">Total tracked market value</p>
      </div>

      <div className="px-4 py-3 border-b border-border">
        <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
          {segments.map((seg) => {
            const cap = calcMarketCap(seg.items);
            const pct = (cap / totalCap) * 100;
            return (
              <div
                key={seg.label}
                className={`${seg.color} rounded-sm`}
                style={{ width: `${pct}%` }}
                title={`${seg.label}: ${pct.toFixed(1)}%`}
              />
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {segments.map((seg) => {
          const cap = calcMarketCap(seg.items);
          const change = calcAvgChange(seg.items);
          const pct = (cap / totalCap) * 100;
          const isUp = change >= 0;
          return (
            <div key={seg.label} className="px-4 py-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2.5 h-2.5 rounded-sm ${seg.color}`} />
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {seg.label}
                </span>
              </div>
              <p className="font-mono text-base font-bold text-foreground">
                ${cap.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`font-mono text-xs font-semibold flex items-center gap-0.5 ${isUp ? "text-terminal-green" : "text-terminal-red"}`}>
                  {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {isUp ? "+" : ""}{change.toFixed(2)}%
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {pct.toFixed(1)}% of total • {seg.items.length} items
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketCapSummary;
