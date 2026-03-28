import { Shield, RefreshCw, Database, Users, Star, TrendingUp } from "lucide-react";

const signals = [
  {
    icon: Database,
    stat: "500+",
    label: "Cards Tracked",
    desc: "Live raw, graded & sealed data",
  },
  {
    icon: RefreshCw,
    stat: "Hourly",
    label: "Data Updates",
    desc: "Prices refresh from pokemontcg.io",
  },
  {
    icon: TrendingUp,
    stat: "3",
    label: "Market Indexes",
    desc: "RAW 500 • GRADED 1000 • SEALED 1000",
  },
  {
    icon: Shield,
    stat: "Secure",
    label: "Data Protection",
    desc: "RLS-protected portfolios & Stripe billing",
  },
];

const TrustSignals = () => {
  return (
    <div className="terminal-card overflow-hidden">
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h3 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold flex items-center gap-2">
          <Star className="w-3.5 h-3.5" /> Why Collectors Trust Us
        </h3>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
          <Users className="w-3 h-3 text-primary" />
          <span className="font-mono text-[10px] text-primary font-semibold">PGVA Ventures, LLC</span>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
        {signals.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="px-3 py-4 text-center space-y-1.5">
              <div className="w-8 h-8 rounded-md bg-muted mx-auto flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <p className="font-mono text-lg font-bold text-foreground">{item.stat}</p>
              <p className="font-mono text-[10px] font-semibold text-foreground uppercase tracking-wider">{item.label}</p>
              <p className="font-mono text-[9px] text-muted-foreground leading-tight">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrustSignals;
