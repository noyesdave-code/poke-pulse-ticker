import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import type { CardData } from "@/data/marketData";

// Generate mock historical data for a card
const generateHistory = (card: CardData) => {
  const days = 90;
  const data = [];
  let price = card.market * 0.85;
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const volatility = (Math.random() - 0.48) * card.market * 0.03;
    price = Math.max(price + volatility, card.market * 0.5);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: Math.round(price * 100) / 100,
    });
  }
  data[data.length - 1].price = card.market;
  return data;
};

const timeRanges = ["7D", "30D", "90D"] as const;

interface PriceChartProps {
  cards?: CardData[];
}

const PriceChart = ({ cards }: PriceChartProps) => {
  const displayCards = cards && cards.length > 0 ? cards : [];
  const [selectedCard, setSelectedCard] = useState<CardData | null>(displayCards[0] || null);
  const [range, setRange] = useState<typeof timeRanges[number]>("90D");

  useMemo(() => {
    if (displayCards.length > 0 && (!selectedCard || !displayCards.find(c => c.name === selectedCard.name && c.set === selectedCard.set))) {
      setSelectedCard(displayCards[0]);
    }
  }, [displayCards]);

  if (!selectedCard) return null;

  const history = generateHistory(selectedCard);
  const filteredHistory = (() => {
    const days = range === "7D" ? 7 : range === "30D" ? 30 : 90;
    return history.slice(-days - 1);
  })();

  const minPrice = Math.min(...filteredHistory.map(d => d.price));
  const maxPrice = Math.max(...filteredHistory.map(d => d.price));
  const isUp = selectedCard.change >= 0;
  const strokeColor = isUp ? "hsl(145, 100%, 45%)" : "hsl(0, 90%, 58%)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="terminal-card overflow-hidden"
    >
      <div className="border-b border-border px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold">
          Price History
        </h2>
        <div className="flex items-center gap-1">
          {timeRanges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 font-mono text-[10px] rounded-md transition-all duration-200 ${
                range === r
                  ? "bg-primary text-primary-foreground shadow-[0_0_10px_hsl(145_100%_45%/0.2)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 border-b border-border">
        <select
          value={selectedCard.name + selectedCard.set}
          onChange={(e) => {
            const card = displayCards.find(c => c.name + c.set === e.target.value);
            if (card) setSelectedCard(card);
          }}
          className="rounded-md border border-border bg-muted px-3 py-2 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
        >
          {displayCards.map((c, i) => (
            <option key={i} value={c.name + c.set}>
              {c.name} — {c.set}
            </option>
          ))}
        </select>
        <div className="mt-2 flex items-baseline gap-3">
          <span className="font-mono text-2xl font-bold text-foreground">
            ${selectedCard.market.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
          <span className={`font-mono text-sm font-semibold ${isUp ? "text-terminal-green" : "text-terminal-red"}`}>
            {isUp ? "▲" : "▼"} {Math.abs(selectedCard.change).toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="p-4" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredHistory}>
            <defs>
              <linearGradient id="priceGradientUp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(145, 100%, 45%)" stopOpacity={0.35} />
                <stop offset="50%" stopColor="hsl(145, 100%, 45%)" stopOpacity={0.1} />
                <stop offset="100%" stopColor="hsl(145, 100%, 45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="priceGradientDown" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0, 90%, 58%)" stopOpacity={0.35} />
                <stop offset="50%" stopColor="hsl(0, 90%, 58%)" stopOpacity={0.1} />
                <stop offset="100%" stopColor="hsl(0, 90%, 58%)" stopOpacity={0} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 14%)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)', fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(220, 15%, 14%)' }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minPrice * 0.95, maxPrice * 1.05]}
              tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)', fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(220, 15%, 14%)' }}
              tickFormatter={(v) => `$${v.toFixed(0)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(220, 20%, 7%)',
                border: '1px solid hsl(220, 15%, 20%)',
                borderRadius: '8px',
                fontFamily: 'JetBrains Mono',
                fontSize: 12,
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}
              labelStyle={{ color: 'hsl(215, 15%, 60%)' }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
              cursor={{ stroke: 'hsl(215, 15%, 30%)', strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={strokeColor}
              strokeWidth={2.5}
              fill={isUp ? "url(#priceGradientUp)" : "url(#priceGradientDown)"}
              filter="url(#glow)"
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default PriceChart;
