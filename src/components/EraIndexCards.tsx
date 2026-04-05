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
    sets: ["Base Set", "Base Set 2", "Jungle", "Fossil", "Team Rocket", "Gym Heroes", "Gym Challenge", "Neo Genesis", "Neo Discovery", "Neo Revelation", "Neo Destiny", "Legendary Collection", "Expedition Base Set", "Aquapolis", "Skyridge", "POP Series", "Poké Rumble", "Southern Islands", "Best of Game"],
    color: "text-terminal-amber",
    glowClass: "glow-amber",
  },
  {
    label: "EX ERA",
    tag: "2003–2007",
    sets: ["Ruby & Sapphire", "Sandstorm", "Dragon", "Team Magma vs Team Aqua", "Hidden Legends", "FireRed & LeafGreen", "Team Rocket Returns", "Deoxys", "Emerald", "Unseen Forces", "Delta Species", "Legend Maker", "Holon Phantoms", "Crystal Guardians", "Dragon Frontiers", "Power Keepers", "EX"],
    color: "text-terminal-blue",
    glowClass: "glow-blue",
  },
  {
    label: "DP / PLATINUM",
    tag: "2007–2010",
    sets: ["Diamond & Pearl", "Mysterious Treasures", "Secret Wonders", "Great Encounters", "Majestic Dawn", "Legends Awakened", "Stormfront", "Platinum", "Rising Rivals", "Supreme Victors", "Arceus", "HeartGold & SoulSilver", "Unleashed", "Undaunted", "Triumphant", "Call of Legends", "HGSS"],
    color: "text-purple-400",
    glowClass: "",
  },
  {
    label: "BW / XY",
    tag: "2011–2017",
    sets: ["Black & White", "Emerging Powers", "Noble Victories", "Next Destinies", "Dark Explorers", "Dragons Exalted", "Boundaries Crossed", "Plasma Storm", "Plasma Freeze", "Plasma Blast", "Legendary Treasures", "XY", "Flashfire", "Furious Fists", "Phantom Forces", "Primal Clash", "Roaring Skies", "Ancient Origins", "BREAKthrough", "BREAKpoint", "Fates Collide", "Steam Siege", "Evolutions", "Generations"],
    color: "text-sky-400",
    glowClass: "",
  },
  {
    label: "SUN & MOON",
    tag: "2017–2020",
    sets: ["Sun & Moon", "Guardians Rising", "Burning Shadows", "Shining Legends", "Crimson Invasion", "Ultra Prism", "Forbidden Light", "Celestial Storm", "Dragon Majesty", "Lost Thunder", "Team Up", "Unbroken Bonds", "Unified Minds", "Hidden Fates", "Cosmic Eclipse", "Detective Pikachu"],
    color: "text-orange-400",
    glowClass: "",
  },
  {
    label: "MODERN",
    tag: "2020–Present",
    sets: ["Sword & Shield", "Rebel Clash", "Darkness Ablaze", "Champion's Path", "Vivid Voltage", "Shining Fates", "Battle Styles", "Chilling Reign", "Evolving Skies", "Celebrations", "Fusion Strike", "Brilliant Stars", "Astral Radiance", "Lost Origin", "Silver Tempest", "Crown Zenith", "Scarlet & Violet", "Paldea Evolved", "Obsidian Flames", "151", "Paldean Fates", "Temporal Forces", "Twilight Masquerade", "Shrouded Fable", "Stellar Crown", "Surging Sparks", "Prismatic Evolutions", "Journey Together"],
    color: "text-primary",
    glowClass: "glow-green",
  },
];

function categorizeCards(cards: CardData[]): { era: Era; cards: CardData[] }[] {
  const matched = new Set<number>();
  const result: { era: Era; cards: CardData[] }[] = [];

  // Match all non-Modern eras first
  for (const era of ERAS) {
    if (era.label === "MODERN") continue;
    const eraCards: CardData[] = [];
    cards.forEach((card, idx) => {
      if (!matched.has(idx) && era.sets.some(s => card.set.includes(s))) {
        eraCards.push(card);
        matched.add(idx);
      }
    });
    result.push({ era, cards: eraCards });
  }

  // Modern = explicitly matched modern sets + everything unmatched (catch-all)
  const modernEra = ERAS.find(e => e.label === "MODERN")!;
  const modernCards = cards.filter((_, idx) => !matched.has(idx));
  result.push({ era: modernEra, cards: modernCards });

  return result.filter(r => r.cards.length > 0);
}

const EraIndexCards = ({ cards }: EraIndexCardsProps) => {
  const eras = categorizeCards(cards);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="terminal-card overflow-hidden"
    >
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h2 className="text-sm font-bold tracking-wide text-secondary uppercase flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" /> Era-Based Market Indexes
        </h2>
        <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
          All Eras • Live Data
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 divide-border">
        {eras.map(({ era, cards: eraCards }, idx) => {
          const avgPrice = eraCards.length > 0 ? eraCards.reduce((s, c) => s + c.market, 0) / eraCards.length : 0;
          const avgChange = eraCards.length > 0 ? eraCards.reduce((s, c) => s + c.change, 0) / eraCards.length : 0;
          const isUp = avgChange >= 0;
          const totalCap = eraCards.reduce((s, c) => s + c.market, 0);

          return (
            <motion.div
              key={era.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className="px-3 py-3 hover:bg-muted/20 transition-colors border-r border-border last:border-r-0"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <Layers className={`w-3 h-3 ${era.color}`} />
                <span className={`font-mono text-[9px] font-bold uppercase tracking-wider ${era.color} leading-tight`}>
                  {era.label}
                </span>
              </div>
              <span className="font-mono text-[8px] text-muted-foreground block mb-1">{era.tag}</span>

              <p className="text-lg font-extrabold text-foreground leading-none">
                ${avgPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="font-mono text-[8px] text-muted-foreground mb-1.5">Avg card value</p>

              <div className="flex items-center justify-between">
                <span className={`font-mono text-[9px] font-semibold flex items-center gap-0.5 ${isUp ? "text-terminal-green" : "text-terminal-red"}`}>
                  {isUp ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                  {isUp ? "+" : ""}{avgChange.toFixed(2)}%
                </span>
              </div>
              <span className="font-mono text-[8px] text-muted-foreground">
                {eraCards.length} cards • ${totalCap.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default EraIndexCards;
