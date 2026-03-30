import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import type { CardData } from "@/data/marketData";

interface VolumeConfidenceProps {
  card: CardData;
}

/** Shows a confidence level based on trading volume — low volume = unreliable pricing */
const VolumeConfidence = ({ card }: VolumeConfidenceProps) => {
  const volume = (card as any).volume ?? 0;
  const level = volume >= 30 ? "high" : volume >= 10 ? "medium" : "low";
  const config = {
    high: { label: "HIGH CONFIDENCE", color: "text-terminal-green", bg: "bg-terminal-green/10 border-terminal-green/20" },
    medium: { label: "MEDIUM CONFIDENCE", color: "text-terminal-amber", bg: "bg-terminal-amber/10 border-terminal-amber/20" },
    low: { label: "LOW CONFIDENCE", color: "text-terminal-red", bg: "bg-terminal-red/10 border-terminal-red/20" },
  };
  const c = config[level];

  return (
    <span className={`inline-flex items-center gap-1 font-mono text-[8px] px-1.5 py-0.5 rounded border ${c.bg} ${c.color} font-bold tracking-wider`}>
      <BarChart3 className="w-2.5 h-2.5" />
      {c.label}
    </span>
  );
};

export default VolumeConfidence;

/** Seasonality indicator based on month */
export function getSeasonalTrend(): { label: string; direction: "up" | "down" | "neutral"; description: string } {
  const month = new Date().getMonth(); // 0-11
  // Q4 (Oct-Dec) = historically bullish for TCG market
  // Q1 (Jan-Mar) = post-holiday correction
  // Q2-Q3 = neutral/accumulation
  if (month >= 9 && month <= 11) {
    return { label: "Q4 BULLISH", direction: "up", description: "Holiday demand historically drives prices up 15-25% in Q4" };
  }
  if (month >= 0 && month <= 2) {
    return { label: "Q1 CORRECTION", direction: "down", description: "Post-holiday sell-off typically causes 5-10% price retracement in Q1" };
  }
  return { label: "ACCUMULATION", direction: "neutral", description: "Mid-year accumulation phase — prices consolidate before Q4 rally" };
}

/** Grade Spread Tracker — shows PSA 10 vs PSA 9 price ratio */
export function getGradeSpread(marketPrice: number): { ratio: string; spread: string; signal: string } {
  // PSA 10 ~3.5x raw, PSA 9 ~2x raw — spread = 10/9 ratio
  const psa10 = marketPrice * 3.5;
  const psa9 = marketPrice * 2;
  const ratio = psa10 / psa9;
  const spread = ((ratio - 1) * 100).toFixed(0);
  const signal = ratio > 2 ? "Wide spread — grading arbitrage opportunity" : ratio > 1.5 ? "Normal spread" : "Compressed — avoid grading";
  return { ratio: ratio.toFixed(2), spread: `${spread}%`, signal };
}
