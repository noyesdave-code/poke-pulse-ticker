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
      {/* Ambient glow background — warmer & brighter */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, hsl(160 84% 50% / 0.08), transparent)" }} />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, hsl(215 90% 62% / 0.06), transparent)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, hsl(38 92% 60% / 0.03), transparent)" }} />
      </div>

      <div className="relative px-5 py-6 sm:px-8 sm:py-10 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xl sm:text-3xl font-extrabold tracking-tight text-foreground"
            >
              Pokémon TCG{" "}
              <span className="text-primary">Market Terminal</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-sm sm:text-base text-muted-foreground max-w-lg leading-relaxed"
            >
              Real-time prices for <span className="text-foreground font-medium">500+ cards</span>, graded values & sealed products — updated hourly from live market data.
            </motion.p>
          </div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-lg border border-primary/20 bg-primary/5"
          >
            <div className="h-2.5 w-2.5 rounded-full bg-primary pulse-live" />
            <span className="font-mono text-xs text-primary font-semibold uppercase tracking-wider">Live</span>
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
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (item.action === "search") {
                  onSearchFocus?.();
                } else if (item.path) {
                  navigate(item.path);
                }
              }}
              className="flex flex-col items-center gap-2.5 px-3 py-5 sm:py-6 transition-colors group cursor-pointer hover:bg-muted/30"
            >
              <div className="w-11 h-11 rounded-xl bg-muted/60 flex items-center justify-center group-hover:bg-primary/15 group-hover:shadow-[0_0_20px_hsl(160_84%_50%/0.15)] transition-all duration-300">
                <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              </div>
              <div className="text-center">
                <span className="text-sm font-semibold text-foreground block">{item.label}</span>
                <span className="text-[11px] text-muted-foreground leading-snug hidden sm:block mt-1">
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