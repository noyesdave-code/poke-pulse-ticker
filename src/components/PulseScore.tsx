import { useMemo } from "react";
import { Gauge, TrendingUp, Layers, Zap, ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { CardData } from "@/data/marketData";

interface PulseScoreProps {
  cards: CardData[];
}

/** Compute a 0-100 Pulse Score combining liquidity, grade spread, and alpha potential */
function computePulseScore(card: CardData): number {
  // Liquidity: based on price stability (lower change = more liquid), capped contribution 40pts
  const absChange = Math.abs(card.change);
  const liquidity = Math.max(0, 40 - absChange * 4);

  // Grade spread proxy: cards with higher price have more grading upside, capped 30pts
  const gradeSpread = Math.min(30, (card.price / 200) * 30);

  // Alpha potential: bigger positive change = more alpha, capped 30pts
  const alpha = card.change > 0 ? Math.min(30, card.change * 3) : Math.max(0, 15 + card.change * 1.5);

  return Math.round(Math.min(100, Math.max(0, liquidity + gradeSpread + alpha)));
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-terminal-green";
  if (score >= 60) return "text-primary";
  if (score >= 40) return "text-terminal-amber";
  return "text-destructive";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "STRONG BUY";
  if (score >= 60) return "BUY";
  if (score >= 40) return "HOLD";
  return "WATCH";
}

const PulseScore = ({ cards }: PulseScoreProps) => {
  const scored = useMemo(() => {
    return cards
      .map((c) => ({ ...c, pulseScore: computePulseScore(c) }))
      .sort((a, b) => b.pulseScore - a.pulseScore)
      .slice(0, 10);
  }, [cards]);

  const avgScore = useMemo(() => {
    if (scored.length === 0) return 0;
    return Math.round(scored.reduce((s, c) => s + c.pulseScore, 0) / scored.length);
  }, [scored]);

  return (
    <div className="terminal-card p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm font-bold tracking-wide text-secondary uppercase flex items-center gap-2">
          <Gauge className="w-3.5 h-3.5" /> Pulse Score™ — Top 10
        </h3>
        <div className="flex items-center gap-2">
          <a href="/methodology" className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-bold tracking-wider hover:bg-primary/20 transition-colors">
            ✓ VERIFIED BY PGVA
          </a>
          <span className="font-mono text-[10px] text-muted-foreground px-2 py-0.5 rounded bg-muted border border-border">
            AVG: <span className={getScoreColor(avgScore)}>{avgScore}</span>
          </span>
        </div>
      </div>

      <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
        Proprietary 0-100 composite score combining <span className="text-foreground">liquidity</span>, <span className="text-foreground">grade spread</span>, and <span className="text-foreground">alpha potential</span> into a single actionable number.
      </p>

      <div className="space-y-1">
        {scored.map((card, i) => {
          const color = getScoreColor(card.pulseScore);
          const label = getScoreLabel(card.pulseScore);
          return (
            <div key={card.name + i} className="flex items-center gap-3 px-3 py-2 rounded bg-muted/30 hover:bg-muted/50 transition-colors">
              <span className="font-mono text-[10px] text-muted-foreground w-4">{i + 1}</span>
              {card.image && <img src={card.image} alt="" className="w-6 h-8 object-contain rounded-sm" />}
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs text-foreground truncate">{card.name}</p>
                <p className="font-mono text-[9px] text-muted-foreground">{card.set}</p>
              </div>
              <div className="flex items-center gap-1">
                {card.change >= 0 ? (
                  <ArrowUpRight className="w-3 h-3 text-terminal-green" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 text-destructive" />
                )}
                <span className="font-mono text-[10px] text-muted-foreground">{card.change >= 0 ? "+" : ""}{card.change.toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Score bar */}
                <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full ${card.pulseScore >= 80 ? "bg-terminal-green" : card.pulseScore >= 60 ? "bg-primary" : card.pulseScore >= 40 ? "bg-terminal-amber" : "bg-destructive"}`} style={{ width: `${card.pulseScore}%` }} />
                </div>
                <span className={`font-mono text-xs font-bold w-7 text-right ${color}`}>{card.pulseScore}</span>
                <span className={`font-mono text-[8px] font-bold px-1.5 py-0.5 rounded ${color} bg-current/10`} style={{ backgroundColor: "transparent" }}>{label}</span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="font-mono text-[9px] text-muted-foreground/70 text-center">
        Pulse Score™ is proprietary to PGVA Ventures, LLC. Not financial advice. <a href="/methodology" className="text-primary hover:underline">Methodology →</a>
      </p>
    </div>
  );
};

export default PulseScore;
