import { motion } from "framer-motion";
import { Download, ArrowRight } from "lucide-react";

const ImportFromTCGPlayer = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="terminal-card overflow-hidden border-primary/20"
    >
      <div className="px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Download className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-mono text-xs font-bold text-foreground">Switch from TCGPlayer or RareCandy?</p>
            <p className="font-mono text-[10px] text-muted-foreground">
              Import your collection CSV — we'll map your portfolio automatically with live pricing.
            </p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary text-primary-foreground font-mono text-[11px] font-bold tracking-wider hover:bg-primary/90 transition-colors">
          Import Collection <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
};

export default ImportFromTCGPlayer;
