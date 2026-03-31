import { useRef, useEffect, useMemo } from "react";

import { rawCards, gradedCards, sealedProducts, getIndexValue, getIndexChange } from "@/data/marketData";
import { useLiveCards } from "@/hooks/usePokemonTcg";
import { useGradedCards } from "@/hooks/useGradedCards";
import { useSealedProducts } from "@/hooks/useSealedProducts";
import TerminalHeader from "@/components/TerminalHeader";
import TickerBar from "@/components/TickerBar";
import HeroSection from "@/components/HeroSection";
import SocialProofBar from "@/components/SocialProofBar";
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
import ProGate from "@/components/ProGate";
import Testimonials from "@/components/Testimonials";
import AlphaSignals from "@/components/AlphaSignals";
import { useAlphaSignals } from "@/hooks/useAlphaSignals";
import { useTotalMarketValue } from "@/hooks/useIndexCache";
import VerifiedLeaderboard from "@/components/VerifiedLeaderboard";
import WhaleReport from "@/components/WhaleReport";
import RecentNotableSales from "@/components/RecentNotableSales";
import EraIndexCards from "@/components/EraIndexCards";
import MarketTrendSummary from "@/components/MarketTrendSummary";
// DataQualityBadge merged into SocialProofBar
import FomoPopup from "@/components/FomoPopup";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import MarketIntelWidget from "@/components/MarketIntelWidget";
import ReferralCTA from "@/components/ReferralCTA";
import SystemStatusIndicator from "@/components/SystemStatusIndicator";
import SimTraderPromo from "@/components/SimTraderPromo";
import OnboardingWalkthrough from "@/components/OnboardingWalkthrough";
import StickyUpgradeBanner from "@/components/StickyUpgradeBanner";
import AlphaAccuracy from "@/components/AlphaAccuracy";
import ImportFromTCGPlayer from "@/components/ImportFromTCGPlayer";
import DailySpotlight from "@/components/DailySpotlight";
import LiveMarketPulse from "@/components/LiveMarketPulse";
import PricePredictionGame from "@/components/PricePredictionGame";
import TeamPlanCTA from "@/components/TeamPlanCTA";
import GradingArbitrage from "@/components/GradingArbitrage";
import GradeRatioArbitrageBot from "@/components/GradeRatioArbitrageBot";
import IndexDayChart from "@/components/IndexDayChart";
import LaunchCountdown from "@/components/LaunchCountdown";
import ValueUnlockPreview from "@/components/ValueUnlockPreview";
import QuickValueCalculator from "@/components/QuickValueCalculator";
import InlineUpgradeNudge from "@/components/InlineUpgradeNudge";
import { SkeletonIndexCard, SkeletonTableRow, SkeletonTrendingCard } from "@/components/SkeletonCard";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { data: liveCards, isLoading, dataUpdatedAt } = useLiveCards();
  const searchRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const { checkSubscription } = useAuth();

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    if (checkout === "success") {
      toast({ title: "Subscription activated!", description: "Welcome to Pro. Refreshing your status..." });
      checkSubscription();
      setSearchParams({}, { replace: true });
    } else if (checkout === "canceled") {
      toast({ title: "Checkout canceled", description: "No changes were made.", variant: "destructive" });
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const displayCards = liveCards && liveCards.length > 0 ? liveCards : rawCards;
  const liveGradedCards = useGradedCards(liveCards);
  const displayGraded = liveGradedCards.length > 0 ? liveGradedCards : gradedCards;
  const liveSealedProducts = useSealedProducts(liveCards);
  const displaySealed = liveSealedProducts.length > 0 ? liveSealedProducts : sealedProducts;
  const isLive = !!liveCards && liveCards.length > 0;

  const rawIndex = getIndexValue(displayCards);
  const rawChange = getIndexChange(displayCards);
  const gradedIndex = getIndexValue(displayGraded);
  const gradedChange = getIndexChange(displayGraded);
  const sealedIndex = getIndexValue(displaySealed);
  const sealedChange = getIndexChange(displaySealed);

  const totalMarketValue = useTotalMarketValue(
    rawIndex, gradedIndex, sealedIndex,
    displayCards.length, displayGraded.length, displaySealed.length
  );

  const alphaSignals = useAlphaSignals(displayCards);

  // Get top mover for hero urgency hook
  const topMover = useMemo(() => {
    const sorted = [...displayCards].sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
    return sorted[0] || null;
  }, [displayCards]);

  const handleSearchFocus = () => {
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      const input = searchRef.current?.querySelector("input");
      input?.focus();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background">
      <StickyUpgradeBanner />
      <TerminalHeader />
      <TickerBar cards={displayCards} isLive={isLive} lastUpdated={isLive ? (dataUpdatedAt || Date.now()) : undefined} />

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* 1. Hero with urgency hook */}
        <HeroSection
          onSearchFocus={handleSearchFocus}
          topMoverName={topMover?.name}
          topMoverChange={topMover?.change}
        />

        {/* Launch Countdown — urgency drives first purchase */}
        <LaunchCountdown />

        {/* 2. Social proof — immediately after hero */}
        <SocialProofBar
          totalMarketValue={totalMarketValue}
          isLive={isLive}
          lastUpdated={isLive ? (dataUpdatedAt || Date.now()) : undefined}
          cardCount={displayCards.length}
        />

        {/* 3. Market Index Cards — show the money right away */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <SkeletonIndexCard />
            <SkeletonIndexCard />
            <SkeletonIndexCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <MarketIndexCard title="RAW 500 INDEX" value={rawIndex} change={rawChange} count={displayCards.length} description="Average tracked raw card market value" variant="green" />
            <MarketIndexCard title="GRADED 1000 INDEX" value={gradedIndex} change={gradedChange} count={displayGraded.length} description="Average tracked graded card market value (PSA/CGC/BGS/TAG)" variant="amber" />
            <MarketIndexCard title="SEALED 1000 INDEX" value={sealedIndex} change={sealedChange} count={displaySealed.length} description="Average tracked sealed product value (Boxes/Packs/ETBs)" variant="blue" />
          </div>
        )}

        {/* Daily Index Charts — hidden on mobile by default */}
        {!isLoading && (
          <div className="hidden md:grid grid-cols-3 gap-3">
            <IndexDayChart title="RAW 500 INDEX" indexValue={rawIndex} indexChange={rawChange} variant="green" />
            <IndexDayChart title="GRADED 1000 INDEX" indexValue={gradedIndex} indexChange={gradedChange} variant="amber" />
            <IndexDayChart title="SEALED 1000 INDEX" indexValue={sealedIndex} indexChange={sealedChange} variant="blue" />
          </div>
        )}

        {/* 4. Trending Cards with images — above the fold dopamine hit */}
        <TrendingCards cards={displayCards} isLoading={isLoading} />

        {/* Quick Collection Value Calculator — instant engagement hook */}
        <QuickValueCalculator />

        {/* Inline upgrade nudge — after first value moment */}
        <InlineUpgradeNudge variant="savings" />

        {/* Daily Card Spotlight — AI-analyzed pick drives daily return visits */}
        <DailySpotlight cards={displayCards} />

        {/* Live Market Pulse — real-time feed creates hourly engagement */}
        <LiveMarketPulse cards={displayCards} />

        {/* Value Unlock Preview — show what Pro users see */}
        <ValueUnlockPreview />

        {/* Daily Price Predictions — gamified engagement loop */}
        <PricePredictionGame cards={displayCards} />

        {/* Trust nudge */}
        <InlineUpgradeNudge variant="trust" />

        <MarketUpdateBanner cards={displayCards} />

        {/* Top Movers with card thumbnails */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TopMoversTable cards={displayCards} title="Top Movers — Raw Cards" isLoading={isLoading} />
          <TopMoversTable cards={displayGraded} title="Top Movers — Graded Cards" isLoading={isLoading} />
        </div>

        {/* Era-Based Indexes */}
        <EraIndexCards cards={displayCards} />

        {/* Market Trend Summary */}
        <MarketTrendSummary cards={displayCards} />

        {/* Market Intelligence: Seasonality + Grade Spread + Adaptability */}
        <MarketIntelWidget cards={displayCards} />

        <TrustSignals />

        {/* System Status for Consumer Confidence */}
        <SystemStatusIndicator />

        {/* Alpha Signals — Predictive Divergence */}
        <ProGate feature="Predictive Alpha Signals" blur>
          <AlphaSignals signals={alphaSignals} />
        </ProGate>

        {/* Grading Arbitrage Scanner */}
        <ProGate feature="Grading Arbitrage Scanner" blur>
          <GradingArbitrage />
        </ProGate>

        {/* Grade Ratio Arbitrage Bot */}
        <ProGate feature="Grade Ratio Arbitrage Bot" blur>
          <GradeRatioArbitrageBot />
        </ProGate>

        {/* Alpha Algorithm Accuracy Metrics */}
        <ProGate feature="Alpha Signal Accuracy Metrics" blur>
          <AlphaAccuracy />
        </ProGate>

        {/* Recent Notable Sales */}
        <RecentNotableSales cards={displayCards} />

        {/* Search */}
        <div ref={searchRef}>
          <CardSearch />
        </div>

        {/* Price Chart — Pro */}
        <ProGate feature="Historical price charts" blur>
          <PriceChart cards={displayCards} />
        </ProGate>

        {/* AI Signal Indicator — Pro */}
        <ProGate feature="AI signal analysis" blur>
          <SignalSummary cards={displayCards} />
        </ProGate>

        {/* Tabbed Full Board — Pro */}
        <ProGate feature="Full card board (500+ cards)" blur>
          <MarketTabs liveCards={displayCards} liveGradedCards={displayGraded} liveSealedProducts={displaySealed} />
        </ProGate>

        <MarketCapSummary liveRawCards={displayCards} />

        {/* Verified Portfolios Leaderboard */}
        <VerifiedLeaderboard />

        {/* Whale-Exclusive AI Report */}
        <WhaleReport cards={displayCards} />

        {/* Pro upgrade nudge before testimonials */}
        <InlineUpgradeNudge variant="default" />

        <Testimonials />

        {/* Import from competitors */}
        <ImportFromTCGPlayer />

        <SubscriptionTiers />

        {/* Team/Shop Plan CTA */}
        <TeamPlanCTA />

        {/* Referral Program */}
        <ReferralCTA />

        <FinancialDisclaimer />

        {/* Footer */}
        <footer className="border-t border-border pt-10 pb-8">
          <div className="flex flex-col items-center gap-5">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_20px_hsl(160_84%_50%/0.2)]">
                <span className="font-mono text-xs font-bold text-primary-foreground">PG</span>
              </div>
              <span className="text-base font-bold tracking-wide text-foreground">
                POKE-PULSE-TICKER
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
              <a href="https://poke-pulse-ticker.com" className="text-sm text-primary font-medium hover:underline">
                poke-pulse-ticker.com
              </a>
              <span className="text-border hidden sm:inline">|</span>
              <span className="text-xs text-muted-foreground tracking-wide">
                Live Pokémon TCG Market Data
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
              <a href="/videos" className="text-xs text-muted-foreground hover:text-primary transition-colors">Video Library</a>
              <span className="text-border">•</span>
              <a href="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
              <span className="text-border">•</span>
              <a href="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
              <span className="text-border">•</span>
              <a href="/methodology" className="text-xs text-muted-foreground hover:text-primary transition-colors">Methodology</a>
              <span className="text-border">•</span>
              <a href="mailto:contact@poke-pulse-ticker.com" className="text-xs text-muted-foreground hover:text-primary transition-colors">Contact</a>
            </div>
            <p className="text-[11px] text-muted-foreground text-center max-w-md leading-relaxed">
              Pokémon is a trademark of Nintendo/Creatures Inc./GAME FREAK inc. Not affiliated with The Pokémon Company International. Data powered by pokemontcg.io. Not financial advice.
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} PGVA Ventures, LLC. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
      <InstallPrompt />
      <FomoPopup />
      <ExitIntentPopup />
      <SimTraderPromo />
      <OnboardingWalkthrough />
    </div>
  );
};

export default Index;
