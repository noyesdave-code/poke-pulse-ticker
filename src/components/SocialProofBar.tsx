import { useEffect, useState } from "react";
import { Users, Star, Shield, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

interface SocialProofBarProps {
  totalMarketValue?: number;
}

const formatValue = (value: number) => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
};

const AnimatedCounter = ({ target }: { target: string }) => {
  const [displayed, setDisplayed] = useState(target);
  useEffect(() => {
    setDisplayed(target);
  }, [target]);
  return <>{displayed}</>;
};

const SocialProofBar = ({ totalMarketValue = 0 }: SocialProofBarProps) => {
  const displayValue = totalMarketValue > 0 ? formatValue(totalMarketValue) : "$2.4M+";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="terminal-card overflow-hidden"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
        <div className="flex items-center gap-2.5 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-mono text-sm font-extrabold text-foreground">
              <AnimatedCounter target={displayValue} />
            </p>
            <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">Market Tracked</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-mono text-sm font-extrabold text-foreground">2,400+</p>
            <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">Active Users</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
            <Star className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <p className="font-mono text-sm font-extrabold text-foreground">4.8/5</p>
            <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">User Rating</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-mono text-sm font-extrabold text-foreground">Secure</p>
            <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">Encrypted Data</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SocialProofBar;
