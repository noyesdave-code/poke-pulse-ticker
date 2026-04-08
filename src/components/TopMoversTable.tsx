import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { CardData } from "@/data/marketData";
import { getCardToken } from "@/lib/tokenSymbols";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Timer, CalendarDays, TrendingUp } from "lucide-react";

interface TopMoversTableProps {
  cards: CardData[];
  title: string;
  isLoading?: boolean;
}

type TimeCategory = "race" | "hour" | "day" | "week";

const TIME_TABS: { key: TimeCategory; label: string; icon: typeof Clock }[] = [
  { key: "race", label: "Last Race", icon: Timer },
  { key: "hour", label: "1 Hour", icon: Clock },
  { key: "day", label: "24 Hours", icon: CalendarDays },
  { key: "week", label: "This Week", icon: TrendingUp },
];

const getTimeMultiplier = (card: CardData, category: TimeCategory): number => {
  const seed = card.name.length + card.market;
  switch (category) {
    case "race":
      return 0.15 + Math.sin(seed * 1.3) * 0.1;
    case "hour":
      return 0.4 + Math.sin(seed * 2.1) * 0.15;
    case "day":
      return 1;
    case "week":
      return 2.5 + Math.sin(seed * 0.7) * 0.8;
  }
};

const getCardsForCategory = (
  cards: CardData[],
  category: TimeCategory
): (CardData & {
  adjustedChange: number;
  adjustedPrice: number;
  prevPrice: number;
  inventory: number;
})[] => {
  return [...cards]
    .map((card) => {
      const mult = getTimeMultiplier(card, category);
      const adjustedChange = card.change * mult;
      const prevPrice = card.market / (1 + adjustedChange / 100);
      const inventory = Math.max(
        1,
        Math.floor(Math.abs(card.change * 7.3 + card.market * 0.04) % 200) + 3
      );
      return {
        ...card,
        adjustedChange,
        adjustedPrice: card.market,
        prevPrice,
        inventory,
      };
    })
    .sort((a, b) => Math.abs(b.adjustedChange) - Math.abs(a.adjustedChange))
    .slice(0, 5);
};

const MiniSparkline = ({ change }: { change: number }) => {
  const isUp = change >= 0;
  const points = [];
  const seed = Math.abs(change * 1000) | 0;

  for (let i = 0; i < 12; i++) {
    const noise = Math.sin(seed + i * 2.5) * 4;
    const trend = isUp ? (i / 11) * 10 : ((11 - i) / 11) * 10;
    points.push(`${i * 4},${18 - trend - noise}`);
  }

  return (
    <svg width="40" height="16" viewBox="0 0 48 20" className="inline-block ml-1 opacity-70">
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={isUp ? "hsl(145, 100%, 45%)" : "hsl(0, 90%, 58%)"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const TopMoversTable = ({ cards, title, isLoading }: TopMoversTableProps) => {
  const [activeTab, setActiveTab] = useState<TimeCategory>("race");

  const sorted = useMemo(() => getCardsForCategory(cards, activeTab), [cards, activeTab]);

  if (isLoading) {
    return (
      <div className="terminal-card overflow-hidden">
        <div className="border-b border-border px-4 py-2.5">
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="p-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2 border-b border-border/50">
              <Skeleton className="w-8 h-11 rounded flex-shrink-0" />
              <Skeleton className="h-3 w-24 flex-1" />
              <Skeleton className="h-3 w-16 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="terminal-card overflow-hidden"
    >
      <div className="border-b border-border/60 px-4 py-2.5 flex items-center justify-between gap-2">
        <h2 className="text-xs font-bold tracking-wide text-secondary uppercase font-display">
          {title}
        </h2>
      </div>

      <div className="flex border-b border-border/40 bg-muted/20 overflow-x-auto">
        {TIME_TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold tracking-wide whitespace-nowrap transition-all border-b-2 ${
              activeTab === key
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-3 h-3" />
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-2 py-1.5 text-left font-mono text-[9px] tracking-widest text-muted-foreground uppercase w-9"></th>
              <th className="px-1.5 py-1.5 text-left font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
                Card
              </th>
              <th className="px-1.5 py-1.5 text-right font-mono text-[9px] tracking-widest text-muted-foreground uppercase hidden sm:table-cell">
                Inv
              </th>
              <th className="px-1.5 py-1.5 text-right font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
                Price
              </th>
              <th className="px-1.5 py-1.5 text-right font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
                % Move
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((card, i) => {
              const priceDelta = card.adjustedPrice - card.prevPrice;
              return (
                <motion.tr
                  key={`${activeTab}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                  className="data-row"
                >
                  <td className="px-2 py-1.5">
                    <div className="w-8 h-11 rounded overflow-hidden bg-muted ring-1 ring-border flex-shrink-0">
                      <img
                        src={card._image || "/icon-192.png"}
                        alt={card.name}
                        className={`w-full h-full ${
                          card._image ? "object-cover" : "object-contain p-1"
                        }`}
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/icon-192.png";
                          (e.target as HTMLImageElement).className =
                            "w-full h-full object-contain p-1";
                        }}
                      />
                    </div>
                  </td>

                  <td className="px-1.5 py-1.5">
                    <span className="font-mono text-[10px] text-primary/70 font-bold tracking-wider block">
                      {getCardToken(card)}
                    </span>
                    <span className="font-mono text-xs text-foreground font-medium block truncate max-w-[120px]">
                      {card.name}
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground">{card.set}</span>
                  </td>

                  <td className="px-1.5 py-1.5 text-right hidden sm:table-cell">
                    <span className="font-mono text-[10px] font-semibold text-foreground">
                      {card.inventory}
                    </span>
                  </td>

                  <td className="px-1.5 py-1.5 text-right">
                    <span className="font-mono text-xs font-bold text-foreground block">
                      ${card.adjustedPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`font-mono text-[9px] ${
                        priceDelta >= 0 ? "text-terminal-green" : "text-terminal-red"
                      }`}
                    >
                      {priceDelta >= 0 ? "+" : ""}$
                      {Math.abs(priceDelta).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </td>

                  <td className="px-1.5 py-1.5 text-right">
                    <span
                      className={`inline-flex items-center gap-0.5 font-mono text-[11px] font-black px-1 py-0.5 rounded ${
                        card.adjustedChange >= 0
                          ? "text-terminal-green bg-terminal-green/10"
                          : "text-terminal-red bg-terminal-red/10"
                      }`}
                    >
                      {card.adjustedChange >= 0 ? "▲" : "▼"}{" "}
                      {Math.abs(card.adjustedChange).toFixed(2)}%
                    </span>
                    <MiniSparkline change={card.adjustedChange} />
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default TopMoversTable;
