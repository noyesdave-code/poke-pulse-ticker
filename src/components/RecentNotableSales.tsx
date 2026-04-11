import { useMemo, useState } from "react";
import { DollarSign, Clock, Flame, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import type { CardData } from "@/data/marketData";

interface RecentNotableSalesProps {
  cards: CardData[];
}

type SalesWindow = "minute5" | "minute30" | "avg";

type SaleRow = {
  id: string;
  name: string;
  set: string;
  venue: string;
  price: number;
  ageLabel: string;
  bucket: SalesWindow;
};

const TAB_META: { key: SalesWindow; label: string }[] = [
  { key: "minute5", label: "5 min" },
  { key: "minute30", label: "30 min" },
  { key: "avg", label: "Ave" },
];

const VENUES = ["eBay", "TCGPlayer", "CardMarket", "Marketplace", "Auction"];

const RecentNotableSales = ({ cards }: RecentNotableSalesProps) => {
  const [activeTab, setActiveTab] = useState<SalesWindow>("minute5");

  const salesByBucket = useMemo(() => {
    if (!cards.length) {
      return {
        minute5: [] as SaleRow[],
        minute30: [] as SaleRow[],
        avg: [] as SaleRow[],
      };
    }

    const topCards = [...cards].sort((a, b) => b.market - a.market).slice(0, 20);

    const makeSeed = (card: CardData, offset: number) =>
      Math.floor(card.market * 100) + card.name.length * 17 + offset;

    const formatPrice = (value: number) => Math.max(1, Number(value.toFixed(2)));

    const minute5 = topCards.slice(0, 5).map((card, i) => {
      const seed = makeSeed(card, i + 11);
      const venue = VENUES[seed % VENUES.length];
      const multiplier = 1 + ((seed % 11) - 3) / 100;
      return {
        id: `m5-${card.name}-${i}`,
        name: card.name,
        set: card.set,
        venue,
        price: formatPrice(card.market * multiplier),
        ageLabel: `${(seed % 4) + 1}m ago`,
        bucket: "minute5" as const,
      };
    });

    const minute30 = topCards.slice(5, 10).map((card, i) => {
      const seed = makeSeed(card, i + 21);
      const venue = VENUES[seed % VENUES.length];
      const multiplier = 1 + ((seed % 13) - 4) / 100;
      return {
        id: `m30-${card.name}-${i}`,
        name: card.name,
        set: card.set,
        venue,
        price: formatPrice(card.market * multiplier),
        ageLabel: `${(seed % 22) + 8}m ago`,
        bucket: "minute30" as const,
      };
    });

    const avgPool = [...cards].sort((a, b) => b.market - a.market);
    const avg = [
      {
        id: "avg-raw",
        name: "Top 5 Raw Singles Avg",
        set: "Composite",
        venue: "Composite",
        price: formatPrice(
          avgPool.slice(0, 5).reduce((sum, c) => sum + c.market, 0) / Math.max(1, avgPool.slice(0, 5).length)
        ),
        ageLabel: "Rolling avg",
        bucket: "avg" as const,
      },
      {
        id: "avg-graded",
        name: "Top 5 Premium Avg",
        set: "Composite",
        venue: "Composite",
        price: formatPrice(
          avgPool.slice(5, 10).reduce((sum, c) => sum + c.market, 0) / Math.max(1, avgPool.slice(5, 10).length)
        ),
        ageLabel: "Rolling avg",
        bucket: "avg" as const,
      },
      {
        id: "avg-vintage",
        name: "Vintage Leaders Avg",
        set: "Composite",
        venue: "Composite",
        price: formatPrice(
          avgPool.slice(10, 15).reduce((sum, c) => sum + c.market, 0) / Math.max(1, avgPool.slice(10, 15).length)
        ),
        ageLabel: "Rolling avg",
        bucket: "avg" as const,
      },
      {
        id: "avg-modern",
        name: "Modern Leaders Avg",
        set: "Composite",
        venue: "Composite",
        price: formatPrice(
          avgPool.slice(15, 20).reduce((sum, c) => sum + c.market, 0) / Math.max(1, avgPool.slice(15, 20).length)
        ),
        ageLabel: "Rolling avg",
        bucket: "avg" as const,
      },
      {
        id: "avg-market",
        name: "Notable Sales Market Avg",
        set: "Composite",
        venue: "Composite",
        price: formatPrice(
          [...minute5, ...minute30].reduce((sum, row) => sum + row.price, 0) /
            Math.max(1, [...minute5, ...minute30].length)
        ),
        ageLabel: "Rolling avg",
        bucket: "avg" as const,
      },
    ];

    return { minute5, minute30, avg };
  }, [cards]);

  const currentRows = salesByBucket[activeTab];

  if (!cards.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="terminal-card overflow-hidden h-full"
    >
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-wide text-secondary uppercase flex items-center gap-2">
          <Flame className="w-3.5 h-3.5" /> Recent Notable Sales
        </h2>
        <span className="flex items-center gap-1 font-mono text-[9px] text-terminal-green uppercase tracking-wider">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-terminal-green"></span>
          </span>
          Live Feed
        </span>
      </div>

      <div className="border-b border-border bg-muted/20 flex overflow-x-auto">
        {TAB_META.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-2 font-mono text-[10px] font-bold tracking-wide whitespace-nowrap transition-all border-b-2 ${
              activeTab === tab.key
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="divide-y divide-border">
        {currentRows.slice(0, 5).map((sale, i) => (
          <motion.div
            key={sale.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.25 }}
            className="px-4 py-2.5 flex items-center justify-between hover:bg-muted/30 transition-colors group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-7 h-7 rounded bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                {activeTab === "avg" ? (
                  <BarChart3 className="w-3.5 h-3.5 text-primary" />
                ) : (
                  <DollarSign className="w-3.5 h-3.5 text-primary" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs text-foreground font-medium truncate">{sale.name}</p>
                <p className="font-mono text-[9px] text-muted-foreground truncate">
                  {sale.set} • {sale.venue}
                </p>
              </div>
            </div>

            <div className="text-right flex-shrink-0 ml-3">
              <p className="font-mono text-xs font-bold text-foreground">
                $
                {sale.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="font-mono text-[9px] text-muted-foreground flex items-center gap-1 justify-end">
                <Clock className="w-2.5 h-2.5" /> {sale.ageLabel}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentNotableSales;
