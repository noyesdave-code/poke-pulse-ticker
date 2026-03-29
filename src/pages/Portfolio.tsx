import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePortfolio, useRemoveFromPortfolio, useUpdatePortfolioCard, type PortfolioCard } from "@/hooks/usePortfolio";
import { useQuery } from "@tanstack/react-query";
import { fetchCardById, getBestPrice } from "@/lib/pokemonTcgApi";
import TerminalHeader from "@/components/TerminalHeader";
import NotificationSettings from "@/components/NotificationSettings";
import TickerBar from "@/components/TickerBar";
import AuthModal from "@/components/AuthModal";
import { ArrowLeft, Trash2, Loader2, TrendingUp, TrendingDown, Minus, Plus, Activity } from "lucide-react";

const Portfolio = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const { data: portfolio, isLoading } = usePortfolio();
  const removeCard = useRemoveFromPortfolio();
  const updateCard = useUpdatePortfolioCard();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <TerminalHeader />
        <TickerBar />
        <main className="max-w-7xl mx-auto px-4 py-12 text-center space-y-4">
          <h1 className="font-mono text-lg font-bold text-foreground">Portfolio Tracker</h1>
          <p className="font-mono text-sm text-muted-foreground">
            Sign in to track your Pokémon card collection and monitor its value.
          </p>
          <button
            onClick={() => setShowAuth(true)}
            className="font-mono text-sm font-semibold bg-primary text-primary-foreground rounded px-6 py-2.5 hover:opacity-90"
          >
            Sign In to Get Started
          </button>
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
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Terminal
        </button>

        <div className="terminal-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-mono text-lg font-bold text-foreground">My Portfolio</h1>
            <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
              Track your collection's value with live market prices
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 font-mono text-xs font-semibold bg-primary/10 text-primary border border-primary/30 rounded px-3 py-1.5 hover:bg-primary/20 transition-colors"
          >
            <Activity className="w-3.5 h-3.5" />
            View Dashboard
          </button>
        </div>

        {/* Email Notification Settings */}
        <NotificationSettings />

        {isLoading ? (
          <div className="flex items-center justify-center py-12 gap-2">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <span className="font-mono text-xs text-muted-foreground">Loading portfolio…</span>
          </div>
        ) : !portfolio || portfolio.length === 0 ? (
          <div className="terminal-card p-8 text-center">
            <p className="font-mono text-sm text-muted-foreground">Your portfolio is empty.</p>
            <p className="font-mono text-xs text-muted-foreground mt-2">
              Browse the <button onClick={() => navigate("/sets")} className="text-primary hover:underline">Set Browser</button> or search for cards and click "Add to Portfolio".
            </p>
          </div>
        ) : (
          <PortfolioContent portfolio={portfolio} removeCard={removeCard} updateCard={updateCard} navigate={navigate} />
        )}

        <FinancialDisclaimer compact />
      </main>
    </div>
  );
};

