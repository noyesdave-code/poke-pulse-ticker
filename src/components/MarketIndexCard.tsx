import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";

interface MarketIndexCardProps {
  title: string;
  value: number;
  change: number;
  count: number;
  description: string;
  variant?: "green" | "amber" | "blue";
}

const MarketIndexCard = ({ title, value, change, count, description, variant = "green" }: MarketIndexCardProps) => {
  const glowClass = variant === "green" ? "glow-green" : variant === "amber" ? "glow-amber" : "";
  const accentColor = variant === "green" ? "text-terminal-green" : variant === "amber" ? "text-terminal-amber" : "text-terminal-blue";
  const borderAccent = variant === "green" ? "border-t-terminal-green" : variant === "amber" ? "border-t-terminal-amber" : "border-t-terminal-blue";
  const glowColor = variant === "green" ? "hsl(145 100% 45% / 0.08)" : variant === "amber" ? "hsl(40 100% 55% / 0.08)" : "hsl(210 100% 60% / 0.08)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 8px 30px ${glowColor}`,
      }}
      className={`terminal-card hero-glow-border p-4 ${glowClass} border-t-2 ${borderAccent} transition-shadow duration-300`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">{title}</span>
        <span className="font-mono text-[10px] text-muted-foreground">{count} tracked</span>
      </div>
      <div className="text-2xl lg:text-3xl font-extrabold text-foreground mb-1">
        ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <p className="text-xs text-muted-foreground mb-2">{description}</p>
      <div className="flex items-center justify-between">
        <span className={`font-mono text-sm font-semibold ${change >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
          {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
        </span>
        <Link to="/methodology" className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors font-mono">
          <Info className="w-3 h-3" /> How it's calculated
        </Link>
      </div>
    </motion.div>
  );
};

export default MarketIndexCard;
