import { rawCards, gradedCards, sealedProducts, getIndexValue, getIndexChange } from "@/data/marketData";
import TerminalHeader from "@/components/TerminalHeader";
import TickerBar from "@/components/TickerBar";
import MarketIndexCard from "@/components/MarketIndexCard";
import TopMoversTable from "@/components/TopMoversTable";
import MarketTabs from "@/components/MarketTabs";
import SubscriptionTiers from "@/components/SubscriptionTiers";

const Index = () => {
  const rawIndex = getIndexValue(rawCards);
  const rawChange = getIndexChange(rawCards);
  const gradedIndex = getIndexValue(gradedCards);
  const gradedChange = getIndexChange(gradedCards);
  const sealedIndex = getIndexValue(sealedProducts);
  const sealedChange = getIndexChange(sealedProducts);

  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />
      <TickerBar />

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6">
        {/* Market Index Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MarketIndexCard
            title="RAW 500 INDEX"
            value={rawIndex}
            change={rawChange}
            count={rawCards.length}
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

        {/* Top Movers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TopMoversTable cards={rawCards} title="Top Movers — Raw Cards" />
          <TopMoversTable cards={gradedCards} title="Top Movers — Graded Cards" />
        </div>

        {/* Tabbed Full Board */}
        <MarketTabs />

        {/* Subscription Tiers */}
        <SubscriptionTiers />

        {/* Footer */}
        <footer className="border-t border-border py-6 text-center">
          <p className="font-mono text-xs text-muted-foreground">
            POKÉGARAGEVA MARKET TERMINAL • Data provided for informational purposes only • Not financial advice
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
