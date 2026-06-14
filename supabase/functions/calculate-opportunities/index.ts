import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const TAX_RATE = 0.065;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data: latestPrices } = await supabase.from("prices")
      .select("item_id, city, sell_price_min, buy_price_max, fetched_at")
      .gte("fetched_at", tenMinAgo).order("fetched_at", { ascending: false });

    if (!latestPrices || latestPrices.length === 0) {
      return new Response(JSON.stringify({ success: true, opportunities: 0 }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Deduplicate
    const latestByKey = new Map<string, typeof latestPrices[0]>();
    for (const p of latestPrices) {
      const key = `${p.item_id}:${p.city}`;
      if (!latestByKey.has(key)) latestByKey.set(key, p);
    }

    // Group by item
    const byItem = new Map<string, typeof latestPrices>();
    for (const p of latestByKey.values()) {
      if (p.sell_price_min <= 0) continue;
      const list = byItem.get(p.item_id) || [];
      list.push(p);
      byItem.set(p.item_id, list);
    }

    // City flips
    const cityFlips: Record<string, unknown>[] = [];
    for (const [itemId, entries] of byItem) {
      if (entries.length < 2) continue;
      for (const buy of entries) {
        for (const sell of entries) {
          if (buy.city === sell.city) continue;
          const buyPrice = buy.sell_price_min;
          const sellPrice = sell.sell_price_min;
          if (sellPrice <= buyPrice) continue;
          const marginRaw = sellPrice - buyPrice;
          const tax = Math.round(sellPrice * TAX_RATE);
          const marginNet = marginRaw - tax;
          if (marginNet <= 0) continue;
          const marginPct = Math.round((marginNet / buyPrice) * 100);
          const dataAge = (Date.now() - new Date(buy.fetched_at).getTime()) / 60000;
          const riskScore = Math.min(1, Math.max(0, Math.round((0.4 * (dataAge > 30 ? 0.9 : 0.1) + 0.4 * 0.3 + 0.2 * (marginPct > 200 ? 0.4 : 0)) * 100) / 100));

          cityFlips.push({
            type: "city", buy_item_id: itemId, buy_city: buy.city, buy_price: buyPrice,
            sell_city: sell.city, sell_price: sellPrice, margin_raw: marginRaw,
            margin_net: marginNet, margin_pct: marginPct, volume: 5, risk_score: riskScore, status: "active",
          });
        }
      }
    }

    // Expire old
    await supabase.from("opportunities").update({ status: "expired", expired_at: new Date().toISOString() }).eq("status", "active");

    // Insert top 100
    const allOpps = cityFlips.sort((a, b) => (b.margin_net as number) - (a.margin_net as number)).slice(0, 100);
    if (allOpps.length > 0) {
      await supabase.from("opportunities").insert(allOpps);
    }

    return new Response(JSON.stringify({ success: true, opportunities: allOpps.length }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
