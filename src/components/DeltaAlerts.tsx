import { useNavigate } from "react-router-dom";
import { useDeltaAlerts, useDeleteDeltaAlert, useUpdateDeltaAlert } from "@/hooks/useDeltaAlerts";
import { useQuery } from "@tanstack/react-query";
import { fetchCardById, getBestPrice } from "@/lib/pokemonTcgApi";
import { getCardSignal } from "@/hooks/useSignalIndicator";
import { Loader2, Trash2, Activity, TrendingUp, TrendingDown, Zap, AlertTriangle, ToggleLeft, ToggleRight } from "lucide-react";
import { useMemo } from "react";

const DeltaAlerts = () => {
  const navigate = useNavigate();
  const { data: alerts, isLoading } = useDeltaAlerts();
  const deleteAlert = useDeleteDeltaAlert();
  const updateAlert = useUpdateDeltaAlert();

  const cardIds = useMemo(() => alerts?.map((a) => a.card_api_id) ?? [], [alerts]);

  const { data: livePrices } = useQuery({
    queryKey: ["delta-prices", cardIds.join(",")],
    queryFn: async () => {
      const prices: Record<string, { market: number; ma30: number; deviation: number }> = {};
      for (let i = 0; i < cardIds.length; i += 5) {
        const batch = cardIds.slice(i, i + 5);
        await Promise.allSettled(
          batch.map(async (id) => {
            const card = await fetchCardById(id);
            const p = getBestPrice(card);
            if (p) {
              const signal = getCardSignal({
                name: card.name,
                set: card.set?.name || "",
                number: card.number || "",
                market: p.market,
                change: 0,
                mid: p.market,
                volume: 0,
              });
              const deviation = ((p.market - signal.ma30) / signal.ma30) * 100;
              prices[id] = { market: p.market, ma30: signal.ma30, deviation };
            }
          })
        );
      }
      return prices;
    },
    enabled: cardIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 gap-2">
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
        <span className="font-mono text-xs text-muted-foreground">Loading volatility alerts…</span>
      </div>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <div className="terminal-card p-8 text-center space-y-3">
        <Activity className="w-10 h-10 text-muted-foreground mx-auto" />
        <p className="font-mono text-sm text-muted-foreground">No volatility alerts yet.</p>
        <p className="font-mono text-xs text-muted-foreground">
          Visit any card's detail page and enable delta tracking to get notified when prices deviate from their 30-day moving average.
        </p>
        <button onClick={() => navigate("/sets")} className="font-mono text-xs font-semibold bg-primary text-primary-foreground rounded px-4 py-2 hover:opacity-90">
          Browse Cards
        </button>
      </div>
    );
  }

  const activeAlerts = alerts.filter((a) => a.is_active);
  const pausedAlerts = alerts.filter((a) => !a.is_active);

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="terminal-card px-4 py-3 flex items-start gap-2.5 border-primary/20">
        <Zap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-mono text-[10px] font-semibold text-primary uppercase tracking-wider">Whale Tier · Predictive Delta Alerts</p>
          <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
            Monitor cards for significant price deviations from their 30-day moving average. Get alerted when a card moves beyond your threshold.
          </p>
        </div>
      </div>

      {/* Active */}
      {activeAlerts.length > 0 && (
        <div className="terminal-card overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h2 className="font-mono text-xs tracking-widest text-secondary uppercase font-semibold">
              Active Delta Alerts ({activeAlerts.length})
            </h2>
          </div>
          <div className="divide-y divide-border">
            {activeAlerts.map((alert) => (
              <DeltaAlertRow
                key={alert.id}
                alert={alert}
                priceData={livePrices?.[alert.card_api_id]}
                onDelete={() => deleteAlert.mutate(alert.id)}
                onToggle={() => updateAlert.mutate({ id: alert.id, is_active: false })}
                onNavigate={() => navigate(`/card/${alert.card_api_id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Paused */}
      {pausedAlerts.length > 0 && (
        <div className="terminal-card overflow-hidden opacity-60">
          <div className="border-b border-border px-4 py-3">
            <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase font-semibold">
              Paused ({pausedAlerts.length})
            </h2>
          </div>
          <div className="divide-y divide-border">
            {pausedAlerts.map((alert) => (
              <DeltaAlertRow
                key={alert.id}
                alert={alert}
                priceData={livePrices?.[alert.card_api_id]}
                onDelete={() => deleteAlert.mutate(alert.id)}
                onToggle={() => updateAlert.mutate({ id: alert.id, is_active: true })}
                onNavigate={() => navigate(`/card/${alert.card_api_id}`)}
                paused
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function DeltaAlertRow({ alert, priceData, onDelete, onToggle, onNavigate, paused }: {
  alert: { id: string; card_name: string; card_set: string; card_number: string; card_image: string | null; deviation_threshold: number };
  priceData?: { market: number; ma30: number; deviation: number };
  onDelete: () => void;
  onToggle: () => void;
  onNavigate: () => void;
  paused?: boolean;
}) {
  const isBreaching = priceData && Math.abs(priceData.deviation) >= alert.deviation_threshold;
  const deviationColor = priceData
    ? priceData.deviation > 0
      ? "text-terminal-green"
      : "text-terminal-red"
    : "text-muted-foreground";

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
      {alert.card_image && (
        <img src={alert.card_image} alt="" className="w-8 h-11 rounded object-cover cursor-pointer" onClick={onNavigate} />
      )}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onNavigate}>
        <p className="font-mono text-xs text-foreground font-medium truncate">{alert.card_name}</p>
        <p className="font-mono text-[9px] text-muted-foreground truncate">{alert.card_set} · #{alert.card_number}</p>
      </div>
      <div className="text-right space-y-0.5">
        {priceData ? (
          <>
            <div className="flex items-center gap-1 justify-end">
              {isBreaching && <AlertTriangle className="w-3 h-3 text-terminal-amber" />}
              {priceData.deviation > 0 ? (
                <TrendingUp className="w-3 h-3 text-terminal-green" />
              ) : (
                <TrendingDown className="w-3 h-3 text-terminal-red" />
              )}
              <span className={`font-mono text-xs font-semibold ${deviationColor}`}>
                {priceData.deviation > 0 ? "+" : ""}{priceData.deviation.toFixed(1)}%
              </span>
            </div>
            <p className="font-mono text-[9px] text-muted-foreground">
              MA30: ${priceData.ma30.toFixed(2)} · Now: ${priceData.market.toFixed(2)}
            </p>
            <p className="font-mono text-[9px] text-muted-foreground/60">
              Threshold: ±{alert.deviation_threshold}%
            </p>
          </>
        ) : (
          <span className="font-mono text-[9px] text-muted-foreground">Loading…</span>
        )}
      </div>
      <button onClick={onToggle} className="p-1.5 rounded hover:bg-muted/50 transition-colors text-muted-foreground" title={paused ? "Resume" : "Pause"}>
        {paused ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4 text-primary" />}
      </button>
      <button onClick={onDelete} className="p-1.5 rounded hover:bg-destructive/20 transition-colors text-muted-foreground hover:text-destructive">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default DeltaAlerts;
