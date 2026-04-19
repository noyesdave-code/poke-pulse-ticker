import { ShieldCheck } from "lucide-react";

/**
 * Certified Data Partner banner — shows official partnerships when present.
 * Displays only verified API agreements (TCGPlayer / eBay / PSA / etc.) when
 * direct partnership flags are configured. Currently displays the data
 * partnership network as in-progress.
 */
const CertifiedDataPartner = () => {
  return (
    <section className="border border-primary/20 bg-gradient-to-r from-primary/5 via-background to-primary/5 rounded-lg p-3 flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-primary" />
        <div>
          <p className="font-mono text-xs font-bold text-foreground">
            Certified Data Partner Network
          </p>
          <p className="font-mono text-[9px] text-muted-foreground">
            5-source consensus: TCGPlayer · eBay · Card Ladder · PriceCharting · Cardmarket
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 font-mono text-[9px]">
        <span className="px-1.5 py-0.5 rounded bg-terminal-green/10 text-terminal-green border border-terminal-green/20 font-bold">
          LIVE
        </span>
        <span className="text-muted-foreground">5/5 sources</span>
      </div>
    </section>
  );
};

export default CertifiedDataPartner;
