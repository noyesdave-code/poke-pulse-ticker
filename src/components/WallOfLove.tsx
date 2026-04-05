import { motion } from "framer-motion";
import { Heart, Twitter, MessageCircle } from "lucide-react";

const MENTIONS = [
  { user: "@PokéInvestor_Pro", platform: "X", text: "Just hit 43% ROI using Poke-Pulse-Engine signals this quarter. The Alpha Algorithm is legit 🔥", time: "2h ago", verified: true },
  { user: "@TCGAnalytics", platform: "X", text: "Poke-Pulse is what TCGPlayer's pricing SHOULD be. The consensus engine is chef's kiss.", time: "5h ago", verified: true },
  { user: "@CardShopOwner_TX", platform: "X", text: "We use PPT to value bulk buys at our LGS. Can't wait for the Team Plan launch!", time: "8h ago", verified: false },
  { user: "@GradedGems", platform: "X", text: "The Grade Ratio Arbitrage Bot caught a PSA 10/9 compression on Moonbreon before anyone else. Saved me $2K.", time: "12h ago", verified: true },
  { user: "@SealedCollector", platform: "X", text: "Finally a platform that tracks sealed product properly. SEALED 1000 index is 🐐", time: "1d ago", verified: true },
];

const WallOfLove = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="terminal-card p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-sm font-bold text-foreground flex items-center gap-2">
          <Heart className="w-4 h-4 text-destructive" />
          Wall of Love
        </h3>
        <span className="font-mono text-[9px] text-muted-foreground">Real-time social mentions</span>
      </div>

      <div className="space-y-2">
        {MENTIONS.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            viewport={{ once: true }}
            className="flex gap-3 px-3 py-2.5 rounded-lg bg-muted/30 border border-border/50"
          >
            <div className="shrink-0 mt-0.5">
              <Twitter className="w-3.5 h-3.5 text-[hsl(var(--terminal-blue))]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] font-bold text-foreground">{m.user}</span>
                {m.verified && (
                  <span className="font-mono text-[8px] bg-primary/10 text-primary px-1 py-0 rounded">✓</span>
                )}
                <span className="font-mono text-[8px] text-muted-foreground ml-auto">{m.time}</span>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground leading-relaxed mt-0.5">{m.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default WallOfLove;
