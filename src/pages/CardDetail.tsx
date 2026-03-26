import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { rawCards, gradedCards, sealedProducts, type CardData } from "@/data/marketData";
import TerminalHeader from "@/components/TerminalHeader";
import TickerBar from "@/components/TickerBar";
import CardPriceHistory from "@/components/CardPriceHistory";
import SellerComparison from "@/components/SellerComparison";
import MarketCapSummary from "@/components/MarketCapSummary";
import { ArrowLeft } from "lucide-react";

const allCards = [...rawCards, ...gradedCards];

const CardDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const card = useMemo(() => {
    return allCards.find(
      (c) => encodeURIComponent(`${c.name}-${c.set}-${c.number}`.replace(/\s+/g, "-").toLowerCase()) === slug
    );
  }, [slug]);

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
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Terminal
        </button>

        {/* Card header */}
        <div className="terminal-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-mono text-xl font-bold text-foreground">{card.name}</h1>
              <p className="font-mono text-sm text-muted-foreground mt-1">
                {card.set} • #{card.number}
                {card.grade && <span className="ml-2 text-terminal-amber font-semibold">{card.grade}</span>}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-2xl font-bold text-foreground">
                ${card.market.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <p className={`font-mono text-sm font-semibold ${card.change >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
                {card.change >= 0 ? "▲" : "▼"} {Math.abs(card.change).toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Price summary row */}
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
        </div>

        {/* Full Price History Chart */}
        <CardPriceHistory card={card} />

        {/* Seller Price Comparison */}
        <SellerComparison card={card} />

        {/* Market Cap Summary */}
        <MarketCapSummary />
      </main>
    </div>
  );
};

export default CardDetail;