/* Portfolio content with live prices */
function PortfolioContent({
  portfolio,
  removeCard,
  updateCard,
  navigate,
}: {
  portfolio: PortfolioCard[];
  removeCard: ReturnType<typeof useRemoveFromPortfolio>;
  updateCard: ReturnType<typeof useUpdatePortfolioCard>;
  navigate: ReturnType<typeof useNavigate>;
}) {
  // Fetch live prices for all portfolio cards
  const { data: livePrices } = useQuery({
    queryKey: ["portfolio-prices", portfolio.map((c) => c.card_api_id).join(",")],
    queryFn: async () => {
      const prices: Record<string, { market: number; low: number; mid: number; high: number }> = {};
      // Fetch in batches of 5 to avoid rate limiting
      for (let i = 0; i < portfolio.length; i += 5) {
        const batch = portfolio.slice(i, i + 5);
        const results = await Promise.allSettled(
          batch.map(async (card) => {
            const apiCard = await fetchCardById(card.card_api_id);
            const price = getBestPrice(apiCard);
            if (price) prices[card.card_api_id] = price;
          })
        );
      }
      return prices;
    },
    staleTime: 5 * 60 * 1000,
  });

  const summary = useMemo(() => {
    let totalCurrent = 0;
    let totalPurchase = 0;
    let cardsWithPrice = 0;

    for (const card of portfolio) {
      const livePrice = livePrices?.[card.card_api_id];
      if (livePrice) {
        totalCurrent += livePrice.market * card.quantity;
        cardsWithPrice++;
      }
      if (card.purchase_price) {
        totalPurchase += card.purchase_price * card.quantity;
      }
    }

    const totalCards = portfolio.reduce((s, c) => s + c.quantity, 0);
    const pnl = totalPurchase > 0 ? totalCurrent - totalPurchase : 0;
    const pnlPct = totalPurchase > 0 ? (pnl / totalPurchase) * 100 : 0;

    return { totalCurrent, totalPurchase, totalCards, pnl, pnlPct, cardsWithPrice };
  }, [portfolio, livePrices]);

  return (
    <>
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard label="Current Value" value={`$${summary.totalCurrent.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} />
        <SummaryCard label="Total Cards" value={String(summary.totalCards)} />
        <SummaryCard label="Cost Basis" value={summary.totalPurchase > 0 ? `$${summary.totalPurchase.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "—"} />
        <div className="terminal-card p-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">P&L</p>
          {summary.totalPurchase > 0 ? (
            <div className="flex items-center gap-1 mt-1">
              {summary.pnl >= 0 ? <TrendingUp className="w-4 h-4 text-terminal-green" /> : <TrendingDown className="w-4 h-4 text-terminal-red" />}
              <span className={`font-mono text-base font-bold ${summary.pnl >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
                {summary.pnl >= 0 ? "+" : ""}${Math.abs(summary.pnl).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
              <span className={`font-mono text-xs ${summary.pnl >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
                ({summary.pnlPct >= 0 ? "+" : ""}{summary.pnlPct.toFixed(1)}%)
              </span>
            </div>
          ) : (
            <p className="font-mono text-base font-bold text-muted-foreground mt-1">—</p>
          )}
        </div>
      </div>

      {/* Card list */}
      <div className="terminal-card overflow-hidden">
        <div className="border-b border-border px-4 py-3 flex items-center justify-between">
          <h2 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold">
            Collection
          </h2>
          <span className="font-mono text-[10px] text-muted-foreground">{portfolio.length} unique cards</span>
        </div>
        <div className="divide-y divide-border">
          {portfolio.map((card) => {
            const livePrice = livePrices?.[card.card_api_id];
            const currentValue = livePrice ? livePrice.market * card.quantity : null;
            const costBasis = card.purchase_price ? card.purchase_price * card.quantity : null;
            const pnl = currentValue && costBasis ? currentValue - costBasis : null;

            return (
              <div
                key={card.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
              >
                {/* Image */}
                {card.card_image && (
                  <img
                    src={card.card_image}
                    alt={card.card_name}
                    className="w-10 h-14 rounded object-cover cursor-pointer"
                    onClick={() => navigate(`/card/${card.card_api_id}`)}
                  />
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => navigate(`/card/${card.card_api_id}`)}
                    className="font-mono text-sm text-foreground font-medium hover:text-primary transition-colors truncate block"
                  >
                    {card.card_name}
                  </button>
                  <p className="font-mono text-[10px] text-muted-foreground truncate">
                    {card.card_set} • #{card.card_number}
                  </p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      if (card.quantity <= 1) {
                        removeCard.mutate(card.id);
                      } else {
                        updateCard.mutate({ id: card.id, quantity: card.quantity - 1 });
                      }
                    }}
                    className="w-6 h-6 flex items-center justify-center rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-mono text-xs text-foreground w-6 text-center">{card.quantity}</span>
                  <button
                    onClick={() => updateCard.mutate({ id: card.id, quantity: card.quantity + 1 })}
                    className="w-6 h-6 flex items-center justify-center rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Price */}
                <div className="text-right min-w-[80px]">
                  {livePrice ? (
                    <>
                      <p className="font-mono text-sm text-foreground font-semibold">
                        ${(livePrice.market * card.quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                      {pnl !== null && (
                        <p className={`font-mono text-[10px] font-semibold ${pnl >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
                          {pnl >= 0 ? "+" : ""}${Math.abs(pnl).toFixed(2)}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="font-mono text-xs text-muted-foreground">Loading…</p>
                  )}
                </div>

                {/* Delete */}
                <button
                  onClick={() => removeCard.mutate(card.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors ml-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="terminal-card p-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="font-mono text-base font-bold text-foreground mt-1">{value}</p>
    </div>
  );
}

export default Portfolio;
