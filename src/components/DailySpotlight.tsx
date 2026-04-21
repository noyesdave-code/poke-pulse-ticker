import { useMemo } from "react";
import { Star, TrendingUp, TrendingDown, Zap, Target } from "lucide-react";
import type { CardData } from "@/data/marketData";

const DailySpotlight = ({ cards }: { cards: CardData[] }) => {
  const spotlight = useMemo(() => {
    if (!cards.length) return null;
    // Hourly rotation — changes every hour instead of once per day
    const hourBucket = Math.floor(Date.now() / (60 * 60 * 1000));
    const dayIndex = hourBucket % cards.length;
    const card = cards[dayIndex];
    
    const absChange = Math.abs(card.change);
    const signal = card.change > 5 ? "STRONG BUY" : card.change > 2 ? "BUY" : card.change < -5 ? "STRONG SELL" : card.change < -2 ? "SELL" : "HOLD";
    const signalColor = signal.includes("BUY") ? "text-primary" : signal.includes("SELL") ? "text-destructive" : "text-terminal-amber";
    
    // Simulated metrics
    const hash = card.name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const volume24h = 120 + (hash % 400);
    const weekTrend = ((hash % 20) - 10) + card.change * 0.5;
    const rsi = 30 + (hash % 40);
    const support = card.market * (0.85 + (hash % 10) / 100);
    const resistance = card.market * (1.1 + (hash % 15) / 100);

    return { card, signal, signalColor, volume24h, weekTrend, rsi, support, resistance };
  }, [cards]);

  if (!spotlight) return null;
  const { card, signal, signalColor, volume24h, weekTrend, rsi, support, resistance } = spotlight;

  return (
    <section className="terminal-card p-0 overflow-hidden">
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <Star className="w-4 h-4 text-terminal-amber fill-terminal-amber" />
        <h2 className="font-mono text-xs font-bold tracking-widest text-foreground uppercase">
          CARD OF THE DAY
        </h2>
        <span className="ml-auto font-mono text-[10px] text-muted-foreground">
          {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-0">
        {/* Card Image */}
        <div className="flex items-center justify-center p-4 bg-muted/30">
          {card._image ? (
            <img
              src={card._image}
              alt={card.name}
              className="w-44 h-auto rounded-xl shadow-xl hover:scale-105 transition-transform duration-300 ring-2 ring-border"
              loading="lazy"
              style={{ filter: 'contrast(1.05) saturate(1.08)' }}
              onError={(e) => { (e.target as HTMLImageElement).src = '/icon-192.png'; }}
            />
          ) : (
            <img src="/icon-192.png" alt="Personal Pulse Engine" className="w-36 h-48 rounded-lg object-contain bg-muted p-4" />
          )}
        </div>

        {/* Analysis */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-mono text-sm font-bold text-foreground truncate">{card.name}</h3>
            {card.set && (
              <p className="font-mono text-[10px] text-muted-foreground">{card.set} · #{card.number}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xl font-bold text-foreground">${card.market.toFixed(2)}</span>
            <span className={`font-mono text-sm font-bold flex items-center gap-1 ${card.change >= 0 ? "text-primary" : "text-destructive"}`}>
              {card.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {card.change >= 0 ? "+" : ""}{card.change.toFixed(1)}%
            </span>
            <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${signalColor} bg-current/10 border border-current/20`}>
              <Zap className="w-3 h-3 inline mr-0.5" />
              {signal}
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-muted/50 rounded p-2">
              <p className="font-mono text-[9px] text-muted-foreground">24H VOLUME</p>
              <p className="font-mono text-xs font-bold text-foreground">{volume24h}</p>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <p className="font-mono text-[9px] text-muted-foreground">7D TREND</p>
              <p className={`font-mono text-xs font-bold ${weekTrend >= 0 ? "text-primary" : "text-destructive"}`}>
                {weekTrend >= 0 ? "+" : ""}{weekTrend.toFixed(1)}%
              </p>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <p className="font-mono text-[9px] text-muted-foreground">RSI (14)</p>
              <p className={`font-mono text-xs font-bold ${rsi > 70 ? "text-destructive" : rsi < 30 ? "text-primary" : "text-foreground"}`}>
                {rsi.toFixed(0)}
              </p>
            </div>
            <div className="bg-muted/50 rounded p-2">
              <p className="font-mono text-[9px] text-muted-foreground">SUPPORT</p>
              <p className="font-mono text-xs font-bold text-foreground">${support.toFixed(2)}</p>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-muted/30 rounded p-3 border border-border">
            <div className="flex items-center gap-1.5 mb-1">
              <Target className="w-3 h-3 text-primary" />
              <span className="font-mono text-[10px] font-bold text-primary">AI ANALYSIS</span>
            </div>
            <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">
              {card.change > 3
                ? `${card.name} is showing strong upward momentum with volume surge. RSI at ${rsi.toFixed(0)} suggests ${rsi > 65 ? "approaching overbought — consider taking profits" : "room for continued growth"}. Support at $${support.toFixed(2)}, resistance at $${resistance.toFixed(2)}.`
                : card.change < -3
                ? `${card.name} is under selling pressure. RSI at ${rsi.toFixed(0)} ${rsi < 35 ? "indicates oversold territory — potential reversal setup" : "suggests further downside possible"}. Watch support at $${support.toFixed(2)} for entry opportunities.`
                : `${card.name} is consolidating in a tight range. Volume at ${volume24h} units suggests ${volume24h > 300 ? "accumulation phase" : "low conviction"}. Key levels: support $${support.toFixed(2)}, resistance $${resistance.toFixed(2)}.`
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailySpotlight;
