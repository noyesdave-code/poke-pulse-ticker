import { motion } from "framer-motion";
import type { CardData } from "@/data/marketData";
import { getCardSignal } from "@/hooks/useSignalIndicator";
import { getCardToken } from "@/lib/tokenSymbols";
import SignalBadge from "@/components/SignalBadge";
import { Skeleton } from "@/components/ui/skeleton";

interface TopMoversTableProps {
  cards: CardData[];
  title: string;
  isLoading?: boolean;
}

/** Tiny inline sparkline SVG */
const MiniSparkline = ({ change }: { change: number }) => {
  const isUp = change >= 0;
  const points = [];
  const seed = Math.abs(change * 1000) | 0;
  for (let i = 0; i < 12; i++) {
    const noise = Math.sin(seed + i * 2.5) * 4;
    const trend = isUp ? (i / 11) * 10 : ((11 - i) / 11) * 10;
    points.push(`${i * 4},${18 - trend - noise}`);
  }

  return (
    <svg width="48" height="20" viewBox="0 0 48 20" className="inline-block ml-1.5 opacity-70">
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={isUp ? "hsl(145, 100%, 45%)" : "hsl(0, 90%, 58%)"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const TopMoversTable = ({ cards, title, isLoading }: TopMoversTableProps) => {
  const sorted = [...cards].sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 8);

  if (isLoading) {
    return (
      <div className="terminal-card overflow-hidden">
        <div className="border-b border-border px-4 py-3">
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="p-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5 border-b border-border/50">
              <Skeleton className="w-8 h-11 rounded flex-shrink-0" />
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-3 w-24 flex-1" />
              <Skeleton className="h-3 w-16 ml-auto" />
              <Skeleton className="h-3 w-14" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="terminal-card overflow-hidden"
    >
      <div className="border-b border-border/60 px-5 py-3.5">
        <h2 className="text-sm font-bold tracking-wide text-secondary uppercase font-display">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-3 py-2 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase w-10"></th>
              <th className="px-2 py-2 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Ticker</th>
              <th className="px-2 py-2 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Card</th>
              <th className="px-2 py-2 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase hidden sm:table-cell">Set</th>
              <th className="px-2 py-2 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Market</th>
              <th className="px-2 py-2 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Change</th>
              <th className="px-2 py-2 text-center font-mono text-[10px] tracking-widest text-muted-foreground uppercase hidden sm:table-cell">Signal</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((card, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="data-row"
              >
                {/* Card thumbnail */}
                <td className="px-3 py-2">
                  {card._image ? (
                    <div className="w-10 h-14 rounded-md overflow-hidden bg-muted ring-2 ring-border flex-shrink-0 shadow-sm">
                      <img
                        src={card._image}
                        alt={card.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        style={{ filter: 'contrast(1.05) saturate(1.08)' }}
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-14 rounded-md bg-muted ring-2 ring-border flex items-center justify-center flex-shrink-0">
                      <span className="font-mono text-[8px] text-muted-foreground">IMG</span>
                    </div>
                  )}
                </td>
                <td className="px-2 py-2.5">
                  <span className="font-mono text-[10px] text-primary/70 font-bold tracking-wider">
                    {getCardToken(card)}
                  </span>
                </td>
                <td className="px-2 py-2.5 font-mono text-sm text-foreground font-medium">{card.name}</td>
                <td className="px-2 py-2.5 font-mono text-xs text-muted-foreground hidden sm:table-cell">{card.set}</td>
                <td className="px-2 py-2.5 font-mono text-sm text-foreground text-right">
                  ${card.market.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className={`px-2 py-2.5 font-mono text-sm text-right font-semibold ${card.change >= 0 ? "text-terminal-green" : "text-terminal-red"}`}>
                  <span className="inline-flex items-center">
                    {card.change >= 0 ? "+" : ""}{card.change.toFixed(2)}%
                    <MiniSparkline change={card.change} />
                  </span>
                </td>
                <td className="px-2 py-2.5 text-center hidden sm:table-cell">
                  <SignalBadge result={getCardSignal(card)} />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default TopMoversTable;
