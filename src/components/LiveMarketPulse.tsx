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
    setEvents(initial);

    const interval = setInterval(() => {
      const t = templates[counterRef.current % templates.length];
      counterRef.current++;
      setEvents((prev) => {
        const next = [...prev, { ...t, id: counterRef.current, timestamp: new Date() }];
        return next.slice(-15);
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [templates]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  const timeAgo = (d: Date) => {
    const s = Math.floor((Date.now() - d.getTime()) / 1000);
    if (s < 60) return `${s}s ago`;
    return `${Math.floor(s / 60)}m ago`;
  };

  if (!cards.length) return null;

  return (
    <section className="terminal-card p-0 overflow-hidden">
      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        <div className="relative">
          <Activity className="w-4 h-4 text-primary" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>
        <h2 className="font-mono text-xs font-bold tracking-widest text-foreground uppercase">
          LIVE MARKET PULSE
        </h2>
        <span className="ml-auto font-mono text-[9px] text-muted-foreground animate-pulse">● LIVE</span>
      </div>

      <div ref={scrollRef} className="max-h-[260px] overflow-y-auto px-3 pb-3 space-y-1.5 scrollbar-thin">
        {events.map((e) => (
          <div
            key={e.id}
            className="flex items-start gap-2.5 py-1.5 px-2 rounded bg-muted/30 hover:bg-muted/60 transition-colors animate-in slide-in-from-bottom-2 duration-300"
          >
            <div className="mt-0.5 shrink-0">{ICONS[e.icon]}</div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-[11px] text-foreground leading-snug">
                <span className="font-bold">{e.card}</span>{" "}
                <span className="text-muted-foreground">— {e.detail}</span>
              </p>
            </div>
            <span className="font-mono text-[9px] text-muted-foreground shrink-0 mt-0.5">
              {timeAgo(e.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LiveMarketPulse;
