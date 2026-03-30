import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Copy, CheckCircle, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ReferralCTA = () => {
  const { user, subscribed } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const referralLink = `https://poke-pulse-ticker.com/go?ref=${user.id.slice(0, 8)}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="terminal-card overflow-hidden"
    >
      <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Gift className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-mono text-xs font-bold text-foreground">Refer a Collector, Get 1 Month Free</p>
            <p className="font-mono text-[10px] text-muted-foreground">
              Share your link — when they subscribe to Pro or Institutional, you both get 1 free month.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none px-3 py-2 bg-muted rounded border border-border font-mono text-[10px] text-muted-foreground truncate max-w-[200px]">
            {referralLink}
          </div>
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded font-mono text-[10px] font-semibold hover:opacity-90 transition-opacity flex-shrink-0"
          >
            {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReferralCTA;
