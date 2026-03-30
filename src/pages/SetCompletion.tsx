import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSets, fetchSetCards, getBestPrice, type PokemonTCGSet } from "@/lib/pokemonTcgApi";
import { useAuth } from "@/contexts/AuthContext";
import { usePortfolio } from "@/hooks/usePortfolio";
import TerminalHeader from "@/components/TerminalHeader";
import TickerBar from "@/components/TickerBar";
import AuthModal from "@/components/AuthModal";
import { ArrowLeft, Search, Loader2, CheckCircle, Circle, ChevronRight } from "lucide-react";
import FinancialDisclaimer from "@/components/FinancialDisclaimer";

const SetCompletion = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSet, setSelectedSet] = useState<PokemonTCGSet | null>(null);

  const { data: portfolio } = usePortfolio();
  const { data: sets, isLoading: setsLoading } = useQuery({
    queryKey: ["tcg-sets"],
    queryFn: fetchSets,
    staleTime: 30 * 60 * 1000,
  });

  // Cards owned per set (by set ID prefix in card_api_id e.g. "sv7-123")
  const ownedBySet = useMemo(() => {
    if (!portfolio) return {};
    const map: Record<string, Set<string>> = {};
    for (const card of portfolio) {
      const setId = card.card_api_id.split("-").slice(0, -1).join("-") || card.card_api_id.replace(/\d+$/, "");
      if (!map[setId]) map[setId] = new Set();
      map[setId].add(card.card_api_id);
    }
    return map;
  }, [portfolio]);

  // Filter sets
  const filteredSets = useMemo(() => {
    if (!sets) return [];
    const q = searchQuery.toLowerCase();
    return sets.filter((s) =>
      !q || s.name.toLowerCase().includes(q) || s.series.toLowerCase().includes(q)
    );
  }, [sets, searchQuery]);

  // Sort: sets with progress first
  const sortedSets = useMemo(() => {
    return [...filteredSets].sort((a, b) => {
      const aOwned = ownedBySet[a.id]?.size ?? 0;
      const bOwned = ownedBySet[b.id]?.size ?? 0;
      if (aOwned > 0 && bOwned === 0) return -1;
      if (bOwned > 0 && aOwned === 0) return 1;
      return 0;
    });
  }, [filteredSets, ownedBySet]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <TerminalHeader />
        <TickerBar />
        <main className="max-w-7xl mx-auto px-4 py-12 text-center space-y-4">
          <h1 className="font-mono text-lg font-bold text-foreground">Set Completion Tracker</h1>
          <p className="font-mono text-sm text-muted-foreground">Sign in to track your set completion progress.</p>
          <button onClick={() => setShowAuth(true)} className="font-mono text-sm font-semibold bg-primary text-primary-foreground rounded px-6 py-2.5 hover:opacity-90">Sign In</button>
          {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />
      <TickerBar />
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6">
        <button onClick={() => selectedSet ? setSelectedSet(null) : navigate("/")} className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> {selectedSet ? "Back to Sets" : "Back to Terminal"}
        </button>

        {!selectedSet ? (
          <>
            <div className="terminal-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="font-mono text-lg font-bold text-foreground flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" /> Set Completion Tracker
                </h1>
                <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                  Track how close you are to completing each set
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sets…"
                  className="w-full rounded border border-border bg-muted pl-10 pr-4 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {setsLoading ? (
              <div className="flex items-center justify-center py-12 gap-2">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                <span className="font-mono text-xs text-muted-foreground">Loading sets…</span>
              </div>
            ) : (
              <div className="space-y-2">
                {sortedSets.map((set) => {
                  const owned = ownedBySet[set.id]?.size ?? 0;
                  const pct = set.total > 0 ? Math.round((owned / set.total) * 100) : 0;
                  return (
                    <button
                      key={set.id}
                      onClick={() => setSelectedSet(set)}
                      className="terminal-card p-3 w-full text-left hover:border-primary/50 transition-colors flex items-center gap-3"
                    >
                      <img src={set.images.symbol} alt="" className="w-6 h-6 object-contain flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-mono text-xs text-foreground font-medium truncate">{set.name}</p>
                          <span className={`font-mono text-[10px] font-semibold ml-2 ${pct === 100 ? "text-terminal-green" : pct > 0 ? "text-primary" : "text-muted-foreground"}`}>
                            {owned}/{set.total}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? "bg-terminal-green" : "bg-primary"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="font-mono text-[9px] text-muted-foreground w-8 text-right">{pct}%</span>
                        </div>
                        <p className="font-mono text-[9px] text-muted-foreground mt-0.5">{set.series} • {set.releaseDate.slice(0, 4)}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <SetDetailView set={selectedSet} ownedCards={ownedBySet[selectedSet.id] ?? new Set()} navigate={navigate} />
        )}
        <FinancialDisclaimer compact />
      </main>
    </div>
  );
};

function SetDetailView({ set, ownedCards, navigate }: { set: PokemonTCGSet; ownedCards: Set<string>; navigate: (path: string) => void }) {
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 50;

  const { data, isLoading } = useQuery({
    queryKey: ["set-cards", set.id, page],
    queryFn: () => fetchSetCards(set.id, page, PAGE_SIZE),
    staleTime: 10 * 60 * 1000,
  });

  const totalPages = data ? Math.ceil(data.totalCount / PAGE_SIZE) : 0;
  const owned = ownedCards.size;
  const pct = set.total > 0 ? Math.round((owned / set.total) * 100) : 0;

  return (
    <>
      <div className="terminal-card p-4">
        <div className="flex items-center gap-3">
          <img src={set.images.logo} alt={set.name} className="h-8 object-contain" />
          <div className="flex-1">
            <h1 className="font-mono text-lg font-bold text-foreground">{set.name}</h1>
            <p className="font-mono text-[10px] text-muted-foreground">
              {set.series} • {owned}/{set.total} collected ({pct}%)
            </p>
          </div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
          <div className={`h-full rounded-full transition-all ${pct === 100 ? "bg-terminal-green" : "bg-primary"}`} style={{ width: `${pct}%` }} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 gap-2">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span className="font-mono text-xs text-muted-foreground">Loading cards…</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {data?.cards.map((card) => {
              const isOwned = ownedCards.has(card.id);
              const price = getBestPrice(card);
              return (
                <button
                  key={card.id}
                  onClick={() => navigate(`/card/${card.id}`)}
                  className={`terminal-card overflow-hidden text-left transition-all group relative ${isOwned ? "border-primary/50" : "opacity-60 hover:opacity-100"}`}
                >
                  {isOwned && (
                    <div className="absolute top-1 right-1 z-10">
                      <CheckCircle className="w-4 h-4 text-terminal-green drop-shadow" />
                    </div>
                  )}
                  {!isOwned && (
                    <div className="absolute top-1 right-1 z-10">
                      <Circle className="w-4 h-4 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="aspect-[2.5/3.5] bg-muted overflow-hidden">
                    <img src={card.images.small} alt={card.name} className="w-full h-full object-contain" loading="lazy" />
                  </div>
                  <div className="p-1.5">
                    <p className="font-mono text-[9px] text-foreground truncate">{card.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[8px] text-muted-foreground">#{card.number}</span>
                      {price && <span className="font-mono text-[9px] text-terminal-green font-semibold">${price.market.toFixed(2)}</span>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 py-4">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="font-mono text-xs text-muted-foreground hover:text-foreground disabled:opacity-30">← Prev</button>
              <span className="font-mono text-xs text-foreground">Page {page}/{totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="font-mono text-xs text-muted-foreground hover:text-foreground disabled:opacity-30">Next →</button>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default SetCompletion;
