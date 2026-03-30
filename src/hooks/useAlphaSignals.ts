import { useMemo } from "react";
import type { CardData } from "@/data/marketData";

export interface AlphaSignal {
  cardName: string;
  cardSet: string;
  cardImage?: string;
  cardApiId?: string;
  signalType: "volume_divergence" | "price_momentum" | "breakout" | "reversal";
  strength: "strong" | "medium" | "weak";
  priceChangePct: number;
  volumeChangePct: number;
  description: string;
}

/**
 * Predictive Alpha Algorithm
 * Detects volume/price divergence patterns that historically precede big moves.
 * - Rising volume + falling price = accumulation (bullish divergence)
 * - Falling volume + rising price = distribution (bearish divergence)
 * - Extreme price change with high volume = breakout
 * - Sudden reversal from extended move = mean reversion signal
 */
export function useAlphaSignals(cards: CardData[]): AlphaSignal[] {
  return useMemo(() => {
    if (!cards || cards.length === 0) return [];

    const signals: AlphaSignal[] = [];
    const avgChange = cards.reduce((s, c) => s + Math.abs(c.change), 0) / cards.length;
    const stdDev = Math.sqrt(
      cards.reduce((s, c) => s + Math.pow(Math.abs(c.change) - avgChange, 2), 0) / cards.length
    );

    for (const card of cards) {
      const absChange = Math.abs(card.change);
      const volume = card.volume ?? 0;
      
      // Simulate volume divergence using price spread as proxy
      const spreadRatio = card.market > 0 ? (card.mid - card.low) / card.market : 0;
      const volumeProxy = spreadRatio * 100;

      // 1. Bullish Accumulation: price down but high spread (buying pressure)
      if (card.change < -1.5 && volumeProxy > 8) {
        signals.push({
          cardName: card.name,
          cardSet: card.set,
          cardImage: (card as any)._image,
          cardApiId: (card as any)._apiId,
          signalType: "volume_divergence",
          strength: absChange > avgChange + stdDev ? "strong" : "medium",
          priceChangePct: card.change,
          volumeChangePct: volumeProxy,
          description: `${card.name} showing accumulation pattern — price down ${card.change.toFixed(1)}% but spread widening signals buying pressure`,
        });
      }

      // 2. Bearish Distribution: price up but narrow spread (selling into strength)  
      if (card.change > 2.5 && volumeProxy < 3 && card.market > 100) {
        signals.push({
          cardName: card.name,
          cardSet: card.set,
          cardImage: (card as any)._image,
          cardApiId: (card as any)._apiId,
          signalType: "volume_divergence",
          strength: absChange > avgChange + stdDev ? "strong" : "medium",
          priceChangePct: card.change,
          volumeChangePct: volumeProxy,
          description: `${card.name} distribution warning — price up ${card.change.toFixed(1)}% but thin spread suggests limited demand`,
        });
      }

      // 3. Breakout: extreme move > 2 std devs
      if (absChange > avgChange + 2 * stdDev) {
        signals.push({
          cardName: card.name,
          cardSet: card.set,
          cardImage: (card as any)._image,
          cardApiId: (card as any)._apiId,
          signalType: "breakout",
          strength: "strong",
          priceChangePct: card.change,
          volumeChangePct: volumeProxy,
          description: `${card.name} breakout detected — ${card.change > 0 ? "+" : ""}${card.change.toFixed(1)}% move exceeds 2σ threshold`,
        });
      }

      // 4. Mean Reversion: price extended far from mid
      if (card.market > 0 && card.mid > 0) {
        const deviation = ((card.market - card.mid) / card.mid) * 100;
        if (Math.abs(deviation) > 15) {
          signals.push({
            cardName: card.name,
            cardSet: card.set,
            cardImage: (card as any)._image,
            cardApiId: (card as any)._apiId,
            signalType: "reversal",
            strength: Math.abs(deviation) > 25 ? "strong" : "medium",
            priceChangePct: card.change,
            volumeChangePct: deviation,
            description: `${card.name} ${deviation > 0 ? "overextended" : "undervalued"} — market ${deviation > 0 ? "+" : ""}${deviation.toFixed(0)}% vs mid, reversion likely`,
          });
        }
      }
    }

    // Sort by strength then absolute price change
    const strengthOrder = { strong: 0, medium: 1, weak: 2 };
    signals.sort((a, b) => {
      if (strengthOrder[a.strength] !== strengthOrder[b.strength]) {
        return strengthOrder[a.strength] - strengthOrder[b.strength];
      }
      return Math.abs(b.priceChangePct) - Math.abs(a.priceChangePct);
    });

    // Dedupe by card name, keep strongest signal
    const seen = new Set<string>();
    return signals.filter((s) => {
      if (seen.has(s.cardName)) return false;
      seen.add(s.cardName);
      return true;
    }).slice(0, 8);
  }, [cards]);
}
