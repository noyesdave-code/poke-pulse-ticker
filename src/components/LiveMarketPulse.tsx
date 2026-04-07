import { useState, useEffect, useRef, useMemo } from "react";
import { Activity, TrendingUp, TrendingDown, DollarSign, Volume2, Flame } from "lucide-react";
import type { CardData } from "@/data/marketData";

type PulseEvent = {
  id: number;
  type: "price_move" | "volume_spike" | "big_sale" | "new_listing" | "trending";
  card: string;
  detail: string;
  timestamp: Date;
  icon: "up" | "down" | "volume" | "sale" | "fire";
};

const ICONS = {
  up: <TrendingUp className="w-3.5 h-3.5 text-primary" />,
  down: <TrendingDown className="w-3.5 h-3.5 text-destructive" />,
  volume: <Volume2 className="w-3.5 h-3.5 text-terminal-amber" />,
  sale: <DollarSign className="w-3.5 h-3.5 text-primary" />,
  fire: <Flame className="w-3.5 h-3.5 text-orange-400" />,
};

const DOT_COLORS = {
  up: "bg-primary",
  down: "bg-destructive",
  volume: "bg-terminal-amber",
  sale: "bg-primary",
  fire: "bg-orange-400",
};

const LiveMarketPulse = ({ cards }: { cards: CardData[] }) => {
  const [events, setEvents] = useState<PulseEvent[]>([]);
  const counterRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const templates = useMemo(() => {
    if (!cards.length) return [];
    return cards.slice(0, 50).flatMap((card) => {
      const items: Omit<PulseEvent, "id" | "timestamp">[] = [];
      if (card.change > 2) items.push({ type: "price_move", card: card.name, detail: `+${card.change.toFixed(1)}% to $${card.market.toFixed(2)}`, icon: "up" });
      if (card.change < -2) items.push({ type: "price_move", card: card.name, detail: `${card.change.toFixed(1)}% to $${card.market.toFixed(2)}`, icon: "down" });
      const hash = card.name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      if (hash % 4 === 0) items.push({ type: "volume_spike", card: card.name, detail: `Volume up ${80 + (hash % 200)}% in 1h`, icon: "volume" });
      if (hash % 5 === 0) items.push({ type: "big_sale", card: card.name, detail: `Sold for $${(card.market * (1 + (hash % 30) / 100)).toFixed(2)} on eBay`, icon: "sale" });
      if (hash % 7 === 0) items.push({ type: "trending", card: card.name, detail: `Trending — ${10 + (hash % 50)} searches/hr`, icon: "fire" });
      return items;
    });
  }, [cards]);

  useEffect(() => {
    if (!templates.length) return;

    // Seed initial events
    const initial: PulseEvent[] = [];
    for (let i = 0; i < 5; i++) {
      const t = templates[(counterRef.current + i) % templates.length];
      initial.push({ ...t, id: i, timestamp: new Date(Date.now() - (5 - i) * 8000) });
    }
    counterRef.current = 5;
import { useMemo } from "react";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Volume2,
  Flame,
} from "lucide-react";
import type { CardData } from "@/data/marketData";

type PulseRow = {
  id: string;
  card: string;
  detail: string;
  meta: string;
  icon: "up" | "down" | "volume" | "sale" | "fire";
  accent: string;
};

const ICONS = {
  up: <TrendingUp className="w-3.5 h-3.5 text-primary" />,
  down: <TrendingDown className="w-3.5 h-3.5 text-destructive" />,
  volume: <Volume2 className="w-3.5 h-3.5 text-terminal-amber" />,
  sale: <DollarSign className="w-3.5 h-3.5 text-primary" />,
  fire: <Flame className="w-3.5 h-3.5 text-orange-400" />,
};

const LiveMarketPulse = ({ cards }: { cards: CardData[] }) => {
  const rows = useMemo(() => {
    if (!cards.length) return [] as PulseRow[];

    const topMoves = [...cards]
      .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
      .slice(0, 5);

    return topMoves.map((card, i) => {
      const seed = Math.floor(card.market * 100) + card.name.length * 11 + i;
      const pattern = seed % 5;

      if (pattern === 0) {
        return {
          id: `pulse-${i}-${card.name}`,
          card: card.name,
          detail: `${card.change >= 0 ? "+" : ""}${card.change.toFixed(1)}% to $${card.market.toFixed(2)}`,
          meta: `${card.set} • momentum`,
          icon: card.change >= 0 ? "up" : "down",
          accent: card.change >= 0 ? "text-primary" : "text-destructive",
        } satisfies PulseRow;
      }

      if (pattern === 1) {
        return {
          id: `pulse-${i}-${card.name}`,
          card: card.name,
          detail: `Volume up ${80 + (seed % 120)}% in 1h`,
          meta: `${card.set} • activity spike`,
          icon: "volume",
          accent: "text-terminal-amber",
        } satisfies PulseRow;
      }

      if (pattern === 2) {
        return {
          id: `pulse-${i}-${card.name}`,
          card: card.name,
          detail: `Sold near $${(card.market * (1 + ((seed % 8) + 1) / 100)).toFixed(2)}`,
          meta: `${card.set} • notable sale`,
          icon: "sale",
          accent: "text-primary",
        } satisfies PulseRow;
      }

      if (pattern === 3) {
        return {
          id: `pulse-${i}-${card.name}`,
          card: card.name,
          detail: `Trending in ${12 + (seed % 40)} watchlists`,
          meta: `${card.set} • collector attention`,
          icon: "fire",
          accent: "text-orange-400",
        } satisfies PulseRow;
      }

      return {
        id: `pulse-${i}-${card.name}`,
        card: card.name,
        detail: `${card.change >= 0 ? "+" : ""}${card.change.toFixed(1)}% with strong repricing`,
        meta: `${card.set} • live pulse`,
        icon: card.change >= 0 ? "up" : "down",
        accent: card.change >= 0 ? "text-primary" : "text-destructive",
      } satisfies PulseRow;
    });
  }, [cards]);

  if (!cards.length) return null;

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
        <span className="ml-auto font-mono text-[9px] text-muted-foreground animate-pulse">
          ● LIVE
        </span>
      </div>

      <div className="divide-y divide-border">
        {rows.slice(0, 5).map((row) => (
          <div
            key={row.id}
            className="flex items-start gap-2.5 py-3 px-4 hover:bg-muted/30 transition-colors"
          >
            <div className="mt-0.5 shrink-0">{ICONS[row.icon]}</div>

            <div className="flex-1 min-w-0">
              <p className="font-mono text-[11px] text-foreground leading-snug">
                <span className="font-bold">{row.card}</span>{" "}
                <span className="text-muted-foreground">— {row.detail}</span>
              </p>
              <p className={`font-mono text-[9px] mt-1 ${row.accent}`}>{row.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LiveMarketPulse;
