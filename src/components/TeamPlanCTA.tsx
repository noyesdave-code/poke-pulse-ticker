import { motion } from "framer-motion";
import { Store, Users, ArrowRight } from "lucide-react";

const TeamPlanCTA = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="terminal-card overflow-hidden border-terminal-amber/20"
    >
      <div className="px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between bg-gradient-to-r from-terminal-amber/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-terminal-amber/10 border border-terminal-amber/20 flex items-center justify-center">
            <Store className="w-5 h-5 text-terminal-amber" />
          </div>
          <div>
            <p className="font-mono text-xs font-bold text-foreground flex items-center gap-2">
              Local Game Store (LGS) Team Plan
              <span className="font-mono text-[8px] px-1.5 py-0.5 rounded bg-terminal-amber/10 border border-terminal-amber/20 text-terminal-amber">COMING SOON</span>
            </p>
            <p className="font-mono text-[10px] text-muted-foreground">
              Multi-seat licensing for shops — price your inventory with live Poke-Pulse data across your team.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-terminal-amber" />
          <a
            href="mailto:contact@poke-pulse-ticker.com?subject=LGS Team Plan Interest"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-terminal-amber/10 border border-terminal-amber/30 text-terminal-amber font-mono text-[11px] font-bold tracking-wider hover:bg-terminal-amber/20 transition-colors"
          >
            Get Notified <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamPlanCTA;
