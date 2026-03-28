import { useNavigate } from "react-router-dom";
import { Search, Briefcase, Layers, TrendingUp } from "lucide-react";

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
    <div className="terminal-card overflow-hidden">
      <div className="px-4 py-5 sm:px-6 sm:py-6 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-mono text-base sm:text-lg font-bold text-foreground tracking-wide">
              Pokémon TCG Market Terminal
            </h2>
            <p className="font-mono text-xs sm:text-sm text-muted-foreground mt-1 max-w-lg">
              Real-time prices for 500+ cards, graded values, sealed products — updated every hour from live market data.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded border border-primary/30 bg-primary/5">
            <div className="h-2 w-2 rounded-full bg-primary pulse-live" />
            <span className="font-mono text-[10px] text-primary font-semibold uppercase tracking-wider">Live</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
        {actions.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => {
                if (item.action === "search") {
                  onSearchFocus?.();
                } else if (item.path) {
                  navigate(item.path);
                }
              }}
              className="flex flex-col items-center gap-2 px-3 py-4 sm:py-5 transition-colors hover:bg-muted/50 group"
            >
              <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="text-center">
                <span className="font-mono text-xs font-semibold text-foreground block">{item.label}</span>
                <span className="font-mono text-[9px] text-muted-foreground leading-tight hidden sm:block mt-0.5">
                  {item.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HeroSection;
