import type { SealedProduct } from "@/data/marketData";
import { getSealedToken } from "@/lib/tokenSymbols";

interface SealedTableProps {
  products: SealedProduct[];
}

const SealedTable = ({ products }: SealedTableProps) => {
  return (
    <div className="terminal-card overflow-hidden">
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h2 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold">
          Live Sealed Product Feed
        </h2>
        <span className="font-mono text-[10px] text-muted-foreground">{products.length} items</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-2 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Ticker</th>
              <th className="px-4 py-2 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Product</th>
              <th className="px-4 py-2 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Type</th>
              <th className="px-4 py-2 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Market</th>
              <th className="px-4 py-2 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Low</th>
              <th className="px-4 py-2 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Chg%</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={i} className="data-row">
                <td className="px-4 py-2 font-mono text-sm text-foreground font-medium">{p.name}</td>
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{p.type}</td>
                <td className="px-4 py-2 font-mono text-sm text-foreground text-right">
                  ${p.market.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground text-right">
                  ${p.low.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className={`px-4 py-2 font-mono text-sm text-right font-semibold ${p.change >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
                  {p.change >= 0 ? "+" : ""}{p.change.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SealedTable;
