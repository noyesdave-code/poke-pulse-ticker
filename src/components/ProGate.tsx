import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_TIERS } from "@/lib/stripe";
import { Lock, Zap } from "lucide-react";
import { useState } from "react";
import AuthModal from "./AuthModal";

interface ProGateProps {
  children: React.ReactNode;
  feature?: string;
  /** If true, show blurred preview instead of full lock */
  blur?: boolean;
}

const ProGate = ({ children, feature = "This feature", blur = false }: ProGateProps) => {
  const { user, subscribed, tier } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const isPro = subscribed && (tier === "pro" || tier === "institutional");

  if (isPro) return <>{children}</>;

  const handleUpgrade = async () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: STRIPE_TIERS.pro.price_id },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {blur ? (
        <div className="pointer-events-none select-none blur-sm opacity-50">{children}</div>
      ) : null}
      <div className={`${blur ? "absolute inset-0 flex items-center justify-center" : ""}`}>
        <div className="terminal-card border-primary/30 bg-background/95 backdrop-blur-sm p-6 text-center max-w-md mx-auto">
          <div className="flex justify-center mb-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-primary" />
            </div>
          </div>
          <h3 className="font-mono text-sm font-bold text-foreground mb-1">
            PRO Feature
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            {feature} requires a Pro subscription.
          </p>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full py-2.5 rounded font-mono text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Zap className="h-4 w-4" />
            {loading ? "Loading..." : "Upgrade to Pro — $19/mo"}
          </button>
          {!user && (
            <p className="text-[10px] text-muted-foreground mt-2">
              Sign in required to subscribe
            </p>
          )}
        </div>
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
};

export default ProGate;
