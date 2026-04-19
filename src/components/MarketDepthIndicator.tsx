import { Layers } from "lucide-react";

interface Props {
  listingsAtFloor: number;
  totalListings: number;
}

/**
 * Market Depth: number of listings at or near the consensus price floor.
 * High depth = thick market, more reliable price.
 */
const MarketDepthIndicator = ({ listingsAtFloor, totalListings }: Props) => {
  const depthPct = totalListings > 0 ? (listingsAtFloor / totalListings) * 100 : 0;
  const depthClass =
    depthPct > 30 ? "text-terminal-green" : depthPct > 15 ? "text-terminal-amber" : "text-terminal-red";
  return (
    <div className="inline-flex items-center gap-1 font-mono text-[9px]">
      <Layers className="w-2.5 h-2.5 text-muted-foreground" />
      <span className="text-muted-foreground">Depth:</span>
      <span className={`font-bold ${depthClass}`}>{listingsAtFloor}/{totalListings}</span>
    </div>
  );
};

export default MarketDepthIndicator;
