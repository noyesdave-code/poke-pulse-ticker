import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

interface IndexDayChartProps {
  title: string;
  indexValue: number;
  indexChange: number;
  variant: "green" | "amber" | "blue";
}

const VARIANT_CONFIG = {
  green: {
    stroke: "hsl(var(--terminal-green))",
    fill: "hsl(var(--terminal-green))",
    label: "RAW 500",
  },
  amber: {
    stroke: "hsl(var(--terminal-amber))",
    fill: "hsl(var(--terminal-amber))",
    label: "GRADED 1000",
  },
  blue: {
    stroke: "hsl(210, 100%, 60%)",
    fill: "hsl(210, 100%, 60%)",
    label: "SEALED 1000",
  },
};

// Wall Street hours: 9:30 AM – 4:00 PM ET (13 half-hour intervals)
function generateIntradayData(baseValue: number, dailyChangePct: number) {
  const intervals: { time: string; value: number }[] = [];
  const startHour = 9;
  const startMin = 30;
  const endHour = 16;
  const endMin = 0;

  // Generate time slots every 15 minutes from 9:30 to 16:00
  const slots: { h: number; m: number }[] = [];
  let h = startHour;
  let m = startMin;
  while (h < endHour || (h === endHour && m <= endMin)) {
    slots.push({ h, m });
    m += 15;
    if (m >= 60) {
      m -= 60;
      h += 1;
    }
  }

  const openValue = baseValue / (1 + dailyChangePct / 100);
  const totalChange = baseValue - openValue;

  // Simulate intraday movement with some noise
  const now = new Date();
  const seed = now.getDate() + now.getMonth() * 31;

  slots.forEach((slot, i) => {
    const progress = i / (slots.length - 1);
    // S-curve progression with noise
    const sCurve = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    const noise = Math.sin(seed * 7.3 + i * 4.1) * 0.003 * openValue;
    const midNoise = Math.cos(seed * 3.7 + i * 2.9) * 0.002 * openValue;

    const value = openValue + totalChange * sCurve + noise + midNoise;

    const timeStr = `${slot.h}:${slot.m.toString().padStart(2, "0")}`;
    const isPM = slot.h >= 12;
    const displayH = slot.h > 12 ? slot.h - 12 : slot.h;
    const label = `${displayH}:${slot.m.toString().padStart(2, "0")} ${isPM ? "PM" : "AM"}`;

    intervals.push({ time: label, value: Math.max(0, value) });
  });

  return { data: intervals, openValue };
}

const IndexDayChart = ({ title, indexValue, indexChange, variant }: IndexDayChartProps) => {
  const config = VARIANT_CONFIG[variant];
  const isUp = indexChange >= 0;

  const { data, openValue } = useMemo(
    () => generateIntradayData(indexValue, indexChange),
    [indexValue, indexChange]
  );

  const minVal = Math.min(...data.map(d => d.value));
  const maxVal = Math.max(...data.map(d => d.value));
  const padding = (maxVal - minVal) * 0.15 || 1;

  return (
    <div className="terminal-card overflow-hidden">
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${
            variant === "green" ? "text-terminal-green" :
            variant === "amber" ? "text-terminal-amber" :
            "text-terminal-blue"
          }`}>
            {title}
          </span>
          <span className="font-mono text-[9px] text-muted-foreground">DAILY</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-foreground">
            ${indexValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`font-mono text-[10px] font-semibold flex items-center gap-0.5 ${isUp ? "text-terminal-green" : "text-terminal-red"}`}>
            {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isUp ? "+" : ""}{indexChange.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="px-2 pt-1 pb-0">
        <div className="flex items-center justify-between px-2">
          <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-wider">
            NYSE Hours • 9:30 AM – 4:00 PM ET
          </span>
          <span className="font-mono text-[8px] text-muted-foreground">
            Open: ${openValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="px-2 pb-3" style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${variant}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={config.fill} stopOpacity={0.25} />
                <stop offset="100%" stopColor={config.fill} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 8, fill: "hsl(215, 15%, 45%)", fontFamily: "JetBrains Mono" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={40}
            />
            <YAxis
              domain={[minVal - padding, maxVal + padding]}
              tick={{ fontSize: 8, fill: "hsl(215, 15%, 45%)", fontFamily: "JetBrains Mono" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0)}`}
              width={48}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 20%, 8%)",
                border: "1px solid hsl(220, 15%, 16%)",
                borderRadius: "6px",
                fontFamily: "JetBrains Mono",
                fontSize: 11,
              }}
              formatter={(value: number) => [`$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, config.label]}
              labelStyle={{ color: "hsl(215, 15%, 55%)", fontSize: 10 }}
            />
            <ReferenceLine
              y={openValue}
              stroke="hsl(215, 15%, 30%)"
              strokeDasharray="4 4"
              strokeWidth={1}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={config.stroke}
              strokeWidth={2}
              fill={`url(#gradient-${variant})`}
              dot={false}
              activeDot={{ r: 3, stroke: config.stroke, strokeWidth: 2, fill: "hsl(220, 20%, 8%)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IndexDayChart;
