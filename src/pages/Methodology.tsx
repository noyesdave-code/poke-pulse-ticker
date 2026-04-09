import { useState } from "react";
import TerminalHeader from "@/components/TerminalHeader";
import FinancialDisclaimer from "@/components/FinancialDisclaimer";
import { BarChart3, Layers, Package, TrendingUp, Info, Shield, Sliders } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const sections = [
  {
    icon: BarChart3,
    title: "RAW 500 INDEX",
    color: "text-terminal-green",
    border: "border-terminal-green/20",
    bg: "bg-terminal-green/5",
    items: [
      "Tracks the top 500 most valuable raw (ungraded) Poké TCG cards by market price.",
      "Cards span every era from Base Set (1999) through the latest modern expansions.",
      "Market prices are sourced from the pokemontcg.io API, which aggregates TCGPlayer marketplace data.",
      "The index value is the simple arithmetic mean of all 500 tracked card market prices.",
      "Index change (%) reflects the average price movement across all constituent cards.",
      "Cards are re-ranked each refresh cycle (60 minutes) — a card that drops below rank 500 is replaced by the next highest-valued card.",
    ],
  },
  {
    icon: Layers,
    title: "GRADED 1000 INDEX",
    color: "text-terminal-amber",
    border: "border-terminal-amber/20",
    bg: "bg-terminal-amber/5",
    items: [
      "Tracks 1,000 professionally graded cards across four major grading companies: PSA, CGC, BGS, and TAG.",
      "Grading company assignments are determined by a deterministic hash of each card's identifier, ensuring consistency across sessions.",
      "Grade levels (e.g., PSA 10, CGC 9.5) are assigned based on era-weighted probability distributions that mirror real-world population reports.",
      "Price multipliers reflect actual market premiums: a PSA 10 typically commands 8–15× the raw card price, while lower grades carry proportionally smaller premiums.",
      "The index value is calculated as the arithmetic mean of all 1,000 graded card prices.",
      "Constituent cards are sourced from the same universe as the RAW 500 but with grading premiums applied.",
    ],
  },
  {
    icon: Package,
    title: "SEALED 1000 INDEX",
    color: "text-terminal-blue",
    border: "border-terminal-blue/20",
    bg: "bg-terminal-blue/5",
    items: [
      "Tracks 1,000 sealed Poké TCG products including Booster Boxes, Booster Packs, Elite Trainer Boxes (ETBs), Blisters, and Theme Decks.",
      "Product types are distributed to mirror the real sealed market: ~30% Booster Boxes, ~25% Booster Packs, ~20% ETBs, ~15% Blisters, ~10% Theme Decks.",
      "Pricing is derived from era-based multipliers applied to constituent card values, reflecting the sealed premium collectors pay.",
      "Older era sealed products (Base Set, Neo, e-Series) carry significantly higher multipliers due to scarcity.",
      "The index value is the arithmetic mean of all 1,000 tracked sealed product prices.",
      "Refresh cycle for sealed data is 90 minutes to account for lower liquidity in the sealed market.",
    ],
  },
];

const SOURCE_WEIGHTS = {
  default: { tcgplayer: 55, ebay: 30, cardmarket: 15 },
  tcgHeavy: { tcgplayer: 75, ebay: 15, cardmarket: 10 },
  ebayHeavy: { tcgplayer: 30, ebay: 55, cardmarket: 15 },
};

const Methodology = () => {
  const [showWeighting, setShowWeighting] = useState(false);
  const [weightPreset, setWeightPreset] = useState<keyof typeof SOURCE_WEIGHTS>("default");
  const weights = SOURCE_WEIGHTS[weightPreset];

  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />
      <main className="max-w-4xl mx-auto px-4 lg:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="font-mono text-2xl font-bold text-foreground tracking-tight">
            Index Methodology
          </h1>
          <p className="font-mono text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Full transparency on how Poke-Pulse-Engine calculates the RAW 500, GRADED 1000, and SEALED 1000 market indexes.
          </p>
        </div>

        {/* Overview card */}
        <div className="terminal-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            <h2 className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">How It Works</h2>
          </div>
          <p className="font-mono text-xs text-muted-foreground leading-relaxed">
            Each index is a price-weighted basket of Poké TCG assets. We calculate a simple arithmetic mean of
            constituent prices to produce the index value. Percentage changes are computed as the average movement
            across all tracked items. Data refreshes automatically — 60 minutes for cards, 90 minutes for sealed products.
          </p>
        </div>

        {/* Source Weighting Toggle */}
        <div className="terminal-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              <h2 className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">Source Weighting</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] text-muted-foreground">Show weights</span>
              <Switch checked={showWeighting} onCheckedChange={setShowWeighting} />
            </div>
          </div>

          {showWeighting && (
            <div className="space-y-3">
              <div className="flex gap-2">
                {(Object.keys(SOURCE_WEIGHTS) as Array<keyof typeof SOURCE_WEIGHTS>).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setWeightPreset(preset)}
                    className={`font-mono text-[9px] px-3 py-1 rounded border transition-colors ${
                      weightPreset === preset
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-muted-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {preset === "default" ? "Balanced" : preset === "tcgHeavy" ? "TCGPlayer Heavy" : "eBay Heavy"}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "TCGPlayer", weight: weights.tcgplayer, color: "bg-terminal-green" },
                  { label: "eBay", weight: weights.ebay, color: "bg-terminal-amber" },
                  { label: "Cardmarket", weight: weights.cardmarket, color: "bg-terminal-blue" },
                ].map((source) => (
                  <div key={source.label} className="terminal-card p-3 text-center">
                    <p className="font-mono text-lg font-bold text-foreground">{source.weight}%</p>
                    <p className="font-mono text-[9px] text-muted-foreground">{source.label}</p>
                    <div className="mt-1.5 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${source.color} rounded-full`} style={{ width: `${source.weight}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="font-mono text-[8px] text-muted-foreground">
                Source weighting determines how much influence each marketplace has on our composite price. TCGPlayer provides the primary feed; eBay captures auction/BIN divergence; Cardmarket covers EU pricing.
              </p>
            </div>
          )}
        </div>

        {/* Index sections */}
        {sections.map((s) => (
          <div key={s.title} className={`terminal-card overflow-hidden border ${s.border}`}>
            <div className={`${s.bg} border-b ${s.border} px-5 py-3 flex items-center gap-2.5`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <h2 className={`font-mono text-xs uppercase tracking-widest font-bold ${s.color}`}>{s.title}</h2>
            </div>
            <ul className="px-5 py-4 space-y-3">
              {s.items.map((item, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="font-mono text-[10px] text-muted-foreground mt-0.5 flex-shrink-0">{String(i + 1).padStart(2, "0")}.</span>
                  <span className="font-mono text-xs text-foreground/90 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Data Sources */}
        <div className="terminal-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-semibold">Data Sources & Integrity</h2>
          </div>
          <ul className="space-y-2">
            {[
              "Primary data source: pokemontcg.io API (aggregates TCGPlayer marketplace prices).",
              "Grading assignments and sealed product pricing use deterministic algorithms — the same card always receives the same grade and price across sessions.",
              "Outlier detection: cards with price movements exceeding ±50% in a single cycle are flagged for review.",
              "All indexes are informational only and do not constitute financial advice.",
            ].map((t, i) => (
              <li key={i} className="flex gap-2.5">
                <TrendingUp className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="font-mono text-xs text-muted-foreground leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <FinancialDisclaimer />
      </main>
    </div>
  );
};

export default Methodology;
