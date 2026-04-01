import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, DollarSign, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const POPULAR_CARDS = [
  { name: "Charizard ex (OBF)", price: 42.50, image: "https://images.pokemontcg.io/sv3/223_hires.png" },
  { name: "Pikachu VMAX (VV)", price: 28.75, image: "https://images.pokemontcg.io/swsh4/188_hires.png" },
  { name: "Mew ex (151)", price: 19.80, image: "https://images.pokemontcg.io/sv3pt5/151_hires.png" },
  { name: "Umbreon VMAX Alt (ES)", price: 185.00, image: "https://images.pokemontcg.io/swsh7/215_hires.png" },
  { name: "Lugia V Alt (SIT)", price: 78.50, image: "https://images.pokemontcg.io/swsh12pt5/186_hires.png" },
  { name: "Giratina V Alt (LOR)", price: 62.30, image: "https://images.pokemontcg.io/swsh11/186_hires.png" },
  { name: "Moonbreon (EVS)", price: 220.00, image: "https://images.pokemontcg.io/swsh7/214_hires.png" },
  { name: "Charizard UPC (promo)", price: 95.00, image: "https://images.pokemontcg.io/swsh12pt5gg/GG70_hires.png" },
];

const QuickValueCalculator = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const totalValue = useMemo(
    () => Array.from(selected).reduce((sum, idx) => sum + POPULAR_CARDS[idx].price, 0),
    [selected]
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
        <span className="font-mono text-[9px] text-muted-foreground tracking-wider">TAP TO SELECT</span>
      </div>

      <div className="p-4 space-y-3">
        <p className="font-mono text-xs text-muted-foreground">
          Own any of these? Tap to see what they're worth right now:
        </p>

        <div className="grid grid-cols-2 gap-2">
          {POPULAR_CARDS.map((card, idx) => (
            <button
              key={card.name}
              onClick={() => toggle(idx)}
              className={`flex items-center gap-2.5 text-left px-2.5 py-2 rounded-lg border font-mono text-xs transition-all min-h-[56px] ${
                selected.has(idx)
                  ? "border-primary/50 bg-primary/10 text-foreground"
                  : "border-border bg-muted/20 text-muted-foreground hover:border-muted-foreground/30"
              }`}
            >
              <img
                src={card.image}
                alt={card.name}
                loading="lazy"
                className="w-9 h-12 object-contain rounded flex-shrink-0"
              />
              <div className="min-w-0">
                <span className="block font-medium truncate text-[11px]">{card.name}</span>
                <span className={`block text-[10px] mt-0.5 ${selected.has(idx) ? "text-primary" : ""}`}>
                  ${card.price.toFixed(2)}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Value display */}
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

        {totalValue === 0 && (
          <p className="font-mono text-[10px] text-center text-muted-foreground/60 mt-1">
            Select cards you own to see their combined value
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default QuickValueCalculator;
