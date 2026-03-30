import { useState, useMemo } from "react";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { motion } from "framer-motion";
import type { CardData } from "@/data/marketData";

const generateHistory = (card: CardData) => {
  const days = 200;
  const data = [];
  let price = card.market * 0.75;
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const volatility = (Math.random() - 0.48) * card.market * 0.025;
    price = Math.max(price + volatility, card.market * 0.4);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      price: Math.round(price * 100) / 100,
    });
  }
  data[data.length - 1].price = card.market;
  return data;
};

// Simple Moving Average
const calcSMA = (data: { price: number }[], period: number) => {
  return data.map((_, i) => {
    if (i < period - 1) return null;
    const slice = data.slice(i - period + 1, i + 1);
    return Math.round((slice.reduce((s, d) => s + d.price, 0) / period) * 100) / 100;
  });
};

// RSI (Relative Strength Index)
const calcRSI = (data: { price: number }[], period = 14) => {
  const rsi: (number | null)[] = new Array(data.length).fill(null);
  if (data.length < period + 1) return rsi;

  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < data.length; i++) {
    const change = data[i].price - data[i - 1].price;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? -change : 0);
  }

  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  for (let i = period; i < gains.length; i++) {
    if (i === period) {
      rsi[i + 1] = avgLoss === 0 ? 100 : Math.round((100 - 100 / (1 + avgGain / avgLoss)) * 100) / 100;
    }
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    rsi[i + 1] = avgLoss === 0 ? 100 : Math.round((100 - 100 / (1 + avgGain / avgLoss)) * 100) / 100;
  }
  return rsi;
};

const timeRanges = ["7D", "30D", "90D", "6M"] as const;
type Indicator = "none" | "sma" | "rsi";

interface PriceChartProps {
  cards?: CardData[];
}

