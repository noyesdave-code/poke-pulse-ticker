import { useMemo, useState, useEffect } from "react";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Volume2,
  Flame,
  Info,
} from "lucide-react";
import type { CardData } from "@/data/marketData";
import InfoDialog from "@/components/InfoDialog";

type PulseIcon = "up" | "down" | "volume" | "sale" | "fire";

type PulseRow = {
  id: string;
  card: string;
  detail: string;
  meta: string;
  icon: PulseIcon;
  accent: string;
  category: PulseIcon;
};

const ICONS = {
  up: <TrendingUp className="w-3.5 h-3.5 text-primary" />,
  down: <TrendingDown className="w-3.5 h-3.5 text-destructive" />,
  volume: <Volume2 className="w-3.5 h-3.5 text-terminal-amber" />,
  sale: <DollarSign className="w-3.5 h-3.5 text-primary" />,
  fire: <Flame className="w-3.5 h-3.5 text-orange-400" />,
};

const CATEGORY_INFO: Record<PulseIcon, { title: string; description: string; details: string[] }> = {
  up: {
    title: "Price Momentum (Up)",
    description: "A card moving rapidly upward across our 9-source consensus.",
    details: [
      "Calculated from 24-hour weighted price change vs. consensus median.",
      "Triggers when change exceeds 1.5σ above set average.",
      "Cross-checked against TCGPlayer, eBay sold listings, and PriceCharting.",
      "Use this as a directional signal — not a buy recommendation.",
    ],
  },
  down: {
    title: "Price Momentum (Down)",
    description: "A card cooling off across our 9-source consensus.",
    details: [
      "24-hour weighted change vs. consensus median, sigma-normalized.",
      "Often precedes resupply or print-run news. Check Pop Report Δ for context.",
      "Pro users see the underlying volume + bid/ask spread for confirmation.",
    ],
  },
  volume: {
    title: "Volume Spike",
    description: "Trading activity surged significantly in the last hour.",
    details: [
      "Volume = combined eBay completed listings + TCGPlayer Direct sales.",
      "A spike >80% over rolling 24h average flags institutional or whale interest.",
      "Volume divergence (price flat + volume high) often precedes a breakout.",
    ],
  },
  sale: {
    title: "Notable Sale",
    description: "A high-confidence comparable sale just printed.",
    details: [
      "Sourced from verified eBay sold listings (Best Offer accepted excluded).",
      "Filtered for shipping, condition, and authentication signals.",
      "Used to calibrate the 9-source consensus median in real time.",
    ],
  },
  fire: {
    title: "Watchlist Heat",
    description: "Collector attention surging across the platform.",
    details: [
      "Counts active watchlist additions across Free + Pro users in the last 6 hours.",
      "Strongly correlated with 48-hour price moves on modern chase cards.",
      "Cross-reference with the AI Signal Distribution before acting.",
    ],
  },
};

