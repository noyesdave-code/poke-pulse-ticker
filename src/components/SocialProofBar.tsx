import { Users, Star, Shield, Clock } from "lucide-react";
import { motion } from "framer-motion";

const SocialProofBar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="terminal-card overflow-hidden"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border">
        <div className="flex items-center gap-2.5 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-mono text-sm font-extrabold text-foreground">2,400+</p>
            <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">Active Users</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
            <Star className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <p className="font-mono text-sm font-extrabold text-foreground">4.8/5</p>
            <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">User Rating</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-mono text-sm font-extrabold text-foreground">Hourly</p>
            <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">Price Updates</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-mono text-sm font-extrabold text-foreground">Secure</p>
            <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">Encrypted Data</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SocialProofBar;
