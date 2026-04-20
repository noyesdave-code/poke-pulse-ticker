import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SourceProbe {
  name: string;
  url: string;
  method?: string;
  headers?: Record<string, string>;
  requiresKey?: string; // env var name; if missing, marked degraded
  timeoutMs?: number;
}

const PROBES: SourceProbe[] = [
  { name: "tcgplayer", url: "https://api.pokemontcg.io/v2/cards?pageSize=1", timeoutMs: 4000 },
  { name: "ebay",      url: "https://api.ebay.com/buy/browse/v1/item_summary/search?q=pokemon&limit=1", requiresKey: "EBAY_API_KEY", timeoutMs: 4000 },
  { name: "pricecharting", url: "https://www.pricecharting.com/api/products?q=charizard&type=pokemon-cards", requiresKey: "PRICECHARTING_API_KEY", timeoutMs: 4000 },
  { name: "cardladder", url: "https://api.cardladder.com/v1/health", requiresKey: "CARDLADDER_API_KEY", timeoutMs: 4000 },
  { name: "probstein",  url: "https://probsteinauctions.com/rss/sold?category=pokemon", timeoutMs: 5000 },
  { name: "onethirtypoint", url: "https://130point.com/sales/?q=charizard", timeoutMs: 6000 },
];

async function probe(p: SourceProbe): Promise<{ name: string; isLive: boolean; latencyMs: number; reason?: string }> {
  if (p.requiresKey && !Deno.env.get(p.requiresKey)) {
    return { name: p.name, isLive: false, latencyMs: 0, reason: `missing ${p.requiresKey}` };
  }
  const headers: Record<string, string> = { "User-Agent": "PokePulseTicker/1.0", ...(p.headers || {}) };
  if (p.requiresKey === "EBAY_API_KEY") headers["Authorization"] = `Bearer ${Deno.env.get("EBAY_API_KEY")}`;

  const t0 = Date.now();
  try {
    const res = await fetch(p.url, { method: p.method || "GET", headers, signal: AbortSignal.timeout(p.timeoutMs ?? 5000) });
    const ms = Date.now() - t0;
    return { name: p.name, isLive: res.ok, latencyMs: ms, reason: res.ok ? undefined : `HTTP ${res.status}` };
  } catch (e) {
    return { name: p.name, isLive: false, latencyMs: Date.now() - t0, reason: e instanceof Error ? e.message : String(e) };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const results = await Promise.all(PROBES.map(probe));
    const liveCount = results.filter(r => r.isLive).length;
    const total = PROBES.length;
    const signalStrength = Math.round((liveCount / total) * 100);

    const payload = {
      signalStrength,
      liveCount,
      totalSources: total,
      sources: results,
      checkedAt: new Date().toISOString(),
    };

    // Cache in index_cache for fast UI reads
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );
      await supabase.from("index_cache").upsert({
        cache_key: "pricing_health",
        data: payload,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      }, { onConflict: "cache_key" });
    } catch (e) {
      console.error("cache write failed", e);
    }

    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
