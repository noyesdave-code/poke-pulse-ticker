import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { X, Zap } from "lucide-react";

const StickyUpgradeBanner = () => {
  const { subscribed, user } = useAuth();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem("upgrade-banner-dismissed") === "true");
  const [spots, setSpots] = useState(23);

  useEffect(() => {
    const stored = sessionStorage.getItem("ppt_spots");
    if (stored) {
      setSpots(parseInt(stored, 10));
      return;
    }
    const base = 23 - Math.floor(Math.random() * 5);
    setSpots(base);
    sessionStorage.setItem("ppt_spots", String(base));
  }, []);

  if (subscribed || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("upgrade-banner-dismissed", "true");
  };

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-primary via-primary to-emerald-500 text-primary-foreground py-1 px-2 flex items-center justify-center gap-1.5 font-mono text-[9px] sm:text-[10px] font-semibold">
      <Zap className="w-3 h-3 flex-shrink-0 animate-pulse" />
      <span className="hidden sm:inline">
        {user
          ? `🔥 Launch Week — 50% off Pro · ${spots} spots left`
          : `🔥 14-day FREE trial + 50% off · ${spots} spots left`}
      </span>
      <span className="sm:hidden">
        {user ? `50% off — ${spots} left` : `Free trial + 50% off`}
      </span>
      <button
        onClick={() => navigate("/pricing")}
        className="bg-primary-foreground text-primary px-2.5 py-1 rounded text-[9px] font-bold hover:opacity-90 transition-opacity flex-shrink-0"
      >
        {user ? "Claim" : "Start Free"}
      </button>
      <button onClick={handleDismiss} className="ml-0.5 opacity-70 hover:opacity-100 transition-opacity flex-shrink-0">
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

export default StickyUpgradeBanner;
