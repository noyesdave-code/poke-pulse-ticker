import { useState } from "react";
import { motion } from "framer-motion";
import { Store, Users, ArrowRight, Crown, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { STRIPE_TIERS } from "@/lib/stripe";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const TeamPlanCTA = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [annual, setAnnual] = useState(false);

  const tier = STRIPE_TIERS.team;
  const price = annual ? tier.annual.price : tier.price;
  const period = annual ? tier.annual.period : tier.period;
  const priceId = annual ? tier.annual.price_id : tier.price_id;

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please sign in first to subscribe.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast.error(err.message || "Failed to start checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="terminal-card overflow-hidden border-terminal-amber/30 hover:border-terminal-amber/50 transition-colors"
    >
      <div className="px-4 py-4 flex flex-col gap-3 bg-gradient-to-r from-terminal-amber/5 to-transparent">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-terminal-amber/10 border border-terminal-amber/20 flex items-center justify-center">
              <Store className="w-5 h-5 text-terminal-amber" />
            </div>
            <div>
              <p className="font-mono text-xs font-bold text-foreground flex items-center gap-2">
                Local Game Store (LGS) Team Plan
                <span className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-1">
                  <Crown className="w-2.5 h-2.5" /> LIVE
                </span>
              </p>
              <p className="font-mono text-[10px] text-muted-foreground">
                3 seats — price your inventory with live Poke-Pulse data across your team.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAnnual(!annual)}
              className={`font-mono text-[9px] px-2 py-1 rounded border transition-colors ${
                annual
                  ? "bg-terminal-amber/20 border-terminal-amber/40 text-terminal-amber"
                  : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {annual ? `Annual ${tier.annual.savings}` : "Monthly"}
            </button>

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-terminal-amber/10 border border-terminal-amber/30 text-terminal-amber font-mono text-[11px] font-bold tracking-wider hover:bg-terminal-amber/20 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <>
                  <Users className="w-3.5 h-3.5" />
                  {price}{period} <ArrowRight className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamPlanCTA;
