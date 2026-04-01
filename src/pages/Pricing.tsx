import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_TIERS } from "@/lib/stripe";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import TerminalHeader from "@/components/TerminalHeader";
import TickerBar from "@/components/TickerBar";
import AuthModal from "@/components/AuthModal";
import FinancialDisclaimer from "@/components/FinancialDisclaimer";
import { ArrowLeft, Check, Minus, Zap, Crown, Users, Shield, Star, Gem, Store, Sparkles, Anchor } from "lucide-react";

const features = [
  { name: "Raw card market ticker", free: "Delayed 15 min", arena: "Delayed 15 min", starter: "Real-time", pro: "Real-time", premium: "Real-time", team: "Real-time", whale: "Real-time" },
  { name: "Top movers dashboard", free: "Top 12", arena: "Top 12", starter: "Top 50", pro: "Unlimited", premium: "Unlimited", team: "Unlimited", whale: "Unlimited" },
  { name: "Daily market summary", free: true, arena: true, starter: true, pro: true, premium: true, team: true, whale: true },
  { name: "Community access", free: true, arena: true, starter: true, pro: true, premium: true, team: true, whale: true },
  { name: "Arena betting & PokéCoins", free: false, arena: true, starter: true, pro: true, premium: true, team: true, whale: true },
  { name: "Basic price alerts", free: false, arena: false, starter: "5 max", pro: "Unlimited", premium: "Unlimited", team: "Unlimited", whale: "Unlimited" },
  { name: "7-day price history", free: false, arena: false, starter: true, pro: true, premium: true, team: true, whale: true },
  { name: "Graded card ticker", free: false, arena: false, starter: false, pro: true, premium: true, team: true, whale: true },
  { name: "Sealed product ticker", free: false, arena: false, starter: false, pro: true, premium: true, team: true, whale: true },
  { name: "Full card board (500+)", free: false, arena: false, starter: false, pro: true, premium: true, team: true, whale: true },
  { name: "Historical price charts", free: false, arena: false, starter: false, pro: true, premium: true, team: true, whale: true },
  { name: "AI signal analysis", free: false, arena: false, starter: false, pro: true, premium: true, team: true, whale: true },
  { name: "Portfolio tracking & P&L", free: false, arena: false, starter: false, pro: true, premium: true, team: true, whale: true },
  { name: "API access", free: false, arena: false, starter: false, pro: false, premium: true, team: true, whale: true },
  { name: "Arbitrage scanner", free: false, arena: false, starter: false, pro: false, premium: true, team: true, whale: true },
  { name: "Bulk export (CSV/JSON)", free: false, arena: false, starter: false, pro: false, premium: true, team: true, whale: true },
  { name: "SimTrader™ unlimited trades", free: false, arena: false, starter: false, pro: false, premium: true, team: true, whale: true },
  { name: "Limit & stop-loss orders", free: false, arena: false, starter: false, pro: false, premium: true, team: true, whale: true },
  { name: "Trading contests", free: false, arena: false, starter: false, pro: false, premium: true, team: true, whale: true },
  { name: "Capital gains tax reports", free: false, arena: false, starter: false, pro: false, premium: true, team: true, whale: true },
  { name: "AI market intelligence", free: false, arena: false, starter: false, pro: false, premium: true, team: true, whale: true },
  { name: "Priority support", free: false, arena: false, starter: false, pro: false, premium: true, team: true, whale: true },
  { name: "Multi-seat access", free: false, arena: false, starter: false, pro: false, premium: false, team: "3 seats", whale: "5 seats" },
  { name: "Dedicated account manager", free: false, arena: false, starter: false, pro: false, premium: false, team: false, whale: true },
  { name: "Custom API rate limits", free: false, arena: false, starter: false, pro: false, premium: false, team: false, whale: true },
];

type TierDef = { key: string; name: string; icon: React.ReactNode; description: string };

