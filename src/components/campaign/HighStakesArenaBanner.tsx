import { useState } from "react";
import { motion } from "framer-motion";
import { Swords, Flame, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HighStakesArenaBanner = () => {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem("highstakes-dismissed") === "1");

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl border-2 border-destructive/40"
      style={{ background: "linear-gradient(135deg, hsl(0 85% 55% / 0.08) 0%, hsl(15 90% 50% / 0.06) 100%)" }}
    >
      <div className="absolute inset-0 shimmer-sweep opacity-15" />
      <button
        onClick={() => { setDismissed(true); sessionStorage.setItem("highstakes-dismissed", "1"); }}
        className="absolute top-2 right-2 z-10 text-muted-foreground hover:text-foreground"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="relative px-3 py-2.5 flex flex-col sm:flex-row items-center gap-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="h-9 w-9 rounded-lg bg-destructive/15 flex items-center justify-center ring-2 ring-destructive/30 flex-shrink-0">
            <Swords className="h-4 w-4 text-destructive" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-foreground">⚔️ HIGH STAKES WEEK</span>
              <Flame className="w-4 h-4 text-destructive animate-pulse" />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Boosted odds • <span className="text-destructive font-bold">2X payouts</span> on correct predictions
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Arena bets pay double this week only</p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => navigate("/arena")}
          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold gap-1 whitespace-nowrap"
        >
          Enter Arena <Swords className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default HighStakesArenaBanner;
