import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Coins, Sparkles, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DoublePokeCoinBanner = () => {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem("2x-coins-dismissed") === "1");
  const [hours, setHours] = useState(47);
  const [mins, setMins] = useState(59);

  useEffect(() => {
    const end = Number(localStorage.getItem("2x-coin-end") || 0);
    if (!end) {
      localStorage.setItem("2x-coin-end", String(Date.now() + 48 * 60 * 60 * 1000));
    }
    const tick = setInterval(() => {
      const remaining = Math.max(0, Number(localStorage.getItem("2x-coin-end")) - Date.now());
      setHours(Math.floor(remaining / 3600000));
      setMins(Math.floor((remaining % 3600000) / 60000));
    }, 30000);
    return () => clearInterval(tick);
  }, []);

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-xl border-2 border-terminal-amber/40"
      style={{ background: "linear-gradient(135deg, hsl(38 92% 60% / 0.10) 0%, hsl(45 100% 55% / 0.06) 100%)" }}
    >
      <div className="absolute inset-0 shimmer-sweep opacity-20" />
      <button
        onClick={() => { setDismissed(true); sessionStorage.setItem("2x-coins-dismissed", "1"); }}
        className="absolute top-2 right-2 z-10 text-muted-foreground hover:text-foreground"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="relative p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative">
            <div className="h-12 w-12 rounded-xl bg-terminal-amber/15 flex items-center justify-center ring-2 ring-terminal-amber/30 flex-shrink-0">
              <Coins className="h-6 w-6 text-terminal-amber" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-terminal-amber animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-foreground">⚡ 2X POKÉCOIN BONUS</span>
              <span className="px-2 py-0.5 rounded-full bg-terminal-amber/20 text-terminal-amber text-[10px] font-bold tracking-wider">
                LIMITED TIME
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Every pack gives <span className="text-terminal-amber font-bold">DOUBLE PokéCoins</span> — stock up now!
            </p>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-terminal-amber">
              <Clock className="w-3 h-3" /> {hours}h {mins}m remaining
            </div>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => navigate("/arena")}
          className="bg-terminal-amber hover:bg-terminal-amber/90 text-background font-bold gap-1 whitespace-nowrap"
        >
          Buy PokéCoins <Coins className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default DoublePokeCoinBanner;
