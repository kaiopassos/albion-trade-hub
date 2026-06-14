import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const TAX_RATE = 0.065;

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${SUPABASE_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Get latest prices (last 15 minutes)
    const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { data: latestPrices } = await supabase
      .from("prices")
      .select("item_id, city, sell_price_min, buy_price_max, fetched_at")
      .gte("fetched_at", fifteenMinAgo)
      .gt("sell_price_min", 0)
      .order("fetched_at", { ascending: false });

    if (!latestPrices || latestPrices.length === 0) {
      // Fallback: get most recent prices regardless of time
      const { data: fallbackPrices } = await supabase
        .from("prices")
        .select("item_id, city, sell_price_min, buy_price_max, fetched_at")
        .gt("sell_price_min", 0)
        .order("fetched_at", { ascending: false })
        .limit(500);

      if (!fallbackPrices || fallbackPrices.length === 0) {
        return NextResponse.json({ success: true, opportunities: 0, message: "No prices" });
      }

      return processOpportunities(supabase, fallbackPrices);
    }

    return processOpportunities(supabase, latestPrices);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

async function processOpportunities(supabase: ReturnType<typeof createClient>, prices: { item_id: string; city: string; sell_price_min: number; buy_price_max: number; fetched_at: string }[]) {
  // Deduplicate by item+city (keep latest)
  const byKey = new Map<string, typeof prices[0]>();
  for (const p of prices) {
    const key = `${p.item_id}:${p.city}`;
    if (!byKey.has(key)) byKey.set(key, p);
  }

  // Group by item
  const byItem = new Map<string, typeof prices>();
  for (const p of byKey.values()) {
    const list = byItem.get(p.item_id) || [];
    list.push(p);
    byItem.set(p.item_id, list);
  }

  // City flips
  const opportunities: Record<string, unknown>[] = [];
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
        if (marginPct < 5 || marginPct > 500) continue;

        const dataAge = (Date.now() - new Date(buy.fetched_at).getTime()) / 60000;
        const riskScore = Math.min(1, Math.max(0,
          Math.round((0.4 * (dataAge > 30 ? 0.9 : dataAge > 15 ? 0.5 : 0.1) + 0.4 * 0.3 + 0.2 * (marginPct > 200 ? 0.4 : 0)) * 100) / 100
        ));

        opportunities.push({
          type: "city",
          buy_item_id: itemId,
          buy_city: buy.city,
          buy_price: buyPrice,
          sell_city: sell.city,
          sell_price: sellPrice,
          margin_raw: marginRaw,
          margin_net: marginNet,
          margin_pct: marginPct,
          volume: 5,
          risk_score: riskScore,
          status: "active",
        });
      }
    }
  }

  // Expire old active opportunities
  await supabase
    .from("opportunities")
    .update({ status: "expired", expired_at: new Date().toISOString() })
    .eq("status", "active");

  // Insert top 100
  const top = opportunities.sort((a, b) => (b.margin_net as number) - (a.margin_net as number)).slice(0, 100);

  if (top.length > 0) {
    await supabase.from("opportunities").insert(top);
  }

  return NextResponse.json({ success: true, opportunities: top.length, total_found: opportunities.length });
}
