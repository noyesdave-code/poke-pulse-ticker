import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, X, Zap, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const SimTraderPromo = () => {
  const [visible, setVisible] = useState(false);
  const { subscribed, tier } = useAuth();
  const navigate = useNavigate();
  const isTrader = subscribed && (tier === "premium" || tier === "team");

  useEffect(() => {
    const dismissed = sessionStorage.getItem("simtrader_promo_dismissed");
    if (dismissed) return;
    const timer = setTimeout(() => setVisible(true), 12000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible || isTrader) return null;

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem("simtrader_promo_dismissed", "1");
  };

  const handlePlay = () => {
    handleDismiss();
    navigate("/sim-trader");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50"
        >
          <div className="terminal-card border-primary/40 bg-background/95 backdrop-blur-md p-4 shadow-[0_0_30px_hsl(var(--primary)/0.15)] relative overflow-hidden">
            {/* Animated shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-pulse pointer-events-none" />

            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-3 relative">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center ring-2 ring-primary/30 flex-shrink-0">
                <Gamepad2 className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs font-bold text-foreground flex items-center gap-1.5">
                  🎮 SimTrader™ is FREE
                  <span className="font-mono text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold animate-pulse">NEW</span>
                </p>
                <p className="font-mono text-[11px] text-muted-foreground mt-1 leading-relaxed">
                  Trade Pokémon cards with $100K virtual cash. 3 free trades daily!
                </p>
                <div className="flex items-center gap-3 mt-2.5">
                  <button
                    onClick={handlePlay}
                    className="font-mono text-[11px] font-bold bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 transition-all flex items-center gap-1.5"
                  >
                    <Zap className="h-3 w-3" />
                    Play Now — Free
                  </button>
                  <span className="font-mono text-[9px] text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Live market data
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SimTraderPromo;
