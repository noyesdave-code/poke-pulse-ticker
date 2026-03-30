import { ExternalLink, TrendingUp, TrendingDown, Minus, ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import type { ConsensusResult } from "@/hooks/useConsensusPricing";

interface Props {
  data: ConsensusResult;
  isLoading?: boolean;
}

function getPlatformColor(platform: string): string {
  switch (platform) {
    case "TCGPlayer": return "bg-terminal-blue";
    case "eBay": return "bg-terminal-amber";
    case "PriceCharting": return "bg-terminal-green";
    default: return "bg-muted-foreground";
  }
}

function getRecommendationStyle(rec: string) {
  switch (rec) {
    case "buy": return { icon: TrendingDown, label: "BUY SIGNAL", cls: "text-terminal-green bg-terminal-green/10 border-terminal-green/30" };
    case "wait": return { icon: TrendingUp, label: "WAIT", cls: "text-terminal-amber bg-terminal-amber/10 border-terminal-amber/30" };
    default: return { icon: Minus, label: "HOLD", cls: "text-muted-foreground bg-muted border-border" };
  }
}

const ConsensusPricing = ({ data, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="terminal-card p-6 flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
        <span className="font-mono text-xs text-muted-foreground">Aggregating multi-source pricing…</span>
      </div>
    );
  }

  const rec = getRecommendationStyle(data.recommendation);
  const RecIcon = rec.icon;
  const bestTotal = data.sources.length > 0 ? data.sources[0].price + data.sources[0].shipping : 0;
  const liveCount = data.sources.filter(s => s.isLive).length;
  const totalCount = data.sources.length;

  return (
    <div className="terminal-card overflow-hidden">
      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold">
              Consensus Pricing Engine
            </h2>
            <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              MULTI-SOURCE
            </span>
          </div>
          <div className="flex items-center gap-2">
            {data.confidence >= 60 ? (
              <ShieldCheck className="w-3.5 h-3.5 text-terminal-green" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-terminal-amber" />
            )}
            <span className="font-mono text-[10px] text-muted-foreground">
              {liveCount}/{totalCount} live
            </span>
          </div>
        </div>
      </div>

      {/* Consensus summary bar */}
      <div className="border-b border-border px-4 py-3 bg-muted/30">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Consensus</p>
            <p className="font-mono text-lg font-bold text-foreground">
              ${data.consensusPrice.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Fair Value</p>
            <p className="font-mono text-sm text-foreground">
              ${data.fairValueRange.low.toFixed(2)} – ${data.fairValueRange.high.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Confidence</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    data.confidence >= 70 ? "bg-terminal-green" : data.confidence >= 40 ? "bg-terminal-amber" : "bg-terminal-red"
                  }`}
                  style={{ width: `${data.confidence}%` }}
                />
              </div>
              <span className="font-mono text-xs font-semibold text-foreground">{data.confidence}%</span>
            </div>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Signal</p>
            <span className={`inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${rec.cls}`}>
              <RecIcon className="w-3 h-3" />
              {rec.label}
            </span>
          </div>
        </div>
      </div>

      {/* API status dots */}
      <div className="border-b border-border px-4 py-2 flex items-center gap-4">
        {(["tcgplayer", "ebay", "pricecharting"] as const).map((api) => (
          <div key={api} className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${data.apiStatus[api] ? "bg-terminal-green pulse-live" : "bg-muted-foreground"}`} />
            <span className="font-mono text-[9px] text-muted-foreground uppercase">
              {api === "tcgplayer" ? "TCGPlayer" : api === "ebay" ? "eBay" : "PriceCharting"}
            </span>
            <span className={`font-mono text-[8px] px-1 py-0.5 rounded ${data.apiStatus[api] ? "bg-terminal-green/20 text-terminal-green" : "bg-muted text-muted-foreground"}`}>
              {data.apiStatus[api] ? "LIVE" : "EST"}
            </span>
          </div>
        ))}
      </div>

      {/* Listings table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-2 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Source</th>
              <th className="px-4 py-2 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Type</th>
              <th className="px-4 py-2 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Condition</th>
              <th className="px-4 py-2 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Price</th>
              <th className="px-4 py-2 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Ship</th>
              <th className="px-4 py-2 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Total</th>
              <th className="px-4 py-2 text-center font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Link</th>
            </tr>
          </thead>
          <tbody>
            {data.sources.map((s, i) => {
              const total = Math.round((s.price + s.shipping) * 100) / 100;
              const isBest = Math.abs(total - bestTotal) < 0.01;
              return (
                <tr key={i} className="data-row">
                  <td className="px-4 py-2 font-mono text-xs text-foreground font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${getPlatformColor(s.source)}`} />
                      {s.source}
                      {s.isLive && (
                        <span className="px-1 py-0.5 text-[8px] font-bold bg-terminal-green/20 text-terminal-green rounded">LIVE</span>
                      )}
                      {!s.isLive && (
                        <span className="px-1 py-0.5 text-[8px] font-bold bg-muted text-muted-foreground rounded">EST</span>
                      )}
                      {isBest && (
                        <span className="px-1 py-0.5 text-[8px] font-bold bg-primary/20 text-primary rounded">BEST</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 font-mono text-[10px] text-muted-foreground">{s.variant}</td>
                  <td className="px-4 py-2 font-mono text-[10px] text-muted-foreground">{s.condition}</td>
                  <td className="px-4 py-2 font-mono text-xs text-foreground text-right">${s.price.toFixed(2)}</td>
                  <td className="px-4 py-2 font-mono text-[10px] text-right text-muted-foreground">
                    {s.shipping === 0 ? <span className="text-terminal-green">FREE</span> : `$${s.shipping.toFixed(2)}`}
                  </td>
                  <td className={`px-4 py-2 font-mono text-xs text-right font-semibold ${isBest ? "text-terminal-green" : "text-foreground"}`}>
                    ${total.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex text-primary hover:text-primary/80">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-[10px]">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-border px-4 py-2">
        <p className="font-mono text-[9px] text-muted-foreground">
          Consensus price is a weighted average across {new Set(data.sources.map(s => s.source)).size} platforms.
          {" "}LIVE = real-time API data • EST = algorithmic estimate.
          {" "}Spread: {data.spread}%. Add eBay/PriceCharting API keys to increase confidence.
        </p>
      </div>
    </div>
  );
};

export default ConsensusPricing;
