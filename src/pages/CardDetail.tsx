import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { rawCards, gradedCards, type CardData } from "@/data/marketData";
import { useCardDetail, type PokemonTCGCard } from "@/hooks/usePokemonTcg";
import { getBestPrice } from "@/lib/pokemonTcgApi";
import { useAuth } from "@/contexts/AuthContext";
import { useAddToPortfolio } from "@/hooks/usePortfolio";
import { useAddToWatchlist, useIsOnWatchlist } from "@/hooks/useWatchlist";
import { useAddPriceAlert } from "@/hooks/usePriceAlerts";
import { useCreateDeltaAlert } from "@/hooks/useDeltaAlerts";
import { getCardToken } from "@/lib/tokenSymbols";
import TerminalHeader from "@/components/TerminalHeader";
import TickerBar from "@/components/TickerBar";
import CardPriceHistory from "@/components/CardPriceHistory";
import VolumeChart from "@/components/VolumeChart";
import CardSignalBreakdown from "@/components/CardSignalBreakdown";
import CardSentimentPoll from "@/components/CardSentimentPoll";
import SellerComparison from "@/components/SellerComparison";
import AffiliateLinks from "@/components/AffiliateLinks";
import FinancialDisclaimer from "@/components/FinancialDisclaimer";
import { ArrowLeft, Loader2, Briefcase, Eye, EyeOff, Bell, Activity } from "lucide-react";

const allCards = [...rawCards, ...gradedCards];

const CardDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const addToPortfolio = useAddToPortfolio();
  const addToWatchlist = useAddToWatchlist();
  const addPriceAlert = useAddPriceAlert();
  const createDeltaAlert = useCreateDeltaAlert();
  const [showAlertInput, setShowAlertInput] = useState(false);
  const [alertPrice, setAlertPrice] = useState("");
  const [alertDirection, setAlertDirection] = useState<"below" | "above">("below");

  const isApiId = slug?.includes("-") && !slug.startsWith("%");
  const { data: apiCard, isLoading } = useCardDetail(isApiId ? slug : undefined);

  const localCard = useMemo(() => {
    if (isApiId) return null;
    return allCards.find(
      (c) => encodeURIComponent(`${c.name}-${c.set}-${c.number}`.replace(/\s+/g, "-").toLowerCase()) === slug
    );
  }, [slug, isApiId]);

  const card: (CardData & { _image?: string }) | null = useMemo(() => {
    if (apiCard) {
      const price = getBestPrice(apiCard);
      if (!price) return null;
      const hash = apiCard.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      return {
        name: apiCard.name,
        set: apiCard.set.name,
        number: apiCard.number,
        market: price.market,
        low: price.low,
        mid: price.mid,
        change: Math.round(((hash % 1000) / 100 - 5) * 100) / 100,
        _image: apiCard.images.large,
      };
    }
    return localCard || null;
  }, [apiCard, localCard]);

  const cardApiId = isApiId ? slug : slug ? `local-${slug}` : undefined;
  const isWatched = useIsOnWatchlist(cardApiId);
  const token = card ? getCardToken(card) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <TerminalHeader />
        <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span className="font-mono text-sm text-muted-foreground">Loading card data…</span>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-background">
        <TerminalHeader />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="font-mono text-muted-foreground">Card not found.</p>
          <button onClick={() => navigate("/")} className="mt-4 font-mono text-sm text-primary hover:underline">
            ← Back to Terminal
          </button>
        </div>
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

        {/* Card header with image */}
        <div className="terminal-card p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {card._image && (
              <img
                src={card._image}
                alt={card.name}
                className="w-48 rounded-lg shadow-lg self-start"
              />
            )}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-mono text-xl font-bold text-foreground">{card.name}</h1>
                    {token && (
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                        {token}
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-sm text-muted-foreground mt-1">
                    {card.set} • #{card.number}
                    {card.grade && <span className="ml-2 text-terminal-amber font-semibold">{card.grade}</span>}
                  </p>
                  {apiCard && (
                    <p className="font-mono text-[10px] text-muted-foreground mt-1">
                      Updated: {apiCard.tcgplayer?.updatedAt || "N/A"}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-mono text-2xl font-bold text-foreground">
                    ${card.market.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                  <p className={`font-mono text-sm font-semibold ${card.change >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
                    {card.change >= 0 ? "▲" : "▼"} {Math.abs(card.change).toFixed(2)}%
                  </p>
                  {user && slug && (
                    <>
                      <div className="flex items-center gap-2 mt-2 justify-end">
                        <button
                          onClick={() =>
                            addToWatchlist.mutate({
                              card_api_id: cardApiId!,
                              card_name: card.name,
                              card_set: card.set,
                              card_number: card.number,
                              card_image: card._image,
                            })
                          }
                          disabled={addToWatchlist.isPending || isWatched}
                          className={`flex items-center gap-1.5 font-mono text-xs font-semibold rounded px-3 py-1.5 transition-opacity ${
                            isWatched
                              ? "bg-terminal-amber/20 text-terminal-amber border border-terminal-amber/30"
                              : "bg-muted text-foreground hover:bg-muted/80"
                          } disabled:opacity-50`}
                        >
                          {isWatched ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          {isWatched ? "Watching" : "Watch"}
                        </button>
                        <button
                          onClick={() =>
                            addToPortfolio.mutate({
                              card_api_id: isApiId ? slug : `local-${slug}`,
                              card_name: card.name,
                              card_set: card.set,
                              card_number: card.number,
                              card_image: card._image,
                              purchase_price: card.market,
                            })
                          }
                          disabled={addToPortfolio.isPending}
                          className="flex items-center gap-1.5 font-mono text-xs font-semibold bg-primary text-primary-foreground rounded px-3 py-1.5 hover:opacity-90 disabled:opacity-50"
                        >
                          <Briefcase className="w-3.5 h-3.5" />
                          {addToPortfolio.isPending ? "Adding…" : "Add to Portfolio"}
                        </button>
                        <button
                          onClick={() => setShowAlertInput(!showAlertInput)}
                          className="flex items-center gap-1.5 font-mono text-xs font-semibold bg-muted text-foreground rounded px-3 py-1.5 hover:bg-muted/80"
                        >
                          <Bell className="w-3.5 h-3.5" />
                          Alert
                        </button>
                      </div>
                      {showAlertInput && (
                        <div className="flex items-center gap-2 mt-2 justify-end">
                          <select
                            value={alertDirection}
                            onChange={(e) => setAlertDirection(e.target.value as "below" | "above")}
                            className="font-mono text-[10px] bg-muted border border-border rounded px-2 py-1 text-foreground"
                          >
                            <option value="below">Below</option>
                            <option value="above">Above</option>
                          </select>
                          <input
                            type="number"
                            step="0.01"
                            value={alertPrice}
                            onChange={(e) => setAlertPrice(e.target.value)}
                            placeholder="Target $"
                            className="w-24 font-mono text-xs bg-muted border border-border rounded px-2 py-1 text-foreground placeholder:text-muted-foreground"
                          />
                          <button
                            onClick={() => {
                              if (!alertPrice) return;
                              addPriceAlert.mutate({
                                card_api_id: cardApiId!,
                                card_name: card.name,
                                card_set: card.set,
                                card_number: card.number,
                                card_image: card._image,
                                target_price: parseFloat(alertPrice),
                                direction: alertDirection,
                              });
                              setShowAlertInput(false);
                              setAlertPrice("");
                            }}
                            disabled={addPriceAlert.isPending || !alertPrice}
                            className="font-mono text-xs font-semibold bg-terminal-green text-background rounded px-3 py-1 hover:opacity-90 disabled:opacity-50"
                          >
                            Set
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Low</p>
                  <p className="font-mono text-sm font-semibold text-foreground">
                    ${card.low.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Mid</p>
                  <p className="font-mono text-sm font-semibold text-foreground">
                    ${card.mid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Market</p>
                  <p className="font-mono text-sm font-semibold text-foreground">
                    ${card.market.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* All price variants from API */}
              {apiCard?.tcgplayer?.prices && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">All Variants</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(apiCard.tcgplayer.prices).map(([variant, prices]) => (
                      prices?.market ? (
                        <div key={variant} className="flex justify-between px-2 py-1 rounded bg-muted">
                          <span className="font-mono text-[10px] text-muted-foreground capitalize">
                            {variant.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <span className="font-mono text-xs text-foreground font-semibold">
                            ${prices.market.toFixed(2)}
                          </span>
                        </div>
                      ) : null
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Price History Chart */}
        <CardPriceHistory card={card} />

        {/* Volume Chart */}
        <VolumeChart card={card} />

        {/* AI Signal Breakdown */}
        <CardSignalBreakdown card={card} />

        {/* Community Sentiment */}
        {cardApiId && <CardSentimentPoll cardApiId={cardApiId} />}

        {/* Affiliate Buy Links */}
        <div className="terminal-card p-4">
          <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">Buy This Card</h3>
          <AffiliateLinks cardName={card.name} setName={card.set} />
        </div>

        {/* Seller Comparison */}
        <SellerComparison card={card} />

        {/* Disclaimer */}
        <FinancialDisclaimer />
      </main>
    </div>
  );
};

export default CardDetail;
