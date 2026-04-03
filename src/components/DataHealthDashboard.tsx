import { motion } from "framer-motion";
import { Activity, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

const DATA_SOURCES = [
  { name: "RAW 500 Index", lastScrape: new Date(Date.now() - 12 * 60000), interval: "60 min", status: "healthy" as const },
  { name: "GRADED 1000 Index", lastScrape: new Date(Date.now() - 28 * 60000), interval: "60 min", status: "healthy" as const },
  { name: "SEALED 1000 Index", lastScrape: new Date(Date.now() - 35 * 60000), interval: "60 min", status: "healthy" as const },
  { name: "Poké TCG API", lastScrape: new Date(Date.now() - 5 * 60000), interval: "5 min", status: "healthy" as const },
  { name: "SWR Cache Layer", lastScrape: new Date(Date.now() - 2 * 60000), interval: "Continuous", status: "healthy" as const },
  { name: "Consensus Pricing", lastScrape: new Date(Date.now() - 45 * 60000), interval: "90 min", status: "healthy" as const },
];

function timeAgo(date: Date): string {
  const mins = Math.round((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m ago`;
}

const DataHealthDashboard = () => {
  const allHealthy = DATA_SOURCES.every((s) => s.status === "healthy");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="terminal-card p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-sm font-bold text-foreground flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          Data Health
        </h3>
        <span
          className={`font-mono text-[9px] px-2 py-0.5 rounded flex items-center gap-1 ${
            allHealthy
              ? "bg-primary/10 text-primary border border-primary/20"
              : "bg-secondary/10 text-secondary border border-secondary/20"
          }`}
        >
          {allHealthy ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
          {allHealthy ? "ALL SYSTEMS GO" : "DEGRADED"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {DATA_SOURCES.map((src) => (
          <div key={src.name} className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30 border border-border/50">
            <div>
              <p className="font-mono text-[10px] font-semibold text-foreground">{src.name}</p>
              <p className="font-mono text-[9px] text-muted-foreground flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" /> {timeAgo(src.lastScrape)}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary pulse-live" />
                <span className="font-mono text-[9px] text-primary">OK</span>
              </div>
              <p className="font-mono text-[8px] text-muted-foreground">{src.interval}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default DataHealthDashboard;
