import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap, ArrowRight, TrendingUp, Shield, Clock, Star,
  BarChart3, Bell, Layers, CheckCircle2, ChevronDown, Gamepad2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import FinancialDisclaimer from "@/components/FinancialDisclaimer";

/* ── UTM-aware page: /go?ref=tiktok&campaign=launch ── */

const stats = [
  { value: "500+", label: "Cards Tracked" },
  { value: "24/7", label: "Hourly Updates" },
  { value: "4.8★", label: "User Rating" },
  { value: "2,400+", label: "Active Users" },
];

const features = [
  { icon: TrendingUp, title: "Live Price Ticker", desc: "Real-time prices for raw, graded & sealed Pokémon TCG products." },
  { icon: BarChart3, title: "Portfolio Tracker", desc: "Track your collection value, see P&L, and set price alerts." },
  { icon: Bell, title: "Smart Alerts", desc: "Get notified the instant a card hits your target buy/sell price." },
  { icon: Shield, title: "AI Market Signals", desc: "30-day MA crossover, RSI, and consensus pricing — built in." },
  { icon: Layers, title: "Browse Every Set", desc: "From Base Set to the latest expansion, every card is covered." },
  { icon: Clock, title: "Historical Charts", desc: "See how any card's price has moved over days, weeks, months." },
];

const testimonials = [
  { name: "Jake M.", role: "Collector & Investor", quote: "The 30-day MA signals saved me from overpaying on multiple occasions.", stars: 5 },
  { name: "Sarah T.", role: "TCG Shop Owner", quote: "The sealed product index alone is worth the Pro sub. I price my inventory based on the live data here.", stars: 5 },
  { name: "Mike R.", role: "Graded Card Trader", quote: "Finally a platform that tracks graded, raw, AND sealed in one place.", stars: 5 },
];

