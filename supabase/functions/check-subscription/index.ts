import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    // Demo account bypass — full Team tier access for investor demos
    const DEMO_EMAIL = "demo@poke-pulse-ticker.com";
    if (user.email === DEMO_EMAIL) {
      return new Response(JSON.stringify({
        subscribed: true,
        product_id: "prod_UFLEYH02tl3Kso", // Team product ID
        subscription_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        trial: false,
        trial_ends_at: null,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    // Check for active free trial first
    const { data: trialData } = await supabaseClient
      .from("user_trials")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single();

    const hasActiveTrial = trialData && new Date(trialData.ends_at) > new Date();

    if (customers.data.length === 0) {
      // No Stripe customer — check trial
      if (hasActiveTrial) {
        return new Response(JSON.stringify({
          subscribed: true,
          product_id: "prod_UF3Knh8WvKsjHJ", // Pro product ID
          subscription_end: trialData.ends_at,
          trial: true,
          trial_ends_at: trialData.ends_at,
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    const hasActiveSub = subscriptions.data.length > 0;
    let productId = null;
    let subscriptionEnd = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      productId = subscription.items.data[0].price.product;
    } else if (hasActiveTrial) {
      // No paid sub but has active trial — grant Pro access
      productId = "prod_UF3Knh8WvKsjHJ"; // Pro product ID
      subscriptionEnd = trialData.ends_at;
    }

    return new Response(JSON.stringify({
      subscribed: hasActiveSub || !!hasActiveTrial,
      product_id: productId,
      subscription_end: subscriptionEnd,
      trial: !hasActiveSub && !!hasActiveTrial,
      trial_ends_at: hasActiveTrial ? trialData.ends_at : null,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
