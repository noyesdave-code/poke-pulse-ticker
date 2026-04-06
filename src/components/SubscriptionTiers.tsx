import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_TIERS } from "@/lib/stripe";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Zap, Gem, Store, Crown, Anchor } from "lucide-react";

const tierDefs = [
  {
    key: "free" as const,
    name: "FREE",
    description: "Browse live market data — see what your cards are worth right now",
    icon: <Sparkles className="w-4 h-4" />,
    features: [
      "Raw card market ticker (delayed 15 min)",
      "Top 12 movers dashboard",
      "Daily market summary & Card of the Day",
      "Community access & sentiment polls",
    ],
    cta: "Current Plan",
    highlight: false,
    color: "muted-foreground",
  },
  {
    key: "arena" as const,
    name: "ARENA",
    description: "Predict prices, win PokéCoins — prove your market instincts",
    icon: <Crown className="w-4 h-4" />,
    features: [
      "Everything in Free",
      "Arena price-prediction betting",
      "Unified PokéCoin wallet",
      "Digital pack simulator (Poké Ripz™)",
    ],
    cta: "Get Arena",
    highlight: false,
    badge: "🎮 ARENA ACCESS",
    badgeColor: "text-terminal-green bg-terminal-green/10 border-terminal-green/20",
    color: "terminal-green",
  },
  {
    key: "starter" as const,
    name: "STARTER",
    description: "Real-time prices & alerts — know the moment your card moves",
    icon: <Sparkles className="w-4 h-4" />,
    features: [
      "Everything in Arena",
      "Real-time raw card ticker (zero delay)",
      "Top 50 movers dashboard",
      "Price alerts (5 active)",
      "7-day price history charts",
    ],
    cta: "Get Starter",
    highlight: false,
    badge: "☕ LESS THAN A COFFEE",
    badgeColor: "text-terminal-amber bg-terminal-amber/10 border-terminal-amber/20",
    color: "terminal-amber",
  },
  {
    key: "pro" as const,
    name: "PRO",
    description: "AI signals, arbitrage alerts & portfolio P&L — deploy strategies that make money",
    icon: <Zap className="w-4 h-4" />,
    features: [
      "Everything in Starter",
      "Graded & sealed product tickers",
      "Full card board (500+ cards)",
      "Unlimited price & delta alerts",
      "AI Alpha Signals (buy/sell/hold)",
      "Portfolio tracking with P&L & cost basis",
      "Grading ROI calculator",
    ],
    cta: "Start Free Trial",
    highlight: true,
    badge: "⚡ MOST POPULAR",
    badgeColor: "text-primary bg-primary/10 border-primary/20",
    color: "primary",
  },
  {
    key: "premium" as const,
    name: "PREMIUM",
    description: "Arbitrage scanner, SimTrader™, and institutional-grade tools — maximize every edge",
    icon: <Gem className="w-4 h-4" />,
    features: [
      "Everything in Pro",
      "Cross-marketplace arbitrage scanner",
      "Grade Ratio Arbitrage Bot",
      "SimTrader™ unlimited trades & contests",
      "Limit orders & stop-losses",
      "Bulk CSV/JSON export & API access",
      "Capital gains tax reports (FIFO)",
    ],
    cta: "Get Premium",
    highlight: false,
    badge: "💎 BEST VALUE",
    badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    color: "purple-400",
  },
  {
    key: "team" as const,
    name: "TEAM",
    description: "Multi-seat access for game stores — shared data, shared profits",
    icon: <Store className="w-4 h-4" />,
    features: [
      "Everything in Premium",
      "3 seats included",
      "Shared market data dashboard",
      "Team portfolio management",
    ],
    cta: "Get Team",
    highlight: false,
    badge: "🏪 3 SEATS",
    badgeColor: "text-terminal-amber bg-terminal-amber/10 border-terminal-amber/20",
    color: "terminal-amber",
  },
  {
    key: "whale" as const,
    name: "WHALE",
    description: "White-glove service, custom API limits, dedicated manager — institutional grade",
    icon: <Anchor className="w-4 h-4" />,
    features: [
      "Everything in Team",
      "5 seats included",
      "Dedicated account manager",
      "Custom API rate limits",
      "White-glove onboarding & priority support",
    ],
    cta: "Get Whale",
    highlight: false,
    badge: "🐋 WHALE TIER",
    badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    color: "blue-400",
  },
];

