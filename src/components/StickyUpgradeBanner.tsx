import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { X, Zap } from "lucide-react";

const StickyUpgradeBanner = () => {
  const { subscribed, user } = useAuth();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem("upgrade-banner-dismissed") === "true");

  if (subscribed || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("upgrade-banner-dismissed", "true");
  };

  return (
    <div className="sticky top-0 z-40 bg-primary text-primary-foreground py-2 px-4 flex items-center justify-center gap-3 font-mono text-xs font-semibold">
      <Zap className="w-3.5 h-3.5 flex-shrink-0" />
      <span className="hidden sm:inline">
        {user ? "Upgrade to Pro — real-time data, AI signals & portfolio tracking" : "Join free & get a 7-day Pro trial — real-time data, AI signals & more"}
      </span>
      <span className="sm:hidden">
        {user ? "Upgrade to Pro →" : "Free 7-day Pro trial →"}
      </span>
      <button
        onClick={() => navigate(user ? "/pricing" : "/pricing")}
        className="bg-primary-foreground text-primary px-3 py-1 rounded text-[10px] font-bold hover:opacity-90 transition-opacity flex-shrink-0"
      >
        {user ? "See Plans" : "Start Free"}
      </button>
      <button onClick={handleDismiss} className="ml-1 opacity-70 hover:opacity-100 transition-opacity flex-shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default StickyUpgradeBanner;
