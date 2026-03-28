import { useNavigate } from "react-router-dom";
import { Search, Briefcase, Layers, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const actions = [
  {
    icon: Search,
    label: "Price Check",
    desc: "Look up any card's live market value",
    action: "search",
  },
  {
    icon: Briefcase,
    label: "My Portfolio",
    desc: "Track your collection & see gains",
    path: "/portfolio",
  },
  {
    icon: Layers,
    label: "Browse Sets",
    desc: "Explore every set from Base to current",
    path: "/sets",
  },
  {
    icon: TrendingUp,
    label: "Dashboard",
    desc: "Portfolio analytics & performance",
    path: "/dashboard",
  },
];

interface HeroSectionProps {
  onSearchFocus?: () => void;
}

const HeroSection = ({ onSearchFocus }: HeroSectionProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="terminal-card overflow-hidden relative"
    >
      {/* Ambient glow background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-terminal-blue/5 blur-3xl" />
      </div>

      <div className="relative px-4 py-5 sm:px-6 sm:py-8 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-mono text-lg sm:text-2xl font-bold tracking-wide"
              style={{
                background: "linear-gradient(135deg, hsl(0 0% 100%), hsl(145 100% 45%), hsl(0 0% 100%))",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Pokémon TCG Market Terminal
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="font-mono text-xs sm:text-sm text-muted-foreground mt-2 max-w-lg leading-relaxed"
            >
              Real-time prices for 500+ cards, graded values, sealed products — updated every hour from live market data.
            </motion.p>
          </div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-primary/30 bg-primary/5"
          >
            <div className="h-2 w-2 rounded-full bg-primary pulse-live" />
            <span className="font-mono text-[10px] text-primary font-semibold uppercase tracking-wider">Live</span>
          </motion.div>
        </div>
      </div>

      <div className="relative grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
        {actions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.02, backgroundColor: "hsl(220 15% 13% / 0.5)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (item.action === "search") {
                  onSearchFocus?.();
                } else if (item.path) {
                  navigate(item.path);
                }
              }}
              className="flex flex-col items-center gap-2 px-3 py-4 sm:py-5 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/15 group-hover:shadow-[0_0_15px_hsl(145_100%_45%/0.15)] transition-all duration-300">
                <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              </div>
              <div className="text-center">
                <span className="font-mono text-xs font-semibold text-foreground block">{item.label}</span>
                <span className="font-mono text-[9px] text-muted-foreground leading-tight hidden sm:block mt-0.5">
                  {item.desc}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default HeroSection;