const SubscriptionTiers = () => {
  const { user, tier: currentTier, subscribed } = useAuth();
  const { toast } = useToast();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [annual, setAnnual] = useState(false);

  const handleSubscribe = async (priceId: string, tierName: string) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to subscribe.", variant: "destructive" });
      return;
    }
    setLoadingTier(tierName);
    try {
      const coupon = sessionStorage.getItem("checkout_coupon") || undefined;
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId, trial: tierName === "pro" ? 14 : undefined, coupon },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoadingTier(null);
    }
  };

  const handleManage = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const isCurrentTier = (tierKey: string) => {
    if (tierKey === "free" && !subscribed) return true;
    return currentTier === tierKey;
  };

  return (
    <section className="py-16 px-4" id="pricing">
      <div className="text-center mb-8">
        <h2 className="text-sm font-bold tracking-wide text-secondary uppercase mb-3">
          Subscription Plans
        </h2>
        <p className="text-2xl font-extrabold text-foreground mb-2">
          Pick Your Edge
        </p>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-3">
          Start free. Upgrade when you're ready. Cancel anytime.
        </p>
        {/* Urgency nudge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-[11px] text-primary font-bold">
            127 collectors signed up this week
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mb-8">
        <span className={`font-mono text-xs font-semibold ${!annual ? "text-foreground" : "text-muted-foreground"}`}>
          Monthly
        </span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative w-12 h-6 rounded-full transition-colors ${annual ? "bg-primary" : "bg-muted"}`}
        >
          <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-foreground transition-transform ${annual ? "translate-x-6" : ""}`} />
        </button>
        <span className={`font-mono text-xs font-semibold ${annual ? "text-foreground" : "text-muted-foreground"}`}>
          Annual
        </span>
        {annual && (
          <span className="font-mono text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded font-semibold animate-pulse">
            SAVE 2 MONTHS
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 max-w-7xl mx-auto">
        {tierDefs.map((t) => {
          const isCurrent = isCurrentTier(t.key);
          const stripeTier = t.key !== "free" ? (STRIPE_TIERS as any)[t.key] : null;
          const price = !stripeTier ? "$0" : annual ? stripeTier.annual.price : stripeTier.price;
          const period = !stripeTier ? "forever" : annual ? stripeTier.annual.period : stripeTier.period;
          const priceId = !stripeTier ? null : annual ? stripeTier.annual.price_id : stripeTier.price_id;
          const savings = annual && stripeTier ? stripeTier.annual.savings : null;

          return (
            <div
              key={t.name}
              className={`terminal-card p-5 flex flex-col relative transition-all duration-300 ${
                t.highlight ? "border-t-2 border-t-primary shadow-[0_0_24px_hsl(var(--primary)/0.15)] scale-[1.01]" : ""
              } ${t.key === "premium" ? "border-t-2 border-t-purple-500" : ""}
              ${t.key === "starter" ? "border-t-2 border-t-terminal-amber" : ""}
              ${t.key === "whale" ? "border-t-2 border-t-blue-500" : ""}
              ${isCurrent ? "ring-1 ring-primary" : ""}`}
            >
              {isCurrent && (
                <span className="absolute -top-3 left-4 font-mono text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded">
                  YOUR PLAN
                </span>
              )}
              {t.badge && !isCurrent && (
                <span className={`absolute -top-3 right-3 font-mono text-[9px] px-2 py-0.5 rounded-full font-bold border ${t.badgeColor}`}>
                  {t.badge}
                </span>
              )}
              <div className="mb-3">
                <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  {t.name}
                </span>
              </div>
              <div className="mb-1 flex items-baseline gap-1">
                <span className="font-mono text-2xl font-bold text-foreground">{price}</span>
                <span className="font-mono text-xs text-muted-foreground">{period}</span>
              </div>
              {savings && (
                <span className="font-mono text-[10px] text-primary font-semibold mb-1">{savings}</span>
              )}
              <p className="text-[11px] text-muted-foreground mb-4 leading-relaxed">{t.description}</p>
              <ul className="space-y-2 mb-6 flex-1">
                {t.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                    <span className="text-primary mt-0.5 text-[10px]">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {isCurrent && subscribed ? (
                <button
                  onClick={handleManage}
                  className="w-full py-2.5 rounded font-mono text-xs font-semibold border border-border text-foreground hover:bg-muted"
                >
                  Manage Subscription
                </button>
              ) : priceId ? (
                <button
                  onClick={() => handleSubscribe(priceId, t.key)}
                  disabled={loadingTier === t.key}
                  className={`w-full py-2.5 rounded font-mono text-xs font-semibold transition-all ${
                    t.highlight
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : t.key === "premium"
                      ? "bg-purple-500 text-white hover:bg-purple-600"
                      : t.key === "whale"
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "border border-border text-foreground hover:bg-muted"
                  } disabled:opacity-50`}
                >
                  {loadingTier === t.key ? "Loading..." : t.cta}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-2.5 rounded font-mono text-xs font-semibold border border-border text-muted-foreground"
                >
                  {t.cta}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Trust line */}
      <p className="text-center font-mono text-[10px] text-muted-foreground mt-6">
        ✓ 14-day free Pro trial &nbsp;·&nbsp; ✓ Cancel anytime &nbsp;·&nbsp; ✓ Secure Stripe payments
      </p>
    </section>
  );
};

export default SubscriptionTiers;
