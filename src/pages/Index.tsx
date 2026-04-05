import { useRef, useEffect, useMemo, useState } from "react";

import { rawCards, gradedCards, sealedProducts, getIndexValue, getIndexChange } from "@/data/marketData";
import { useLiveCards } from "@/hooks/usePokemonTcg";
import { useGradedCards } from "@/hooks/useGradedCards";
import { useSealedProducts } from "@/hooks/useSealedProducts";
import TerminalHeader from "@/components/TerminalHeader";
import TickerBar from "@/components/TickerBar";
import HeroSection from "@/components/HeroSection";
import SocialProofBar from "@/components/SocialProofBar";
import MarketIndexCard from "@/components/MarketIndexCard";
import TrendingCards from "@/components/TrendingCards";
import LaunchCountdown from "@/components/LaunchCountdown";
import QuickValueCalculator from "@/components/QuickValueCalculator";
import InlineUpgradeNudge from "@/components/InlineUpgradeNudge";
import StickyUpgradeBanner from "@/components/StickyUpgradeBanner";
import IndexDayChart from "@/components/IndexDayChart";
import MarketClosedOverlay, { useMarketStatus } from "@/components/MarketClosedOverlay";
import LazySection from "@/components/LazySection";
import ProGate from "@/components/ProGate";
import { useAlphaSignals } from "@/hooks/useAlphaSignals";
import { useTotalMarketValue } from "@/hooks/useIndexCache";
import { usePrefetchCards } from "@/hooks/usePrefetch";
import { SkeletonIndexCard } from "@/components/SkeletonCard";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Campaign banners
import PromoStack from "@/components/PromoStack";
import ShareButton from "@/components/ShareButton";

// Lazy-loaded below-the-fold components

import DailySpotlight from "@/components/DailySpotlight";
import LiveMarketPulse from "@/components/LiveMarketPulse";
import ValueUnlockPreview from "@/components/ValueUnlockPreview";
import PricePredictionGame from "@/components/PricePredictionGame";
import MarketUpdateBanner from "@/components/MarketUpdateBanner";
import TopMoversTable from "@/components/TopMoversTable";
import EraIndexCards from "@/components/EraIndexCards";
import MarketTrendSummary from "@/components/MarketTrendSummary";
import MarketIntelWidget from "@/components/MarketIntelWidget";
import TrustSignals from "@/components/TrustSignals";
import SystemStatusIndicator from "@/components/SystemStatusIndicator";
import AlphaSignals from "@/components/AlphaSignals";
import GradingArbitrage from "@/components/GradingArbitrage";
import GradeRatioArbitrageBot from "@/components/GradeRatioArbitrageBot";
import AlphaAccuracy from "@/components/AlphaAccuracy";
import RecentNotableSales from "@/components/RecentNotableSales";
import CardSearch from "@/components/CardSearch";
import PriceChart from "@/components/PriceChart";
import SignalSummary from "@/components/SignalSummary";
import MarketTabs from "@/components/MarketTabs";
import MarketCapSummary from "@/components/MarketCapSummary";
import VerifiedLeaderboard from "@/components/VerifiedLeaderboard";
import WhaleReport from "@/components/WhaleReport";
import ArbitrageFinder from "@/components/ArbitrageFinder";
import JPtoENTracker from "@/components/JPtoENTracker";
import DataHealthDashboard from "@/components/DataHealthDashboard";
import WallOfLove from "@/components/WallOfLove";
import Testimonials from "@/components/Testimonials";
import ImportFromTCGPlayer from "@/components/ImportFromTCGPlayer";
import SubscriptionTiers from "@/components/SubscriptionTiers";
import TeamPlanCTA from "@/components/TeamPlanCTA";
import ReferralCTA from "@/components/ReferralCTA";
import FinancialDisclaimer from "@/components/FinancialDisclaimer";
import InstallPrompt from "@/components/InstallPrompt";
import FomoPopup from "@/components/FomoPopup";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import SimTraderPromo from "@/components/SimTraderPromo";
import OnboardingWalkthrough from "@/components/OnboardingWalkthrough";
import PulseScore from "@/components/PulseScore";
import CorrelationMatrix from "@/components/CorrelationMatrix";
import PopReportDelta from "@/components/PopReportDelta";
import GamePromo from "@/components/GamePromo";
import PokeRaceSection from "@/components/PokeRaceSection";
import GradingROICalculator from "@/components/GradingROICalculator";
import AIMarketInsights from "@/components/AIMarketInsights";
import LiveFreshnessIndicator from "@/components/LiveFreshnessIndicator";

