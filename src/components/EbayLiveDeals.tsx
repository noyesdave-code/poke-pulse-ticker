import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Clock, Gavel, TrendingDown, ExternalLink } from "lucide-react";

interface AuctionDeal {
  id: string;
  title: string;
  currentBid: number;
  marketValue: number;
  savings: number;
  savingsPct: number;
  bids: number;
  timeLeft: string;
  seller: string;
  sellerRating: number;
  condition?: string;
  grade?: string;
  grader?: string;
}

const SELLER_NAMES = [
  "pokevault_deals", "tcg_king99", "cardcave_shop", "slabmaster_co", "pokeprime_usa",
  "grail_cards_llc", "mint_factory", "charizard_hq", "rare_finds_tcg", "alpha_slabs",
  "elite_cards_us", "topshelf_tcg", "prism_collectibles", "neon_cards", "vault_sealed",
];

const RAW_CARD_POOL = [
  { name: "Charizard ex SAR", set: "151", mv: 280 },
  { name: "Umbreon VMAX Alt Art", set: "Evolving Skies", mv: 310 },
  { name: "Pikachu VMAX Rainbow", set: "Vivid Voltage", mv: 195 },
  { name: "Moonbreon VMAX", set: "Evolving Skies", mv: 340 },
  { name: "Giratina VSTAR Gold", set: "Crown Zenith", mv: 120 },
  { name: "Rayquaza VMAX Alt Art", set: "Evolving Skies", mv: 265 },
  { name: "Eevee Full Art SIR", set: "Prismatic Evolutions", mv: 185 },
  { name: "Mew VMAX Alt Art", set: "Fusion Strike", mv: 145 },
  { name: "Lugia V Alt Art", set: "Silver Tempest", mv: 175 },
  { name: "Gengar VMAX Alt Art", set: "Fusion Strike", mv: 155 },
  { name: "Espeon VMAX Alt Art", set: "Evolving Skies", mv: 205 },
  { name: "Blaziken VMAX Alt Art", set: "Chilling Reign", mv: 130 },
  { name: "Iono SAR", set: "Paldea Evolved", mv: 245 },
  { name: "Charizard VSTAR Rainbow", set: "Brilliant Stars", mv: 110 },
  { name: "Mewtwo VSTAR SAR", set: "Pokémon GO", mv: 95 },
];

const GRADED_CARD_POOL = [
  { name: "Charizard ex SAR PSA 10", set: "151", mv: 520, grader: "PSA", grade: "10" },
  { name: "Umbreon VMAX Alt CGC 9.5", set: "Evolving Skies", mv: 445, grader: "CGC", grade: "9.5" },
  { name: "Pikachu VMAX BGS 9.5", set: "Vivid Voltage", mv: 310, grader: "BGS", grade: "9.5" },
  { name: "Rayquaza VMAX Alt PSA 10", set: "Evolving Skies", mv: 480, grader: "PSA", grade: "10" },
  { name: "Giratina VSTAR Gold PSA 10", set: "Crown Zenith", mv: 275, grader: "PSA", grade: "10" },
  { name: "Lugia V Alt Art PSA 10", set: "Silver Tempest", mv: 350, grader: "PSA", grade: "10" },
  { name: "Mew VMAX Alt CGC 10", set: "Fusion Strike", mv: 390, grader: "CGC", grade: "10" },
  { name: "Espeon VMAX Alt PSA 9", set: "Evolving Skies", mv: 185, grader: "PSA", grade: "9" },
  { name: "Iono SAR PSA 10", set: "Paldea Evolved", mv: 420, grader: "PSA", grade: "10" },
  { name: "Charizard VSTAR PSA 10", set: "Brilliant Stars", mv: 225, grader: "PSA", grade: "10" },
  { name: "Gengar VMAX Alt BGS 9.5", set: "Fusion Strike", mv: 260, grader: "BGS", grade: "9.5" },
  { name: "Eevee FA SIR CGC 9.5", set: "Prismatic Evolutions", mv: 295, grader: "CGC", grade: "9.5" },
];

const SEALED_POOL = [
  { name: "Evolving Skies Booster Box", set: "Evolving Skies", mv: 380 },
  { name: "151 ETB", set: "151", mv: 85 },
  { name: "Crown Zenith ETB", set: "Crown Zenith", mv: 65 },
  { name: "Prismatic Evolutions ETB", set: "Prismatic Evolutions", mv: 95 },
  { name: "Obsidian Flames Booster Box", set: "Obsidian Flames", mv: 145 },
  { name: "Paldea Evolved Booster Box", set: "Paldea Evolved", mv: 155 },
  { name: "Surging Sparks Booster Box", set: "Surging Sparks", mv: 175 },
  { name: "151 Booster Bundle", set: "151", mv: 48 },
  { name: "Temporal Forces Booster Box", set: "Temporal Forces", mv: 130 },
  { name: "Stellar Crown ETB", set: "Stellar Crown", mv: 42 },
  { name: "Brilliant Stars Booster Box", set: "Brilliant Stars", mv: 165 },
  { name: "Silver Tempest Booster Box", set: "Silver Tempest", mv: 140 },
];

const TIME_LEFTS = ["47s", "1m 12s", "1m 58s", "2m 33s", "3m 05s", "3m 41s", "4m 15s", "4m 52s"];

function pickRandom<T>(arr: T[], count: number, seed: number): T[] {
  const shuffled = [...arr].sort((a, b) => {
    const ha = ((seed * 31 + arr.indexOf(a)) * 2654435761) >>> 0;
    const hb = ((seed * 31 + arr.indexOf(b)) * 2654435761) >>> 0;
    return ha - hb;
  });
  return shuffled.slice(0, count);
}

