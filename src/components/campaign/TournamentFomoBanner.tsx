import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Users, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TournamentFomoBanner = () => {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem("tournament-fomo-dismissed") === "1");
  const [spotsLeft, setSpotsLeft] = useState(() => {
    const saved = localStorage.getItem("tournament-spots");
    return saved ? parseInt(saved) : 48;
  });

  // Simulate slow spot decrease for urgency
  useEffect(() => {
    const interval = setInterval(() => {
      setSpotsLeft((prev) => {
        const next = Math.max(12, prev - (Math.random() < 0.3 ? 1 : 0));
        localStorage.setItem("tournament-spots", String(next));
        return next;
      });
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl border-2 border-purple-500/40"
      style={{ background: "linear-gradient(135deg, hsl(280 80% 55% / 0.08) 0%, hsl(260 70% 50% / 0.06) 100%)" }}
    >
      <div className="absolute inset-0 shimmer-sweep opacity-15" />
      <button
        onClick={() => { setDismissed(true); sessionStorage.setItem("tournament-fomo-dismissed", "1"); }}
        className="absolute top-2 right-2 z-10 text-muted-foreground hover:text-foreground"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="relative px-3 py-2.5 flex flex-col sm:flex-row items-center gap-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="h-9 w-9 rounded-lg bg-purple-500/15 flex items-center justify-center ring-2 ring-purple-500/30 flex-shrink-0">
            <Trophy className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-foreground">🏆 CAPITAL SPRINT TOURNAMENT</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-bold tracking-wider animate-pulse">
                $500 PRIZE
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              $4.99 entry • Pro tier required • Top 3 win cash prizes
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Users className="w-3 h-3 text-destructive" />
              <span className="text-[10px] text-destructive font-bold">{spotsLeft} spots remaining</span>
            </div>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => navigate("/sim-trader")}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold gap-1 whitespace-nowrap"
        >
          Enter Now <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default TournamentFomoBanner;
