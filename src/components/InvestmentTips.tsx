import { TrendingUp, TrendingDown, AlertTriangle, ShieldCheck, Clock, DollarSign, BookOpen } from "lucide-react";

const buySignals = [
  { item: "Base Set 1st Edition holos", detail: "Consistent 10–20% annual appreciation" },
  { item: "Vintage WotC era (1999–2003)", detail: "Limited supply, growing nostalgia demand" },
  { item: "Neo Genesis / Neo Discovery", detail: "Undervalued relative to Base Set" },
  { item: "E-Card series (Skyridge, Aquapolis)", detail: "Low print runs, strong collector demand" },
  { item: "Japanese exclusive promos", detail: "Growing international demand" },
];

const holdSignals = [
  { item: "Modern Alt Art / Illustration Rare", detail: "Strong demand but watch for reprints" },
  { item: "Special Illustration Rares (SIR)", detail: "Premium art commands lasting interest" },
  { item: "Gold & Rainbow rares", detail: "Moderate demand — hold for set rotation" },
  { item: "Sealed ETBs (1–2 years old)", detail: "Value grows after sets go out of print" },
];

const cautionSignals = [
  { item: "Overprinted modern sets", detail: "High supply suppresses long-term value" },
  { item: "Common / Uncommon cards", detail: "Rarely appreciate regardless of age" },
  { item: "Damaged vintage cards", detail: "Condition issues limit upside severely" },
  { item: "Celebrations reprints", detail: "Nostalgia factor already priced in" },
];

const beginnerMistakes = [
  {
    mistake: "Buying at peak hype",
    fix: "Wait 2–4 weeks after a set release for prices to stabilize. New set cards almost always drop from their initial highs.",
  },
  {
    mistake: "Ignoring condition",
    fix: "A 'deal' on a damaged card is rarely a deal. Always ask for close-up photos of corners, edges, and surface before buying.",
  },
  {
    mistake: "Not tracking purchase prices",
    fix: "Use a portfolio tracker to log every purchase price. Without cost basis data, you can't calculate actual profit or loss.",
  },
  {
    mistake: "Grading everything",
    fix: "Only grade cards worth $50+ raw in NM condition. Grading a $5 card costs $25+ and the PSA 10 might only be worth $15.",
  },
  {
    mistake: "Treating cards as guaranteed investments",
    fix: "The market is speculative. Collect what you love first — financial returns are a bonus, not a guarantee.",
  },
];

const storageGuide = [
  { step: "1", title: "Pull from pack", desc: "Handle by edges only, avoid touching the surface" },
  { step: "2", title: "Penny sleeve", desc: "Slide card into a penny sleeve top-first" },
  { step: "3", title: "Top loader", desc: "Place sleeved card into a rigid top loader" },
  { step: "4", title: "Storage box", desc: "Store upright in a cool, dry, dark location" },
];

const InvestmentTips = () => {
  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="terminal-card overflow-hidden">
        <div className="border-b border-border px-4 py-3">
          <h2 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Investment & Collecting Guide
          </h2>
        </div>
        <div className="px-4 py-4">
          <p className="font-mono text-sm text-muted-foreground leading-relaxed">
            Whether you're collecting for fun or investing for profit, understanding market dynamics helps you make better decisions.
            This guide covers what to buy, what to avoid, and how to protect your collection.
          </p>
          <div className="mt-3 flex items-start gap-2 px-3 py-2 rounded border border-terminal-amber/30 bg-terminal-amber/5">
            <AlertTriangle className="w-4 h-4 text-terminal-amber mt-0.5 flex-shrink-0" />
            <span className="font-mono text-[11px] text-terminal-amber">
              Not financial advice. Poké cards are collectibles with speculative value. Never invest more than you can afford to lose.
            </span>
          </div>
        </div>
      </div>

      {/* Buy / Hold / Caution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Buy */}
        <div className="terminal-card overflow-hidden border-t-2 border-t-terminal-green">
          <div className="border-b border-border px-4 py-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-terminal-green" />
            <h3 className="font-mono text-xs tracking-widest text-terminal-green uppercase font-semibold">
              Strong Buy
            </h3>
          </div>
          <div className="divide-y divide-border">
            {buySignals.map((s) => (
              <div key={s.item} className="px-4 py-3">
                <span className="font-mono text-xs font-semibold text-foreground">{s.item}</span>
                <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hold */}
        <div className="terminal-card overflow-hidden border-t-2 border-t-terminal-amber">
          <div className="border-b border-border px-4 py-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-terminal-amber" />
            <h3 className="font-mono text-xs tracking-widest text-terminal-amber uppercase font-semibold">
              Hold / Watch
            </h3>
          </div>
          <div className="divide-y divide-border">
            {holdSignals.map((s) => (
              <div key={s.item} className="px-4 py-3">
                <span className="font-mono text-xs font-semibold text-foreground">{s.item}</span>
                <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Caution */}
        <div className="terminal-card overflow-hidden border-t-2 border-t-terminal-red">
          <div className="border-b border-border px-4 py-3 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-terminal-red" />
            <h3 className="font-mono text-xs tracking-widest text-terminal-red uppercase font-semibold">
              Caution
            </h3>
          </div>
          <div className="divide-y divide-border">
            {cautionSignals.map((s) => (
              <div key={s.item} className="px-4 py-3">
                <span className="font-mono text-xs font-semibold text-foreground">{s.item}</span>
                <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Proper Storage */}
      <div className="terminal-card overflow-hidden">
        <div className="border-b border-border px-4 py-3">
          <h3 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Proper Card Storage
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
          {storageGuide.map((s) => (
            <div key={s.step} className="px-4 py-4 text-center">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-2">
                <span className="font-mono text-sm font-bold text-primary">{s.step}</span>
              </div>
              <span className="font-mono text-xs font-semibold text-foreground block">{s.title}</span>
              <p className="font-mono text-[10px] text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Common Mistakes */}
      <div className="terminal-card overflow-hidden">
        <div className="border-b border-border px-4 py-3">
          <h3 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Common Beginner Mistakes
          </h3>
        </div>
        <div className="divide-y divide-border">
          {beginnerMistakes.map((m) => (
            <div key={m.mistake} className="px-4 py-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-3.5 h-3.5 text-terminal-red mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-mono text-xs font-semibold text-terminal-red">{m.mistake}</span>
                  <p className="font-mono text-[11px] text-muted-foreground mt-1 leading-relaxed">{m.fix}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestmentTips;
