import { rawCards, gradedCards, sealedProducts, getIndexValue, getIndexChange } from "@/data/marketData";
import { useLiveCards } from "@/hooks/usePokemonTcg";
import TerminalHeader from "@/components/TerminalHeader";
import TickerBar from "@/components/TickerBar";
import MarketIndexCard from "@/components/MarketIndexCard";
import TopMoversTable from "@/components/TopMoversTable";
import MarketTabs from "@/components/MarketTabs";
import SubscriptionTiers from "@/components/SubscriptionTiers";
import CardSearch from "@/components/CardSearch";
import PriceChart from "@/components/PriceChart";
import MarketCapSummary from "@/components/MarketCapSummary";
import InstallPrompt from "@/components/InstallPrompt";

const Index = () => {
  const { data: liveCards, isLoading } = useLiveCards();

  const displayCards = liveCards && liveCards.length > 0 ? liveCards : rawCards;

  const rawIndex = getIndexValue(displayCards);
  const rawChange = getIndexChange(displayCards);
  const gradedIndex = getIndexValue(gradedCards);
  const gradedChange = getIndexChange(gradedCards);
  const sealedIndex = getIndexValue(sealedProducts);
  const sealedChange = getIndexChange(sealedProducts);

  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />
      <TickerBar cards={displayCards} isLive={!!liveCards && liveCards.length > 0} />

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6">
        {/* Live indicator */}
        {liveCards && liveCards.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-terminal-green"></span>
            </span>
            <span className="font-mono text-[10px] text-terminal-green uppercase tracking-widest">
              Live Data — pokemontcg.io
            </span>
          </div>
        )}
        {isLoading && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest animate-pulse">
              Loading live market data…
            </span>
          </div>
        )}

        {/* Market Index Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MarketIndexCard
            title="RAW 500 INDEX"
            value={rawIndex}
            change={rawChange}
            count={displayCards.length}
            description="Average tracked raw card market value"
            variant="green"
          />
          <MarketIndexCard
            title="GRADED 1000 INDEX"
            value={gradedIndex}
            change={gradedChange}
            count={gradedCards.length}
            description="Average tracked graded card market value"
            variant="amber"
          />
          <MarketIndexCard
            title="SEALED 1000 INDEX"
            value={sealedIndex}
            change={sealedChange}
            count={sealedProducts.length}
            description="Average tracked sealed product value"
            variant="blue"
          />
        </div>

        {/* Search */}
        <CardSearch />

        {/* Price Chart */}
        <PriceChart cards={displayCards} />

        {/* Top Movers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TopMoversTable cards={displayCards} title="Top Movers — Raw Cards" />
          <TopMoversTable cards={gradedCards} title="Top Movers — Graded Cards" />
        </div>

        {/* Tabbed Full Board */}
        <MarketTabs liveCards={displayCards} />

        {/* Market Cap */}
        <MarketCapSummary liveRawCards={displayCards} />

        {/* Subscription Tiers */}
        <SubscriptionTiers />

        {/* Footer */}
        <footer className="border-t border-border py-6 text-center">
          <p className="font-mono text-xs text-muted-foreground">
            POKÉGARAGEVA MARKET TERMINAL • Data from pokemontcg.io • Not financial advice
          </p>
          <p className="font-mono text-[10px] text-muted-foreground mt-1">
            © 2026 PokéGarageVA. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
