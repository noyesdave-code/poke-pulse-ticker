import { AlertTriangle } from "lucide-react";

interface FinancialDisclaimerProps {
  compact?: boolean;
}

const FinancialDisclaimer = ({ compact = false }: FinancialDisclaimerProps) => {
  if (compact) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-terminal-amber/20 bg-terminal-amber/5">
        <AlertTriangle className="w-3 h-3 text-terminal-amber flex-shrink-0" />
        <span className="font-mono text-[9px] text-terminal-amber/80">
          Not financial advice — for informational purposes only.
        </span>
      </div>
    );
  }

  return (
    <div className="border border-terminal-amber/20 bg-terminal-amber/5 rounded-md px-4 py-3">
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
            research before making any purchase decisions. © PGVA Ventures, LLC.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialDisclaimer;
