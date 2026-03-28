import { AlertTriangle } from "lucide-react";
import type { CardData } from "@/data/marketData";

interface MarketUpdateBannerProps {
  cards: CardData[];
}

const MarketUpdateBanner = ({ cards }: MarketUpdateBannerProps) => {
  const now = new Date();
  const monthYear = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Find top 3 gainers
  const gainers = [...cards]
    .filter((c) => c.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 3);

  // Most expensive card
  const topCard = [...cards].sort((a, b) => b.market - a.market)[0];

  if (!topCard) return null;

  return (
    <div className="terminal-card overflow-hidden border-l-2 border-l-secondary">
      <div className="px-4 py-3 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
        <div className="min-w-0">
          <p className="font-mono text-xs font-semibold text-secondary">
            {monthYear} Market Update
          </p>
          <p className="font-mono text-xs text-muted-foreground mt-1 leading-relaxed">
            {topCard.name} leads at ${topCard.market.toLocaleString("en-US", { minimumFractionDigits: 2 })}.
            {gainers.length > 0 && (
              <> Top movers: {gainers.map((g, i) => (
                <span key={i}>
                  {g.name} (+{g.change.toFixed(1)}%){i < gainers.length - 1 ? ", " : ""}
                </span>
              ))}.</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketUpdateBanner;
