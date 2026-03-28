import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import type { CardData } from "@/data/marketData";

const timeRanges = ["7D", "30D", "90D", "1Y"] as const;

const generateVolumeData = (card: CardData) => {
  const seed = card.name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const days = 365;
  const data = [];
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const noise = Math.sin(seed + i * 7.3) * 0.5 + 0.5;
    const baseVolume = Math.max(5, Math.floor(card.market > 1000 ? 8 + noise * 20 : 15 + noise * 40));
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      volume: baseVolume,
    });
  }
  return data;
};

interface Props {
  card: CardData;
}

const VolumeChart = ({ card }: Props) => {
  const [range, setRange] = useState<(typeof timeRanges)[number]>("30D");
  const data = useMemo(() => generateVolumeData(card), [card]);

  const filtered = useMemo(() => {
    const days = range === "7D" ? 7 : range === "30D" ? 30 : range === "90D" ? 90 : 365;
    return data.slice(-days);
  }, [data, range]);

  const avgVolume = filtered.reduce((s, d) => s + d.volume, 0) / filtered.length;

  return (
    <div className="terminal-card overflow-hidden">
      <div className="border-b border-border px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold">
            Trading Volume
          </h2>
          <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
            Avg: {avgVolume.toFixed(0)} sales/day
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
      <div className="p-4" style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filtered}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 9, fill: "hsl(215, 15%, 55%)", fontFamily: "JetBrains Mono" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 9, fill: "hsl(215, 15%, 55%)", fontFamily: "JetBrains Mono" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 20%, 8%)",
                border: "1px solid hsl(220, 15%, 16%)",
                borderRadius: "4px",
                fontFamily: "JetBrains Mono",
                fontSize: 11,
              }}
              formatter={(value: number) => [`${value} sales`, "Volume"]}
            />
            <Bar dataKey="volume" fill="hsl(210, 100%, 60%)" fillOpacity={0.7} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VolumeChart;
