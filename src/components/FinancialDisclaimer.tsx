import { AlertTriangle, Scale } from "lucide-react";

interface FinancialDisclaimerProps {
  compact?: boolean;
}

const FinancialDisclaimer = ({ compact = false }: FinancialDisclaimerProps) => {
  if (compact) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-terminal-amber/20 bg-terminal-amber/5">
        <AlertTriangle className="w-3 h-3 text-terminal-amber flex-shrink-0" />
        <span className="font-mono text-[9px] text-terminal-amber/80">
          Not financial advice — for informational purposes only. Poké is a trademark of Nintendo/Creatures Inc./GAME FREAK inc.
        </span>
      </div>
    );
  }

  return (
    <div className="border border-terminal-amber/20 bg-terminal-amber/5 rounded-md px-4 py-4 space-y-3">
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-terminal-amber flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-mono text-[10px] font-semibold text-terminal-amber uppercase tracking-wider">
            Not Financial Advice
          </p>
          <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
            All market data, price indexes, and analytics on Poke-Pulse-Ticker are for informational
            and educational purposes only. This platform does not provide financial, investment, or
            trading advice. Past performance does not guarantee future results. Always do your own
            research before making any purchase decisions.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-2.5 border-t border-terminal-amber/10 pt-3">
        <Scale className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-mono text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Trademark Notice
          </p>
          <p className="font-mono text-[9px] text-muted-foreground/80 leading-relaxed">
            Poké, Poké TCG, and all related names, images, and logos are trademarks of
            Nintendo, Creatures Inc., and GAME FREAK inc. This site is not affiliated with, endorsed,
            sponsored, or specifically approved by Nintendo, Creatures Inc., GAME FREAK inc., or The
            Poké Company International. Card prices are sourced from public market data and may
            not reflect actual sale prices. © {new Date().getFullYear()} PGVA Ventures, LLC. 
            All rights reserved. Patent pending. Protected under U.S. copyright, trademark, trade secret, and patent laws.
            See Terms of Service for complete liability limitations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialDisclaimer;
