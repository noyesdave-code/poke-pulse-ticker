import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-request-timestamp, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const POKEMON_TCG_BASE = "https://api.pokemontcg.io/v2";

// Simple in-memory rate limiter per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 100; // requests per window (increased for concurrent card queries)
const RATE_WINDOW_MS = 60_000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

// Allowed endpoints to prevent arbitrary URL access
const ALLOWED_PATHS = ["/cards", "/sets"];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limit by IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Request integrity: reject stale requests (>5 min old)
    const reqTimestamp = req.headers.get("x-request-timestamp");
    if (reqTimestamp) {
      const age = Date.now() - Number(reqTimestamp);
      if (age > 300_000 || age < -60_000) {
        return new Response(
          JSON.stringify({ error: "Request expired. Please refresh and try again." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const { path, params } = await req.json();

    // Validate the requested path
    if (!path || typeof path !== "string") {
      throw new Error("Missing 'path' parameter");
    }

    const basePath = path.split("?")[0].replace(/\/[^/]+$/, "") || path.split("?")[0];
    const normalizedBase = basePath.startsWith("/") ? basePath : `/${basePath}`;
    const isAllowed = ALLOWED_PATHS.some(
      (allowed) => normalizedBase === allowed || normalizedBase.startsWith(allowed + "/")
    );
    if (!isAllowed) {
      throw new Error("Invalid API path");
    }

    // Validate params are safe (only allow known query params)
    const allowedParams = ["q", "pageSize", "page", "orderBy", "select"];
    if (params && typeof params === "object") {
      for (const key of Object.keys(params)) {
        if (!allowedParams.includes(key)) {
          throw new Error(`Invalid query parameter: ${key}`);
        }
      }
    }

    // Build the URL
    const url = new URL(`${POKEMON_TCG_BASE}${path}`);
    if (params && typeof params === "object") {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, String(value));
      }
    }

    // Forward to Pokémon TCG API with optional server-side API key and retry
    const apiHeaders: Record<string, string> = {};
    const apiKey = Deno.env.get("POKEMON_TCG_API_KEY");
    if (apiKey) {
      apiHeaders["X-Api-Key"] = apiKey;
    }

    let apiRes: Response | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      apiRes = await fetch(url.toString(), { headers: apiHeaders });
      if (apiRes.status === 429) {
        // Rate limited — wait and retry
        const retryAfter = Number(apiRes.headers.get("Retry-After") || "2");
        await new Promise(r => setTimeout(r, retryAfter * 1000));
        continue;
      }
      break;
    }

    const data = await apiRes!.json();

    return new Response(JSON.stringify(data), {
      status: apiRes!.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
