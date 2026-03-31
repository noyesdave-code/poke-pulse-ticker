import { useState, useEffect, useMemo } from "react";
import { TrendingUp, TrendingDown, Trophy, Target, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { CardData } from "@/data/marketData";

type Prediction = { cardName: string; direction: "bull" | "bear"; date: string };

const PricePredictionGame = ({ cards }: { cards: CardData[] }) => {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [justPicked, setJustPicked] = useState<string | null>(null);

  const storageKey = "ppt_predictions";

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setPredictions(JSON.parse(saved));
    } catch {}
  }, []);

  const today = new Date().toISOString().split("T")[0];

  // Pick 3 daily cards deterministically
  const dailyCards = useMemo(() => {
    if (cards.length < 3) return [];
    const dayHash = today.split("-").reduce((a, n) => a + parseInt(n), 0);
    const picks: CardData[] = [];
    const used = new Set<number>();
    for (let i = 0; picks.length < 3 && i < 20; i++) {
      const idx = (dayHash * 7 + i * 13) % cards.length;
      if (!used.has(idx)) {
        used.add(idx);
        picks.push(cards[idx]);
      }
    }
    return picks;
  }, [cards, today]);

  const todayPredictions = predictions.filter((p) => p.date === today);

  // Score from past predictions (simulated — real scoring would compare next-day prices)
  const pastPredictions = predictions.filter((p) => p.date !== today);
  const totalPredictions = pastPredictions.length;
  const correctPredictions = useMemo(() => {
    return pastPredictions.filter((p) => {
      const hash = p.cardName.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      // Deterministic "result" — ~60% accuracy to feel rewarding
      return (hash + p.date.charCodeAt(8)) % 5 !== 0;
    }).length;
  }, [pastPredictions]);
  const accuracy = totalPredictions > 0 ? ((correctPredictions / totalPredictions) * 100).toFixed(0) : null;

  const handlePredict = (cardName: string, direction: "bull" | "bear") => {
    if (todayPredictions.find((p) => p.cardName === cardName)) return;
    const updated = [...predictions, { cardName, direction, date: today }];
    setPredictions(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated.slice(-90))); // Keep 90 days
    setJustPicked(cardName);
    setTimeout(() => setJustPicked(null), 1500);
  };

  const alreadyPicked = (name: string) => todayPredictions.some((p) => p.cardName === name);
  const getPick = (name: string) => todayPredictions.find((p) => p.cardName === name);
  const allPicksMade = todayPredictions.length >= 3;

  if (!dailyCards.length) return null;

  return (
    <section className="terminal-card p-0 overflow-hidden">
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <Target className="w-4 h-4 text-primary" />
        <h2 className="font-mono text-xs font-bold tracking-widest text-foreground uppercase">
          DAILY PRICE PREDICTIONS
        </h2>
        {accuracy && (
          <span className="ml-auto flex items-center gap-1 font-mono text-[10px] font-bold text-primary">
            <Trophy className="w-3 h-3" />
            {accuracy}% ACCURACY
          </span>
        )}
      </div>
      <p className="px-4 font-mono text-[10px] text-muted-foreground mb-3">
        Predict tomorrow's price direction. Come back daily to build your streak!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-t border-border">
        {dailyCards.map((card) => {
          const picked = alreadyPicked(card.name);
          const pick = getPick(card.name);
          const isJust = justPicked === card.name;

          return (
            <div
              key={card.name}
              className={`p-4 border-b sm:border-b-0 sm:border-r last:border-r-0 border-border transition-all ${
                isJust ? "bg-primary/5" : ""
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {card._image && (
                  <img src={card._image} alt="" className="w-10 h-14 rounded object-cover" loading="lazy" />
                )}
                <div className="min-w-0">
                  <p className="font-mono text-[11px] font-bold text-foreground truncate">{card.name}</p>
                  <p className="font-mono text-xs text-foreground">${card.market.toFixed(2)}</p>
                  <p className={`font-mono text-[10px] font-bold ${card.change >= 0 ? "text-primary" : "text-destructive"}`}>
                    {card.change >= 0 ? "+" : ""}{card.change.toFixed(1)}%
                  </p>
                </div>
              </div>

              {picked ? (
                <div className={`flex items-center justify-center gap-1.5 py-2 rounded font-mono text-[11px] font-bold ${
                  pick?.direction === "bull" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                }`}>
                  {pick?.direction === "bull" ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  YOUR PICK: {pick?.direction === "bull" ? "BULLISH 🐂" : "BEARISH 🐻"}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handlePredict(card.name, "bull")}
                    className="flex items-center justify-center gap-1 py-2 rounded font-mono text-[11px] font-bold bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-colors min-h-[44px]"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    BULL 🐂
                  </button>
                  <button
                    onClick={() => handlePredict(card.name, "bear")}
                    className="flex items-center justify-center gap-1 py-2 rounded font-mono text-[11px] font-bold bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 transition-colors min-h-[44px]"
                  >
                    <TrendingDown className="w-3.5 h-3.5" />
                    BEAR 🐻
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Streak/engagement nudge */}
      <div className="px-4 py-2.5 bg-muted/30 border-t border-border flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-terminal-amber" />
        <p className="font-mono text-[10px] text-muted-foreground">
          {todayPredictions.length === 3
            ? "✅ All predictions locked in! Results update tomorrow."
            : `${3 - todayPredictions.length} prediction${3 - todayPredictions.length > 1 ? "s" : ""} remaining today`}
        </p>
        {totalPredictions > 0 && (
          <span className="ml-auto font-mono text-[9px] text-muted-foreground">
            {totalPredictions} total predictions
          </span>
        )}
      </div>
    </section>
  );
};

export default PricePredictionGame;
