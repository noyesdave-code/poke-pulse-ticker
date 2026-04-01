import { motion } from "framer-motion";
import { Globe, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

const JP_SETS = [
  { jpName: "Stellar Crown", enName: "Stellar Crown", jpRelease: "2024-07-19", enRelease: "2024-09-13", jpAvgPrice: 8200, enPredicted: 62.50, enActual: 58.90, accuracy: 94.2 },
  { jpName: "Shrouded Fable", enName: "Shrouded Fable", jpRelease: "2024-06-07", enRelease: "2024-08-02", jpAvgPrice: 12500, enPredicted: 89.00, enActual: 92.30, accuracy: 96.4 },
  { jpName: "Twilight Masquerade", enName: "Twilight Masquerade", jpRelease: "2024-04-26", enRelease: "2024-05-24", jpAvgPrice: 9800, enPredicted: 74.00, enActual: 71.50, accuracy: 96.5 },
  { jpName: "Temporal Forces", enName: "Temporal Forces", jpRelease: "2024-01-26", enRelease: "2024-03-22", jpAvgPrice: 15200, enPredicted: 115.00, enActual: 108.70, accuracy: 94.2 },
];

const UPCOMING = [
  { jpName: "Prismatic Evolutions", jpAvgPrice: 18500, enPredicted: 142.00, enRelease: "2025-01-17", confidence: "High" },
];

const JPtoENTracker = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="terminal-card p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-sm font-bold text-foreground flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          JP → EN Precursor Tracker
        </h3>
        <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
          95.3% AVG ACCURACY
        </span>
      </div>

      <p className="font-mono text-[10px] text-muted-foreground">
        Predicts English set performance based on prior Japanese sales trends. JP releases typically precede EN by 6-10 weeks.
      </p>

      {/* Upcoming predictions */}
      {UPCOMING.map((set) => (
        <div key={set.jpName} className="bg-primary/5 border border-primary/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <p className="font-mono text-[11px] font-bold text-primary">{set.jpName}</p>
            <span className="font-mono text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">PREDICTION</span>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <p className="font-mono text-[9px] text-muted-foreground">JP Avg ¥{set.jpAvgPrice.toLocaleString()}</p>
              <p className="font-mono text-[10px] font-semibold text-foreground">EN Est: ${set.enPredicted.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-mono text-[9px] text-muted-foreground">EN Release</p>
              <p className="font-mono text-[10px] text-foreground">{set.enRelease}</p>
            </div>
            <div>
              <p className="font-mono text-[9px] text-muted-foreground">Confidence</p>
              <p className="font-mono text-[10px] text-primary font-semibold">{set.confidence}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Historical accuracy */}
      <div className="space-y-1.5">
        <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">Historical Accuracy</p>
        {JP_SETS.map((set) => (
          <div key={set.enName} className="flex items-center justify-between px-3 py-1.5 rounded bg-muted/30">
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[10px] font-medium text-foreground truncate">{set.enName}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[9px] text-muted-foreground">
                Est ${set.enPredicted.toFixed(0)} <ArrowRight className="w-2.5 h-2.5 inline" /> ${set.enActual.toFixed(0)}
              </span>
              <span className={`font-mono text-[9px] font-bold ${set.accuracy >= 95 ? "text-primary" : "text-secondary"}`}>
                {set.accuracy}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default JPtoENTracker;
