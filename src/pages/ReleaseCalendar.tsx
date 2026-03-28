import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TerminalHeader from "@/components/TerminalHeader";
import TickerBar from "@/components/TickerBar";
import FinancialDisclaimer from "@/components/FinancialDisclaimer";
import { CalendarDays, ArrowLeft, Clock, Package, Star, ChevronRight } from "lucide-react";

interface SetRelease {
  name: string;
  series: string;
  releaseDate: string;
  status: "released" | "upcoming" | "rumored";
  description: string;
  cardCount?: number;
  highlights?: string[];
}

const releases: SetRelease[] = [
  {
    name: "Prismatic Evolutions",
    series: "Scarlet & Violet",
    releaseDate: "2025-01-17",
    status: "released",
    description: "Features Eevee and all Eeveelutions with stunning prismatic artwork.",
    cardCount: 186,
    highlights: ["Umbreon ex SIR", "Sylveon ex SIR", "Eevee Illustration Rare"],
  },
  {
    name: "Journey Together",
    series: "Scarlet & Violet",
    releaseDate: "2025-03-28",
    status: "released",
    description: "Trainer-Pokémon partnerships take center stage with unique dual artwork.",
    cardCount: 162,
    highlights: ["Pikachu & Red SAR", "N's Zoroark ex", "Trainer Gallery"],
  },
  {
    name: "Destined Rivals",
    series: "Scarlet & Violet",
    releaseDate: "2025-05-30",
    status: "released",
    description: "Rival trainers clash with powerful new ex cards and competitive staples.",
    cardCount: 182,
    highlights: ["Cynthia's Garchomp ex SIR", "Rival Full Arts", "Stadium cards"],
  },
  {
    name: "Paldean Twilight",
    series: "Scarlet & Violet",
    releaseDate: "2025-08-08",
    status: "upcoming",
    description: "Explore the twilight regions of Paldea with new Paradox and Legendary Pokémon.",
    highlights: ["New Paradox forms", "Legendary Pokémon ex", "Illustration Rares"],
  },
  {
    name: "SV Set 9",
    series: "Scarlet & Violet",
    releaseDate: "2025-11-07",
    status: "upcoming",
    description: "The penultimate Scarlet & Violet set — expected to feature Area Zero Pokémon.",
    highlights: ["Final SV legendaries", "Competitive staples", "Chase SIRs"],
  },
  {
    name: "SV Set 10 (Final)",
    series: "Scarlet & Violet",
    releaseDate: "2026-02-06",
    status: "rumored",
    description: "Rumored final set of the Scarlet & Violet era before the next generation.",
    highlights: ["Potential farewell SIRs", "Legacy cards", "Generation transition"],
  },
  {
    name: "Generation X — Set 1",
    series: "New Generation",
    releaseDate: "2026-05-01",
    status: "rumored",
    description: "First set of the new Pokémon TCG generation, coinciding with the next game release.",
    highlights: ["New mechanics", "Starter Pokémon ex", "New rarity types"],
  },
];

const statusColors: Record<string, string> = {
  released: "text-terminal-green border-terminal-green/30 bg-terminal-green/10",
  upcoming: "text-terminal-amber border-terminal-amber/30 bg-terminal-amber/10",
  rumored: "text-terminal-blue border-terminal-blue/30 bg-terminal-blue/10",
};

const statusLabels: Record<string, string> = {
  released: "RELEASED",
  upcoming: "UPCOMING",
  rumored: "RUMORED",
};

const ReleaseCalendar = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "released" | "upcoming" | "rumored">("all");

  const filtered = filter === "all" ? releases : releases.filter((r) => r.status === filter);

  const now = new Date();
  const nextRelease = releases.find((r) => new Date(r.releaseDate) > now && r.status === "upcoming");

  const daysUntil = nextRelease
    ? Math.ceil((new Date(nextRelease.releaseDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />
      <TickerBar />

      <main className="max-w-4xl mx-auto px-4 lg:px-6 py-6 space-y-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Terminal
        </button>

        {/* Header */}
        <div className="terminal-card p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-mono text-lg font-bold text-foreground flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" /> Release Calendar
              </h1>
              <p className="font-mono text-xs text-muted-foreground mt-1">
                Upcoming & recent Pokémon TCG set releases — plan your investments.
              </p>
            </div>
            {nextRelease && daysUntil !== null && (
              <div className="flex items-center gap-2 px-3 py-2 rounded border border-terminal-amber/30 bg-terminal-amber/5">
                <Clock className="w-4 h-4 text-terminal-amber" />
                <div>
                  <p className="font-mono text-[10px] text-terminal-amber font-semibold uppercase">Next Release</p>
                  <p className="font-mono text-xs text-foreground font-bold">
                    {nextRelease.name} — {daysUntil}d
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {(["all", "released", "upcoming", "rumored"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded font-mono text-[10px] uppercase tracking-wider font-semibold transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {f === "all" ? "All Sets" : statusLabels[f]}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          {filtered.map((release, i) => {
            const releaseDate = new Date(release.releaseDate);
            const isPast = releaseDate < now;
            return (
              <div
                key={release.name}
                className="terminal-card overflow-hidden hover:border-primary/30 transition-colors"
              >
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-mono text-sm font-bold text-foreground">{release.name}</h3>
                        <span
                          className={`px-2 py-0.5 rounded font-mono text-[9px] font-semibold uppercase border ${statusColors[release.status]}`}
                        >
                          {statusLabels[release.status]}
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-muted-foreground">{release.description}</p>
                      {release.highlights && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {release.highlights.map((h) => (
                            <span
                              key={h}
                              className="px-2 py-0.5 rounded bg-muted font-mono text-[9px] text-muted-foreground"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right sm:text-right flex-shrink-0 space-y-1">
                      <p className="font-mono text-xs font-semibold text-foreground">
                        {releaseDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                      <p className="font-mono text-[10px] text-muted-foreground">{release.series}</p>
                      {release.cardCount && (
                        <div className="flex items-center gap-1 justify-end">
                          <Package className="w-3 h-3 text-muted-foreground" />
                          <span className="font-mono text-[10px] text-muted-foreground">{release.cardCount} cards</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <FinancialDisclaimer />

        {/* Footer */}
        <footer className="border-t border-border pt-6 pb-4">
          <p className="font-mono text-[10px] text-muted-foreground text-center">
            Release dates are estimates based on publicly available information. Dates may change.
            Pokémon and Pokémon TCG are trademarks of Nintendo / Creatures Inc. / GAME FREAK Inc.
            © {new Date().getFullYear()} PGVA Ventures, LLC. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default ReleaseCalendar;
