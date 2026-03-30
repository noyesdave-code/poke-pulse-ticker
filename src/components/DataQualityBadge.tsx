import { CheckCircle, Clock, RefreshCw, Shield, Database } from "lucide-react";
import { motion } from "framer-motion";

interface DataQualityBadgeProps {
  isLive: boolean;
  lastUpdated?: number;
  cardCount: number;
}

const DataQualityBadge = ({ isLive, lastUpdated, cardCount }: DataQualityBadgeProps) => {
  const minutesAgo = lastUpdated ? Math.floor((Date.now() - lastUpdated) / 60000) : null;
  const freshness = minutesAgo === null ? "stale" : minutesAgo < 30 ? "fresh" : minutesAgo < 90 ? "recent" : "stale";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="terminal-card overflow-hidden"
    >
      <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Verified by PGVA badge */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary/10 border border-primary/20">
            <Shield className="w-3 h-3 text-primary" />
            <span className="font-mono text-[9px] text-primary font-bold tracking-wider">VERIFIED BY PGVA</span>
          </div>

          {/* Source badge */}
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono text-[10px] text-muted-foreground">
              Source: <span className="text-foreground font-semibold">pokemontcg.io</span>
            </span>
          </div>

          {/* Freshness badge */}
          <div className="flex items-center gap-1.5">
            <Clock className={`w-3.5 h-3.5 ${freshness === "fresh" ? "text-terminal-green" : freshness === "recent" ? "text-terminal-amber" : "text-muted-foreground"}`} />
            <span className="font-mono text-[10px] text-muted-foreground">
              {minutesAgo !== null ? (
                <>Updated <span className={`font-semibold ${freshness === "fresh" ? "text-terminal-green" : freshness === "recent" ? "text-terminal-amber" : "text-foreground"}`}>{minutesAgo}m ago</span></>
              ) : (
                <span className="text-muted-foreground">Cached data</span>
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* SWR cache indicator */}
          <div className="flex items-center gap-1">
            <Database className="w-3 h-3 text-muted-foreground" />
            <span className="font-mono text-[9px] text-muted-foreground">SWR Cache</span>
          </div>

          {/* Coverage */}
          <span className="font-mono text-[10px] text-muted-foreground">
            <span className="text-foreground font-semibold">{cardCount.toLocaleString()}</span> cards tracked
          </span>

          {/* Refresh indicator */}
          {isLive && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
              <RefreshCw className="w-2.5 h-2.5 text-primary" />
              <span className="font-mono text-[9px] text-primary font-semibold">AUTO-REFRESH</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DataQualityBadge;
