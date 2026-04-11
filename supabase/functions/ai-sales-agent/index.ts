import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { action } = await req.json();

    if (action === "generate_leads") {
      // Compounding force: each deployment doubles the batch size
      const { data: metricsHistory } = await supabase
        .from("sales_pipeline_metrics")
        .select("leads_generated")
        .order("metric_date", { ascending: false })
        .limit(30);

      // Calculate deployment count to determine compound multiplier
      const totalDeployments = metricsHistory?.length || 0;
      const compoundMultiplier = Math.min(Math.pow(2, Math.floor(totalDeployments / 2)), 32); // caps at 32x
      const batchSize = Math.min(5 * compoundMultiplier, 50); // max 50 leads per batch

      // AI generates targeted lead profiles for Pokemon TCG market
      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `You are a B2B sales intelligence agent for Poké-Pulse-Engine™, the world's first real-time Pokémon TCG market terminal. Generate realistic prospective customer leads. Target: TCG shop owners, Pokemon collectors with 50k+ collections, eBay power sellers in Pokemon category, TCG content creators, card grading service customers, and sealed product investors. Return JSON array of ${batchSize} leads with fields: name, email, company, source, score (1-100), notes.`
            },
            {
              role: "user",
              content: `Generate ${batchSize} high-quality prospective customer leads for today's outreach campaign. Focus on people who would pay $29-299/mo for real-time Pokemon card market data, arbitrage signals, and portfolio tracking. Deployment #${totalDeployments + 1}, compound force multiplier: ${compoundMultiplier}x.`
            }
          ],
          tools: [{
            type: "function",
            function: {
              name: "generate_leads",
              description: "Generate prospective customer leads",
              parameters: {
                type: "object",
                properties: {
                  leads: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        email: { type: "string" },
                        company: { type: "string" },
                        source: { type: "string" },
                        score: { type: "number" },
                        notes: { type: "string" }
                      },
                      required: ["name", "email", "company", "source", "score", "notes"]
                    }
                  }
                },
                required: ["leads"]
              }
            }
          }],
          tool_choice: { type: "function", function: { name: "generate_leads" } }
        }),
      });

      if (!aiResponse.ok) {
        const status = aiResponse.status;
        if (status === 429) return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        if (status === 402) return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        throw new Error(`AI error: ${status}`);
      }

      const aiData = await aiResponse.json();
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      const leads = JSON.parse(toolCall.function.arguments).leads;

      // Insert leads
      for (const lead of leads) {
        await supabase.from("sales_leads").insert({
          name: lead.name,
          email: lead.email,
          company: lead.company,
          source: lead.source,
          score: lead.score,
          notes: lead.notes,
          ai_personalization: { generated: true, model: "gemini-3-flash", deployment: totalDeployments + 1, multiplier: compoundMultiplier }
        });
      }

      // Update daily metrics
      const today = new Date().toISOString().split("T")[0];
      const { data: existing } = await supabase.from("sales_pipeline_metrics").select("*").eq("metric_date", today).maybeSingle();
      if (existing) {
        await supabase.from("sales_pipeline_metrics").update({
          leads_generated: (existing.leads_generated || 0) + leads.length
        }).eq("id", existing.id);
      } else {
        await supabase.from("sales_pipeline_metrics").insert({ metric_date: today, leads_generated: leads.length });
      }

      return new Response(JSON.stringify({ success: true, leads_generated: leads.length, compound_multiplier: compoundMultiplier, deployment_number: totalDeployments + 1 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (action === "outreach") {
      // Get leads needing outreach
      const { data: leads } = await supabase
        .from("sales_leads")
        .select("*")
        .in("status", ["new", "contacted"])
        .order("score", { ascending: false })
        .limit(5);

      if (!leads || leads.length === 0) {
        return new Response(JSON.stringify({ success: true, message: "No leads to contact" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      let emailsSent = 0;
      for (const lead of leads) {
        // Generate personalized outreach
        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              {
                role: "system",
                content: `You are an elite sales copywriter for Poké-Pulse-Engine™. Write a compelling, personalized cold outreach email. The product offers: real-time Pokemon card pricing across 3,000+ cards, Alpha Signal™ predictive analytics, arbitrage detection, portfolio tracking, and grading ROI calculators. Pricing: Pro $29/mo, Premium $99/mo, Institutional $299/mo. Website: poke-pulse-ticker.com. Keep emails under 150 words, personal, and value-focused. No spam language.`
              },
              {
                role: "user",
                content: `Write outreach for: ${lead.name} at ${lead.company}. Source: ${lead.source}. Notes: ${lead.notes}. Score: ${lead.score}/100.`
              }
            ],
            tools: [{
              type: "function",
              function: {
                name: "create_email",
                description: "Create outreach email",
                parameters: {
                  type: "object",
                  properties: {
                    subject: { type: "string" },
                    body: { type: "string" }
                  },
                  required: ["subject", "body"]
                }
              }
            }],
            tool_choice: { type: "function", function: { name: "create_email" } }
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
          const email = JSON.parse(toolCall.function.arguments);

          // Log the outreach
          await supabase.from("sales_outreach_log").insert({
            lead_id: lead.id,
            outreach_type: "email",
            subject: email.subject,
            body: email.body,
            ai_model_used: "gemini-3-flash",
            status: "generated"
          });

          // Update lead status
          await supabase.from("sales_leads").update({
            status: lead.status === "new" ? "contacted" : "engaged",
            last_contacted_at: new Date().toISOString(),
            next_followup_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
          }).eq("id", lead.id);

          emailsSent++;
        }
      }

      // Update metrics
      const today = new Date().toISOString().split("T")[0];
      const { data: existing } = await supabase.from("sales_pipeline_metrics").select("*").eq("metric_date", today).maybeSingle();
      if (existing) {
        await supabase.from("sales_pipeline_metrics").update({
          emails_sent: (existing.emails_sent || 0) + emailsSent
        }).eq("id", existing.id);
      } else {
        await supabase.from("sales_pipeline_metrics").insert({ metric_date: today, emails_sent: emailsSent });
      }

      return new Response(JSON.stringify({ success: true, emails_sent: emailsSent }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (action === "pipeline_stats") {
      const { data: leads } = await supabase.from("sales_leads").select("status");
      const { data: metrics } = await supabase.from("sales_pipeline_metrics").select("*").order("metric_date", { ascending: false }).limit(7);
      const { data: recentOutreach } = await supabase.from("sales_outreach_log").select("*").order("created_at", { ascending: false }).limit(10);

      const statusCounts = {
        new: 0, contacted: 0, engaged: 0, demo_scheduled: 0, converted: 0, lost: 0
      };
      leads?.forEach(l => { if (l.status in statusCounts) statusCounts[l.status as keyof typeof statusCounts]++; });

      return new Response(JSON.stringify({
        pipeline: statusCounts,
        total_leads: leads?.length || 0,
        weekly_metrics: metrics || [],
        recent_outreach: recentOutreach || [],
        daily_target: 2,
        conversion_rate: leads?.length ? ((statusCounts.converted / leads.length) * 100).toFixed(1) : "0"
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (e) {
    console.error("AI Sales Agent error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
