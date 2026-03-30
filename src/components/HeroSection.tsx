import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Briefcase, Layers, TrendingUp } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["-30%", "30%"]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], isMobile ? [1, 1, 1] : [0.9, 1.1, 0.95]);

  const particleCount = isMobile ? 4 : 12;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="terminal-card hero-glow-border overflow-hidden relative"
    >
      {/* Ambient glow background — parallax on desktop, static on mobile */}
      <motion.div className="absolute inset-0 pointer-events-none overflow-hidden" style={isMobile ? undefined : { y: glowY, scale: glowScale }}>
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, hsl(160 84% 50% / 0.08), transparent)" }} />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, hsl(215 90% 62% / 0.06), transparent)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, hsl(38 92% 60% / 0.03), transparent)" }} />
      </motion.div>

      {/* Floating particles — reduced count on mobile */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: particleCount }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${2 + (i % 3) * 1.5}px`,
              height: `${2 + (i % 3) * 1.5}px`,
              left: `${8 + (i * 7.5) % 85}%`,
              top: `${10 + (i * 13) % 80}%`,
              background: i % 3 === 0
                ? "hsl(var(--primary) / 0.4)"
                : i % 3 === 1
                  ? "hsl(var(--terminal-blue) / 0.3)"
                  : "hsl(var(--terminal-amber) / 0.25)",
            }}
            animate={{
              y: [0, -15 - (i % 4) * 5, 0],
              x: [0, (i % 2 === 0 ? 8 : -8), 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + (i % 3) * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
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
              <span className="glow-p pulse-live">P</span>okémon TCG{" "}
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
              className="relative flex flex-col items-center gap-2.5 px-3 py-5 sm:py-6 transition-colors group cursor-pointer hover:bg-muted/30 overflow-hidden"
            >
              {/* Shimmer sweep on hover */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 shimmer-sweep" />
              </div>
              <div className="relative w-11 h-11 rounded-xl bg-muted/60 flex items-center justify-center group-hover:bg-primary/15 group-hover:shadow-[0_0_20px_hsl(160_84%_50%/0.15)] transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl" style={{ background: "linear-gradient(135deg, transparent 30%, hsl(var(--primary) / 0.12) 50%, hsl(var(--terminal-blue) / 0.08) 60%, transparent 70%)" }} />
                <Icon className="relative w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
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