const Index = () => {
  const { data: liveCards, isLoading, dataUpdatedAt } = useLiveCards();
  const marketOpen = useMarketStatus();
  const searchRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const { checkSubscription } = useAuth();

  // Refresh key increments every 60 minutes to force chart data regeneration
  const [chartRefreshKey, setChartRefreshKey] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setChartRefreshKey(k => k + 1);
    }, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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

  // Prefetch trending + top mover cards for instant navigation
  const prefetchIds = useMemo(() => displayCards.slice(0, 10).map((c) => c._apiId).filter(Boolean) as string[], [displayCards]);
  usePrefetchCards(prefetchIds);

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

      <main id="main-content" className="max-w-7xl mx-auto px-4 lg:px-6 py-3 sm:py-5 space-y-3 sm:space-y-4">
        {/* 1. Hero — urgency hook */}
        <HeroSection
          onSearchFocus={handleSearchFocus}
          topMoverName={topMover?.name}
          topMoverChange={topMover?.change}
        />

        <LaunchCountdown />

        <SocialProofBar
          totalMarketValue={totalMarketValue}
          isLive={isLive}
          lastUpdated={isLive ? (dataUpdatedAt || Date.now()) : undefined}
          cardCount={displayCards.length}
        />

        {/* 2. Market Indexes — show the money */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <SkeletonIndexCard />
            <SkeletonIndexCard />
            <SkeletonIndexCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <MarketIndexCard title="RAW 500 INDEX" value={rawIndex} change={rawChange} count={500} description="Average tracked raw card market value" variant="green" />
            <MarketIndexCard title="GRADED 1000 INDEX" value={gradedIndex} change={gradedChange} count={750} description="Average tracked graded card market value (PSA/CGC/BGS/TAG)" variant="amber" />
            <MarketIndexCard title="SEALED 1000 INDEX" value={sealedIndex} change={sealedChange} count={1000} description="Average tracked sealed product value (Boxes/Packs/ETBs)" variant="blue" />
          </div>
        )}

        {/* 3. Intraday Charts */}
        {(() => {
          const isNYSE = marketOpen;
          return (
            <div className="relative">
              {!isNYSE && <MarketClosedOverlay />}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <IndexDayChart title="RAW 500 INDEX" indexValue={rawIndex} indexChange={rawChange} variant="green" refreshKey={chartRefreshKey} />
                <IndexDayChart title="GRADED 1000 INDEX" indexValue={gradedIndex} indexChange={gradedChange} variant="amber" refreshKey={chartRefreshKey} />
                <IndexDayChart title="SEALED 1000 INDEX" indexValue={sealedIndex} indexChange={sealedChange} variant="blue" refreshKey={chartRefreshKey} />
              </div>
            </div>
          );
        })()}

        {/* 4. Trending Cards — dopamine hit */}
        <TrendingCards cards={displayCards} isLoading={isLoading} />

        {/* 5. Era-Based Market Indexes — show all eras */}
        <LazySection minHeight="150px">
          <EraIndexCards cards={displayCards} />
        </LazySection>

        {/* 6. POKÉ RACE — high engagement game */}
        <PokeRaceSection />

        {/* 7. Top Movers side-by-side */}
        <LazySection minHeight="300px">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TopMoversTable cards={displayCards} title="Top Movers — Raw Cards" isLoading={isLoading} />
            <TopMoversTable cards={displayGraded} title="Top Movers — Graded Cards" isLoading={isLoading} />
          </div>
        </LazySection>

        {/* 8. Daily Spotlight + Live Pulse */}
        <LazySection minHeight="200px">
          <DailySpotlight cards={displayCards} />
        </LazySection>

        <LazySection minHeight="200px">
          <LiveMarketPulse cards={displayCards} />
        </LazySection>

        {/* 9. Quick Value Calculator — engagement */}
        <QuickValueCalculator />

        <InlineUpgradeNudge variant="savings" />

        {/* 10. Prediction Game */}
        <LazySection minHeight="200px">
          <PricePredictionGame cards={displayCards} />
        </LazySection>

        {/* 11. Market Trend + Intel */}
        <LazySection minHeight="150px">
          <MarketTrendSummary cards={displayCards} />
        </LazySection>

        <LazySection minHeight="200px">
          <MarketIntelWidget cards={displayCards} />
        </LazySection>

        <LazySection minHeight="80px">
          <MarketUpdateBanner cards={displayCards} />
        </LazySection>

        {/* 12. Search + Charts */}
        <div ref={searchRef}>
          <LazySection minHeight="100px">
            <CardSearch />
          </LazySection>
        </div>

        <LazySection minHeight="300px">
          <ProGate feature="Historical price charts" blur>
            <PriceChart cards={displayCards} />
          </ProGate>
        </LazySection>

        {/* 13. Pro-gated analytics */}
        <LazySection minHeight="200px">
          <ProGate feature="Predictive Alpha Signals" blur>
            <AlphaSignals signals={alphaSignals} />
          </ProGate>
        </LazySection>

        <LazySection minHeight="200px">
          <ProGate feature="AI signal analysis" blur>
            <SignalSummary cards={displayCards} />
          </ProGate>
        </LazySection>

        <LazySection minHeight="250px">
          <ProGate feature="Pulse Score™ Analysis" blur>
            <PulseScore cards={displayCards} />
          </ProGate>
        </LazySection>

        <LazySection minHeight="250px">
          <ProGate feature="Correlation Matrix" blur>
            <CorrelationMatrix cards={displayCards} />
          </ProGate>
        </LazySection>

        <LazySection minHeight="250px">
          <ProGate feature="Pop Report Δ — Supply Pressure" blur>
            <PopReportDelta cards={displayCards} />
          </ProGate>
        </LazySection>

        <InlineUpgradeNudge variant="trust" />

        <LazySection minHeight="200px">
          <ProGate feature="Grading Arbitrage Scanner" blur>
            <GradingArbitrage />
          </ProGate>
        </LazySection>

        <LazySection minHeight="200px">
          <ProGate feature="Grade Ratio Arbitrage Bot" blur>
            <GradeRatioArbitrageBot />
          </ProGate>
        </LazySection>

        <LazySection minHeight="200px">
          <ProGate feature="Alpha Signal Accuracy Metrics" blur>
            <AlphaAccuracy />
          </ProGate>
        </LazySection>

        <LazySection minHeight="200px">
          <ProGate feature="Real-Time Arbitrage Finder" blur>
            <ArbitrageFinder />
          </ProGate>
        </LazySection>

        <LazySection minHeight="200px">
          <ProGate feature="JP → EN Precursor Tracker" blur>
            <JPtoENTracker />
          </ProGate>
        </LazySection>

        {/* 14. Notable Sales + Market Board */}
        <LazySection minHeight="200px">
          <RecentNotableSales cards={displayCards} />
        </LazySection>

        <LazySection minHeight="400px">
          <ProGate feature="Full card board (500+ cards)" blur>
            <MarketTabs liveCards={displayCards} liveGradedCards={displayGraded} liveSealedProducts={displaySealed} />
          </ProGate>
        </LazySection>

        <LazySection minHeight="100px">
          <MarketCapSummary liveRawCards={displayCards} />
        </LazySection>

        <LazySection minHeight="200px">
          <VerifiedLeaderboard />
        </LazySection>

        <LazySection minHeight="200px">
          <WhaleReport cards={displayCards} />
        </LazySection>

        {/* 15. Engagement + Value unlock */}
        <LazySection minHeight="120px">
          <ValueUnlockPreview />
        </LazySection>

        {/* 16. Poké Adventure Land game */}
        <GamePromo />

        {/* 17. SimTrader promo */}
        <SimTraderPromo />

        {/* 18. Trust + Status */}
        <LazySection minHeight="80px">
          <TrustSignals />
        </LazySection>

        <LazySection minHeight="60px">
          <SystemStatusIndicator />
        </LazySection>

        <LazySection minHeight="150px">
          <DataHealthDashboard />
        </LazySection>

        {/* 19. Social proof + testimonials */}
        <LazySection minHeight="150px">
          <WallOfLove />
        </LazySection>

        <LazySection minHeight="150px">
          <Testimonials />
        </LazySection>

        {/* 20. Campaigns — lower priority, still visible */}
        <PromoStack />

        <LazySection minHeight="80px">
          <ImportFromTCGPlayer />
        </LazySection>

        {/* 21. Monetization CTAs */}
        <InlineUpgradeNudge variant="default" />

        <LazySection minHeight="300px">
          <SubscriptionTiers />
        </LazySection>

        <LazySection minHeight="100px">
          <TeamPlanCTA />
        </LazySection>

        <LazySection minHeight="80px">
          <ReferralCTA />
        </LazySection>

        <FinancialDisclaimer />

        {/* Footer */}
        <footer className="border-t border-border/50 pt-4 pb-3">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-[13px] tracking-tight text-foreground">Poke-Pulse-</span>
              <span className="font-display font-extrabold text-[11px] tracking-[0.06em] text-primary uppercase">Market Terminal</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <a href="https://poke-pulse-ticker.com" className="text-[11px] text-primary font-semibold hover:underline transition-colors">poke-pulse-ticker.com</a>
              <span className="text-border/50 hidden sm:inline">|</span>
              <span className="text-[10px] text-muted-foreground">Live Poké TCG Market Data</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              {[
                { href: "/pokemon-kids", label: "Poké Adventure Land" },
                { href: "#poke-race", label: "Poké Race" },
                { href: "/arena", label: "Arena" },
                { href: "/videos", label: "Videos" },
                { href: "/terms", label: "Terms" },
                { href: "/privacy", label: "Privacy" },
                { href: "/methodology", label: "Methodology" },
                { href: "mailto:contact@poke-pulse-ticker.com", label: "Contact" },
              ].map((link) => (
                <a key={link.href} href={link.href} className="text-[10px] text-muted-foreground hover:text-primary transition-colors duration-200">
                  {link.label}
                </a>
              ))}
            </div>
            <p className="text-[9px] text-muted-foreground/60 text-center max-w-md leading-snug">
              Poké is a trademark of Nintendo/Creatures Inc./GAME FREAK inc. Not affiliated with The Poké Company International. Data powered by pokemontcg.io. Not financial advice.
            </p>
            <p className="text-[10px] text-muted-foreground/50 font-mono">
              © {new Date().getFullYear()} PGVA Ventures, LLC. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
      <InstallPrompt />
      <OnboardingWalkthrough />
      <ShareButton />
    </div>
  );
};

export default Index;
