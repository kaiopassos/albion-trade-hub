import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { count: pricesDeleted } = await supabase.from("prices").delete({ count: "exact" }).lt("fetched_at", thirtyDaysAgo);

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: oppsExpired } = await supabase.from("opportunities")
      .update({ status: "expired", expired_at: new Date().toISOString() })
      .eq("status", "active").lt("detected_at", oneHourAgo);

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count: oppsDeleted } = await supabase.from("opportunities").delete({ count: "exact" }).eq("status", "expired").lt("expired_at", sevenDaysAgo);

    return new Response(JSON.stringify({ success: true, pricesDeleted: pricesDeleted || 0, oppsExpired: oppsExpired || 0, oppsDeleted: oppsDeleted || 0 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
