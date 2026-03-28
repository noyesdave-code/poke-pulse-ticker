import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { motion } from "framer-motion";
import { Activity, TrendingUp, TrendingDown, Gauge, Zap } from "lucide-react";
import type { CardData } from "@/data/marketData";
import { getCardSignal } from "@/hooks/useSignalIndicator";
import SignalBadge from "@/components/SignalBadge";

interface Props {
  card: CardData;
}

const CardSignalBreakdown = ({ card }: Props) => {
  const result = useMemo(() => getCardSignal(card), [card]);
  const { signal, strength, ma30, momentum, volatility } = result;

  const priceVsMa = ((card.market / ma30 - 1) * 100);

  const factors = [
    { name: "Price vs MA30", value: Math.abs(priceVsMa), color: priceVsMa >= 0 ? "hsl(145, 100%, 45%)" : "hsl(0, 90%, 58%)" },
    { name: "Momentum", value: Math.min(Math.abs(momentum) * 10, 100), color: momentum >= 0 ? "hsl(145, 100%, 45%)" : "hsl(0, 90%, 58%)" },
    { name: "Strength", value: strength, color: signal === "BUY" ? "hsl(145, 100%, 45%)" : signal === "SELL" ? "hsl(0, 90%, 58%)" : "hsl(40, 100%, 55%)" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="terminal-card overflow-hidden"
    >
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h2 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold flex items-center gap-2">
          <Activity className="w-3.5 h-3.5" /> AI Signal Analysis
        </h2>
        <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
          30-Day Moving Average
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Main signal badge */}
        <SignalBadge result={result} size="md" showDetails />

        {/* Factor breakdown chart */}
        <div>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
            Signal Factor Breakdown
          </p>
          <div style={{ height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={factors} layout="vertical" margin={{ left: 80, right: 20 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)", fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "hsl(215, 15%, 75%)", fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false} width={75} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(220, 20%, 8%)", border: "1px solid hsl(220, 15%, 16%)", borderRadius: "4px", fontFamily: "JetBrains Mono", fontSize: 11 }}
                  labelStyle={{ color: "hsl(215, 15%, 55%)" }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, "Score"]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14}>
                  {factors.map((f, i) => (
                    <Cell key={i} fill={f.color} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detail metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border">
          <div className="text-center p-2 rounded-md bg-muted/50">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Gauge className="w-3 h-3 text-muted-foreground" />
              <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">MA30 Price</p>
            </div>
            <p className="font-mono text-sm font-semibold text-foreground">
              ${ma30.toLocaleString("en-US", { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-center p-2 rounded-md bg-muted/50">
            <div className="flex items-center justify-center gap-1 mb-1">
              {priceVsMa >= 0 ? <TrendingUp className="w-3 h-3 text-terminal-green" /> : <TrendingDown className="w-3 h-3 text-terminal-red" />}
              <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">Price vs MA</p>
            </div>
            <p className={`font-mono text-sm font-semibold ${priceVsMa >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
              {priceVsMa >= 0 ? "+" : ""}{priceVsMa.toFixed(2)}%
            </p>
          </div>
          <div className="text-center p-2 rounded-md bg-muted/50">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="w-3 h-3 text-muted-foreground" />
              <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">Momentum</p>
            </div>
            <p className={`font-mono text-sm font-semibold ${momentum >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
              {momentum >= 0 ? "+" : ""}{momentum.toFixed(2)}%
            </p>
          </div>
          <div className="text-center p-2 rounded-md bg-muted/50">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Activity className="w-3 h-3 text-muted-foreground" />
              <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">Volatility</p>
            </div>
            <p className={`font-mono text-sm font-semibold ${
              volatility === "low" ? "text-terminal-green" :
              volatility === "medium" ? "text-terminal-amber" : "text-terminal-red"
            }`}>
              {volatility.toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CardSignalBreakdown;
