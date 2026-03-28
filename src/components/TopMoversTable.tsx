import type { CardData } from "@/data/marketData";
import { getCardSignal } from "@/hooks/useSignalIndicator";
import SignalBadge from "@/components/SignalBadge";

interface TopMoversTableProps {
  cards: CardData[];
  title: string;
}

const TopMoversTable = ({ cards, title }: TopMoversTableProps) => {
  const sorted = [...cards].sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 8);

  return (
    <div className="terminal-card overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <h2 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-2 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Card</th>
              <th className="px-4 py-2 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Set</th>
              <th className="px-4 py-2 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Market</th>
              <th className="px-4 py-2 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Change</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((card, i) => (
              <tr key={i} className="data-row">
                <td className="px-4 py-2.5 font-mono text-sm text-foreground font-medium">{card.name}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{card.set}</td>
                <td className="px-4 py-2.5 font-mono text-sm text-foreground text-right">
                  ${card.market.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className={`px-4 py-2.5 font-mono text-sm text-right font-semibold ${card.change >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
                  {card.change >= 0 ? "+" : ""}{card.change.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopMoversTable;
