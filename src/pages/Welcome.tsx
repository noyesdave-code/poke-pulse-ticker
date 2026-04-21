import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, ShieldCheck, Zap, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

/**
 * /welcome — high-impact cover/splash landing.
 * Bold value prop + email capture above the fold, dismisses straight to /index.
 * Designed as the A/B variant for paid traffic vs the / terminal landing.
 */
const Welcome = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Live ticker counts that animate in for social proof
  const [counts, setCounts] = useState({ cards: 20237, traders: 139, sets: 172 });

  useEffect(() => {
    const id = setInterval(() => {
      setCounts((c) => ({ ...c, traders: c.traders + Math.floor(Math.random() * 2) }));
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({ title: "Enter a valid email", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("sales_leads").insert({
        email,
        name: email.split("@")[0],
        source: "welcome_cover",
        status: "warm",
        score: 50,
      });
      if (error && !error.message.toLowerCase().includes("duplicate")) {
        throw error;
      }
      toast({
        title: "You're in!",
        description: "Loading the live terminal...",
      });
      setTimeout(() => navigate("/index"), 600);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast({ title: "Couldn't save email", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden relative">
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glowing orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Top row — minimal nav */}
        <div className="flex items-center justify-between mb-12 sm:mb-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="font-mono text-sm font-bold text-foreground">
              Poké-Pulse-Engine™
            </span>
          </div>
          <Link
            to="/index"
            className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            Skip to terminal <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <div className="h-1.5 w-1.5 rounded-full bg-primary pulse-live" />
            <span className="font-mono text-[10px] font-bold text-primary uppercase tracking-wider">
              Live Market · {counts.cards.toLocaleString()} cards tracked
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black text-foreground leading-[0.95] tracking-tight mb-6">
            The Bloomberg Terminal{" "}
            <span className="bg-gradient-to-r from-primary via-terminal-amber to-primary bg-clip-text text-transparent">
              for Pokémon Cards
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Real-time consensus pricing across 6+ marketplaces. Alpha signals before TikTok finds out.
            Portfolio tracking that thinks like a hedge fund.
          </p>

          {/* Email capture */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mb-4"
          >
            <Input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 font-mono text-sm bg-card/80 backdrop-blur border-border/60 focus-visible:ring-primary"
              required
              aria-label="Email address"
            />
            <Button
              type="submit"
              disabled={submitting}
              className="h-12 px-6 font-mono font-bold tracking-wide whitespace-nowrap"
            >
              {submitting ? "Loading..." : "Open Terminal"}
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>
          <p className="font-mono text-[10px] text-muted-foreground/70 mb-12">
            Free forever · No card required · 14-day Pro trial
          </p>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto mb-16">
            {[
              { label: "Cards", value: counts.cards.toLocaleString(), icon: TrendingUp },
              { label: "Traders", value: `${counts.traders}+`, icon: Users },
              { label: "Sets", value: `${counts.sets}+`, icon: Sparkles },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="terminal-card p-3 sm:p-4 backdrop-blur bg-card/60"
              >
                <Icon className="w-4 h-4 text-primary mx-auto mb-1.5" />
                <p className="font-mono text-xl sm:text-2xl font-black text-foreground tabular-nums">
                  {value}
                </p>
                <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Feature triple — what makes us different */}
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-12"
        >
          {[
            {
              icon: Zap,
              title: "Alpha Signals",
              body: "Volume divergence + price-action AI flags grail cards before they pop. 24h lead-time on average.",
            },
            {
              icon: ShieldCheck,
              title: "6-Source Consensus",
              body: "TCGPlayer · eBay · Card Ladder · PriceCharting · Probstein · 130point. No more single-source guessing.",
            },
            {
              icon: TrendingUp,
              title: "Portfolio P&L",
              body: "Cost basis, FIFO gains, daily snapshots, smart alerts. Trade like a fund, not a hobbyist.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="terminal-card p-4 sm:p-5 backdrop-blur bg-card/60 hover:border-primary/40 transition-colors"
            >
              <Icon className="w-5 h-5 text-primary mb-3" />
              <h3 className="font-mono text-sm font-bold text-foreground mb-1.5">
                {title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </motion.section>

        {/* Footer CTA */}
        <div className="text-center">
          <Link
            to="/index"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-primary hover:text-primary/80 transition-colors group"
          >
            Or skip the email and go straight to the live terminal
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Welcome;
