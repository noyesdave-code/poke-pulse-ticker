import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_TIERS } from "@/lib/stripe";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import TerminalHeader from "@/components/TerminalHeader";
import TickerBar from "@/components/TickerBar";
import AuthModal from "@/components/AuthModal";
import { ArrowLeft, Check, Minus, Zap, Crown, Building2 } from "lucide-react";

const features = [
  { name: "Raw card market ticker", free: "Delayed 15 min", pro: "Real-time", institutional: "Real-time" },
  { name: "Top movers dashboard", free: "Top 12", pro: "Unlimited", institutional: "Unlimited" },
  { name: "Daily market summary", free: true, pro: true, institutional: true },
  { name: "Community access", free: true, pro: true, institutional: true },
  { name: "Graded card ticker", free: false, pro: true, institutional: true },
  { name: "Sealed product ticker", free: false, pro: true, institutional: true },
  { name: "Full card board (500+)", free: false, pro: true, institutional: true },
  { name: "Price alerts & notifications", free: false, pro: true, institutional: true },
  { name: "Historical price charts", free: false, pro: true, institutional: true },
  { name: "AI signal analysis", free: false, pro: true, institutional: true },
  { name: "Portfolio tracking & P&L", free: false, pro: true, institutional: true },
  { name: "API access", free: false, pro: false, institutional: true },
  { name: "Arbitrage scanner", free: false, pro: false, institutional: true },
  { name: "Bulk export (CSV/JSON)", free: false, pro: false, institutional: true },
  { name: "Priority support", free: false, pro: false, institutional: true },
  { name: "Custom watchlists (unlimited)", free: false, pro: false, institutional: true },
];

const tiers = [
  { key: "free" as const, name: "FREE", icon: <Minus className="h-5 w-5" /> },
  { key: "pro" as const, name: "PRO", icon: <Zap className="h-5 w-5" /> },
  { key: "institutional" as const, name: "INSTITUTIONAL", icon: <Building2 className="h-5 w-5" /> },
];

const Pricing = () => {
  const navigate = useNavigate();
  const { user, tier: currentTier, subscribed } = useAuth();
  const { toast } = useToast();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [annual, setAnnual] = useState(false);

  const isCurrent = (key: string) => {
    if (key === "free" && !subscribed) return true;
    return currentTier === key;
  };

  const handleSubscribe = async (priceId: string, tierKey: string) => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setLoadingTier(tierKey);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId, trial: tierKey === "pro" ? 7 : undefined },
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

  const renderCell = (value: boolean | string) => {
    if (typeof value === "string") {
      return <span className="font-mono text-[11px] text-foreground">{value}</span>;
    }
    return value ? (
      <Check className="h-4 w-4 text-primary mx-auto" />
    ) : (
      <Minus className="h-4 w-4 text-muted-foreground/40 mx-auto" />
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <TerminalHeader />
      <TickerBar />
      <main className="max-w-5xl mx-auto px-4 lg:px-6 py-6 space-y-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Terminal
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-mono text-2xl md:text-3xl font-bold text-foreground">
            Upgrade Your Market Intelligence
          </h1>
          <p className="font-mono text-sm text-muted-foreground max-w-lg mx-auto">
            From casual collectors to institutional dealers — pick the plan that matches your trading volume.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3">
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

        {/* Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tiers.map((t) => {
            const current = isCurrent(t.key);
            const highlight = t.key === "pro";
            const stripeTier = t.key !== "free" ? STRIPE_TIERS[t.key] : null;
            const price = !stripeTier ? "$0" : annual ? stripeTier.annual.price : stripeTier.price;
            const period = !stripeTier ? "forever" : annual ? stripeTier.annual.period : stripeTier.period;
            const priceId = !stripeTier ? null : annual ? stripeTier.annual.price_id : stripeTier.price_id;
            const savings = annual && stripeTier ? stripeTier.annual.savings : null;

            return (
              <div
                key={t.key}
                className={`terminal-card p-5 flex flex-col relative ${
                  highlight ? "border-t-2 border-t-primary glow-green" : ""
                } ${current ? "ring-1 ring-primary" : ""}`}
              >
                {current && (
                  <span className="absolute -top-3 left-4 font-mono text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded">
                    YOUR PLAN
                  </span>
                )}
                {highlight && !current && (
                  <span className="absolute -top-3 right-4 font-mono text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded">
                    MOST POPULAR
                  </span>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                    {t.icon}
                  </div>
                  <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase font-semibold">
                    {t.name}
                  </span>
                </div>
                <div className="mb-1 flex items-baseline gap-1">
                  <span className="font-mono text-3xl font-bold text-foreground">{price}</span>
                  <span className="font-mono text-sm text-muted-foreground">{period}</span>
                </div>
                {savings && (
                  <span className="font-mono text-[10px] text-primary font-semibold mb-3">{savings}</span>
                )}
                {!savings && <div className="mb-3" />}

                <div className="mt-auto">
                  {current && subscribed ? (
                    <button
                      onClick={handleManage}
                      className="w-full py-2.5 rounded font-mono text-sm font-semibold border border-border text-foreground hover:bg-muted transition-colors"
                    >
                      Manage Subscription
                    </button>
                  ) : priceId ? (
                    <button
                      onClick={() => handleSubscribe(priceId, t.key)}
                      disabled={loadingTier === t.key}
                      className={`w-full py-2.5 rounded font-mono text-sm font-semibold transition-all disabled:opacity-50 ${
                        highlight
                          ? "bg-primary text-primary-foreground hover:opacity-90"
                          : "border border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      {loadingTier === t.key ? "Loading..." : t.key === "pro" ? "Start 7-Day Free Trial" : `Get ${t.name}`}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2.5 rounded font-mono text-sm font-semibold border border-border text-muted-foreground"
                    >
                      Current Plan
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="terminal-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-mono text-sm font-bold text-foreground flex items-center gap-2">
              <Crown className="h-4 w-4 text-primary" />
              Feature Comparison
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground p-3 w-1/2">
                    Feature
                  </th>
                  {tiers.map((t) => (
                    <th
                      key={t.key}
                      className={`text-center font-mono text-[10px] uppercase tracking-widest p-3 ${
                        isCurrent(t.key) ? "text-primary font-bold" : "text-muted-foreground"
                      }`}
                    >
                      {t.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((f, i) => (
                  <tr
                    key={f.name}
                    className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-muted/10"}`}
                  >
                    <td className="font-mono text-xs text-foreground p-3">{f.name}</td>
                    <td className="text-center p-3">{renderCell(f.free)}</td>
                    <td className="text-center p-3">{renderCell(f.pro)}</td>
                    <td className="text-center p-3">{renderCell(f.institutional)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="terminal-card p-5 space-y-4">
          <h2 className="font-mono text-sm font-bold text-foreground">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: "Can I cancel anytime?", a: "Yes. Cancel from your subscription management portal — no lock-in contracts." },
              { q: "Do I need a credit card for Free?", a: "No. The Free tier requires no payment information." },
              { q: "Can I upgrade or downgrade?", a: "Absolutely. Changes take effect on your next billing cycle." },
              { q: "Is my payment secure?", a: "All payments are processed through Stripe with bank-level encryption." },
            ].map(({ q, a }) => (
              <div key={q}>
                <p className="font-mono text-xs font-semibold text-foreground">{q}</p>
                <p className="font-mono text-[11px] text-muted-foreground mt-0.5">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
};

export default Pricing;
