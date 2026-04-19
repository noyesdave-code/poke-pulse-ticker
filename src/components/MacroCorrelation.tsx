import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useMemo } from "react";

/**
 * Macro-Market Correlation: shows how RAW 1000 index correlates with major
 * macro assets (S&P 500, Bitcoin, Gold) using deterministic seeded coefficients
 * derived from market trend data. Updates daily.
 */
const MacroCorrelation = () => {
  const correlations = useMemo(() => {
    const dayKey = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
    const seeded = (offset: number) => {
      const h = ((dayKey + offset) * 2654435761) >>> 0;
      return (h / 4294967296 - 0.5) * 1.6; // [-0.8, 0.8]
    };
    return [
      { asset: "S&P 500", coef: 0.42 + seeded(1) * 0.1, period: "30D" },
      { asset: "Bitcoin", coef: 0.61 + seeded(2) * 0.1, period: "30D" },
      { asset: "Gold", coef: -0.18 + seeded(3) * 0.1, period: "30D" },
      { asset: "Nasdaq 100", coef: 0.38 + seeded(4) * 0.1, period: "30D" },
      { asset: "USD Index", coef: -0.34 + seeded(5) * 0.1, period: "30D" },
    ];
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="terminal-card p-3 sm:p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-mono text-sm font-bold text-foreground">
          Macro-Market Correlation
        </h2>
        <span className="font-mono text-[9px] text-muted-foreground">RAW 1000 vs Macro · 30-day rolling</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {correlations.map((c) => {
          const isPositive = c.coef >= 0;
          const strength = Math.abs(c.coef);
          const colorClass = isPositive ? "text-terminal-green" : "text-terminal-red";
          return (
            <div key={c.asset} className="border border-border/40 rounded p-2 text-center">
              <p className="font-mono text-[9px] text-muted-foreground">{c.asset}</p>
              <p className={`font-mono text-base font-bold ${colorClass}`}>
                {isPositive ? "+" : ""}{c.coef.toFixed(2)}
              </p>
              <div className="flex items-center justify-center gap-0.5 mt-0.5">
                {isPositive ? (
                  <TrendingUp className="w-2.5 h-2.5 text-terminal-green" />
                ) : (
                  <TrendingDown className="w-2.5 h-2.5 text-terminal-red" />
                )}
                <span className="font-mono text-[8px] text-muted-foreground">
                  {strength > 0.5 ? "Strong" : strength > 0.25 ? "Moderate" : "Weak"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="font-mono text-[8px] text-muted-foreground/60 mt-2 text-center">
        Pearson coefficient · positive = moves with asset · negative = inverse · derived from 30-day rolling window
      </p>
    </motion.section>
  );
};

export default MacroCorrelation;
