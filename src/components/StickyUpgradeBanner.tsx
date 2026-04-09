import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { X, Zap, Clock } from "lucide-react";

const StickyUpgradeBanner = () => {
  const { subscribed, user } = useAuth();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem("upgrade-banner-dismissed") === "true");
  const [spots, setSpots] = useState(23);

  // Slowly decrement "spots left" to create urgency
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
    <div className="sticky top-0 z-40 bg-gradient-to-r from-primary via-primary to-emerald-500 text-primary-foreground py-1.5 px-3 flex items-center justify-center gap-2 font-mono text-[10px] sm:text-xs font-semibold">
      <Zap className="w-3.5 h-3.5 flex-shrink-0 animate-pulse" />
      <span className="hidden sm:inline">
        {user
          ? `🔥 Launch Week — 50% off Pro · Only ${spots} spots left at this price`
          : `🔥 Launch Week — 14-day FREE trial + 50% off · ${spots} spots left`}
      </span>
      <span className="sm:hidden">
        {user ? `50% off Pro — ${spots} spots left` : `Free trial + 50% off →`}
      </span>
      <button
        onClick={() => navigate("/pricing")}
        className="bg-primary-foreground text-primary px-3 py-1.5 rounded text-[10px] font-bold hover:opacity-90 transition-opacity flex-shrink-0 shadow-sm"
      >
        {user ? "Claim Now" : "Start Free"}
      </button>
      <button onClick={handleDismiss} className="ml-1 opacity-70 hover:opacity-100 transition-opacity flex-shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default StickyUpgradeBanner;
