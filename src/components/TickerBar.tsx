import { useState, useEffect } from "react";
import type { CardData } from "@/data/marketData";
import { getCardToken } from "@/lib/tokenSymbols";

interface TickerBarProps {
  cards?: CardData[];
  isLive?: boolean;
  lastUpdated?: number; // timestamp ms
}

const TickerBar = ({ cards = [], isLive = false, lastUpdated }: TickerBarProps) => {
  const tickerItems = [...cards, ...cards]; // duplicate for seamless loop
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!lastUpdated) return;
    const REFRESH_MS = 60 * 60 * 1000; // 60 min

    const tick = () => {
      const elapsed = Date.now() - lastUpdated;
      const remaining = Math.max(0, REFRESH_MS - elapsed);
      const mins = Math.floor(remaining / 60_000);
      const secs = Math.floor((remaining % 60_000) / 1000);
      setCountdown(`${mins}:${secs.toString().padStart(2, "0")}`);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lastUpdated]);

  return (
    <div className="border-b border-border/40 bg-terminal-header overflow-hidden">
      <div className="flex items-center">
        {/* Refresh countdown badge */}
        {isLive && countdown && (
          <div className="flex-shrink-0 px-2.5 py-1.5 border-r border-border/40 bg-terminal-header z-10 relative shadow-[6px_0_12px_4px_hsl(var(--terminal-header))]">
            <span className="font-mono text-[9px] text-secondary uppercase tracking-wider font-bold">
              ↻ {countdown}
            </span>
          </div>
        )}
        <div className="ticker-scroll flex whitespace-nowrap py-1.5" style={{ animationDuration: `${Math.max(80, cards.length * 6.4)}s` }}>
          {tickerItems.map((card, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-4 font-mono text-xs">
              <span className="text-primary font-bold text-[10px]">{getCardToken(card)}</span>
              <span className="text-foreground/80 font-medium">{card.name}</span>
              <span className="text-foreground font-semibold">${card.market.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              <span className={card.change >= 0 ? "text-terminal-green" : "text-terminal-red"}>
                {card.change >= 0 ? "▲" : "▼"} {Math.abs(card.change).toFixed(2)}%
              </span>
              <span className="text-border/40">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TickerBar;
