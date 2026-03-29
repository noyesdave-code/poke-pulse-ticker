import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import type { CardData } from "@/data/marketData";
import { getCardSignal } from "@/hooks/useSignalIndicator";
import { getCardToken } from "@/lib/tokenSymbols";
import SignalBadge from "@/components/SignalBadge";

interface TrendingCardsProps {
  cards: CardData[];
}

const TrendingCards = ({ cards }: TrendingCardsProps) => {
  const navigate = useNavigate();
  const trending = [...cards].sort((a, b) => b.market - a.market).slice(0, 6);

  return (
    <div className="terminal-card overflow-hidden">
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-wide text-secondary uppercase">
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
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/card/${slug}`)}
              className="flex flex-col p-3 border-b border-r border-border hover:bg-muted/50 transition-colors text-left group last:border-r-0 relative overflow-hidden"
            >
              {/* Shimmer overlay on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />

              {/* Card image */}
              {card._image ? (
                <div className="w-full aspect-[2.5/3.5] rounded-md overflow-hidden mb-2 bg-muted ring-1 ring-border group-hover:ring-primary/30 transition-all duration-300">
                  <img
                    src={card._image}
                    alt={card.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[2.5/3.5] rounded-md bg-muted flex items-center justify-center mb-2 ring-1 ring-border">
                  <span className="font-mono text-[9px] text-muted-foreground">No Image</span>
                </div>
              )}

              {/* Token + Card info */}
              <span className="font-mono text-[9px] text-primary/70 font-bold tracking-wider">
                {getCardToken(card)}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground truncate w-full">
                {card.setCode && `(${card.setCode}) `}{card.set}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-mono text-xs font-semibold text-foreground truncate">
                  {card.name}
                </span>
                <SignalBadge result={getCardSignal(card)} />
              </div>

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
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingCards;
