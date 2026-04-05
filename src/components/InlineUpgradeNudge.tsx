import { Zap, ArrowRight, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

/**
 * Compact, high-contrast inline upgrade nudge — placed between key sections.
 * Only visible to non-Pro users. Different variants for A/B feel.
 */
const InlineUpgradeNudge = ({ variant = "default" }: { variant?: "default" | "savings" | "trust" }) => {
  const navigate = useNavigate();
  const { subscribed, tier } = useAuth();
  const isPro = subscribed && (tier === "pro" || tier === "premium" || tier === "team" || tier === "whale");

  if (isPro) return null;

  const messages = {
    default: {
      text: "Pro users see 5x more data, AI insights & real-time alerts",
      cta: "Try Free for 14 Days",
    },
    savings: {
      text: "Collectors using our signals save avg. $340/yr on purchases",
      cta: "Start Saving Now →",
    },
    trust: {
      text: "Join 2,400+ collectors who track their portfolio here daily",
      cta: "Join Free — No Card Needed",
    },
  };

  const msg = messages[variant];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 px-4 py-3 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent"
    >
      <div className="flex items-center gap-2 text-center sm:text-left">
        {variant === "trust" ? (
          <Shield className="w-4 h-4 text-primary flex-shrink-0 hidden sm:block" />
        ) : (
          <Zap className="w-4 h-4 text-primary flex-shrink-0 hidden sm:block" />
        )}
        <p className="font-mono text-xs text-foreground font-medium">{msg.text}</p>
      </div>
      <button
        onClick={() => navigate("/pricing")}
        className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-mono text-[11px] font-bold bg-primary text-primary-foreground hover:shadow-[0_0_15px_hsl(160_84%_50%/0.25)] transition-all flex-shrink-0 min-h-[40px]"
      >
        {msg.cta}
        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </motion.div>
  );
};

export default InlineUpgradeNudge;
