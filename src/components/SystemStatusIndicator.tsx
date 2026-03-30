import { motion } from "framer-motion";
import { Activity, CheckCircle, Clock } from "lucide-react";

const SystemStatusIndicator = () => {
  const uptime = 99.9;

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
          <Activity className="w-3.5 h-3.5" /> System Status
        </h3>
        <span className="font-mono text-[10px] text-terminal-green font-semibold flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> ALL SYSTEMS OPERATIONAL
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
        {[
          { label: "Uptime", value: `${uptime}%`, color: "text-terminal-green" },
          { label: "API Latency", value: "<120ms", color: "text-primary" },
          { label: "Data Freshness", value: "5 min", color: "text-terminal-amber" },
          { label: "Last Incident", value: "None", color: "text-muted-foreground" },
        ].map((item) => (
          <div key={item.label} className="px-4 py-3 text-center">
            <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
            <p className={`font-mono text-sm font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-4 py-2 flex items-center gap-1.5">
        <Clock className="w-3 h-3 text-muted-foreground" />
        <span className="font-mono text-[9px] text-muted-foreground">
          Last checked: {new Date().toLocaleTimeString()} — Monitored 24/7 by PGVA Ventures, LLC
        </span>
      </div>
    </motion.div>
  );
};

export default SystemStatusIndicator;
