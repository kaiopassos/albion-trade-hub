import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { fetchPrices } from "../_shared/albion-api.ts";

const CITIES = ["Bridgewatch", "Fort Sterling", "Lymhurst", "Martlock", "Thetford", "Caerleon", "Brecilien"];
const BATCH_SIZE = 50;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: watchlistItems } = await supabase.from("watchlist").select("item_id");
    const { data: allItems } = await supabase.from("items").select("id")
      .in("category", ["material", "resource", "consumable", "mount", "accessory"])
      .gte("tier", 4).lte("tier", 8).limit(200);

    const watchlistIds = (watchlistItems || []).map((w: { item_id: string }) => w.item_id);
    const popularIds = (allItems || []).map((i: { id: string }) => i.id);
    const itemIds = [...new Set([...watchlistIds, ...popularIds])];

    if (itemIds.length === 0) {
      return new Response(JSON.stringify({ success: true, fetched: 0 }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    let totalInserted = 0;
    for (let i = 0; i < itemIds.length; i += BATCH_SIZE) {
      const batch = itemIds.slice(i, i + BATCH_SIZE);
      const prices = await fetchPrices(batch, CITIES);
      const validPrices = prices.filter((p) => p.sell_price_min > 0 || p.buy_price_max > 0);
      if (validPrices.length === 0) continue;

      const rows = validPrices.map((p) => ({
        item_id: p.item_id, city: p.city,
        sell_price_min: p.sell_price_min, sell_price_max: p.sell_price_max,
        buy_price_min: p.buy_price_min, buy_price_max: p.buy_price_max,
        sell_order_count: 0, buy_order_count: 0, fetched_at: new Date().toISOString(),
      }));

      const { error } = await supabase.from("prices").insert(rows);
      if (!error) totalInserted += rows.length;
    }

    return new Response(JSON.stringify({ success: true, fetched: totalInserted }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
