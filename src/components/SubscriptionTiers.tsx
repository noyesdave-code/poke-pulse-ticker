import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_TIERS } from "@/lib/stripe";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const tiers = [
  {
    key: "free" as const,
    name: "FREE",
    price: "$0",
    period: "forever",
    description: "Basic market access for casual collectors",
    features: [
      "Raw card market ticker (delayed 15 min)",
      "Top 12 movers dashboard",
      "Daily market summary",
      "Community access",
    ],
    cta: "Current Plan",
    highlight: false,
    priceId: null,
  },
  {
    key: "pro" as const,
    name: "PRO",
    price: "$19",
    period: "/month",
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
    priceId: STRIPE_TIERS.pro.price_id,
  },
  {
    key: "institutional" as const,
    name: "INSTITUTIONAL",
    price: "$99",
    period: "/month",
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
    priceId: STRIPE_TIERS.institutional.price_id,
  },
];

const SubscriptionTiers = () => {
  const { user, tier: currentTier, subscribed } = useAuth();
  const { toast } = useToast();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string, tierName: string) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to subscribe.", variant: "destructive" });
      return;
    }

    setLoadingTier(tierName);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
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
      <div className="text-center mb-12">
        <h2 className="font-mono text-xs tracking-[0.3em] text-secondary uppercase font-semibold mb-3">
          Subscription Plans
        </h2>
        <p className="font-mono text-2xl font-bold text-foreground mb-2">
          Upgrade Your Market Intelligence
        </p>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          From casual collectors to institutional dealers — pick the plan that matches your trading volume.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {tiers.map((t) => {
          const isCurrent = isCurrentTier(t.key);
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
                <span className="font-mono text-3xl font-bold text-foreground">{t.price}</span>
                <span className="font-mono text-sm text-muted-foreground">{t.period}</span>
              </div>
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
              ) : t.priceId ? (
                <button
                  onClick={() => handleSubscribe(t.priceId!, t.key)}
                  disabled={loadingTier === t.key}
                  className={`w-full py-2.5 rounded font-mono text-sm font-semibold transition-all ${
                    t.highlight
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "border border-border text-foreground hover:bg-muted"
                  } disabled:opacity-50`}
                >
                  {loadingTier === t.key ? "Loading..." : t.cta}
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
