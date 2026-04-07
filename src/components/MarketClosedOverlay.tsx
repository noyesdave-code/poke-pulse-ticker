import { useState, useEffect } from "react";

function getNextMarketOpen(): Date {
  const now = new Date();
  // Work in ET
  const etStr = now.toLocaleString("en-US", { timeZone: "America/New_York" });
  const et = new Date(etStr);

  // Find next weekday 9:30 AM ET
  let target = new Date(et);
  target.setHours(9, 30, 0, 0);

  // If it's before 9:30 today and it's a weekday, target is today
  if (et < target && et.getDay() >= 1 && et.getDay() <= 5) {
    // already set
  } else {
    // Move to next day
    target.setDate(target.getDate() + 1);
    // Skip weekends
    while (target.getDay() === 0 || target.getDay() === 6) {
      target.setDate(target.getDate() + 1);
    }
  }

  // Convert back: target is in ET-local terms, compute offset from real now
  const diffMs = target.getTime() - et.getTime();
  return new Date(now.getTime() + diffMs);
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "Opening now…";
  const totalSecs = Math.floor(ms / 1000);
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return `${h}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
}

export function useMarketStatus() {
  const now = new Date();
  const etStr = now.toLocaleString("en-US", { timeZone: "America/New_York" });
  const et = new Date(etStr);
  const mins = et.getHours() * 60 + et.getMinutes();
  const isOpen = et.getDay() >= 1 && et.getDay() <= 5 && mins >= 570 && mins <= 990;
  return isOpen;
}

const MarketClosedOverlay = () => {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const update = () => {
      const target = getNextMarketOpen();
      const ms = target.getTime() - Date.now();
      setCountdown(formatCountdown(ms));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-center py-1 pointer-events-none">
      <div className="terminal-card px-4 py-2 border-primary/30 text-center bg-background/90 backdrop-blur-sm shadow-lg">
        <div className="flex items-center gap-2 justify-center">
          <div className="h-2 w-2 rounded-full bg-terminal-amber animate-pulse" />
          <span className="font-mono text-[10px] font-bold text-terminal-amber tracking-widest uppercase">
            Market Closed
          </span>
        </div>
        <p className="font-mono text-[9px] text-muted-foreground mt-0.5">
          NYSE Hours: Mon–Fri 9:30 AM – 4:30 PM ET
        </p>
        <p className="font-mono text-sm font-bold text-primary mt-1 tabular-nums">
          ⏱ Opens in {countdown}
        </p>
      </div>
    </div>
  );
};

export default MarketClosedOverlay;
