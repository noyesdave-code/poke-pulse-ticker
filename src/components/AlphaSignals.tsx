import { motion } from "framer-motion";
import { Zap, TrendingUp, TrendingDown, AlertTriangle, Target } from "lucide-react";
import type { AlphaSignal } from "@/hooks/useAlphaSignals";

const signalConfig = {
  volume_divergence: { icon: AlertTriangle, color: "text-terminal-amber" },
  price_momentum: { icon: TrendingUp, color: "text-primary" },
  breakout: { icon: Zap, color: "text-terminal-green" },
  reversal: { icon: Target, color: "text-terminal-blue" },
};

const strengthBadge = {
  strong: "bg-destructive/20 text-destructive border-destructive/30",
  medium: "bg-terminal-amber/20 text-terminal-amber border-terminal-amber/30",
  weak: "bg-muted text-muted-foreground border-border",
};

interface AlphaSignalsProps {
  signals: AlphaSignal[];
}

const AlphaSignals = ({ signals }: AlphaSignalsProps) => {
  if (signals.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="terminal-card overflow-hidden">
        <div className="border-b border-border px-4 py-3 flex items-center justify-between">
          <h3 className="text-sm font-bold tracking-wide text-secondary uppercase flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" /> Alpha Signals — Predictive Divergence
          </h3>
          <span className="font-mono text-[10px] text-muted-foreground px-2 py-0.5 rounded bg-muted border border-border">
            {signals.length} ACTIVE
          </span>
        </div>

        <div className="divide-y divide-border">
          {signals.map((signal, idx) => {
            const config = signalConfig[signal.signalType];
            const Icon = config.icon;
            return (
              <motion.div
                key={`${signal.cardName}-${signal.signalType}`}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className="px-4 py-3 flex items-start gap-3 hover:bg-muted/30 transition-colors"
              >
                {signal.cardImage && (
                  <img
                    src={signal.cardImage}
                    alt={signal.cardName}
                    className="w-10 h-14 object-contain rounded flex-shrink-0"
                    loading="lazy"
                  />
                )}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${config.color}`} />
                    <span className="font-mono text-xs font-semibold text-foreground truncate">
                      {signal.cardName}
                    </span>
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded border uppercase tracking-wider ${strengthBadge[signal.strength]}`}>
                      {signal.strength}
                    </span>
                    <span className={`font-mono text-[10px] font-bold ${signal.priceChangePct >= 0 ? "text-terminal-green" : "text-destructive"}`}>
                      {signal.priceChangePct >= 0 ? "+" : ""}{signal.priceChangePct.toFixed(1)}%
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
                    {signal.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="border-t border-border px-4 py-2 flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3 text-terminal-amber flex-shrink-0" />
          <span className="font-mono text-[8px] text-terminal-amber/70">
            FOR INFORMATIONAL PURPOSES ONLY — NOT FINANCIAL ADVICE. Signals are algorithmic and do not constitute buy/sell recommendations. © PGVA Ventures, LLC.
          </span>
        </div>
      </div>
    </motion.section>
  );
};

export default AlphaSignals;