function generateDeals(
  pool: typeof RAW_CARD_POOL,
  category: string,
  seed: number
): AuctionDeal[] {
  const picks = pickRandom(pool, 5, seed);
  return picks.map((item, i) => {
    const discountPct = 15 + ((seed * (i + 1) * 7) % 35);
    const currentBid = Math.round(item.mv * (1 - discountPct / 100));
    const savings = item.mv - currentBid;
    const bids = 3 + ((seed * (i + 2)) % 28);
    const timeIdx = (seed + i) % TIME_LEFTS.length;
    const sellerIdx = (seed * 3 + i * 7) % SELLER_NAMES.length;
    const p = item as any;
    return {
      id: `${category}-${seed}-${i}`,
      title: item.name,
      currentBid,
      marketValue: item.mv,
      savings,
      savingsPct: discountPct,
      bids,
      timeLeft: TIME_LEFTS[timeIdx],
      seller: SELLER_NAMES[sellerIdx],
      sellerRating: 97 + ((seed + i) % 3),
      condition: p.grader ? undefined : "NM",
      grade: p.grade,
      grader: p.grader,
    };
  });
}

const DealRow = ({ deal, rank }: { deal: AuctionDeal; rank: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: rank * 0.05 }}
    className="flex items-center gap-2 py-1.5 border-b border-border/10 last:border-0"
  >
    <span className="font-mono text-[10px] font-bold text-primary w-4 text-center">
      {rank}
    </span>
    <div className="flex-1 min-w-0">
      <p className="font-mono text-[11px] font-semibold text-foreground truncate leading-tight">
        {deal.title}
      </p>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span className="font-mono text-[9px] text-muted-foreground">
          {deal.seller} ({deal.sellerRating}%)
        </span>
        <span className="text-border/40">·</span>
        <span className="font-mono text-[9px] text-muted-foreground">
          {deal.bids} bids
        </span>
      </div>
    </div>
    <div className="text-right flex-shrink-0">
      <p className="font-mono text-[12px] font-bold text-primary">
        ${deal.currentBid}
      </p>
      <div className="flex items-center gap-1 justify-end">
        <span className="font-mono text-[9px] text-muted-foreground line-through">
          ${deal.marketValue}
        </span>
        <span className="font-mono text-[9px] font-bold text-primary">
          -{deal.savingsPct}%
        </span>
      </div>
    </div>
    <div className="flex items-center gap-0.5 flex-shrink-0">
      <Clock className="w-2.5 h-2.5 text-terminal-amber" />
      <span className="font-mono text-[9px] text-terminal-amber font-semibold">
        {deal.timeLeft}
      </span>
    </div>
  </motion.div>
);

const DealColumn = ({
  title,
  icon,
  deals,
  accentClass,
}: {
  title: string;
  icon: React.ReactNode;
  deals: AuctionDeal[];
  accentClass: string;
}) => (
  <div className="terminal-card p-3 sm:p-4">
    <div className="flex items-center gap-2 mb-2.5">
      {icon}
      <h3 className={`font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider ${accentClass}`}>
        {title}
      </h3>
    </div>
    <div className="space-y-0">
      {deals.map((deal, i) => (
        <DealRow key={deal.id} deal={deal} rank={i + 1} />
      ))}
    </div>
  </div>
);

const EbayLiveDeals = () => {
  const [seed, setSeed] = useState(() => Math.floor(Date.now() / (5 * 60 * 1000)));

  useEffect(() => {
    const interval = setInterval(() => {
      setSeed(Math.floor(Date.now() / (5 * 60 * 1000)));
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const rawDeals = useMemo(() => generateDeals(RAW_CARD_POOL, "raw", seed), [seed]);
  const gradedDeals = useMemo(() => generateDeals(GRADED_CARD_POOL as any, "graded", seed + 1), [seed]);
  const sealedDeals = useMemo(() => generateDeals(SEALED_POOL, "sealed", seed + 2), [seed]);

  return (
    <div className="terminal-card p-3 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Gavel className="w-4 h-4 text-primary" />
          <h2 className="font-mono text-sm font-bold text-foreground">
            eBay Live Auction Deals
          </h2>
          <div className="flex items-center gap-1 ml-1">
            <div className="h-1.5 w-1.5 rounded-full bg-primary pulse-live" />
            <span className="font-mono text-[9px] text-primary font-bold">LIVE</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="font-mono text-[9px] text-muted-foreground">
            Refreshes every 5 min
          </span>
        </div>
      </div>
      <p className="font-mono text-[10px] text-muted-foreground mb-3">
        Top 5 best-value auctions ending soon — below market value picks across raw, graded & sealed
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
        <DealColumn
          title="Raw Cards"
          icon={<Flame className="w-3.5 h-3.5 text-primary" />}
          deals={rawDeals}
          accentClass="text-primary"
        />
        <DealColumn
          title="Graded Slabs"
          icon={<TrendingDown className="w-3.5 h-3.5 text-terminal-amber" />}
          deals={gradedDeals}
          accentClass="text-terminal-amber"
        />
        <DealColumn
          title="Sealed Products"
          icon={<ExternalLink className="w-3.5 h-3.5 text-terminal-blue" />}
          deals={sealedDeals}
          accentClass="text-terminal-blue"
        />
      </div>

      <p className="font-mono text-[8px] text-muted-foreground/50 text-center mt-2">
        Data simulated for demonstration · Market values from Poke-Pulse-Engine™ index
      </p>
    </div>
  );
};

export default EbayLiveDeals;
