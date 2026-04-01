import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, ExternalLink, AlertTriangle, ArrowRight } from "lucide-react";

interface ArbitrageOpportunity {
  cardName: string;
  set: string;
  pgvaPrice: number;
  ebayPrice: number;
  spread: number;
  spreadPct: number;
  ebayUrl: string;
  timeLeft: string;
}

const MOCK_OPPORTUNITIES: ArbitrageOpportunity[] = [
  { cardName: "Charizard ex SAR", set: "Obsidian Flames", pgvaPrice: 142.50, ebayPrice: 119.99, spread: 22.51, spreadPct: 15.8, ebayUrl: "https://www.ebay.com/sch/i.html?_nkw=charizard+ex+sar+obsidian+flames", timeLeft: "2h 14m" },
  { cardName: "Pikachu VMAX RR", set: "Vivid Voltage", pgvaPrice: 289.00, ebayPrice: 251.00, spread: 38.00, spreadPct: 13.1, ebayUrl: "https://www.ebay.com/sch/i.html?_nkw=pikachu+vmax+rainbow+vivid+voltage", timeLeft: "45m" },
  { cardName: "Umbreon VMAX AA", set: "Evolving Skies", pgvaPrice: 485.00, ebayPrice: 439.00, spread: 46.00, spreadPct: 9.5, ebayUrl: "https://www.ebay.com/sch/i.html?_nkw=umbreon+vmax+alt+art+evolving+skies", timeLeft: "1h 32m" },
  { cardName: "Mew VMAX AA", set: "Fusion Strike", pgvaPrice: 178.00, ebayPrice: 159.50, spread: 18.50, spreadPct: 10.4, ebayUrl: "https://www.ebay.com/sch/i.html?_nkw=mew+vmax+alt+art+fusion+strike", timeLeft: "3h 05m" },
];

const ArbitrageFinder = () => {
  const [filter, setFilter] = useState<"all" | "hot">("all");

  const opportunities = useMemo(() => {
    const sorted = [...MOCK_OPPORTUNITIES].sort((a, b) => b.spreadPct - a.spreadPct);
    if (filter === "hot") return sorted.filter((o) => o.spreadPct >= 12);
    return sorted;
  }, [filter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="terminal-card p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-sm font-bold text-foreground flex items-center gap-2">
          <Search className="w-4 h-4 text-primary" />
          Arbitrage Finder
        </h3>
        <div className="flex gap-1">
          {(["all", "hot"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-mono text-[9px] px-2 py-0.5 rounded transition-colors ${
                filter === f
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "hot" ? "🔥 HOT" : "ALL"}
            </button>
          ))}
        </div>
      </div>

      <p className="font-mono text-[10px] text-muted-foreground">
        Real-time price discrepancies between PGVA Consensus Index and eBay "Ending Soon" auctions.
      </p>

      <div className="space-y-2">
        {opportunities.map((opp, i) => (
          <div key={i} className="data-row flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30">
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[11px] font-semibold text-foreground truncate">{opp.cardName}</p>
              <p className="font-mono text-[9px] text-muted-foreground">{opp.set} · Ends {opp.timeLeft}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <p className="font-mono text-[10px] text-muted-foreground">PGVA: ${opp.pgvaPrice.toFixed(2)}</p>
                <p className="font-mono text-[10px] text-primary">eBay: ${opp.ebayPrice.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-1 bg-primary/10 border border-primary/20 rounded px-2 py-1">
                <TrendingUp className="w-3 h-3 text-primary" />
                <span className="font-mono text-[10px] font-bold text-primary">
                  +{opp.spreadPct.toFixed(1)}%
                </span>
              </div>
              <a
                href={opp.ebayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 bg-secondary/10 border border-secondary/20 rounded-lg p-2.5">
        <AlertTriangle className="w-3.5 h-3.5 text-secondary mt-0.5 shrink-0" />
        <p className="font-mono text-[9px] text-secondary/80 leading-relaxed">
          Arbitrage opportunities are estimates. eBay prices update in near real-time. Always verify listing authenticity before purchasing. Not financial advice.
        </p>
      </div>
    </motion.div>
  );
};

export default ArbitrageFinder;
