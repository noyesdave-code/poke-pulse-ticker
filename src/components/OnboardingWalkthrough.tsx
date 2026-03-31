import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Bell, Gamepad2, ArrowRight, X, CheckCircle, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ONBOARDING_KEY = "ppt_onboarding_seen";

const steps = [
  {
    icon: Briefcase,
    title: "Track Your Collection",
    description:
      "Add cards to your portfolio and watch their value change in real time. Import from TCGPlayer or add manually — we track cost basis, profit/loss, and daily snapshots automatically.",
    cta: "Go to Portfolio",
    path: "/portfolio",
    gradient: "from-primary to-emerald-400",
    accent: "hsl(var(--primary))",
  },
  {
    icon: Bell,
    title: "Set Price Alerts",
    description:
      "Never miss a price spike. Set target prices on any card and get notified the moment it crosses your threshold — up or down.",
    cta: "Set an Alert",
    path: "/price-alerts",
    gradient: "from-amber-400 to-orange-500",
    accent: "hsl(38 92% 60%)",
  },
  {
    icon: Gamepad2,
    title: "Practice on SimTrader",
    description:
      "Trade Pokémon cards with $100K virtual cash. Test strategies risk-free, compete on the leaderboard, and learn the market before going live.",
    cta: "Play SimTrader",
    path: "/sim-trader",
    gradient: "from-violet-500 to-indigo-500",
    accent: "hsl(263 70% 58%)",
  },
];

const OnboardingWalkthrough = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!user) return;
    const seen = localStorage.getItem(ONBOARDING_KEY);
    if (seen) return;

    // Small delay so the page settles first
    const timer = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(timer);
  }, [user]);

  const dismiss = () => {
    setOpen(false);
    localStorage.setItem(ONBOARDING_KEY, "1");
  };

  const goToStep = (path: string) => {
    dismiss();
    navigate(path);
  };

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else dismiss();
  };

  if (!open) return null;

  const current = steps[step];
  const Icon = current.icon;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={dismiss}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="fixed inset-x-4 top-[15%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md z-[101] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
          >
            {/* Progress bar */}
            <div className="flex gap-1.5 px-5 pt-4">
              {steps.map((_, i) => (
                <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-muted">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${steps[i].gradient}`}
                    initial={{ width: 0 }}
                    animate={{ width: i <= step ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              ))}
            </div>

            {/* Close */}
            <button
              onClick={dismiss}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Step label */}
            <p className="px-5 pt-3 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              Step {step + 1} of {steps.length}
            </p>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
                className="px-5 pb-5 pt-2"
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${current.gradient} flex items-center justify-center shadow-lg mb-4`}
                  style={{ boxShadow: `0 8px 30px ${current.accent}33` }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h2 className="text-xl font-extrabold text-foreground tracking-tight mb-2">
                  {current.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {current.description}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => goToStep(current.path)}
                    className={`group flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r ${current.gradient} hover:shadow-lg transition-all duration-300 min-h-[48px]`}
                  >
                    {current.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    onClick={next}
                    className="px-4 py-3 rounded-xl font-semibold text-sm border border-border text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all min-h-[48px]"
                  >
                    {step < steps.length - 1 ? "Next" : "Done"}
                  </button>
                </div>

                {/* Skip link */}
                {step < steps.length - 1 && (
                  <button
                    onClick={dismiss}
                    className="mt-3 w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Skip walkthrough
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OnboardingWalkthrough;
