import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AUDIT_CATEGORIES = [
  "aesthetics",
  "efficiency",
  "information_quality",
  "consumer_confidence",
  "reliability",
  "capital_intake",
  "market_adaptability",
  "market_predictability",
  "competitive_edge",
  "security",
  "legal_compliance",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableApiKey) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Try to verify user, use a fixed anonymous UUID if no auth
    let userId = "00000000-0000-0000-0000-000000000000";
    if (authHeader) {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user } } = await supabase.auth.getUser();
      if (user) userId = user.id;
    }

    const body = await req.json().catch(() => ({}));
    const triggerType = body.trigger_type || "manual";

    const adminClient = createClient(supabaseUrl, serviceKey);

    // For scheduled audits, skip if latest score is already 95+
    if (triggerType === "scheduled") {
      const { data: latest } = await adminClient
        .from("site_audits")
        .select("overall_score")
        .eq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (latest && latest.overall_score !== null && latest.overall_score >= 95) {
        console.log(`Score already ${latest.overall_score}/100 — skipping scheduled audit.`);
        return new Response(
          JSON.stringify({ skipped: true, reason: `Score already ${latest.overall_score}/100 (≥95 target)` }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Create audit record
    const { data: audit, error: insertError } = await adminClient
      .from("site_audits")
      .insert({
        user_id: userId,
        trigger_type: triggerType,
        status: "running",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create audit record" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call Lovable AI for comprehensive audit
    const systemPrompt = `You are an expert website/app auditor for Poke-Pulse Ticker, a Bloomberg-inspired Pokémon TCG market data platform owned by PGVA Ventures, LLC.

Analyze the platform across these categories and provide actionable recommendations:

1. AESTHETICS - UI/UX design quality, visual appeal, brand consistency
2. EFFICIENCY - Performance, load times, code optimization, user workflow efficiency
3. INFORMATION_QUALITY - Data accuracy, completeness, presentation clarity
4. CONSUMER_CONFIDENCE - Trust signals, transparency, user testimonials, social proof
5. RELIABILITY - Uptime, error handling, data freshness, fallback mechanisms
6. CAPITAL_INTAKE - Monetization effectiveness, subscription conversion, pricing strategy
7. MARKET_ADAPTABILITY - How quickly the platform adapts to market changes, new sets, trends
8. MARKET_PREDICTABILITY - Forecasting tools, trend analysis, predictive features
9. COMPETITIVE_EDGE - Advantages over TCGPlayer.com and RareCandy.com specifically
10. SECURITY - Data protection, auth security, API security, anti-scraping
11. LEGAL_COMPLIANCE - PGVA Ventures LLC compliance, terms of service, privacy policy, IP protection, disclaimers

For each category provide:
- score (1-100)
- status: "strong", "adequate", "needs_improvement", "critical"
- findings: array of specific observations
- recommendations: array of actionable improvements

Also provide:
- competitive_intel: specific features TCGPlayer and RareCandy have that we should consider
- legal_compliance: specific items to verify for PGVA Ventures LLC

Respond with valid JSON only.`;

    const userPrompt = `Perform a comprehensive audit of the Poke-Pulse Ticker platform. The platform is a Pokémon TCG market data terminal with:
- Live market data from pokemontcg.io API with Stale-While-Revalidate (SWR) caching (localStorage 24h TTL + placeholderData for instant loads and offline fallback)
- RAW 500, GRADED 1000, and SEALED 1000 proprietary market indexes with server-side index caching (index_cache table, 5-min refresh)
- Portfolio tracking with Supabase backend and weekly portfolio performance summary emails
- Stripe subscription tiers (Free, Pro $19/mo with 7-day free trial, Institutional $99/mo) with annual billing options
- Card search, price charts, trending cards, top movers
- SMA-based Buy/Sell/Hold signal badges on every card (30-day moving average, 7-day momentum, volatility indicator) displayed in card tables and card detail pages
- Verified Portfolio Leaderboard showing anonymous top-10 performers with ROI%, portfolio value, card count, and top holdings
- Whale-exclusive AI Market Intelligence Reports (Card of the Week deep analysis, Market Risk Alerts, sector rotation insights) gated to institutional tier
- 30/90/180-day moving average overlays on price charts with forecast projections
- Predictive Alpha Algorithm detecting volume/price divergence patterns and generating alpha signals stored in database
- Total Market Value Tracked live counter on the landing page with social proof bar
- Grading guide, investment tips, TCG glossary educational content
- Set browser for browsing card sets with virtualized rendering (react-window, top 100 row cap) for DOM performance
- Terms of Service and Privacy Policy pages
- Copy protection and anti-iframe measures
- Mobile-responsive PWA with install prompt
- Consensus pricing aggregation from multiple seller sources
- Automated daily site audits with AI-powered scoring across 11 categories
- RSI (14-period) technical indicator with overbought/oversold zones on price charts alongside SMA overlays
- Whale-exclusive CSV portfolio export with full P&L breakdown
- Whale-exclusive Capital Gains Tax Report with holding period analysis (short-term vs long-term), cost basis, FMV, and unrealized gains
- Verified Data freshness badges showing source attribution, last-updated timestamps, SWR cache status, and auto-refresh indicators
- Hardened legal disclaimers on all Alpha Signals ("Not Financial Advice"), Buy/Sell/Hold signal badges, and Capital Gains Tax Reports with liability limitation
- IP-based rate limiting (30 req/min) on card search API proxy with path whitelisting and parameter validation
- FOMO conversion pop-ups for free users showing real-time market activity and 7-day trial CTAs (session-based, non-intrusive)
- Shimmer skeleton loading placeholders on all data-heavy components (index cards, tables, trending cards) for perceived performance
- Cross-route page transitions with framer-motion AnimatePresence (fade + slide)
- Content Security Policy (CSP) meta headers restricting script/style/img/connect sources with XSS protection
- Auto-logout session timeout after 30 minutes of inactivity for security
- Zod-based input sanitization on card search and all user-facing forms with HTML tag stripping
- Annual billing toggle with prominent savings badges ("Save $38" / "Save $198") on pricing cards
- Exit-intent popup on desktop offering 7-day free trial when cursor leaves viewport (session-based, one-time)
- Social proof on pricing page showing "2,400+ active traders", "4.8/5 rating", and "Bank-level encryption" badges
- "Verified by PGVA" badges on Alpha Signals and Data Quality indicators for consumer confidence
- Historical Seasonality indicator showing Q4 bullish, Q1 correction, and mid-year accumulation phases for market predictability
- Grade Spread Tracker showing PSA 10/PSA 9 price ratios and grading arbitrage signals for competitive edge
- Volume Confidence badges (High/Medium/Low) on cards based on trading volume to flag unreliable pricing on low-volume cards (information quality)
- Circuit breaker pattern with 15-second timeout on external API calls, automatic fallback to cached data on failure (reliability)
- Request timestamp integrity validation on API proxy rejecting requests older than 5 minutes (security)
- Anti-redistribution clause in Terms of Service explicitly prohibiting commercial redistribution of proprietary indexes and Alpha Signals (legal compliance)
- Pokémon fair use disclaimer and trademark attribution in Terms of Service (legal compliance)
- Ironclad CPA disclaimer on Capital Gains Tax Reports: "PGVA Ventures, LLC is NOT a CPA or licensed tax advisor" with FIFO methodology disclosure (legal compliance)
- Auto-detection of new card sets from pokemontcg.io API with 60-min refresh cycle for market adaptability
- Refer-a-Collector program CTA offering 1 free month for successful referrals (capital intake)
- Market Intelligence widget combining seasonality, grade spreads, and set auto-tracking in a single dashboard section

Owner: PGVA Ventures, LLC
Domain: poke-pulse-ticker.com

Competitors to stay ahead of:
- TCGPlayer.com: Largest TCG marketplace with price history, market data, direct sales
- RareCandy.com: Modern portfolio tracker with AI-powered insights, grading submissions

Return a JSON object with this exact structure:
{
  "overall_score": number,
  "summary": "string",
  "categories": [
    {
      "name": "category_name",
      "score": number,
      "status": "strong|adequate|needs_improvement|critical",
      "findings": ["string"],
      "recommendations": ["string"]
    }
  ],
  "competitive_intel": {
    "tcgplayer_advantages": ["string"],
    "rarecandy_advantages": ["string"],
    "our_advantages": ["string"],
    "opportunities": ["string"]
  },
  "legal_compliance": {
    "status": "compliant|needs_review|non_compliant",
    "items": [
      {
        "area": "string",
        "status": "ok|warning|action_required",
        "detail": "string"
      }
    ]
  },
  "top_priorities": [
    {
      "title": "string",
      "category": "string",
      "impact": "high|medium|low",
      "effort": "high|medium|low",
      "description": "string"
    }
  ]
}`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        await adminClient.from("site_audits").update({ status: "failed" }).eq("id", audit.id);
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (status === 402) {
        await adminClient.from("site_audits").update({ status: "failed" }).eq("id", audit.id);
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings > Workspace > Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Parse the JSON from AI response
    let auditResult;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      auditResult = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse AI response:", content);
      auditResult = {
        overall_score: 0,
        summary: "Audit completed but response parsing failed. Raw response saved.",
        categories: [],
        competitive_intel: {},
        legal_compliance: {},
        top_priorities: [],
        raw_response: content,
      };
    }

    // Update audit record
    await adminClient
      .from("site_audits")
      .update({
        status: "completed",
        overall_score: auditResult.overall_score,
        summary: auditResult.summary,
        categories: auditResult.categories || [],
        recommendations: auditResult.top_priorities || [],
        competitive_intel: auditResult.competitive_intel || {},
        legal_compliance: auditResult.legal_compliance || {},
        completed_at: new Date().toISOString(),
      })
      .eq("id", audit.id);

    return new Response(
      JSON.stringify({ success: true, audit_id: audit.id, result: auditResult }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Audit error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
