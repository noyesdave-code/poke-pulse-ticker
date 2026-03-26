import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { CardData } from "@/data/marketData";

const timeRanges = ["7D", "30D", "90D", "1Y", "ALL"] as const;

const generateFullHistory = (card: CardData) => {
  const days = 365;
  const data = [];
  let price = card.market * 0.6;
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const volatility = (Math.random() - 0.47) * card.market * 0.025;
    price = Math.max(price + volatility, card.market * 0.3);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: i > 90 ? "2-digit" : undefined }),
      price: Math.round(price * 100) / 100,
      volume: Math.floor(Math.random() * 50) + 1,
    });
  }
  data[data.length - 1].price = card.market;
  return data;
};

interface Props {
  card: CardData;
}

const CardPriceHistory = ({ card }: Props) => {
  const [range, setRange] = useState<(typeof timeRanges)[number]>("90D");
  const history = useMemo(() => generateFullHistory(card), [card]);

  const filtered = useMemo(() => {
    const days = range === "7D" ? 7 : range === "30D" ? 30 : range === "90D" ? 90 : range === "1Y" ? 365 : history.length;
    return history.slice(-days - 1);
  }, [history, range]);

  const minP = Math.min(...filtered.map((d) => d.price));
  const maxP = Math.max(...filtered.map((d) => d.price));
  const priceChange = filtered.length > 1 ? filtered[filtered.length - 1].price - filtered[0].price : 0;
  const isPositive = priceChange >= 0;
  const strokeColor = isPositive ? "hsl(145, 100%, 41%)" : "hsl(0, 85%, 55%)";

  return (
    <div className="terminal-card overflow-hidden">
      <div className="border-b border-border px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold">
            Price History
          </h2>
          <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
            {range} change:{" "}
            <span className={isPositive ? "text-terminal-green" : "text-terminal-red"}>
              {isPositive ? "+" : ""}${Math.abs(priceChange).toFixed(2)} ({((priceChange / (filtered[0]?.price || 1)) * 100).toFixed(2)}%)
            </span>
          </p>
        </div>
        <div className="flex items-center gap-1">
          {timeRanges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2 py-1 font-mono text-[10px] rounded transition-colors ${
                range === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4" style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filtered}>
            <defs>
              <linearGradient id="detailGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)", fontFamily: "JetBrains Mono" }}
              tickLine={false}
              axisLine={{ stroke: "hsl(220, 15%, 16%)" }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minP * 0.95, maxP * 1.05]}
              tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)", fontFamily: "JetBrains Mono" }}
              tickLine={false}
              axisLine={{ stroke: "hsl(220, 15%, 16%)" }}
              tickFormatter={(v) => `$${v.toFixed(0)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 20%, 8%)",
                border: "1px solid hsl(220, 15%, 16%)",
                borderRadius: "4px",
                fontFamily: "JetBrains Mono",
                fontSize: 12,
              }}
              labelStyle={{ color: "hsl(215, 15%, 55%)" }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
            />
            <Area type="monotone" dataKey="price" stroke={strokeColor} strokeWidth={2} fill="url(#detailGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CardPriceHistory;
