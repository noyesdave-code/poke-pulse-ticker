import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Layers, Briefcase, Activity, TrendingUp,
  Eye, Bell, Gamepad2, Brain, ChevronRight, ChevronLeft, X,
  Rocket, Play, BarChart3, Shield, DollarSign, Sparkles,
} from "lucide-react";

const DEMO_EMAIL = "demo@poke-pulse-ticker.com";

interface TourStep {
  title: string;
  description: string;
  icon: React.ElementType;
  route: string;
  highlight?: string;
  badge?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Live Market Terminal",
    description:
      "Real-time Pokémon TCG pricing powered by hourly market scans. Track 500+ cards across Raw, Graded & Sealed indexes with institutional-grade data.",
    icon: LayoutDashboard,
    route: "/",
    badge: "CORE",
  },
  {
    title: "Daily Index Charts",
    description:
      "Three proprietary indexes — Raw, Graded, Sealed — with 1-day, 5-day, and 1-month views synced to Wall Street trading hours (9:30 AM – 4 PM ET).",
    icon: BarChart3,
    route: "/",
    highlight: "index-charts",
    badge: "NEW",
  },
  {
    title: "Set Browser & Explorer",
    description:
      "Browse every Pokémon TCG set ever released. Dive into individual cards, view price histories, rarity breakdowns, and set completion rates.",
    icon: Layers,
    route: "/sets",
    badge: "CORE",
  },
  {
    title: "Portfolio Tracker",
    description:
      "Track your physical collection's market value. Import cards, view P&L, historical snapshots, and export CSV reports for tax season.",
    icon: Briefcase,
    route: "/portfolio",
    badge: "PRO",
  },
  {
    title: "Smart Dashboard",
    description:
      "Personalized analytics dashboard with portfolio performance, market trends, top movers, and AI-powered investment insights.",
    icon: Activity,
    route: "/dashboard",
    badge: "PRO",
  },
  {
    title: "Watchlist & Alerts",
    description:
      "Set custom price alerts on any card. Get notified when prices hit your targets. Track watchlisted cards with Delta deviation monitoring.",
    icon: Eye,
    route: "/watchlist",
    badge: "PRO",
  },
  {
    title: "Price Alerts Engine",
    description:
      "Automated price monitoring with customizable thresholds, email notifications, and portfolio-level alert intelligence.",
    icon: Bell,
    route: "/alerts",
    badge: "TEAM",
  },
  {
    title: "SimTrader World™",
    description:
      "Paper trading simulator with $10K virtual balance. Practice buy/sell strategies on real market data. Compete in seasonal trading contests.",
    icon: Gamepad2,
    route: "/sim-trader",
    badge: "FREE",
  },
  {
    title: "AI Command Center",
    description:
      "AI-powered market analysis, card valuations, and automated site audits. Institutional-grade intelligence at your fingertips.",
    icon: Brain,
    route: "/command-center",
    badge: "TEAM",
  },
  {
    title: "Subscription Tiers",
    description:
      "Flexible pricing: Free browsing, Scout ($9/mo), Pro ($29/mo), and Team ($99/mo) plans. 7-day free trial on all paid tiers.",
    icon: DollarSign,
    route: "/pricing",
    badge: "BUSINESS",
  },
];

const badgeColors: Record<string, string> = {
  CORE: "bg-primary/20 text-primary border-primary/30",
  NEW: "bg-secondary/20 text-secondary border-secondary/30",
  PRO: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  TEAM: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  FREE: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  BUSINESS: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

const InvestorTour = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [showButton, setShowButton] = useState(false);

  const isDemoUser = user?.email === DEMO_EMAIL;

  useEffect(() => {
    if (isDemoUser) {
      const dismissed = sessionStorage.getItem("tour_dismissed");
      if (!dismissed) setShowButton(true);
    } else {
      setShowButton(false);
      setActive(false);
    }
  }, [isDemoUser]);

  const startTour = useCallback(() => {
    setActive(true);
    setStep(0);
    setShowButton(false);
    navigate(TOUR_STEPS[0].route);
  }, [navigate]);

  const endTour = useCallback(() => {
    setActive(false);
    setShowButton(true);
    sessionStorage.setItem("tour_dismissed", "1");
  }, []);

  const goTo = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= TOUR_STEPS.length) return;
      setStep(idx);
      if (TOUR_STEPS[idx].route !== location.pathname) {
        navigate(TOUR_STEPS[idx].route);
      }
    },
    [navigate, location.pathname]
  );

  if (!isDemoUser) return null;

  const current = TOUR_STEPS[step];
  const Icon = current?.icon;
  const progress = ((step + 1) / TOUR_STEPS.length) * 100;

  return (
    <>
      {/* Floating "Start Tour" button */}
      <AnimatePresence>
        {showButton && !active && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={startTour}
            className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-mono text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 hover:brightness-110 transition-all"
          >
            <Rocket className="w-4 h-4" />
            Investor Tour
          </motion.button>
        )}
      </AnimatePresence>

      {/* Tour overlay */}
      <AnimatePresence>
        {active && current && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] bg-background/60 backdrop-blur-sm"
              onClick={endTour}
            />

            {/* Tour Card */}
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed z-[80] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[94vw] max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10 overflow-hidden">
                {/* Progress bar */}
                <div className="h-1 bg-muted">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                {/* Header */}
                <div className="px-6 pt-5 pb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 border border-primary/20">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-mono text-base font-bold text-foreground leading-tight">
                          {current.title}
                        </h3>
                        {current.badge && (
                          <span
                            className={`text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded border ${
                              badgeColors[current.badge] ?? "bg-muted text-muted-foreground border-border"
                            }`}
                          >
                            {current.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase mt-0.5">
                        Step {step + 1} of {TOUR_STEPS.length}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={endTour}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 -mr-1 -mt-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Body */}
                <div className="px-6 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {current.description}
                  </p>
                </div>

                {/* Step dots */}
                <div className="flex items-center justify-center gap-1.5 pb-3">
                  {TOUR_STEPS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === step
                          ? "w-6 bg-primary"
                          : i < step
                          ? "w-1.5 bg-primary/40"
                          : "w-1.5 bg-muted-foreground/20"
                      }`}
                    />
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-border px-6 py-3 flex items-center justify-between">
                  <button
                    onClick={() => goTo(step - 1)}
                    disabled={step === 0}
                    className="flex items-center gap-1 text-xs font-mono font-semibold text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Back
                  </button>

                  <button
                    onClick={endTour}
                    className="text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Skip Tour
                  </button>

                  {step < TOUR_STEPS.length - 1 ? (
                    <button
                      onClick={() => goTo(step + 1)}
                      className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-xs font-mono font-bold text-primary-foreground hover:brightness-110 transition-all"
                    >
                      Next
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={endTour}
                      className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-xs font-mono font-bold text-primary-foreground hover:brightness-110 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Finish
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default InvestorTour;
