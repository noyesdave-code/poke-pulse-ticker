import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import type { CardData } from "@/data/marketData";
import { rawCards } from "@/data/marketData";

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
  // Ensure last point matches current market
  data[data.length - 1].price = card.market;
  return data;
};

const timeRanges = ["7D", "30D", "90D"] as const;

const PriceChart = () => {
  const [selectedCard, setSelectedCard] = useState(rawCards[0]);
  const [range, setRange] = useState<typeof timeRanges[number]>("90D");

  const history = useMemo(() => generateHistory(selectedCard), [selectedCard]);

  const filteredHistory = useMemo(() => {
    const days = range === "7D" ? 7 : range === "30D" ? 30 : 90;
    return history.slice(-days - 1);
  }, [history, range]);

  const minPrice = Math.min(...filteredHistory.map(d => d.price));
  const maxPrice = Math.max(...filteredHistory.map(d => d.price));

  return (
    <div className="terminal-card overflow-hidden">
      <div className="border-b border-border px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold">
          Price History
        </h2>
        <div className="flex items-center gap-2">
          {timeRanges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2 py-1 font-mono text-[10px] rounded transition-colors ${
                range === r
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
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
            const card = rawCards.find(c => c.name + c.set === e.target.value);
            if (card) setSelectedCard(card);
          }}
          className="rounded border border-border bg-muted px-2 py-1.5 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {rawCards.map((c, i) => (
            <option key={i} value={c.name + c.set}>
              {c.name} — {c.set}
            </option>
          ))}
        </select>
        <div className="mt-2 flex items-baseline gap-3">
          <span className="font-mono text-xl font-bold text-foreground">
            ${selectedCard.market.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
          <span className={`font-mono text-sm font-semibold ${selectedCard.change >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
            {selectedCard.change >= 0 ? "▲" : "▼"} {Math.abs(selectedCard.change).toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="p-4" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredHistory}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(145, 100%, 41%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(145, 100%, 41%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)', fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(220, 15%, 16%)' }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minPrice * 0.95, maxPrice * 1.05]}
              tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)', fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(220, 15%, 16%)' }}
              tickFormatter={(v) => `$${v.toFixed(0)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(220, 20%, 8%)',
                border: '1px solid hsl(220, 15%, 16%)',
                borderRadius: '4px',
                fontFamily: 'JetBrains Mono',
                fontSize: 12,
              }}
              labelStyle={{ color: 'hsl(215, 15%, 55%)' }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="hsl(145, 100%, 41%)"
              strokeWidth={2}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
