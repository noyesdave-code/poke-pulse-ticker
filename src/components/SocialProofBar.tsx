import { Users, Star, Shield, DollarSign, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface SocialProofBarProps {
  totalMarketValue?: number;
  isLive?: boolean;
  lastUpdated?: number;
  cardCount?: number;
}

const formatValue = (value: number) => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
};

const SocialProofBar = ({
  totalMarketValue = 0,
  isLive,
  lastUpdated,
  cardCount,
}: SocialProofBarProps) => {
  const displayValue = totalMarketValue > 0 ? formatValue(totalMarketValue) : "$2.4M+";
  const minutesAgo = lastUpdated ? Math.floor((Date.now() - lastUpdated) / 60000) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.45 }}
      className="terminal-card overflow-hidden"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border/50">
        <div className="flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 min-h-[48px]">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-xs sm:text-sm font-extrabold text-foreground truncate">
              {displayValue}
            </p>
            <p className="font-mono text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-wider">
              Market Tracked
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 min-h-[48px]">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-xs sm:text-sm font-extrabold text-foreground">
              {cardCount ? `${cardCount}+` : "2,400+"}
            </p>
            <p className="font-mono text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-wider">
              Active Listings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 min-h-[48px]">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary" />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-xs sm:text-sm font-extrabold text-foreground">Top 5</p>
            <p className="font-mono text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-wider">
              Movers & Sales
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 min-h-[48px]">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            {isLive ? (
              <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-terminal-green" />
            ) : (
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            )}
          </div>
          <div className="min-w-0">
            {isLive ? (
              <>
                <p className="font-mono text-xs sm:text-sm font-extrabold text-terminal-green flex items-center gap-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-terminal-green"></span>
                  </span>
                  Live
                </p>
                <p className="font-mono text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-wider">
                  {minutesAgo !== null ? `${minutesAgo}m ago` : "Real-time"}
                </p>
              </>
            ) : (
              <>
                <p className="font-mono text-xs sm:text-sm font-extrabold text-foreground">Secure</p>
                <p className="font-mono text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-wider">
                  Encrypted
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SocialProofBar;
