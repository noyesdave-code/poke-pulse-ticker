import { Shield, AlertTriangle, XCircle, CheckCircle2, Star, Info } from "lucide-react";

const grades = [
  {
    grade: "PSA 10 / CGC 10 / BGS 10",
    label: "Gem Mint",
    color: "text-terminal-green",
    bg: "bg-terminal-green/10 border-terminal-green/30",
    multiplier: "3–5× raw value",
    description:
      "Flawless card with perfect centering (55/45 or better), sharp corners, pristine edges, and no surface imperfections under magnification.",
    tips: [
      "Check centering with a centering tool before submitting",
      "Handle only by edges with clean, dry hands or gloves",
      "Use penny sleeves + top loaders immediately after pulling",
    ],
  },
  {
    grade: "PSA 9 / CGC 9 / BGS 9.5",
    label: "Mint",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/30",
    multiplier: "2–3× raw value",
    description:
      "Near-flawless with one minor flaw — a slight centering shift, a tiny edge nick, or minor surface imperfection only visible under close inspection.",
    tips: [
      "Most well-handled modern pulls can achieve a 9",
      "A slight off-center print is the most common reason for missing a 10",
    ],
  },
  {
    grade: "PSA 8 / CGC 8 / BGS 8.5",
    label: "Near Mint–Mint",
    color: "text-terminal-amber",
    bg: "bg-terminal-amber/10 border-terminal-amber/30",
    multiplier: "1.5–2× raw value",
    description:
      "Minor wear visible — light whitening on one or two corners, slight edge wear, or minor surface scratching visible at an angle.",
    tips: [
      "Vintage cards in this condition are still highly collectible",
      "Worth grading if raw value is $100+",
    ],
  },
  {
    grade: "PSA 7 / CGC 7 / BGS 7",
    label: "Near Mint",
    color: "text-terminal-blue",
    bg: "bg-terminal-blue/10 border-terminal-blue/30",
    multiplier: "0.8–1.2× raw value",
    description:
      "Noticeable wear — corner whitening, light creasing, surface scratches, or slight edge dents. Still presentable in a binder.",
    tips: [
      "Only grade at this level for high-value vintage cards ($500+ raw)",
      "Authentication value may outweigh the grade premium",
    ],
  },
  {
    grade: "PSA 5–6",
    label: "Excellent to Light Play",
    color: "text-muted-foreground",
    bg: "bg-muted border-border",
    multiplier: "0.4–0.7× raw NM value",
    description:
      "Obvious wear — multiple creases, heavy whitening, surface scratches clearly visible. Card shows signs of play or poor storage.",
    tips: [
      "Generally not worth grading unless the card is a vintage chase card",
      "Focus on upgrading to a better condition copy instead",
    ],
  },
  {
    grade: "PSA 1–4",
    label: "Heavy Play / Damaged",
    color: "text-terminal-red",
    bg: "bg-terminal-red/10 border-terminal-red/30",
    multiplier: "0.1–0.3× raw NM value",
    description:
      "Severe damage — major creases, tears, water damage, writing, heavy edge wear, or missing pieces.",
    tips: [
      "Not recommended for grading",
      "May still hold sentimental value — great for casual play decks",
    ],
  },
];

const conditionChecklist = [
  { area: "Centering", what: "Compare borders on front and back — even borders = better grade", icon: "⊞" },
  { area: "Corners", what: "Inspect all 4 corners under bright light for whitening or soft bends", icon: "◇" },
  { area: "Edges", what: "Run your finger along edges — feel for nicks, dents, or rough spots", icon: "▬" },
  { area: "Surface", what: "Tilt under light to reveal scratches, print lines, or holo damage", icon: "◻" },
];

const GradingGuide = () => {
  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="terminal-card overflow-hidden">
        <div className="border-b border-border px-4 py-3">
          <h2 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Card Condition & Grading Guide
          </h2>
        </div>
        <div className="px-4 py-4">
          <p className="font-mono text-sm text-muted-foreground leading-relaxed">
            Card condition is the single biggest factor in determining value.
            A PSA 10 Charizard can be worth <span className="text-terminal-green font-semibold">5× more</span> than the same card in PSA 7.
            Understanding grades helps you buy smarter, sell higher, and decide which cards are worth submitting for grading.
          </p>
        </div>
      </div>

      {/* Quick Condition Checklist */}
      <div className="terminal-card overflow-hidden">
        <div className="border-b border-border px-4 py-3">
          <h3 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold">
            Quick Condition Checklist
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {conditionChecklist.map((item) => (
            <div key={item.area} className="px-4 py-3 flex items-start gap-3">
              <span className="font-mono text-lg text-primary mt-0.5">{item.icon}</span>
              <div>
                <span className="font-mono text-xs font-semibold text-foreground">{item.area}</span>
                <p className="font-mono text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{item.what}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grade Breakdown */}
      <div className="terminal-card overflow-hidden">
        <div className="border-b border-border px-4 py-3">
          <h3 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold">
            Grade Breakdown & Value Multipliers
          </h3>
        </div>
        <div className="divide-y divide-border">
          {grades.map((g) => (
            <div key={g.grade} className="px-4 py-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className={`font-mono text-sm font-bold ${g.color}`}>{g.label}</span>
                  <span className="font-mono text-[10px] text-muted-foreground block mt-0.5">{g.grade}</span>
                </div>
                <span className={`font-mono text-[10px] px-2 py-1 rounded border ${g.bg} font-semibold whitespace-nowrap`}>
                  {g.multiplier}
                </span>
              </div>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed mb-2">{g.description}</p>
              <div className="space-y-1">
                {g.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Info className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="font-mono text-[11px] text-muted-foreground">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* When to Grade */}
      <div className="terminal-card overflow-hidden border-l-2 border-l-primary">
        <div className="px-4 py-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-mono text-xs font-bold text-foreground">Pro Tip: When Is Grading Worth It?</span>
            <p className="font-mono text-xs text-muted-foreground mt-1 leading-relaxed">
              Only submit cards worth <span className="text-foreground font-semibold">$50+ raw</span> that appear to be in Near Mint or better condition.
              Grading costs $25–150+ per card depending on service and turnaround.
              The potential value increase must justify the cost and risk of receiving a lower grade than expected.
              For modern cards under $20 raw, focus on proper storage over grading.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradingGuide;
