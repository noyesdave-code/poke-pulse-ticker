import { useRef } from "react";
import { rawCards, gradedCards, sealedProducts, getIndexValue, getIndexChange } from "@/data/marketData";
import { useLiveCards } from "@/hooks/usePokemonTcg";
import { useGradedCards } from "@/hooks/useGradedCards";
import { useSealedProducts } from "@/hooks/useSealedProducts";
import TerminalHeader from "@/components/TerminalHeader";
import TickerBar from "@/components/TickerBar";
import HeroSection from "@/components/HeroSection";
import MarketUpdateBanner from "@/components/MarketUpdateBanner";
import MarketIndexCard from "@/components/MarketIndexCard";
import TrendingCards from "@/components/TrendingCards";
import TopMoversTable from "@/components/TopMoversTable";
import CardSearch from "@/components/CardSearch";
import PriceChart from "@/components/PriceChart";
import MarketTabs from "@/components/MarketTabs";
import MarketCapSummary from "@/components/MarketCapSummary";
import SubscriptionTiers from "@/components/SubscriptionTiers";
import InstallPrompt from "@/components/InstallPrompt";
import SignalSummary from "@/components/SignalSummary";
import FinancialDisclaimer from "@/components/FinancialDisclaimer";
import TrustSignals from "@/components/TrustSignals";

const Index = () => {
  const { data: liveCards, isLoading, dataUpdatedAt } = useLiveCards();
  const searchRef = useRef<HTMLDivElement>(null);

  const displayCards = liveCards && liveCards.length > 0 ? liveCards : rawCards;
  const liveGradedCards = useGradedCards(liveCards);
  const displayGraded = liveGradedCards.length > 0 ? liveGradedCards : gradedCards;
  const liveSealedProducts = useSealedProducts(liveCards);
  const displaySealed = liveSealedProducts.length > 0 ? liveSealedProducts : sealedProducts;

  const rawIndex = getIndexValue(displayCards);
  const rawChange = getIndexChange(displayCards);
  const gradedIndex = getIndexValue(displayGraded);
  const gradedChange = getIndexChange(displayGraded);
  const sealedIndex = getIndexValue(displaySealed);
  const sealedChange = getIndexChange(displaySealed);

  const handleSearchFocus = () => {
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      const input = searchRef.current?.querySelector("input");
      input?.focus();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />
      <TickerBar cards={displayCards} isLive={!!liveCards && liveCards.length > 0} lastUpdated={liveCards && liveCards.length > 0 ? (dataUpdatedAt || Date.now()) : undefined} />

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

        {/* Hero with CTAs */}
        <HeroSection onSearchFocus={handleSearchFocus} />

        {/* Market Update Banner */}
        <MarketUpdateBanner cards={displayCards} />

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
            count={displayGraded.length}
            description="Average tracked graded card market value (PSA/CGC/BGS/TAG)"
            variant="amber"
          />
          <MarketIndexCard
            title="SEALED 1000 INDEX"
            value={sealedIndex}
            change={sealedChange}
            count={displaySealed.length}
            description="Average tracked sealed product value (Boxes/Packs/ETBs)"
            variant="blue"
          />
        </div>

        {/* Trust Signals */}
        <TrustSignals />

        {/* Trending Cards with Images */}
        <TrendingCards cards={displayCards} />

        {/* Search */}
        <div ref={searchRef}>
          <CardSearch />
        </div>

        {/* Price Chart */}
        <PriceChart cards={displayCards} />

        {/* Top Movers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TopMoversTable cards={displayCards} title="Top Movers — Raw Cards" />
          <TopMoversTable cards={displayGraded} title="Top Movers — Graded Cards" />
        </div>

        {/* Tabbed Full Board */}
        <MarketTabs liveCards={displayCards} liveGradedCards={displayGraded} liveSealedProducts={displaySealed} />

        {/* Market Cap */}
        <MarketCapSummary liveRawCards={displayCards} />

        {/* Subscription Tiers */}
        <SubscriptionTiers />

        {/* Financial Disclaimer */}
        <FinancialDisclaimer />

        {/* Footer */}
        <footer className="border-t border-border pt-8 pb-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded bg-primary flex items-center justify-center">
                <span className="font-mono text-xs font-bold text-primary-foreground">PG</span>
              </div>
              <span className="font-mono text-sm font-bold tracking-wider text-foreground">
                POKE-PULSE-TICKER
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <a href="https://poke-pulse-ticker.com" className="font-mono text-xs text-primary hover:underline">
                poke-pulse-ticker.com
              </a>
              <span className="text-border hidden sm:inline">|</span>
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                Live Pokémon TCG Market Data
              </span>
            </div>
            <div className="flex items-center gap-3">
              <a href="/terms" className="font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <span className="text-border">•</span>
              <a href="/privacy" className="font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <span className="text-border">•</span>
              <a href="mailto:contact@poke-pulse-ticker.com" className="font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </div>
            <p className="font-mono text-[10px] text-muted-foreground">
              Data powered by pokemontcg.io • Not financial advice
            </p>
            <p className="font-mono text-[10px] text-muted-foreground">
              © {new Date().getFullYear()} Poke-Pulse-Ticker. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
      <InstallPrompt />
    </div>
  );
};

export default Index;
