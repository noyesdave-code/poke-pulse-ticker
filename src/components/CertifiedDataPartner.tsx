import { ShieldCheck, Wifi, WifiOff } from "lucide-react";
import { usePricingHealth } from "@/hooks/usePricingHealth";

const SOURCE_LABELS: Record<string, string> = {
  tcgplayer: "TCGPlayer",
  ebay: "eBay",
  pricecharting: "PriceCharting",
  cardladder: "Card Ladder",
  probstein: "Probstein",
  onethirtypoint: "130point",
  pokemonio: "Pokemon.io",
  rarecandy: "RareCandy",
  pokescope: "PokeScope",
};

/**
 * Certified Data Partner banner — shows real-time signal strength across
 * 6 pricing sources. Watchdog (`pricing-health` edge fn) probes each source
 * every 5 min; UI re-fetches every 5 min and reflects live status pills.
 */
const CertifiedDataPartner = () => {
  const { health } = usePricingHealth();
  const signal = health?.signalStrength ?? 0;
  const liveCount = health?.liveCount ?? 0;
  const total = health?.totalSources ?? 9;

  const signalColor =
    signal >= 67 ? "text-terminal-green border-terminal-green/30 bg-terminal-green/10" :
    signal >= 34 ? "text-yellow-500 border-yellow-500/30 bg-yellow-500/10" :
                   "text-destructive border-destructive/30 bg-destructive/10";

  return (
    <section className="border border-primary/20 bg-gradient-to-r from-primary/5 via-background to-primary/5 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <div>
            <p className="font-mono text-xs font-bold text-foreground">
              Certified Data Partner Network
            </p>
            <p className="font-mono text-[9px] text-muted-foreground">
              9-source consensus: TCGPlayer · eBay · Card Ladder · PriceCharting · Probstein · 130point · Pokemon.io · RareCandy · PokeScope
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 font-mono text-[9px] px-2 py-0.5 rounded border ${signalColor}`}>
          {signal >= 34 ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          <span className="font-bold">SIGNAL {signal}%</span>
          <span className="opacity-70">· {liveCount}/{total} live</span>
        </div>
      </div>
      {health?.sources && (
        <div className="flex items-center gap-1 flex-wrap">
          {health.sources.map((s) => (
            <span
              key={s.name}
              title={s.reason || `${s.latencyMs}ms`}
              className={`px-1.5 py-0.5 rounded text-[8px] font-mono border ${
                s.isLive
                  ? "bg-terminal-green/10 text-terminal-green border-terminal-green/30"
                  : "bg-muted/30 text-muted-foreground border-border/50"
              }`}
            >
              {s.isLive ? "●" : "○"} {SOURCE_LABELS[s.name] || s.name}
            </span>
          ))}
        </div>
      )}
    </section>
  );
};

export default CertifiedDataPartner;
