import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, X, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_TIERS } from "@/lib/stripe";
import AuthModal from "@/components/AuthModal";

const CampaignProBanner = () => {
  const { user, subscribed, tier } = useAuth();
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem("campaign-pro-dismissed") === "1");
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const isPro = subscribed && tier && !["free", "arena"].includes(tier);

  if (isPro || dismissed) return null;

  const handleUpgrade = async () => {
    if (!user) { setShowAuth(true); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: STRIPE_TIERS.pro.price_id, mode: "subscription" },
      });
      if (data?.url) window.open(data.url, "_blank");
    } finally { setLoading(false); }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl border-2 border-primary/40"
        style={{ background: "linear-gradient(135deg, hsl(160 84% 50% / 0.08) 0%, hsl(210 90% 60% / 0.06) 100%)" }}
      >
        <div className="absolute inset-0 shimmer-sweep opacity-20" />
        <button
          onClick={() => { setDismissed(true); sessionStorage.setItem("campaign-pro-dismissed", "1"); }}
          className="absolute top-2 right-2 z-10 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="relative p-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center ring-2 ring-primary/30 flex-shrink-0">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-foreground">🔥 LAUNCH WEEK SPECIAL</span>
                <span className="px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-[10px] font-bold tracking-wider animate-pulse">
                  40% OFF
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pro tier — <span className="line-through">$4.99</span>{" "}
                <span className="text-primary font-bold">$2.99/mo</span> — Alpha Signals, P&L Tracking, Grading Scanner & more
              </p>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-terminal-amber">
                <Clock className="w-3 h-3" /> Ends in 48 hours
              </div>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleUpgrade}
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-1 whitespace-nowrap"
          >
            {loading ? "Loading…" : "Claim 40% Off"} <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </motion.div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
};

export default CampaignProBanner;
