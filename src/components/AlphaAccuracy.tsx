import { motion } from "framer-motion";
import { Target, TrendingUp, BarChart3 } from "lucide-react";

const AlphaAccuracy = () => {
  const metrics = [
    { label: "30-Day Hit Rate", value: "72%", description: "Signals that moved in predicted direction within 30 days", icon: Target },
    { label: "Avg Signal Return", value: "+8.4%", description: "Average return when following strong signals", icon: TrendingUp },
    { label: "Signals Generated", value: "1,247", description: "Total alpha signals generated since launch", icon: BarChart3 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="terminal-card overflow-hidden"
    >
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-wide text-secondary uppercase flex items-center gap-2">
          <Target className="w-3.5 h-3.5" /> Alpha Algorithm — Historic Accuracy
        </h3>
        <span className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-bold tracking-wider">
          ✓ VERIFIED BY PGVA
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="px-4 py-4 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary" />
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{m.label}</span>
              </div>
              <p className="font-mono text-2xl font-bold text-terminal-green">{m.value}</p>
              <p className="font-mono text-[9px] text-muted-foreground leading-relaxed">{m.description}</p>
            </motion.div>
          );
        })}
      </div>
      <div className="border-t border-terminal-amber/30 px-4 py-2">
        <span className="font-mono text-[8px] text-terminal-amber">
          ⚠ Past performance does not guarantee future results. Not financial advice. © PGVA Ventures, LLC.
        </span>
      </div>
    </motion.div>
  );
};

export default AlphaAccuracy;
