import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const AODP_BASE = "https://west.albion-online-data.com";
const CITIES = "Bridgewatch,Fort Sterling,Lymhurst,Martlock,Thetford,Caerleon,Brecilien";
const BATCH_SIZE = 50;

export async function GET(req: Request) {
  // Simple auth via secret header
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${SUPABASE_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Get items to fetch
    const { data: watchlistItems } = await supabase.from("watchlist").select("item_id");
    const { data: allItems } = await supabase
      .from("items")
      .select("id")
      .in("category", ["material", "resource", "consumable", "mount", "accessory"])
      .gte("tier", 4)
      .lte("tier", 8)
      .limit(200);

    const watchlistIds = (watchlistItems || []).map((w: { item_id: string }) => w.item_id);
    const popularIds = (allItems || []).map((i: { id: string }) => i.id);
    const itemIds = [...new Set([...watchlistIds, ...popularIds])];

    if (itemIds.length === 0) {
      return NextResponse.json({ success: true, fetched: 0 });
    }

    let totalInserted = 0;
    for (let i = 0; i < itemIds.length; i += BATCH_SIZE) {
      const batch = itemIds.slice(i, i + BATCH_SIZE);
      const url = `${AODP_BASE}/api/v2/stats/prices/${batch.join(",")}?locations=${encodeURIComponent(CITIES)}&qualities=1`;

      const res = await fetch(url);
      if (!res.ok) continue;
      const prices = await res.json();

      const rows = prices
        .filter((p: { sell_price_min: number; buy_price_max: number }) => p.sell_price_min > 0 || p.buy_price_max > 0)
        .map((p: { item_id: string; city: string; sell_price_min: number; sell_price_max: number; buy_price_min: number; buy_price_max: number }) => ({
          item_id: p.item_id,
          city: p.city,
          sell_price_min: p.sell_price_min,
          sell_price_max: p.sell_price_max,
          buy_price_min: p.buy_price_min,
          buy_price_max: p.buy_price_max,
          sell_order_count: 0,
          buy_order_count: 0,
        }));

      if (rows.length > 0) {
        const { error } = await supabase.from("prices").insert(rows);
        if (!error) totalInserted += rows.length;
      }
    }

    return NextResponse.json({ success: true, fetched: totalInserted });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
