import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchSets, fetchSetCards, getBestPrice, type PokemonTCGSet, type PokemonTCGCard } from "@/lib/pokemonTcgApi";
import TerminalHeader from "@/components/TerminalHeader";
import TickerBar from "@/components/TickerBar";
import { ArrowLeft, Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

const SetBrowser = () => {
  const navigate = useNavigate();
  const [selectedSet, setSelectedSet] = useState<PokemonTCGSet | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cardPage, setCardPage] = useState(1);
  const PAGE_SIZE = 36;

  // Fetch all sets
  const { data: sets, isLoading: setsLoading } = useQuery({
    queryKey: ["tcg-sets"],
    queryFn: fetchSets,
    staleTime: 30 * 60 * 1000,
  });

  // Fetch cards for selected set
  const { data: setCardsData, isLoading: cardsLoading } = useQuery({
    queryKey: ["set-cards", selectedSet?.id, cardPage],
    queryFn: () => fetchSetCards(selectedSet!.id, cardPage, PAGE_SIZE),
    enabled: !!selectedSet,
    staleTime: 10 * 60 * 1000,
  });

  // Filter sets by search
  const filteredSets = useMemo(() => {
    if (!sets) return [];
    if (!searchQuery) return sets;
    const q = searchQuery.toLowerCase();
    return sets.filter(
      (s) => s.name.toLowerCase().includes(q) || s.series.toLowerCase().includes(q)
    );
  }, [sets, searchQuery]);

  // Group sets by series
  const groupedSets = useMemo(() => {
    const groups: Record<string, PokemonTCGSet[]> = {};
    for (const set of filteredSets) {
      if (!groups[set.series]) groups[set.series] = [];
      groups[set.series].push(set);
    }
    return groups;
  }, [filteredSets]);

  const totalPages = setCardsData ? Math.ceil(setCardsData.totalCount / PAGE_SIZE) : 0;

  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />
      <TickerBar />

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6">
        <button
          onClick={() => (selectedSet ? (setSelectedSet(null), setCardPage(1)) : navigate("/"))}
          className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {selectedSet ? "Back to Sets" : "Back to Terminal"}
        </button>

        {!selectedSet ? (
          /* ── SET LIST VIEW ── */
          <>
            <div className="terminal-card p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-mono text-lg font-bold text-foreground">Set Browser</h1>
                  <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                    {sets?.length ?? "…"} sets • Browse every Pokémon TCG set with live pricing
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
            </div>

            {setsLoading ? (
              <div className="flex items-center justify-center py-12 gap-2">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                <span className="font-mono text-xs text-muted-foreground">Loading sets…</span>
              </div>
            ) : (
              Object.entries(groupedSets).map(([series, seriesSets]) => (
                <div key={series}>
                  <h2 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold mb-3">
                    {series} Series
                    <span className="text-muted-foreground ml-2 font-normal">({seriesSets.length})</span>
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {seriesSets.map((set) => (
                      <button
                        key={set.id}
                        onClick={() => { setSelectedSet(set); setCardPage(1); }}
                        className="terminal-card p-3 text-left hover:border-primary/50 transition-colors group"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <img src={set.images.symbol} alt="" className="w-5 h-5 object-contain" />
                          <img src={set.images.logo} alt={set.name} className="h-6 object-contain max-w-[80%]" />
                        </div>
                        <p className="font-mono text-xs text-foreground font-medium truncate group-hover:text-primary transition-colors">
                          {set.name}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {set.total} cards
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {set.releaseDate.slice(0, 4)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </>
        ) : (
          /* ── CARD GRID VIEW ── */
          <>
            <div className="terminal-card p-4">
              <div className="flex items-center gap-3">
                <img src={selectedSet.images.logo} alt={selectedSet.name} className="h-8 object-contain" />
                <div>
                  <h1 className="font-mono text-lg font-bold text-foreground">{selectedSet.name}</h1>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {selectedSet.series} • {selectedSet.total} cards • Released {selectedSet.releaseDate}
                  </p>
                </div>
              </div>
            </div>

            {cardsLoading ? (
              <div className="flex items-center justify-center py-12 gap-2">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                <span className="font-mono text-xs text-muted-foreground">Loading cards…</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {setCardsData?.cards.map((card) => (
                    <CardTile key={card.id} card={card} onClick={() => navigate(`/card/${card.id}`)} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 py-4">
                    <button
                      onClick={() => setCardPage((p) => Math.max(1, p - 1))}
                      disabled={cardPage === 1}
                      className="flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    <span className="font-mono text-xs text-foreground">
                      Page {cardPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCardPage((p) => Math.min(totalPages, p + 1))}
                      disabled={cardPage === totalPages}
                      className="flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

/* ── Card Tile Component ── */
const CardTile = ({ card, onClick }: { card: PokemonTCGCard; onClick: () => void }) => {
  const price = getBestPrice(card);

  return (
    <button
      onClick={onClick}
      className="terminal-card overflow-hidden text-left hover:border-primary/50 transition-all group"
    >
      <div className="relative aspect-[2.5/3.5] bg-muted overflow-hidden">
        <img
          src={card.images.small}
          alt={card.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-2">
        <p className="font-mono text-[11px] text-foreground font-medium truncate group-hover:text-primary transition-colors">
          {card.name}
        </p>
        <div className="flex items-center justify-between mt-0.5">
          <span className="font-mono text-[10px] text-muted-foreground">#{card.number}</span>
          {price ? (
            <span className="font-mono text-[11px] text-terminal-green font-semibold">
              ${price.market.toFixed(2)}
            </span>
          ) : (
            <span className="font-mono text-[10px] text-muted-foreground">—</span>
          )}
        </div>
        {card.rarity && (
          <span className="font-mono text-[9px] text-muted-foreground">{card.rarity}</span>
        )}
      </div>
    </button>
  );
};

export default SetBrowser;
