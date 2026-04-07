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

import PromoStack from "@/components/PromoStack";
import ShareButton from "@/components/ShareButton";

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
import ProductAdBanner from "@/components/ProductAdBanner";

const Index = () => {
  const { data: liveCards, isLoading, dataUpdatedAt } = useLiveCards();
  const marketOpen = useMarketStatus();
  const searchRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const { checkSubscription } = useAuth();

  const [chartRefreshKey, setChartRefreshKey] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setChartRefreshKey(k => k + 1);
    }, 60 * 1000); // Refresh charts every 60 seconds
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

  const topMover = useMemo(() => {
    const sorted = [...displayCards].sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
    return sorted[0] || null;
  }, [displayCards]);

  const prefetchIds = useMemo(() => displayCards.slice(0, 10).map((c) => c._apiId).filter(Boolean) as string[], [displayCards]);
  usePrefetchCards(prefetchIds);

  // Filter cards with images for DailySpotlight
  const cardsWithImages = useMemo(() => displayCards.filter(c => c._image), [displayCards]);

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

      <main id="main-content" className="max-w-7xl mx-auto px-4 lg:px-6 py-2 sm:py-4 space-y-2.5 sm:space-y-3">
        {/* 1. Hero */}
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

        {/* 2. Market Indexes */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <SkeletonIndexCard />
            <SkeletonIndexCard />
            <SkeletonIndexCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <MarketIndexCard title="RAW 500 INDEX" value={rawIndex} change={rawChange} count={500} description="500+ raw cards tracked" variant="green" />
            <MarketIndexCard title="GRADED 1000 INDEX" value={gradedIndex} change={gradedChange} count={1000} description="1,000+ graded cards tracked (PSA/CGC/BGS/TAG)" variant="amber" />
            <MarketIndexCard title="SEALED 1000 INDEX" value={sealedIndex} change={sealedChange} count={1000} description="1,000+ sealed products tracked (Boxes/Packs/ETBs)" variant="blue" />
          </div>
        )}

        {/* 3. Intraday Charts */}
        {(() => {
          const isNYSE = marketOpen;
          return (
            <div className="relative">
              {!isNYSE && <MarketClosedOverlay />}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                <IndexDayChart title="RAW 500 INDEX" indexValue={rawIndex} indexChange={rawChange} variant="green" refreshKey={chartRefreshKey} />
                <IndexDayChart title="GRADED 1000 INDEX" indexValue={gradedIndex} indexChange={gradedChange} variant="amber" refreshKey={chartRefreshKey} />
                <IndexDayChart title="SEALED 1000 INDEX" indexValue={sealedIndex} indexChange={sealedChange} variant="blue" refreshKey={chartRefreshKey} />
              </div>
            </div>
          );
        })()}

        {/* 4. Trending Cards */}
        <TrendingCards cards={displayCards} isLoading={isLoading} />

        <ProductAdBanner variant="strip" count={4} />

        {/* 5. AI Market Insights */}
        <LazySection minHeight="200px">
          <AIMarketInsights cards={displayCards} />
        </LazySection>

        {/* 6. Era Indexes */}
        <LazySection minHeight="150px">
          <EraIndexCards cards={displayCards} />
        </LazySection>

        {/* 7. Poké Race */}
        <PokeRaceSection />

        {/* 8. Top Movers */}
        <LazySection minHeight="280px">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
            <TopMoversTable cards={displayCards} title="Top Movers — Raw Cards" isLoading={isLoading} />
            <TopMoversTable cards={displayGraded} title="Top Movers — Graded Cards" isLoading={isLoading} />
          </div>
        </LazySection>

        {/* 9. Daily Spotlight */}
        <LazySection minHeight="200px">
          <DailySpotlight cards={cardsWithImages.length > 0 ? cardsWithImages : displayCards} />
        </LazySection>

        <LazySection minHeight="180px">
          <LiveMarketPulse cards={displayCards} />
        </LazySection>

        {/* 10. Grading ROI Calculator */}
        <LazySection minHeight="200px">
          <GradingROICalculator cards={displayCards} />
        </LazySection>

        <InlineUpgradeNudge variant="savings" />
        <ProductAdBanner variant="inline" />

        {/* 11. Prediction Game */}
        <LazySection minHeight="200px">
          <PricePredictionGame cards={displayCards} />
        </LazySection>

        {/* 12. Market Trend + Intel */}
        <LazySection minHeight="150px">
          <MarketTrendSummary cards={displayCards} />
        </LazySection>

        <LazySection minHeight="180px">
          <MarketIntelWidget cards={displayCards} />
        </LazySection>

        <LazySection minHeight="70px">
          <MarketUpdateBanner cards={displayCards} />
        </LazySection>

        {/* 13. Search */}
        <div ref={searchRef}>
          <LazySection minHeight="100px">
            <CardSearch />
          </LazySection>
        </div>

        {/* 14. Notable Sales */}
        <LazySection minHeight="200px">
          <RecentNotableSales cards={displayCards} />
        </LazySection>

        <LazySection minHeight="100px">
          <MarketCapSummary liveRawCards={displayCards} />
        </LazySection>

        {/* 15. Poké Ripz */}
        <LazySection minHeight="120px">
          <div className="terminal-card p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-mono text-sm font-bold text-foreground flex items-center gap-2">
                  🃏 Poké Ripz™
                </h2>
                <p className="font-mono text-[10px] text-muted-foreground mt-0.5">Digital pack ripping — watch, bet, and rip across every era. Buy in with PokéCoins.</p>
              </div>
              <a href="/ripz" className="font-mono text-xs font-semibold bg-primary text-primary-foreground rounded px-4 py-1.5 hover:opacity-90">
                RIP NOW →
              </a>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {['🏆 Vintage','🔴 EX','💠 DP/Plat','⚫ BW/XY','☀️ S&M/SwSh','🔮 Modern'].map((era) => (
                <div key={era} className="terminal-card p-2 text-center">
                  <p className="text-lg">{era.split(' ')[0]}</p>
                  <p className="font-mono text-[8px] text-muted-foreground">{era.split(' ').slice(1).join(' ')}</p>
                </div>
              ))}
            </div>
          </div>
        </LazySection>

        {/* 16. Poké Adventure Land */}
        <GamePromo />

        {/* 17. SimTrader */}
        <SimTraderPromo />

        {/* 17. Trust + Status */}
        <LazySection minHeight="70px">
          <TrustSignals />
        </LazySection>

        <LazySection minHeight="50px">
          <SystemStatusIndicator />
        </LazySection>

        <LazySection minHeight="150px">
          <DataHealthDashboard />
        </LazySection>

        {/* === PRO-GATED FEATURES — blurred sign-in sections below === */}
        <div className="relative">
          <div className="absolute inset-x-0 -top-8 h-16 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
        </div>

        <LazySection minHeight="280px">
          <ProGate feature="Historical price charts" blur>
            <PriceChart cards={displayCards} />
          </ProGate>
        </LazySection>

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

        <LazySection minHeight="220px">
          <ProGate feature="Pulse Score™ Analysis" blur>
            <PulseScore cards={displayCards} />
          </ProGate>
        </LazySection>

        <LazySection minHeight="220px">
          <ProGate feature="Correlation Matrix" blur>
            <CorrelationMatrix cards={displayCards} />
          </ProGate>
        </LazySection>

        <LazySection minHeight="220px">
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

        <LazySection minHeight="350px">
          <ProGate feature="Full card board (500+ cards)" blur>
            <MarketTabs liveCards={displayCards} liveGradedCards={displayGraded} liveSealedProducts={displaySealed} />
          </ProGate>
        </LazySection>

        <LazySection minHeight="200px">
          <VerifiedLeaderboard />
        </LazySection>

        <LazySection minHeight="200px">
          <WhaleReport cards={displayCards} />
        </LazySection>

        <LazySection minHeight="100px">
          <ValueUnlockPreview />
        </LazySection>

        {/* Campaigns */}
        <PromoStack />
        <ProductAdBanner variant="strip" count={4} />

        <LazySection minHeight="80px">
          <ImportFromTCGPlayer />
        </LazySection>

        {/* Monetization CTAs */}
        <InlineUpgradeNudge variant="default" />

        <LazySection minHeight="280px">
          <SubscriptionTiers />
        </LazySection>

        <LazySection minHeight="90px">
          <TeamPlanCTA />
        </LazySection>

        <LazySection minHeight="70px">
          <ReferralCTA />
        </LazySection>

        <FinancialDisclaimer />

        {/* Footer */}
        <footer className="border-t border-border/30 pt-2 pb-1.5">
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-[13px] tracking-tight text-foreground">Poke-Pulse-</span>
              <span className="font-display font-extrabold text-[11px] tracking-[0.06em] text-primary uppercase">Engine</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5">
              <a href="https://poke-pulse-ticker.lovable.app" className="text-[11px] text-primary font-semibold hover:underline transition-colors">poke-pulse-ticker.lovable.app</a>
              <span className="text-border/50 hidden sm:inline">|</span>
              <span className="text-[10px] text-muted-foreground">Live Poké TCG Market Data</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5">
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