const PriceChart = ({ cards }: PriceChartProps) => {
  const displayCards = cards && cards.length > 0 ? cards : [];
  const [selectedCard, setSelectedCard] = useState<CardData | null>(displayCards[0] || null);
  const [range, setRange] = useState<(typeof timeRanges)[number]>("90D");
  const [indicator, setIndicator] = useState<Indicator>("sma");

  useMemo(() => {
    if (displayCards.length > 0 && (!selectedCard || !displayCards.find((c) => c.name === selectedCard.name && c.set === selectedCard.set))) {
      setSelectedCard(displayCards[0]);
    }
  }, [displayCards]);

  if (!selectedCard) return null;

  const history = generateHistory(selectedCard);
  const days = range === "7D" ? 7 : range === "30D" ? 30 : range === "6M" ? 180 : 90;
  const filteredHistory = history.slice(-days - 1);

  const sma20 = calcSMA(history, 20).slice(-days - 1);
  const sma50 = calcSMA(history, 50).slice(-days - 1);
  const rsiValues = calcRSI(history).slice(-days - 1);

  const chartData = filteredHistory.map((d, i) => ({
    ...d,
    sma20: sma20[i],
    sma50: sma50[i],
    rsi: rsiValues[i],
  }));

  const minPrice = Math.min(...filteredHistory.map((d) => d.price));
  const maxPrice = Math.max(...filteredHistory.map((d) => d.price));
  const isUp = selectedCard.change >= 0;
  const strokeColor = isUp ? "hsl(145, 100%, 45%)" : "hsl(0, 90%, 58%)";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="terminal-card overflow-hidden">
      <div className="border-b border-border px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold">Price History</h2>
        <div className="flex items-center gap-3">
          {/* Indicator toggle */}
          <div className="flex items-center gap-1">
            {(["none", "sma", "rsi"] as Indicator[]).map((ind) => (
              <button
                key={ind}
                onClick={() => setIndicator(ind)}
                className={`px-2 py-1 font-mono text-[10px] rounded-md transition-all duration-200 ${
                  indicator === ind
                    ? "bg-terminal-amber/20 text-terminal-amber border border-terminal-amber/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {ind === "none" ? "Price" : ind.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="w-px h-4 bg-border" />
          {/* Time range */}
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
      </div>

      <div className="px-4 py-3 border-b border-border">
        <select
          value={selectedCard.name + selectedCard.set}
          onChange={(e) => {
            const card = displayCards.find((c) => c.name + c.set === e.target.value);
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
            ${selectedCard.market.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className={`font-mono text-sm font-semibold ${isUp ? "text-terminal-green" : "text-terminal-red"}`}>
            {isUp ? "▲" : "▼"} {Math.abs(selectedCard.change).toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Main price chart with SMA overlays */}
      <div className="p-4" style={{ height: indicator === "rsi" ? 240 : 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
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
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)", fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={{ stroke: "hsl(220, 15%, 14%)" }} interval="preserveStartEnd" />
            <YAxis domain={[minPrice * 0.95, maxPrice * 1.05]} tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)", fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={{ stroke: "hsl(220, 15%, 14%)" }} tickFormatter={(v) => `$${v.toFixed(0)}`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 20%, 7%)",
                border: "1px solid hsl(220, 15%, 20%)",
                borderRadius: "8px",
                fontFamily: "JetBrains Mono",
                fontSize: 11,
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
              labelStyle={{ color: "hsl(215, 15%, 60%)" }}
              formatter={(value: number | null, name: string) => {
                if (value === null) return ["-", name];
                if (name === "price") return [`$${value.toFixed(2)}`, "Price"];
                if (name === "sma20") return [`$${value.toFixed(2)}`, "SMA 20"];
                if (name === "sma50") return [`$${value.toFixed(2)}`, "SMA 50"];
                return [`$${value.toFixed(2)}`, name];
              }}
              cursor={{ stroke: "hsl(215, 15%, 30%)", strokeDasharray: "4 4" }}
            />
            <Area type="monotone" dataKey="price" stroke={strokeColor} strokeWidth={2.5} fill={isUp ? "url(#priceGradientUp)" : "url(#priceGradientDown)"} filter="url(#glow)" animationDuration={1200} animationEasing="ease-out" />
            {indicator === "sma" && (
              <>
                <Line type="monotone" dataKey="sma20" stroke="hsl(45, 100%, 60%)" strokeWidth={1.5} dot={false} strokeDasharray="4 2" connectNulls />
                <Line type="monotone" dataKey="sma50" stroke="hsl(280, 80%, 65%)" strokeWidth={1.5} dot={false} strokeDasharray="6 3" connectNulls />
              </>
            )}
            {indicator === "sma" && (
              <Legend
                wrapperStyle={{ fontFamily: "JetBrains Mono", fontSize: 10 }}
                formatter={(value: string) => {
                  if (value === "price") return "Price";
                  if (value === "sma20") return "SMA 20";
                  if (value === "sma50") return "SMA 50";
                  return value;
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* RSI sub-chart */}
      {indicator === "rsi" && (
        <div className="px-4 pb-4" style={{ height: 120 }}>
          <div className="border-t border-border pt-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">RSI (14)</span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 14%)" />
              <XAxis dataKey="date" tick={false} axisLine={{ stroke: "hsl(220, 15%, 14%)" }} />
              <YAxis domain={[0, 100]} ticks={[30, 50, 70]} tick={{ fontSize: 9, fill: "hsl(215, 15%, 55%)", fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={{ stroke: "hsl(220, 15%, 14%)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(220, 20%, 7%)",
                  border: "1px solid hsl(220, 15%, 20%)",
                  borderRadius: "8px",
                  fontFamily: "JetBrains Mono",
                  fontSize: 11,
                }}
                formatter={(value: number | null) => [value !== null ? value.toFixed(1) : "-", "RSI"]}
              />
              {/* Overbought / oversold zones */}
              <Area type="monotone" dataKey={() => 70} stroke="none" fill="hsl(0, 90%, 58%)" fillOpacity={0.05} />
              <Area type="monotone" dataKey={() => 30} stroke="none" fill="hsl(145, 100%, 45%)" fillOpacity={0.05} />
              <Line type="monotone" dataKey="rsi" stroke="hsl(45, 100%, 60%)" strokeWidth={1.5} dot={false} connectNulls />
              {/* Reference lines */}
              <Line type="monotone" dataKey={() => 70} stroke="hsl(0, 90%, 58%)" strokeWidth={0.5} strokeDasharray="4 4" dot={false} />
              <Line type="monotone" dataKey={() => 30} stroke="hsl(145, 100%, 45%)" strokeWidth={0.5} strokeDasharray="4 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Signal summary */}
      {indicator !== "none" && (
        <div className="border-t border-border px-4 py-2.5 flex items-center gap-4">
          {indicator === "sma" && (
            <>
              <span className="font-mono text-[10px] text-muted-foreground">
                SMA 20: <span className="text-[hsl(45,100%,60%)] font-semibold">${chartData[chartData.length - 1]?.sma20?.toFixed(2) ?? "—"}</span>
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                SMA 50: <span className="text-[hsl(280,80%,65%)] font-semibold">${chartData[chartData.length - 1]?.sma50?.toFixed(2) ?? "—"}</span>
              </span>
              {chartData[chartData.length - 1]?.sma20 && chartData[chartData.length - 1]?.sma50 && (
                <span className={`font-mono text-[10px] font-bold ${chartData[chartData.length - 1].sma20! > chartData[chartData.length - 1].sma50! ? "text-terminal-green" : "text-terminal-red"}`}>
                  {chartData[chartData.length - 1].sma20! > chartData[chartData.length - 1].sma50! ? "▲ BULLISH CROSS" : "▼ BEARISH CROSS"}
                </span>
              )}
            </>
          )}
          {indicator === "rsi" && (() => {
            const lastRsi = chartData[chartData.length - 1]?.rsi;
            const label = lastRsi === null || lastRsi === undefined ? "—" : lastRsi > 70 ? "OVERBOUGHT" : lastRsi < 30 ? "OVERSOLD" : "NEUTRAL";
            const color = lastRsi === null || lastRsi === undefined ? "text-muted-foreground" : lastRsi > 70 ? "text-terminal-red" : lastRsi < 30 ? "text-terminal-green" : "text-muted-foreground";
            return (
              <span className={`font-mono text-[10px] font-bold ${color}`}>
                RSI: {lastRsi?.toFixed(1) ?? "—"} — {label}
              </span>
            );
          })()}
        </div>
      )}
    </motion.div>
  );
};

export default PriceChart;
