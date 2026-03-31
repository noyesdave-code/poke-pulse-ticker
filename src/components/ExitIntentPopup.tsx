import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ExitIntentPopup = () => {
  const [visible, setVisible] = useState(false);
  const { subscribed } = useAuth();
  const navigate = useNavigate();

  // A/B test: 50% see 14-day trial, 50% see 7-day trial
  const [trialDays] = useState(() => {
    const stored = sessionStorage.getItem("ppt_exit_variant");
    if (stored) return parseInt(stored, 10);
    const variant = Math.random() < 0.5 ? 14 : 7;
    sessionStorage.setItem("ppt_exit_variant", String(variant));
    return variant;
  });

  useEffect(() => {
    if (subscribed) return;
    const shown = sessionStorage.getItem("ppt_exit_shown");
    if (shown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !sessionStorage.getItem("ppt_exit_shown")) {
        setVisible(true);
        sessionStorage.setItem("ppt_exit_shown", "1");
      }
    };

    // Only on desktop
    if (window.innerWidth > 768) {
      document.addEventListener("mouseleave", handleMouseLeave);
      return () => document.removeEventListener("mouseleave", handleMouseLeave);
    }
  }, [subscribed]);

  if (subscribed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setVisible(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative bg-card border border-primary/30 rounded-xl shadow-[0_0_40px_hsl(var(--primary)/0.2)] max-w-sm mx-4 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setVisible(false)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-primary">
              <TrendingUp className="w-5 h-5" />
              <span className="font-mono text-xs font-bold tracking-widest uppercase">🚨 Before You Go</span>
            </div>
            <h3 className="font-mono text-lg font-bold text-foreground">
              Unlock Pro — <span className="text-primary">50% off</span> your first month
            </h3>
            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
              Real-time signals, AI analysis, portfolio tracking — all for just $4.50/mo for your first month. Plus a {trialDays}-day free trial. No credit card charged during trial.
            </p>
            <button
              onClick={() => { setVisible(false); navigate("/pricing"); }}
              className="w-full py-3 rounded-lg font-mono text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Start {trialDays}-Day Free Trial
            </button>
            <p className="font-mono text-[9px] text-muted-foreground text-center">Cancel anytime. No obligations. {trialDays === 14 ? "Extended trial — limited time." : ""}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentPopup;