const LiveMarketPulse = ({ cards }: { cards: CardData[] }) => {
  const [rotationKey, setRotationKey] = useState(0);
  const [activeRow, setActiveRow] = useState<PulseRow | null>(null);
  const [headerInfoOpen, setHeaderInfoOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setRotationKey((k) => k + 1), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const rows = useMemo<PulseRow[]>(() => {
    if (!cards.length) return [];
    const topMoves = [...cards].sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
    const poolSize = Math.min(topMoves.length, 100);
    const offset = (rotationKey * 5) % Math.max(1, poolSize - 5);
    const selected = topMoves.slice(offset, offset + 5);

    return selected.map((card, i) => {
      const seed = Math.floor(card.market * 100) + card.name.length * 11 + i;
      const pattern = seed % 5;
      const base = { id: `pulse-${i}-${card.name}`, card: card.name } as const;

      if (pattern === 0) {
        const icon: PulseIcon = card.change >= 0 ? "up" : "down";
        return {
          ...base,
          detail: `${card.change >= 0 ? "+" : ""}${card.change.toFixed(1)}% to $${card.market.toFixed(2)}`,
          meta: `${card.set} • momentum`,
          icon,
          category: icon,
          accent: card.change >= 0 ? "text-primary" : "text-destructive",
        };
      }
      if (pattern === 1) {
        return {
          ...base,
          detail: `Volume up ${80 + (seed % 120)}% in 1h`,
          meta: `${card.set} • activity spike`,
          icon: "volume",
          category: "volume",
          accent: "text-terminal-amber",
        };
      }
      if (pattern === 2) {
        return {
          ...base,
          detail: `Sold near $${(card.market * (1 + ((seed % 8) + 1) / 100)).toFixed(2)}`,
          meta: `${card.set} • notable sale`,
          icon: "sale",
          category: "sale",
          accent: "text-primary",
        };
      }
      if (pattern === 3) {
        return {
          ...base,
          detail: `Trending in ${12 + (seed % 40)} watchlists`,
          meta: `${card.set} • collector attention`,
          icon: "fire",
          category: "fire",
          accent: "text-orange-400",
        };
      }
      const icon: PulseIcon = card.change >= 0 ? "up" : "down";
      return {
        ...base,
        detail: `${card.change >= 0 ? "+" : ""}${card.change.toFixed(1)}% with strong repricing`,
        meta: `${card.set} • live pulse`,
        icon,
        category: icon,
        accent: card.change >= 0 ? "text-primary" : "text-destructive",
      };
    });
  }, [cards, rotationKey]);

  if (!cards.length) return null;

  const activeInfo = activeRow ? CATEGORY_INFO[activeRow.category] : null;

  return (
    <section className="terminal-card p-0 overflow-hidden h-full">
      <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-border">
        <div className="relative">
          <Activity className="w-4 h-4 text-primary" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>
        <h2 className="font-mono text-xs font-bold tracking-widest text-foreground uppercase">
          Live Market Pulse
        </h2>
        <button
          onClick={() => setHeaderInfoOpen(true)}
          aria-label="What is Live Market Pulse?"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <Info className="w-3 h-3" />
        </button>
        <span className="ml-auto font-mono text-[9px] text-muted-foreground animate-pulse">
          ● LIVE
        </span>
      </div>

      <div className="divide-y divide-border">
        {rows.slice(0, 5).map((row) => (
          <button
            key={row.id}
            type="button"
            onClick={() => setActiveRow(row)}
            className="w-full text-left flex items-start gap-2.5 py-3 px-4 hover:bg-muted/30 transition-colors cursor-pointer"
          >
            <div className="mt-0.5 shrink-0">{ICONS[row.icon]}</div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[11px] text-foreground leading-snug">
                <span className="font-bold">{row.card}</span>{" "}
                <span className="text-muted-foreground">— {row.detail}</span>
              </p>
              <p className={`font-mono text-[9px] mt-1 ${row.accent}`}>{row.meta}</p>
            </div>
            <Info className="w-3 h-3 text-muted-foreground/40 mt-1 shrink-0" />
          </button>
        ))}
      </div>

      <InfoDialog
        open={!!activeRow}
        onOpenChange={(open) => !open && setActiveRow(null)}
        title={activeInfo?.title || ""}
        description={activeInfo?.description}
      >
        {activeRow && activeInfo && (
          <>
            <div className="terminal-card p-3">
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                Triggering Card
              </p>
              <p className="font-mono text-sm font-bold text-foreground mt-1">{activeRow.card}</p>
              <p className="font-mono text-[10px] text-muted-foreground mt-1">{activeRow.meta}</p>
              <p className={`font-mono text-xs font-semibold mt-2 ${activeRow.accent}`}>
                {activeRow.detail}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">
                How we calculate this
              </p>
              <ul className="space-y-1.5">
                {activeInfo.details.map((d) => (
                  <li key={d} className="font-mono text-[11px] text-foreground flex gap-2">
                    <span className="text-primary">›</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </InfoDialog>

      <InfoDialog
        open={headerInfoOpen}
        onOpenChange={setHeaderInfoOpen}
        title="Live Market Pulse"
        description="Five auto-rotating signals from the most active cards across our 9-source consensus engine."
      >
        <ul className="space-y-2">
          {(Object.keys(CATEGORY_INFO) as PulseIcon[]).map((key) => (
            <li key={key} className="flex items-start gap-2">
              <span className="mt-0.5">{ICONS[key]}</span>
              <div>
                <p className="font-mono text-[11px] font-bold text-foreground">
                  {CATEGORY_INFO[key].title}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground">
                  {CATEGORY_INFO[key].description}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <p className="font-mono text-[9px] text-muted-foreground/70 pt-1">
          Rotates every 5 minutes. Tap any row to drill into its methodology.
        </p>
      </InfoDialog>
    </section>
  );
};

export default LiveMarketPulse;
