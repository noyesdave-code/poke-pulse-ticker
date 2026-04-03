import { useState, useMemo, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Calculator, DollarSign, TrendingUp, ArrowRight, Sparkles, Loader2, Shuffle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLiveCards } from "@/hooks/usePokemonTcg";

const DISPLAY_COUNT = 8;
const ROTATION_MS = 60 * 60 * 1000;

function getRotationIndex(poolSize: number) {
  if (poolSize <= DISPLAY_COUNT) return 0;
  return Math.floor(Date.now() / ROTATION_MS) % Math.ceil(poolSize / DISPLAY_COUNT);
}

function getVisibleCards<T>(cards: T[], rotationIdx: number): T[] {
  if (cards.length === 0) return [];
  const start = (rotationIdx * DISPLAY_COUNT) % cards.length;
  const result: T[] = [];
  for (let i = 0; i < Math.min(DISPLAY_COUNT, cards.length); i++) {
    result.push(cards[(start + i) % cards.length]);
  }
  return result;
}

const QuickValueCalculator = () => {
  const navigate = useNavigate();
  const { data: liveCards, isLoading } = useLiveCards();

  const pool = useMemo(() => {
    if (!liveCards || liveCards.length === 0) return [];
    return liveCards.slice(0, 500).map((c) => ({
      name: `${c.name} (${c.set})`,
      price: c.market,
      image: c._image || "",
    }));
  }, [liveCards]);

  const [rotationIdx, setRotationIdx] = useState(() => getRotationIndex(pool.length));
  const [selected, setSelected] = useState<Set<number>>(new Set());

  useEffect(() => {
    setRotationIdx(getRotationIndex(pool.length));
  }, [pool.length]);

  const visibleCards = useMemo(() => getVisibleCards(pool, rotationIdx), [pool, rotationIdx]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newIdx = getRotationIndex(pool.length);
      if (newIdx !== rotationIdx) {
        setRotationIdx(newIdx);
        setSelected(new Set());
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [rotationIdx, pool.length]);

  const totalValue = useMemo(
    () => Array.from(selected).reduce((sum, idx) => sum + (visibleCards[idx]?.price ?? 0), 0),
    [selected, visibleCards]
  );

  const toggle = (idx: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="terminal-card overflow-hidden"
    >
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-wide text-foreground uppercase flex items-center gap-2">
          <Calculator className="w-3.5 h-3.5 text-primary" />
          Quick Collection Value Check
        </h3>
        <span className="font-mono text-[9px] text-muted-foreground tracking-wider">
          {pool.length > 0 ? `${pool.length} CARDS · TAP TO SELECT` : "TAP TO SELECT"}
        </span>
      </div>

      <div className="p-4 space-y-3">
        <p className="font-mono text-xs text-muted-foreground">
          Own any of these? Tap to see what they're worth right now:
        </p>

        {isLoading && pool.length === 0 ? (
          <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="font-mono text-xs">Loading live prices…</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {visibleCards.map((card, idx) => (
              <button
                key={`${card.name}-${idx}`}
                onClick={() => toggle(idx)}
                className={`flex items-center gap-2.5 text-left px-2.5 py-2 rounded-lg border font-mono text-xs transition-all min-h-[56px] ${
                  selected.has(idx)
                    ? "border-primary/50 bg-primary/10 text-foreground"
                    : "border-border bg-muted/20 text-muted-foreground hover:border-muted-foreground/30"
                }`}
              >
                {card.image && (
                  <img
                    src={card.image}
                    alt={card.name}
                    loading="lazy"
                    className="w-9 h-12 object-contain rounded flex-shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <span className="block font-medium truncate text-[11px]">{card.name}</span>
                  <span className={`block text-[10px] mt-0.5 ${selected.has(idx) ? "text-primary" : ""}`}>
                    ${card.price.toFixed(2)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        <motion.div
          initial={false}
          animate={{ height: totalValue > 0 ? "auto" : 0, opacity: totalValue > 0 ? 1 : 0 }}
          className="overflow-hidden"
        >
          <div className="mt-2 p-3 rounded-lg border border-primary/30 bg-primary/5 flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Your Collection Value</p>
              <p className="font-mono text-xl font-bold text-primary flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {totalValue.toFixed(2)}
              </p>
              <p className="font-mono text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3 text-primary" />
                Track daily changes free with a portfolio
              </p>
            </div>
            <button
              onClick={() => navigate("/portfolio")}
              className="group flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-mono text-[11px] font-bold bg-primary text-primary-foreground hover:shadow-[0_0_20px_hsl(160_84%_50%/0.3)] transition-all min-h-[44px]"
            >
              <Sparkles className="w-3 h-3" />
              Track Mine
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>

        {totalValue === 0 && !isLoading && (
          <p className="font-mono text-[10px] text-center text-muted-foreground/60 mt-1">
            Select cards you own to see their combined value
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default QuickValueCalculator;