const tiers: TierDef[] = [
  { key: "free", name: "FREE", icon: <Minus className="h-5 w-5" />, description: "Explore the market" },
  { key: "arena", name: "ARENA", icon: <Crown className="h-5 w-5" />, description: "Arena access" },
  { key: "starter", name: "STARTER", icon: <Sparkles className="h-5 w-5" />, description: "For casual collectors" },
  { key: "pro", name: "PRO", icon: <Zap className="h-5 w-5" />, description: "For active collectors" },
  { key: "premium", name: "PREMIUM", icon: <Gem className="h-5 w-5" />, description: "For serious investors" },
  { key: "team", name: "TEAM", icon: <Store className="h-5 w-5" />, description: "For local game stores" },
  { key: "whale", name: "WHALE", icon: <Anchor className="h-5 w-5" />, description: "Ultimate tier" },
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
      const coupon = sessionStorage.getItem("checkout_coupon") || undefined;
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId, trial: tierKey === "pro" ? 7 : undefined, coupon },
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
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Terminal
        </button>

        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="font-mono text-2xl md:text-3xl font-bold text-foreground">
            Pick Your Edge
          </h1>
          <p className="font-mono text-sm text-muted-foreground max-w-lg mx-auto">
            Start free. Upgrade when you're ready. Cancel anytime.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap pt-1">
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-primary font-semibold">
              <Users className="w-3.5 h-3.5" /> 2,400+ traders
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-terminal-amber font-semibold">
              <Star className="w-3.5 h-3.5" /> 4.8/5 rating
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-terminal-green font-semibold">
              <Shield className="w-3.5 h-3.5" /> Bank-level encryption
            </span>
          </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {tiers.map((t) => {
            const current = isCurrent(t.key);
            const highlight = t.key === "pro";
            const isPremium = t.key === "premium";
            const isTeam = t.key === "team";
            const isStarter = t.key === "starter";
            const isWhale = t.key === "whale";
            const isArena = t.key === "arena";
            const stripeTier = t.key !== "free" ? (STRIPE_TIERS as any)[t.key] : null;
            const price = !stripeTier ? "$0" : annual ? stripeTier.annual.price : stripeTier.price;
            const period = !stripeTier ? "forever" : annual ? stripeTier.annual.period : stripeTier.period;
            const priceId = !stripeTier ? null : annual ? stripeTier.annual.price_id : stripeTier.price_id;
            const savings = annual && stripeTier ? stripeTier.annual.savings : null;

            return (
              <div
                key={t.key}
                className={`terminal-card p-4 flex flex-col relative transition-all duration-300 ${
                  highlight ? "border-t-2 border-t-primary shadow-[0_0_24px_hsl(var(--primary)/0.15)] hover:shadow-[0_0_32px_hsl(var(--primary)/0.25)] scale-[1.02]" : ""
                } ${isPremium ? "border-t-2 border-t-purple-500 shadow-[0_0_16px_rgba(168,85,247,0.1)]" : ""
                } ${isStarter ? "border-t-2 border-t-terminal-amber shadow-[0_0_16px_rgba(245,158,11,0.1)]" : ""
                } ${isTeam ? "border-t-2 border-t-terminal-amber shadow-[0_0_16px_rgba(245,158,11,0.1)]" : ""
                } ${isWhale ? "border-t-2 border-t-blue-500 shadow-[0_0_16px_rgba(59,130,246,0.1)]" : ""
                } ${isArena ? "border-t-2 border-t-terminal-green shadow-[0_0_16px_rgba(34,197,94,0.1)]" : ""
                } ${current ? "ring-1 ring-primary" : ""}`}
              >
                {current && (
                  <span className="absolute -top-3 left-4 font-mono text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded">
                    YOUR PLAN
                  </span>
                )}
                {highlight && !current && (
                  <span className="absolute -top-3 right-3 font-mono text-[9px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold animate-pulse shadow-[0_0_12px_hsl(var(--primary)/0.6)]">
                    ⚡ MOST POPULAR
                  </span>
                )}
                {isPremium && !current && (
                  <span className="absolute -top-3 right-3 font-mono text-[9px] bg-purple-500 text-white px-2 py-0.5 rounded-full font-bold">
                    💎 BEST VALUE
                  </span>
                )}
                {isWhale && !current && (
                  <span className="absolute -top-3 right-3 font-mono text-[9px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">
                    🐋 WHALE
                  </span>
                )}

                <div className="flex items-center gap-2 mb-1">
                  <div className={`h-7 w-7 rounded flex items-center justify-center ${
                    isPremium ? "bg-purple-500/10 text-purple-400" : isTeam ? "bg-terminal-amber/10 text-terminal-amber" : isWhale ? "bg-blue-500/10 text-blue-400" : isArena ? "bg-terminal-green/10 text-terminal-green" : "bg-primary/10 text-primary"
                  }`}>
                    {t.icon}
                  </div>
                  <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase font-semibold">
                    {t.name}
                  </span>
                </div>

                <p className="font-mono text-[10px] text-muted-foreground mb-2">{t.description}</p>

                <div className="mb-1 flex items-baseline gap-1">
                  <span className="font-mono text-2xl font-bold text-foreground">{price}</span>
                  <span className="font-mono text-xs text-muted-foreground">{period}</span>
                </div>

                {isStarter && !current && (
                  <span className="inline-block font-mono text-[9px] text-terminal-amber font-bold bg-terminal-amber/10 border border-terminal-amber/20 px-2 py-0.5 rounded mb-2">
                    ☕ LESS THAN A COFFEE
                  </span>
                )}
                {highlight && !current && (
                  <span className="inline-block font-mono text-[9px] text-terminal-green font-bold bg-terminal-green/10 border border-terminal-green/20 px-2 py-0.5 rounded mb-2">
                    🎁 14-DAY FREE TRIAL
                  </span>
                )}
                {isTeam && (
                  <span className="inline-block font-mono text-[9px] text-terminal-amber font-bold bg-terminal-amber/10 border border-terminal-amber/20 px-2 py-0.5 rounded mb-2">
                    🏪 3 SEATS INCLUDED
                  </span>
                )}
                {isWhale && (
                  <span className="inline-block font-mono text-[9px] text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded mb-2">
                    🐋 5 SEATS + VIP
                  </span>
                )}
                {savings && (
                  <span className="inline-block font-mono text-[9px] text-primary font-bold bg-primary/10 border border-primary/20 px-2 py-0.5 rounded mb-2">
                    💰 {savings}
                  </span>
                )}
                {!savings && <div className="mb-2" />}

                <div className="mt-auto">
                  {current && subscribed ? (
                    <button
                      onClick={handleManage}
                      className="w-full py-2 rounded font-mono text-[11px] font-semibold border border-border text-foreground hover:bg-muted transition-colors"
                    >
                      Manage Subscription
                    </button>
                  ) : priceId ? (
                    <button
                      onClick={() => handleSubscribe(priceId, t.key)}
                      disabled={loadingTier === t.key}
                      className={`w-full py-2 rounded font-mono text-[11px] font-semibold transition-all disabled:opacity-50 ${
                        highlight
                          ? "bg-primary text-primary-foreground hover:opacity-90"
                          : isPremium
                          ? "bg-purple-500 text-white hover:bg-purple-600"
                          : isWhale
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "border border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      {loadingTier === t.key
                        ? "Loading..."
                        : t.key === "pro"
                        ? "Start Free Trial"
                        : `Get ${t.name}`}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2 rounded font-mono text-[11px] font-semibold border border-border text-muted-foreground"
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
                  <th className="text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground p-3 min-w-[180px]">
                    Feature
                  </th>
                  {tiers.map((t) => (
                    <th
                      key={t.key}
                      className={`text-center font-mono text-[9px] uppercase tracking-widest p-2 min-w-[70px] ${
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
                    <td className="text-center p-2">{renderCell(f.free)}</td>
                    <td className="text-center p-2">{renderCell((f as any).arena)}</td>
                    <td className="text-center p-2">{renderCell((f as any).starter)}</td>
                    <td className="text-center p-2">{renderCell(f.pro)}</td>
                    <td className="text-center p-2">{renderCell(f.premium)}</td>
                    <td className="text-center p-2">{renderCell(f.team)}</td>
                    <td className="text-center p-2">{renderCell((f as any).whale)}</td>
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
              { q: "Can I cancel anytime?", a: "Yes. Cancel from your subscription portal — no lock-in contracts." },
              { q: "Do I need a credit card for Free?", a: "No. The Free tier requires no payment information." },
              { q: "What's included in the 14-day trial?", a: "Full Pro access — real-time data, alerts, charts, and portfolio tracking. No card charged until day 15." },
              { q: "What's the Arena tier?", a: "At $0.99/mo you unlock Arena betting, PokéCoin wallet, and pack simulator. The cheapest way to play." },
              { q: "What's the Starter plan?", a: "At $1.99/mo — less than a coffee — you get real-time data, top 50 movers, and basic alerts." },
              { q: "Can I upgrade or downgrade?", a: "Absolutely. Changes take effect on your next billing cycle." },
              { q: "How does the Team plan work?", a: "3 seats with full Premium access at $19.99/mo. Perfect for LGS shops." },
              { q: "What's the Whale tier?", a: "Our ultimate tier at $49.99/mo — 5 seats, dedicated account manager, custom API limits, and white-glove onboarding." },
              { q: "Is my payment secure?", a: "All payments are processed through Stripe with bank-level encryption." },
            ].map(({ q, a }) => (
              <div key={q}>
                <p className="font-mono text-xs font-semibold text-foreground">{q}</p>
                <p className="font-mono text-[11px] text-muted-foreground mt-0.5">{a}</p>
              </div>
            ))}
          </div>
        </div>
        <FinancialDisclaimer compact />
      </main>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
};

export default Pricing;
