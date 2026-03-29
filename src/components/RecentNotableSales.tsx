import { DollarSign, Clock, Flame } from "lucide-react";
import { motion } from "framer-motion";
import type { CardData } from "@/data/marketData";

interface RecentNotableSalesProps {
  cards: CardData[];
}

// Simulate "recent notable sales" from top cards with randomized time offsets
const RecentNotableSales = ({ cards }: RecentNotableSalesProps) => {
  const sales = [...cards]
    .sort((a, b) => b.market - a.market)
    .slice(0, 8)
    .map((card, i) => {
      // Deterministic pseudo-random sale data
      const seed = card.name.charCodeAt(0) + card.market;
      const hoursAgo = Math.floor((seed % 23) + 1);
      const saleVariation = 1 + ((seed % 10) - 5) / 100; // ±5% variation
      const salePrice = card.market * saleVariation;
      const platform = ["TCGPlayer", "eBay", "CardMarket"][seed % 3];
      return { card, hoursAgo, salePrice, platform };
    })
    .sort((a, b) => a.hoursAgo - b.hoursAgo);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="terminal-card overflow-hidden"
    >
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-wide text-secondary uppercase flex items-center gap-2">
          <Flame className="w-3.5 h-3.5" /> Recent Notable Sales
        </h2>
        <span className="flex items-center gap-1 font-mono text-[9px] text-terminal-green uppercase tracking-wider">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-terminal-green"></span>
          </span>
          Live Feed
        </span>
      </div>
      <div className="divide-y divide-border">
        {sales.slice(0, 5).map((sale, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="px-4 py-2.5 flex items-center justify-between hover:bg-muted/30 transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-7 h-7 rounded bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                <DollarSign className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs text-foreground font-medium truncate">
                  {sale.card.name}
                </p>
                <p className="font-mono text-[9px] text-muted-foreground truncate">
                  {sale.card.set} • {sale.platform}
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-3">
              <p className="font-mono text-xs font-bold text-foreground">
                ${sale.salePrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="font-mono text-[9px] text-muted-foreground flex items-center gap-1 justify-end">
                <Clock className="w-2.5 h-2.5" /> {sale.hoursAgo}h ago
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentNotableSales;
