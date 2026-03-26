import type { CardData } from "@/data/marketData";

interface TickerBarProps {
  cards?: CardData[];
  isLive?: boolean;
}

const TickerBar = ({ cards = [], isLive = false }: TickerBarProps) => {
  const tickerItems = [...cards, ...cards]; // duplicate for seamless loop

  return (
    <div className="border-b border-border bg-terminal-header overflow-hidden">
      <div className="ticker-scroll flex whitespace-nowrap py-1.5">
        {tickerItems.map((card, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-4 font-mono text-xs">
            <span className="text-secondary font-semibold">{card.name}</span>
            <span className="text-foreground">${card.market.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            <span className={card.change >= 0 ? "text-terminal-green" : "text-terminal-red"}>
              {card.change >= 0 ? "▲" : "▼"} {Math.abs(card.change).toFixed(2)}%
            </span>
            <span className="text-border">•</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TickerBar;
