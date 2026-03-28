import type { CardData } from "@/data/marketData";

export type Signal = "BUY" | "SELL" | "HOLD";

export interface SignalResult {
  signal: Signal;
  strength: number; // 0-100
  ma30: number;
  momentum: number;
  volatility: "low" | "medium" | "high";
}

/**
 * Deterministic 30-day moving average signal for a card.
 * Uses current price, change %, and a seeded price history simulation
 * to produce consistent Buy/Sell/Hold recommendations.
 */
export function getCardSignal(card: CardData): SignalResult {
  const seed = hashCode(`${card.name}-${card.set}-${card.number}`);

  // Simulate 30-day price history using deterministic noise
  const prices: number[] = [];
  for (let i = 29; i >= 0; i--) {
    const noise = seededRandom(seed + i) * 0.08 - 0.04; // ±4% daily variation
    const trendFactor = 1 - (i * (card.change / 100) / 30); // linear trend toward current
    prices.push(card.market * trendFactor * (1 + noise));
  }
  prices.push(card.market); // today's price

  // Calculate 30-day simple moving average
  const ma30 = prices.reduce((sum, p) => sum + p, 0) / prices.length;

  // Price vs MA ratio — how far price is from the average
  const ratio = card.market / ma30;

  // Momentum: weighted recent change (last 7 vs last 30)
  const recent7 = prices.slice(-7);
  const ma7 = recent7.reduce((s, p) => s + p, 0) / recent7.length;
  const momentum = ((ma7 / ma30) - 1) * 100;

  // Volatility: standard deviation of daily returns
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  const avgReturn = returns.reduce((s, r) => s + r, 0) / returns.length;
  const stdDev = Math.sqrt(returns.reduce((s, r) => s + (r - avgReturn) ** 2, 0) / returns.length);
  const volatility: "low" | "medium" | "high" =
    stdDev < 0.02 ? "low" : stdDev < 0.04 ? "medium" : "high";

  // Signal determination
  let signal: Signal;
  let strength: number;

  if (ratio > 1.02 && momentum > 0.5) {
    // Price above MA and positive momentum → SELL (overvalued, take profit)
    signal = "SELL";
    strength = Math.min(100, Math.round((ratio - 1) * 500 + momentum * 10));
  } else if (ratio < 0.98 && momentum < -0.5) {
    // Price below MA and negative momentum → BUY (undervalued opportunity)
    signal = "BUY";
    strength = Math.min(100, Math.round((1 - ratio) * 500 + Math.abs(momentum) * 10));
  } else {
    // Near MA → HOLD
    signal = "HOLD";
    strength = Math.round(50 - Math.abs(ratio - 1) * 500);
  }

  strength = Math.max(10, Math.min(100, strength));

  return { signal, strength, ma30, momentum, volatility };
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}
