import { motion } from "framer-motion";
import { Layers, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import type { CardData } from "@/data/marketData";

interface EraIndexCardsProps {
  cards: CardData[];
}

interface Era {
  label: string;
  tag: string;
  sets: string[];
  color: string;
  glowClass: string;
}

const ERAS: Era[] = [
  {
    label: "VINTAGE (WOTC)",
    tag: "1999–2003",
    sets: ["Base Set", "Base Set 2", "Jungle", "Fossil", "Team Rocket", "Gym Challenge", "Neo Genesis", "Neo Discovery", "Neo Destiny", "Legendary Collection", "Expedition Base Set", "Skyridge", "POP Series 5", "Pokémon Rumble"],
    color: "text-terminal-amber",
    glowClass: "glow-amber",
  },
  {
    label: "EX ERA",
    tag: "2003–2007",
    sets: ["Crystal Guardians", "EX Dragon Frontiers", "Deoxys"],
    color: "text-terminal-blue",
    glowClass: "glow-blue",
  },
  {
    label: "MODERN",
    tag: "2017–Present",
    sets: [], // catch-all for anything not matched above
    color: "text-primary",
    glowClass: "glow-green",
  },
];

function categorizeCards(cards: CardData[]): { era: Era; cards: CardData[] }[] {
  const matched = new Set<number>();
  const result: { era: Era; cards: CardData[] }[] = [];

  for (const era of ERAS) {
    if (era.sets.length === 0) continue;
    const eraCards: CardData[] = [];
    cards.forEach((card, idx) => {
      if (!matched.has(idx) && era.sets.some(s => card.set.includes(s))) {
        eraCards.push(card);
        matched.add(idx);
      }
    });
    result.push({ era, cards: eraCards });
  }

  // Modern = everything unmatched
  const modernEra = ERAS.find(e => e.sets.length === 0)!;
  const modernCards = cards.filter((_, idx) => !matched.has(idx));
  result.push({ era: modernEra, cards: modernCards });

  return result.filter(r => r.cards.length > 0);
}

const EraIndexCards = ({ cards }: EraIndexCardsProps) => {
  const eras = categorizeCards(cards);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="terminal-card overflow-hidden"
    >
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-wide text-secondary uppercase flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" /> Era-Based Market Indexes
        </h2>
        <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
          Market Adaptability
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {eras.map(({ era, cards: eraCards }, idx) => {
          const avgPrice = eraCards.reduce((s, c) => s + c.market, 0) / eraCards.length;
          const avgChange = eraCards.reduce((s, c) => s + c.change, 0) / eraCards.length;
          const isUp = avgChange >= 0;
          const totalCap = eraCards.reduce((s, c) => s + c.market, 0);

          return (
            <motion.div
              key={era.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.12, duration: 0.4 }}
              className="px-4 py-4 hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Layers className={`w-3.5 h-3.5 ${era.color}`} />
                  <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${era.color}`}>
                    {era.label}
                  </span>
                </div>
                <span className="font-mono text-[9px] text-muted-foreground">{era.tag}</span>
              </div>

              <p className="text-xl font-extrabold text-foreground">
                ${avgPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="font-mono text-[9px] text-muted-foreground mb-2">Avg card value</p>

              <div className="flex items-center justify-between">
                <span className={`font-mono text-[10px] font-semibold flex items-center gap-0.5 ${isUp ? "text-terminal-green" : "text-terminal-red"}`}>
                  {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {isUp ? "+" : ""}{avgChange.toFixed(2)}%
                </span>
                <span className="font-mono text-[9px] text-muted-foreground">
                  {eraCards.length} cards • ${totalCap.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default EraIndexCards;
