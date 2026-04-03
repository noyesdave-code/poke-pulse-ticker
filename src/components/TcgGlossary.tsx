import { BookText, Search } from "lucide-react";
import { useState, useMemo } from "react";

const glossaryTerms = [
  { term: "Alt Art", aka: "Alternate Art", def: "A card featuring unique artwork different from its standard version, often depicting Poké in scenic or dynamic settings. Highly sought by collectors." },
  { term: "Base Set", def: "The original Poké TCG set released in 1999 (US). Contains iconic cards like Charizard, Blastoise, and Venusaur holos." },
  { term: "BGS", aka: "Beckett Grading Services", def: "A card grading company that provides sub-grades for centering, corners, edges, and surface. A BGS 10 'Black Label' is extremely rare." },
  { term: "Booster Box", def: "A sealed box containing 36 booster packs (typically). Sealed boxes appreciate in value after sets go out of print." },
  { term: "Booster Pack", def: "A sealed pack of 10 cards with randomized pulls. Contains a mix of commons, uncommons, and at least one rare or higher." },
  { term: "Centering", def: "How evenly the card's artwork is positioned within its borders. Perfect centering (50/50) significantly increases graded value." },
  { term: "CGC", aka: "Certified Guaranty Company", def: "A grading service that expanded from comics to Poké cards. Known for competitive pricing and subgrades." },
  { term: "Chase Card", def: "The most desirable and valuable card in a set — the one collectors are 'chasing.' Usually a Secret Rare, SIR, or Alt Art." },
  { term: "Common", aka: "C", def: "The most frequently pulled rarity tier, marked with a circle (●). Typically low value unless it's a vintage or error card." },
  { term: "Crown Rare", def: "A premium rarity introduced in Scarlet & Violet featuring a golden crown stamp. Extremely limited pull rates." },
  { term: "EX / ex", def: "A card mechanic introduced in Ruby & Sapphire (uppercase EX) and reintroduced in Scarlet & Violet (lowercase ex). Gives up 2 prize cards when knocked out." },
  { term: "ETB", aka: "Elite Trainer Box", def: "A sealed product containing 9 booster packs, energy cards, sleeves, dice, and a collector's box. Popular for both play and investment." },
  { term: "Error Card", def: "A card with a printing mistake (wrong name, missing symbol, misprint). Some errors are highly valuable due to rarity." },
  { term: "First Edition", aka: "1st Ed", def: "Cards printed in the initial run of Base–Neo era sets, marked with a '1st Edition' stamp. Commands massive premiums over Unlimited prints." },
  { term: "Full Art", aka: "FA", def: "A card where the artwork extends to cover the entire card face, leaving minimal border. First introduced in Black & White era." },
  { term: "GX", def: "A powerful card mechanic from Sun & Moon era featuring GX attacks that can only be used once per game." },
  { term: "Holo", aka: "Holographic", def: "A card with a holographic foil pattern on the artwork. In vintage sets, holos are the highest standard rarity." },
  { term: "Illustration Rare", aka: "IR", def: "A rarity tier in Scarlet & Violet featuring extended artwork by notable artists. More common than SIRs but still premium." },
  { term: "NM", aka: "Near Mint", def: "Card condition with minimal to no wear — sharp corners, clean edges, no scratches. The standard condition for pricing raw cards." },
  { term: "PSA", aka: "Professional Sports Authenticator", def: "The most recognized card grading service. PSA 10 (Gem Mint) is the gold standard for graded Poké cards." },
  { term: "Pull Rate", def: "The statistical probability of pulling a specific card or rarity from a booster pack. Lower pull rates = higher market value." },
  { term: "Rainbow Rare", aka: "RR / Hyper Rare", def: "A multicolored foil variant of V, VMAX, or ex cards. Features a rainbow-gradient treatment." },
  { term: "Raw", def: "An ungraded card — not encapsulated by PSA, BGS, CGC, or any grading service. 'Raw NM' refers to ungraded Near Mint condition." },
  { term: "Reverse Holo", aka: "Rev Holo", def: "A card where the holographic pattern appears on the non-artwork area (the text/border), while the artwork itself is non-holo." },
  { term: "Secret Rare", aka: "SR", def: "A card numbered beyond the set's official count (e.g., 201/198). Typically the most valuable non-promo cards in a set." },
  { term: "Shadowless", def: "An early Base Set print run missing the drop shadow on the right side of the artwork box. Rarer and more valuable than Unlimited." },
  { term: "SIR", aka: "Special Illustration Rare", def: "The highest standard rarity in modern Scarlet & Violet sets. Features full-bleed, artistic illustrations. The modern equivalent of Alt Arts." },
  { term: "Slab", def: "A graded card encapsulated in a hard plastic case by a grading company. 'Slabbed' = professionally graded and sealed." },
  { term: "TAG", aka: "TAG Team", def: "A grading company, also a card mechanic from Sun & Moon featuring two Poké together with powerful TAG TEAM GX attacks." },
  { term: "TCG", aka: "Trading Card Game", def: "The category of collectible card games designed for play and collecting. Poké TCG is one of the 'Big Three' alongside MTG and Yu-Gi-Oh." },
  { term: "Top Loader", def: "A rigid plastic sleeve used to protect valuable cards. Standard size is 3×4 inches. Essential for shipping and storage." },
  { term: "Uncommon", aka: "U", def: "A mid-tier rarity marked with a diamond (◆). More common than rares but less common than commons." },
  { term: "Unlimited", def: "The standard (non-1st Edition) print run of early sets. More widely available and less valuable than 1st Edition prints." },
  { term: "V / VMAX / VSTAR", def: "Card mechanics from Sword & Shield era. V cards are basic powerful Poké; VMAX are evolved forms; VSTAR have special VSTAR powers." },
  { term: "WotC", aka: "Wizards of the Coast", def: "The original publisher of the Poké TCG in English (1999–2003). WotC-era cards are considered 'vintage' and command premium prices." },
];

const TcgGlossary = () => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return glossaryTerms;
    const q = search.toLowerCase();
    return glossaryTerms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.aka?.toLowerCase().includes(q) ||
        t.def.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="terminal-card overflow-hidden">
        <div className="border-b border-border px-4 py-3 flex items-center justify-between gap-3">
          <h2 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold flex items-center gap-2">
            <BookText className="w-4 h-4" />
            TCG Glossary
          </h2>
          <span className="font-mono text-[9px] text-muted-foreground">{filtered.length} terms</span>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-border">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search terms..."
              className="w-full rounded border border-border bg-muted px-3 py-2 pl-8 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Terms */}
        <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
          {filtered.map((t) => (
            <div key={t.term} className="px-4 py-3 hover:bg-muted/30 transition-colors">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-mono text-sm font-bold text-foreground">{t.term}</span>
                {t.aka && (
                  <span className="font-mono text-[10px] text-muted-foreground">({t.aka})</span>
                )}
              </div>
              <p className="font-mono text-xs text-muted-foreground mt-1 leading-relaxed">{t.def}</p>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="font-mono text-sm text-muted-foreground">No terms found for "{search}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TcgGlossary;
