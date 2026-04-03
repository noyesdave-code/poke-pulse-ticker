import { motion } from "framer-motion";
import { Rocket, Trophy, Swords, Users, Flame, ArrowRight, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const PromoStack = () => {
  const navigate = useNavigate();

  const [spotsLeft, setSpotsLeft] = useState(() => {
    const saved = localStorage.getItem("tournament-spots");
    return saved ? parseInt(saved) : 48;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSpotsLeft((prev) => {
        const next = Math.max(12, prev - (Math.random() < 0.3 ? 1 : 0));
        localStorage.setItem("tournament-spots", String(next));
        return next;
      });
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const promos = [
    {
      icon: Rocket,
      title: "CAPITAL SPRINT",
      subtitle: "7-Day Revenue Campaign",
      detail: "$25K target across 5 revenue streams",
      cta: "View Campaign",
      href: "/capital-campaign",
      accentClass: "text-primary",
      bgClass: "bg-primary/10",
      ringClass: "ring-primary/30",
      btnClass: "bg-primary hover:bg-primary/90 text-primary-foreground",
      badge: "LIVE",
      badgeClass: "bg-primary/20 text-primary",
    },
    {
      icon: Trophy,
      title: "SPRINT TOURNAMENT",
      subtitle: `$500 Prize Pool • ${spotsLeft} spots left`,
      detail: "$4.99 entry • Pro tier required • Top 3 win",
      cta: "Enter Now",
      href: "/sim-trader",
      accentClass: "text-purple-400",
      bgClass: "bg-purple-500/10",
      ringClass: "ring-purple-500/30",
      btnClass: "bg-purple-600 hover:bg-purple-700 text-white",
      badge: `${spotsLeft} LEFT`,
      badgeClass: "bg-destructive/20 text-destructive",
    },
    {
      icon: Swords,
      title: "HIGH STAKES ARENA",
      subtitle: "2X Payouts This Week",
      detail: "Boosted odds on all price predictions",
      cta: "Enter Arena",
      href: "/arena",
      accentClass: "text-destructive",
      bgClass: "bg-destructive/10",
      ringClass: "ring-destructive/30",
      btnClass: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
      badge: "2X",
      badgeClass: "bg-destructive/20 text-destructive",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm overflow-hidden"
    >
      <div className="px-3 py-2 border-b border-border/40 flex items-center gap-2">
        <Zap className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Active Campaigns</span>
        <div className="ml-auto flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-[10px] text-primary font-semibold">LIVE</span>
        </div>
      </div>

      <div className="divide-y divide-border/30">
        {promos.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="px-3 py-2.5 flex items-center gap-3 hover:bg-muted/30 transition-colors cursor-pointer group"
            onClick={() => navigate(p.href)}
          >
            <div className={`h-9 w-9 rounded-lg ${p.bgClass} flex items-center justify-center ring-2 ${p.ringClass} flex-shrink-0`}>
              <p.icon className={`h-4 w-4 ${p.accentClass}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground truncate">{p.title}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider ${p.badgeClass} animate-pulse`}>
                  {p.badge}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">{p.subtitle}</p>
            </div>
            <Button
              size="sm"
              className={`${p.btnClass} font-bold text-xs gap-1 h-7 px-2.5 flex-shrink-0 opacity-90 group-hover:opacity-100`}
              onClick={(e) => { e.stopPropagation(); navigate(p.href); }}
            >
              {p.cta} <ArrowRight className="w-3 h-3" />
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default PromoStack;
