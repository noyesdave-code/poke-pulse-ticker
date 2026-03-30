import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_TIERS } from "@/lib/stripe";
import { useToast } from "@/hooks/use-toast";

const tierDefs = [
  {
    key: "free" as const,
    name: "FREE",
    description: "Basic market access for casual collectors",
    features: [
      "Raw card market ticker (delayed 15 min)",
      "Top 12 movers dashboard",
      "Daily market summary",
      "Community access",
    ],
    cta: "Current Plan",
    highlight: false,
  },
  {
    key: "pro" as const,
    name: "PRO",
    description: "Real-time data for serious traders",
    features: [
      "Everything in Free",
      "Real-time raw card ticker",
      "Real-time graded card ticker",
      "Real-time sealed product ticker",
      "Full card board (500+ cards)",
      "Price alerts & notifications",
      "Historical price charts",
    ],
    cta: "Subscribe to Pro",
    highlight: true,
  },
  {
    key: "institutional" as const,
    name: "INSTITUTIONAL",
    description: "Enterprise-grade analytics for dealers & shops",
    features: [
      "Everything in Pro",
      "API access for custom integrations",
      "Arbitrage scanner",
      "Portfolio tracking & P&L",
      "Bulk export (CSV/JSON)",
      "Priority support",
      "Custom watchlists (unlimited)",
    ],
    cta: "Subscribe to Institutional",
    highlight: false,
  },
  {
    key: "trader" as const,
    name: "TRADER",
    description: "Simulated Pokémon stock market trading game",
    features: [
      "Everything in Institutional",
      "$100K virtual trading balance",
      "Buy/sell tokens at live prices",
      "Limit orders & stop-losses",
      "Daily trading contests & tournaments",
      "Leaderboards & in-app rewards",
      "Play vs AI & other traders",
      "Secure sandbox environment",
    ],
    cta: "Subscribe to Trader",
    highlight: false,
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
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId, trial: tierName === "pro" ? 7 : undefined },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
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
      if (data?.url) {
        window.open(data.url, "_blank");
      }
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
          Upgrade Your Market Intelligence
        </p>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          From casual collectors to institutional dealers — pick the plan that matches your trading volume.
        </p>
      </div>

      {/* Billing Toggle */}
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
          <span className="font-mono text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded font-semibold">
            2 MONTHS FREE
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {tierDefs.map((t) => {
          const isCurrent = isCurrentTier(t.key);
          const stripeTier = t.key !== "free" ? STRIPE_TIERS[t.key] : null;
          const price = !stripeTier ? "$0" : annual ? stripeTier.annual.price : stripeTier.price;
          const period = !stripeTier ? "forever" : annual ? stripeTier.annual.period : stripeTier.period;
          const priceId = !stripeTier ? null : annual ? stripeTier.annual.price_id : stripeTier.price_id;
          const savings = annual && stripeTier ? stripeTier.annual.savings : null;

          return (
            <div
              key={t.name}
              className={`terminal-card p-6 flex flex-col relative ${
                t.highlight ? "border-t-2 border-t-primary glow-green" : ""
              } ${isCurrent ? "ring-1 ring-primary" : ""}`}
            >
              {isCurrent && (
                <span className="absolute -top-3 left-4 font-mono text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded">
                  YOUR PLAN
                </span>
              )}
              <div className="mb-4">
                <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  {t.name}
                </span>
              </div>
              <div className="mb-1 flex items-baseline gap-1">
                <span className="font-mono text-3xl font-bold text-foreground">{price}</span>
                <span className="font-mono text-sm text-muted-foreground">{period}</span>
              </div>
              {savings && (
                <span className="font-mono text-[10px] text-primary font-semibold mb-2">{savings}</span>
              )}
              <p className="text-xs text-muted-foreground mb-6">{t.description}</p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {t.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="text-primary mt-0.5 text-xs">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {isCurrent && subscribed ? (
                <button
                  onClick={handleManage}
                  className="w-full py-2.5 rounded font-mono text-sm font-semibold border border-border text-foreground hover:bg-muted"
                >
                  Manage Subscription
                </button>
              ) : priceId ? (
                <button
                  onClick={() => handleSubscribe(priceId, t.key)}
                  disabled={loadingTier === t.key}
                  className={`w-full py-2.5 rounded font-mono text-sm font-semibold transition-all ${
                    t.highlight
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "border border-border text-foreground hover:bg-muted"
                  } disabled:opacity-50`}
                >
                  {loadingTier === t.key ? "Loading..." : t.key === "pro" ? "Start 7-Day Free Trial" : t.cta}
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-2.5 rounded font-mono text-sm font-semibold border border-border text-muted-foreground"
                >
                  {t.cta}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SubscriptionTiers;
