import { useNavigate } from "react-router-dom";
import { TrendingUp, Shield, Zap, Crown, Gamepad2, BarChart3, Brain, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

const ads = [
  {
    icon: TrendingUp,
    headline: "Live Market Indexes",
    sub: "RAW 500 · GRADED 1000 · SEALED 1000",
    cta: "Track Now",
    path: "/",
    accent: "from-emerald-500/20 to-emerald-900/5",
    border: "border-emerald-500/20",
  },
  {
    icon: Gamepad2,
    headline: "SimTrader World™",
    sub: "Paper-trade Poké cards risk-free",
    cta: "Start Trading",
    path: "/sim-trader",
    accent: "from-blue-500/20 to-blue-900/5",
    border: "border-blue-500/20",
  },
  {
    icon: Trophy,
    headline: "Poké-Pulse Arena™",
    sub: "Predict prices · Win PokéCoins",
    cta: "Enter Arena",
    path: "/arena",
    accent: "from-amber-500/20 to-amber-900/5",
    border: "border-amber-500/20",
  },
  {
    icon: Brain,
    headline: "AI Alpha Signals",
    sub: "AI-powered breakout detection",
    cta: "View Signals",
    path: "/pricing",
    accent: "from-purple-500/20 to-purple-900/5",
    border: "border-purple-500/20",
  },
  {
    icon: BarChart3,
    headline: "Grading ROI Calculator",
    sub: "PSA · CGC · BGS · TAG ROI analysis",
    cta: "Calculate ROI",
    path: "/",
    accent: "from-cyan-500/20 to-cyan-900/5",
    border: "border-cyan-500/20",
  },
  {
    icon: Crown,
    headline: "Go Pro — 14-Day Free Trial",
    sub: "Unlock every tool, signal & scanner",
    cta: "Start Free",
    path: "/pricing",
    accent: "from-primary/20 to-primary/5",
    border: "border-primary/30",
  },
  {
    icon: Shield,
    headline: "Franchise Blueprint",
    sub: "$103B+ TAM · 12 verticals · Investor ready",
    cta: "View Blueprint",
    path: "/blueprint",
    accent: "from-rose-500/20 to-rose-900/5",
    border: "border-rose-500/20",
  },
  {
    icon: Zap,
    headline: "PGTV Media Hub",
    sub: "Watch promos, demos & investor content",
    cta: "Watch Now",
    path: "/videos",
    accent: "from-orange-500/20 to-orange-900/5",
    border: "border-orange-500/20",
  },
];

interface ProductAdBannerProps {
  variant?: "inline" | "sidebar" | "strip";
  count?: number;
}

const ProductAdBanner = ({ variant = "strip", count = 4 }: ProductAdBannerProps) => {
  const navigate = useNavigate();
  const [startIdx, setStartIdx] = useState(0);

  // Rotate ads every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStartIdx(prev => (prev + count) % ads.length);
    }, 30000);
    return () => clearInterval(interval);
  }, [count]);

  const visibleAds = Array.from({ length: count }, (_, i) => ads[(startIdx + i) % ads.length]);

  if (variant === "inline") {
    const ad = visibleAds[0];
    const Icon = ad.icon;
    return (
      <button
        onClick={() => navigate(ad.path)}
        className={`w-full rounded-lg border ${ad.border} bg-gradient-to-r ${ad.accent} p-3 flex items-center gap-3 hover:scale-[1.01] transition-transform group`}
      >
        <div className="w-9 h-9 rounded-md bg-background/60 flex items-center justify-center flex-shrink-0">
          <Icon className="h-4.5 w-4.5 text-primary" />
        </div>
        <div className="text-left flex-1 min-w-0">
          <p className="text-xs font-bold text-foreground truncate">{ad.headline}</p>
          <p className="text-[10px] text-muted-foreground truncate">{ad.sub}</p>
        </div>
        <Badge className="text-[9px] bg-primary/15 text-primary border-0 group-hover:bg-primary/25 flex-shrink-0">
          {ad.cta} →
        </Badge>
      </button>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className="space-y-2">
        {visibleAds.slice(0, 3).map((ad, i) => {
          const Icon = ad.icon;
          return (
            <button
              key={i}
              onClick={() => navigate(ad.path)}
              className={`w-full rounded-md border ${ad.border} bg-gradient-to-r ${ad.accent} p-2.5 flex items-center gap-2.5 hover:scale-[1.01] transition-transform`}
            >
              <Icon className="h-4 w-4 text-primary flex-shrink-0" />
              <div className="text-left min-w-0 flex-1">
                <p className="text-[11px] font-bold text-foreground truncate">{ad.headline}</p>
                <p className="text-[9px] text-muted-foreground truncate">{ad.sub}</p>
              </div>
            </button>
          );
        })}
        <p className="text-[8px] text-muted-foreground/40 text-center">Sponsored · PGVA Ventures</p>
      </div>
    );
  }

  // Strip — horizontal row
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 px-1">
        <Zap className="h-3 w-3 text-primary" />
        <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Explore the Engine</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {visibleAds.map((ad, i) => {
          const Icon = ad.icon;
          return (
            <button
              key={i}
              onClick={() => navigate(ad.path)}
              className={`rounded-lg border ${ad.border} bg-gradient-to-br ${ad.accent} p-2.5 flex flex-col items-start gap-1.5 hover:scale-[1.02] transition-transform text-left group`}
            >
              <div className="flex items-center gap-1.5 w-full">
                <Icon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span className="text-[11px] font-bold text-foreground truncate">{ad.headline}</span>
              </div>
              <p className="text-[9px] text-muted-foreground line-clamp-1">{ad.sub}</p>
              <span className="text-[9px] font-semibold text-primary group-hover:underline">{ad.cta} →</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductAdBanner;
