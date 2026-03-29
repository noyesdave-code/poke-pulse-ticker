import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_TIERS } from "@/lib/stripe";
import { Crown, RefreshCw, ExternalLink } from "lucide-react";
import { useState } from "react";

const SubscriptionStatus = () => {
  const { subscribed, tier, subscriptionEnd, checkSubscription } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await checkSubscription();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleManage = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch {
      // silently fail
    }
  };

  if (!subscribed) return null;

  const tierInfo = tier ? STRIPE_TIERS[tier] : null;

  return (
    <div className="terminal-card border-primary/30 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Crown className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs font-bold text-primary tracking-widest">
            {tierInfo?.name ?? "SUBSCRIBED"}
          </span>
        </div>
        <button
          onClick={handleRefresh}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Refresh subscription status"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>
      {subscriptionEnd && (
        <p className="font-mono text-[10px] text-muted-foreground mb-3">
          Renews {new Date(subscriptionEnd).toLocaleDateString()}
        </p>
      )}
      <button
        onClick={handleManage}
        className="w-full py-2 rounded font-mono text-[11px] font-semibold border border-border text-foreground hover:bg-muted flex items-center justify-center gap-1.5 transition-colors"
      >
        <ExternalLink className="h-3 w-3" />
        Manage Subscription
      </button>
    </div>
  );
};

export default SubscriptionStatus;
