import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { Signal, SignalResult } from "@/hooks/useSignalIndicator";

interface SignalBadgeProps {
  result: SignalResult;
  size?: "sm" | "md";
  showDetails?: boolean;
}

const config: Record<Signal, { icon: typeof TrendingUp; label: string; classes: string; bg: string }> = {
  BUY: {
    icon: TrendingUp,
    label: "BUY",
    classes: "text-terminal-green",
    bg: "bg-terminal-green/15 border-terminal-green/30",
  },
  SELL: {
    icon: TrendingDown,
    label: "SELL",
    classes: "text-terminal-red",
    bg: "bg-terminal-red/15 border-terminal-red/30",
  },
  HOLD: {
    icon: Minus,
    label: "HOLD",
    classes: "text-terminal-amber",
    bg: "bg-terminal-amber/15 border-terminal-amber/30",
  },
};

const SignalBadge = ({ result, size = "sm", showDetails = false }: SignalBadgeProps) => {
  const { signal, strength, ma30, momentum, volatility } = result;
  const { icon: Icon, label, classes, bg } = config[signal];

  if (size === "sm") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border font-mono text-[9px] font-bold tracking-wider ${bg} ${classes}`}
        title={`${label} signal — Strength: ${strength}%`}
      >
        <Icon className="w-2.5 h-2.5" />
        {label}
      </span>
    );
  }

  return (
    <div className={`rounded-lg border p-3 ${bg}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${bg}`}>
          <Icon className={`w-4 h-4 ${classes}`} />
        </div>
        <div>
          <span className={`font-mono text-sm font-bold tracking-wider ${classes}`}>{label}</span>
          <span className="font-mono text-[10px] text-muted-foreground ml-2">
            {strength}% strength
          </span>
        </div>
      </div>
      {showDetails && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="text-center">
            <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">30D MA</p>
            <p className="font-mono text-xs font-semibold text-foreground">
              ${ma30.toLocaleString("en-US", { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-center">
            <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">Momentum</p>
            <p className={`font-mono text-xs font-semibold ${momentum >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
              {momentum >= 0 ? "+" : ""}{momentum.toFixed(2)}%
            </p>
          </div>
          <div className="text-center">
            <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">Volatility</p>
            <p className={`font-mono text-xs font-semibold ${
              volatility === "low" ? "text-terminal-green" :
              volatility === "medium" ? "text-terminal-amber" : "text-terminal-red"
            }`}>
              {volatility.toUpperCase()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignalBadge;