const SocialLanding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  // Track UTM params for analytics
  const utm = {
    ref: searchParams.get("ref") || "direct",
    campaign: searchParams.get("campaign") || "",
  };

  useEffect(() => {
    // Store UTM in sessionStorage for downstream checkout attribution
    if (utm.ref !== "direct") {
      sessionStorage.setItem("utm_ref", utm.ref);
      if (utm.campaign) sessionStorage.setItem("utm_campaign", utm.campaign);
    }
  }, [utm.ref, utm.campaign]);

  const handleCTA = () => {
    if (user) {
      navigate("/pricing");
    } else {
      setShowAuth(true);
    }
  };

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ════════ HERO ════════ */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-5 py-16 text-center overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20" style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent)" }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10" style={{ background: "radial-gradient(circle, hsl(var(--terminal-blue)), transparent)" }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-2xl mx-auto space-y-6"
        >
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mx-auto">
            <div className="h-2 w-2 rounded-full bg-primary pulse-live" />
            <span className="font-mono text-xs text-primary font-bold uppercase tracking-wider">Live Market Data</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Your Pokémon Cards Are
            <span className="block text-primary mt-1">Moving Right Now</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Real-time pricing for <span className="text-foreground font-semibold">500+ cards</span>, graded values & sealed products — updated hourly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleCTA}
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-mono text-base font-bold bg-primary text-primary-foreground hover:shadow-[0_0_40px_hsl(160_84%_50%/0.35)] transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 shimmer-sweep opacity-60" />
              <Zap className="relative w-5 h-5" />
              <span className="relative">START FREE — 7 DAYS</span>
              <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-mono text-sm font-medium border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
            >
              Explore the Terminal
            </button>
          </div>

          <p className="font-mono text-[10px] text-primary/60 tracking-wide">
            ✓ No credit card required &nbsp;·&nbsp; ✓ Cancel anytime &nbsp;·&nbsp; ✓ 7-day free trial
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          onClick={scrollToFeatures}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </motion.button>
      </section>

      {/* ════════ SOCIAL PROOF BAR ════════ */}
      <section className="border-y border-border bg-muted/30">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="px-4 py-6 text-center"
            >
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-primary">{s.value}</div>
              <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════ FEATURES ════════ */}
      <section id="features" className="max-w-5xl mx-auto px-5 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Everything You Need to <span className="text-primary">Trade Smarter</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Built for collectors, investors, and shop owners who take Pokémon TCG seriously.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="terminal-card p-6 hover:border-primary/30 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ════════ HOW IT WORKS ════════ */}
      <section className="border-y border-border bg-muted/20 py-20 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-12"
          >
            Start in <span className="text-primary">60 Seconds</span>
          </motion.h2>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Sign Up Free", desc: "Create your account — no credit card needed." },
              { step: "02", title: "Add Your Cards", desc: "Search any card and add it to your portfolio." },
              { step: "03", title: "Track & Profit", desc: "Get live prices, alerts, and AI-powered signals." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="font-mono text-4xl font-extrabold text-primary/20 mb-3">{item.step}</div>
                <h3 className="font-bold text-foreground text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SIMTRADER PROMO ════════ */}
      <section className="max-w-5xl mx-auto px-5 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="terminal-card border-primary/30 p-8 sm:p-10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5">
                <Gamepad2 className="h-3.5 w-3.5 text-primary" />
                <span className="font-mono text-[10px] text-primary font-bold uppercase tracking-wider">New — Play Free</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                SimTrader™ — Pokémon
                <span className="text-primary"> Stock Market</span>
              </h2>
              <p className="text-muted-foreground max-w-md leading-relaxed">
                Trade Pokémon cards with <span className="text-foreground font-semibold">$100K virtual cash</span> using real market data. 
                Compete against 10 AI bots. 3 free trades daily — no subscription required.
              </p>
              <ul className="space-y-2 font-mono text-sm">
                {[
                  "Live market prices on 50+ tradable cards",
                  "Buy & sell with simulated balance",
                  "Compete on daily leaderboards",
                  "Upgrade for unlimited trades & contests",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => navigate("/sim-trader")}
                  className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-mono text-sm font-bold bg-primary text-primary-foreground hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 shimmer-sweep opacity-60" />
                  <Gamepad2 className="relative w-4 h-4" />
                  <span className="relative">Play SimTrader — Free</span>
                  <ArrowRight className="relative w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <span className="flex items-center justify-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5" /> Powered by live market data
                </span>
              </div>
            </div>
            <div className="flex-shrink-0 w-full lg:w-64 space-y-3">
              <div className="terminal-card p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted-foreground">YOUR BALANCE</span>
                  <span className="font-mono text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">VIRTUAL</span>
                </div>
                <p className="font-mono text-2xl font-bold text-foreground">$100,000</p>
              </div>
              <div className="terminal-card p-4 space-y-1.5">
                <span className="font-mono text-[10px] text-muted-foreground">SAMPLE TRADES</span>
                {[
                  { name: "Charizard ex", action: "BUY", color: "text-green-400" },
                  { name: "Pikachu VMAX", action: "SELL", color: "text-red-400" },
                  { name: "Mewtwo GX", action: "BUY", color: "text-green-400" },
                ].map((t) => (
                  <div key={t.name} className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-foreground">{t.name}</span>
                    <span className={`font-mono text-[10px] font-bold ${t.color}`}>{t.action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>
      {/* ════════ TESTIMONIALS ════════ */}
      <section className="max-w-5xl mx-auto px-5 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-4xl font-extrabold tracking-tight text-center mb-10"
        >
          Trusted by <span className="text-primary">Collectors</span>
        </motion.h2>

        <div className="grid sm:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="terminal-card p-6"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.quote}"</p>
              <div>
                <div className="font-semibold text-foreground text-sm">{t.name}</div>
                <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════ FINAL CTA ════════ */}
      <section className="border-t border-border bg-muted/20 py-20 px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto text-center space-y-6"
        >
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Stop Guessing.
            <span className="block text-primary">Start Tracking.</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Join 2,400+ collectors using live market data to make better buying and selling decisions.
          </p>

          <button
            onClick={handleCTA}
            className="group relative inline-flex items-center gap-2 px-10 py-4 rounded-xl font-mono text-base font-bold bg-primary text-primary-foreground hover:shadow-[0_0_40px_hsl(160_84%_50%/0.35)] transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 shimmer-sweep opacity-60" />
            <Zap className="relative w-5 h-5" />
            <span className="relative">START YOUR FREE TRIAL</span>
            <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> 7-day free trial</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Cancel anytime</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> No credit card</span>
          </div>
        </motion.div>
      </section>

      <FinancialDisclaimer />

      {/* Auth Modal */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
};

export default SocialLanding;
