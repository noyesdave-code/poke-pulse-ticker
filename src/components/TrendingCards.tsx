import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { CardData } from "@/data/marketData";

interface TrendingCardsProps {
  cards: CardData[];
}

const TrendingCards = ({ cards }: TrendingCardsProps) => {
  const navigate = useNavigate();
  const trending = [...cards].sort((a, b) => b.market - a.market).slice(0, 6);

  return (
    <div className="terminal-card overflow-hidden">
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h2 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold">
          Trending Cards
        </h2>
        <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
          Updated Live
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {trending.map((card, i) => {
          const isUp = card.change >= 0;
          const slug = `${card.name}-${card.set}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          return (
            <button
              key={i}
              onClick={() => navigate(`/card/${slug}`)}
              className="flex flex-col p-3 border-b border-r border-border hover:bg-muted/50 transition-colors text-left group last:border-r-0"
            >
              {/* Card image */}
              {card.image ? (
                <div className="w-full aspect-[2.5/3.5] rounded overflow-hidden mb-2 bg-muted">
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[2.5/3.5] rounded bg-muted flex items-center justify-center mb-2">
                  <span className="font-mono text-[9px] text-muted-foreground">No Image</span>
                </div>
              )}

              {/* Card info */}
              <span className="font-mono text-[10px] text-muted-foreground truncate w-full">
                {card.setCode && `(${card.setCode}) `}{card.set}
              </span>
              <span className="font-mono text-xs font-semibold text-foreground truncate w-full mt-0.5">
                {card.name}
              </span>

              {/* Price */}
              <div className="flex items-center justify-between w-full mt-1.5">
                <span className="font-mono text-sm font-bold text-foreground">
                  ${card.market.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span
                  className={`font-mono text-[10px] font-semibold flex items-center gap-0.5 ${
                    isUp ? "text-terminal-green" : "text-terminal-red"
                  }`}
                >
                  {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {isUp ? "+" : ""}{card.change.toFixed(1)}%
                </span>
              </div>

              {/* Graded estimates */}
              <div className="mt-2 space-y-0.5">
                <div className="flex justify-between">
                  <span className="font-mono text-[9px] text-muted-foreground">PSA 10</span>
                  <span className="font-mono text-[9px] text-foreground">
                    ~${(card.market * 3.5).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-[9px] text-muted-foreground">PSA 9</span>
                  <span className="font-mono text-[9px] text-foreground">
                    ~${(card.market * 2).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingCards;
