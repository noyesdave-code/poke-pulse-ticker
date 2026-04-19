import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  cardName: string;
  tcgPrice: number;
  ebayPrice: number;
}

/**
 * Warns when TCGPlayer and eBay prices diverge by >15% on a single asset.
 * Indicates listing-vs-sold spread or seller-side mispricing.
 */
const SourceDivergenceWarning = ({ cardName, tcgPrice, ebayPrice }: Props) => {
  if (!tcgPrice || !ebayPrice) return null;
  const max = Math.max(tcgPrice, ebayPrice);
  const min = Math.min(tcgPrice, ebayPrice);
  const divergencePct = ((max - min) / max) * 100;
  if (divergencePct < 15) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 px-2 py-1 rounded border border-terminal-amber/30 bg-terminal-amber/5"
    >
      <AlertTriangle className="w-3 h-3 text-terminal-amber flex-shrink-0" />
      <span className="font-mono text-[9px] text-terminal-amber">
        Source Δ {divergencePct.toFixed(0)}% — TCG ${tcgPrice.toFixed(0)} vs eBay ${ebayPrice.toFixed(0)}
      </span>
    </motion.div>
  );
};

export default SourceDivergenceWarning;
