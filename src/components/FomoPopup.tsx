import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Zap, X, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_TIERS } from "@/lib/stripe";
import AuthModal from "./AuthModal";

const FOMO_MESSAGES = [
  { icon: TrendingUp, text: "3 Alpha Signals detected in the last hour", cta: "See what Pro users are trading" },
  { icon: Zap, text: "Your watchlist cards moved +12.4% this week", cta: "Unlock real-time alerts" },
  { icon: TrendingUp, text: "Top portfolios gained +28% this month", cta: "Track yours with Pro" },
  { icon: Zap, text: "7 cards just hit Buy signals", cta: "Upgrade to see which ones" },
  { icon: TrendingUp, text: "$2.4M in market value tracked today", cta: "Join Pro traders now" },
];

const FomoPopup = () => {
  const { user, subscribed } = useAuth();
  const [visible, setVisible] = useState(false);
  const [messageIdx, setMessageIdx] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(false);

  // Don't show for Pro users or if dismissed this session
  const shouldShow = !subscribed && !dismissed;

  useEffect(() => {
    if (!shouldShow) return;

    // Check if already dismissed in this session
    const lastDismissed = sessionStorage.getItem("fomo-dismissed");
    if (lastDismissed) {
      setDismissed(true);
      return;
    }

    // Show after 45 seconds of browsing
    const timer = setTimeout(() => {
      setMessageIdx(Math.floor(Math.random() * FOMO_MESSAGES.length));
      setVisible(true);
    }, 45000);

    return () => clearTimeout(timer);
  }, [shouldShow]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem("fomo-dismissed", "true");
  };

  const handleUpgrade = async () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: STRIPE_TIERS.pro.price_id, trial: 7 },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const msg = FOMO_MESSAGES[messageIdx];
  const Icon = msg.icon;

  return (
    <>
      <AnimatePresence>
        {visible && shouldShow && (
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-20 right-4 z-50 max-w-sm"
          >
            <div className="terminal-card border-primary/30 shadow-[0_0_30px_hsl(var(--primary)/0.15)] p-4 relative">
              <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-1.5 pr-4">
                  <p className="font-mono text-xs font-semibold text-foreground leading-snug">
                    {msg.text}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {msg.cta}
                  </p>
                </div>
              </div>

              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-mono text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5" />
                {loading ? "Loading…" : "Start 7-Day Free Trial"}
                <ArrowRight className="w-3 h-3" />
              </button>

              <p className="font-mono text-[8px] text-muted-foreground/60 text-center mt-1.5">
                Then $19/mo · Cancel anytime · No card charged during trial
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
};

export default FomoPopup;
