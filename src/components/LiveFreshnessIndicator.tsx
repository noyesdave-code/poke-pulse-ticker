import { useState, useEffect } from "react";
import { Wifi, WifiOff, Clock } from "lucide-react";

interface LiveFreshnessProps {
  lastUpdated?: number;
  isLive: boolean;
  compact?: boolean;
}

const LiveFreshnessIndicator = ({ lastUpdated, isLive, compact }: LiveFreshnessProps) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(interval);
  }, []);

  const age = lastUpdated ? Math.floor((now - lastUpdated) / 1000) : null;

  const getStatus = () => {
    if (!isLive) return { label: "OFFLINE", color: "text-destructive", dot: "bg-destructive", icon: WifiOff };
    if (age === null) return { label: "CONNECTING", color: "text-terminal-amber", dot: "bg-terminal-amber animate-pulse", icon: Clock };
    if (age < 120) return { label: "REAL-TIME", color: "text-primary", dot: "bg-primary animate-pulse", icon: Wifi };
    if (age < 600) return { label: "RECENT", color: "text-terminal-amber", dot: "bg-terminal-amber", icon: Wifi };
    return { label: "STALE", color: "text-destructive", dot: "bg-destructive", icon: WifiOff };
  };

  const status = getStatus();
  const Icon = status.icon;

  const formatAge = (s: number) => {
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    return `${Math.floor(s / 3600)}h ago`;
  };

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 font-mono text-[9px] ${status.color}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
        {status.label}
        {age !== null && <span className="text-muted-foreground">· {formatAge(age)}</span>}
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border border-border/50 bg-muted/20 ${status.color}`}>
      <Icon className="w-3 h-3" />
      <span className="font-mono text-[10px] font-bold">{status.label}</span>
      {age !== null && (
        <span className="font-mono text-[9px] text-muted-foreground">
          {formatAge(age)}
        </span>
      )}
    </div>
  );
};

export default LiveFreshnessIndicator;
