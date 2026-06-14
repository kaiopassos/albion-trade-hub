import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const TAX_RATE = 0.065;

interface PriceRow {
  item_id: string;
  city: string;
  sell_price_min: number;
  buy_price_max: number;
  fetched_at: string;
}

// A sell order is likely fake/manipulated if:
// 1. sell_price_min > buy_price_max * 5 (when buy data exists)
// 2. sell_price_min is in the top outlier range vs other cities for same item
function isRealisticPrice(p: PriceRow): boolean {
  // If we have buy order data and sell is way above buy, it's fake
  if (p.buy_price_max > 0 && p.sell_price_min > p.buy_price_max * 5) {
    return false;
  }
  // Price too low to be real
  if (p.sell_price_min < 10) {
    return false;
  }
  return true;
}

function getRealisticPrice(p: PriceRow): number {
  // If sell_price_min looks fake but buy_price_max exists, use buy_price_max as reference
  if (p.buy_price_max > 0 && p.sell_price_min > p.buy_price_max * 5) {
    return 0; // exclude this entry
  }
  return p.sell_price_min;
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${SUPABASE_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    let { data: prices } = await supabase
      .from("prices")
      .select("item_id, city, sell_price_min, buy_price_max, fetched_at")
      .gte("fetched_at", fifteenMinAgo)
      .gt("sell_price_min", 0)
      .order("fetched_at", { ascending: false });

    if (!prices || prices.length === 0) {
      const { data: fallback } = await supabase
        .from("prices")
        .select("item_id, city, sell_price_min, buy_price_max, fetched_at")
        .gt("sell_price_min", 0)
        .order("fetched_at", { ascending: false })
        .limit(500);
      prices = fallback;
    }

    if (!prices || prices.length === 0) {
      return NextResponse.json({ success: true, opportunities: 0, message: "No prices" });
    }

    const rows = prices as PriceRow[];

    // Deduplicate by item+city (keep latest)
    const byKey = new Map<string, PriceRow>();
    for (const p of rows) {
      const key = `${p.item_id}:${p.city}`;
      if (!byKey.has(key)) byKey.set(key, p);
    }

    // === ANTI-OUTLIER FILTER (3-layer) ===

    // Layer 1: Remove entries where sell >> buy (fake sell orders)
    for (const [key, p] of byKey) {
      if (!isRealisticPrice(p)) {
        byKey.delete(key);
      }
    }

    // Layer 2: For items with multiple cities, use IQR to remove outliers
    const pricesByItem = new Map<string, { key: string; price: number }[]>();
    for (const [key, p] of byKey) {
      const list = pricesByItem.get(p.item_id) || [];
      list.push({ key, price: p.sell_price_min });
      pricesByItem.set(p.item_id, list);
    }

    for (const [, itemPrices] of pricesByItem) {
      if (itemPrices.length < 3) continue;

      const sorted = [...itemPrices].sort((a, b) => a.price - b.price);
      const q1 = sorted[Math.floor(sorted.length * 0.25)].price;
      const q3 = sorted[Math.floor(sorted.length * 0.75)].price;
      const iqr = q3 - q1;
      const upperBound = q3 + iqr * 3; // Very generous bound

      for (const entry of sorted) {
        if (entry.price > upperBound && upperBound > 0) {
          byKey.delete(entry.key);
        }
      }
    }

    // Layer 3: Cap maximum margin at 200% to avoid unrealistic flips
    // (applied during opportunity detection below)

    // Group by item
    const byItem = new Map<string, PriceRow[]>();
    for (const p of byKey.values()) {
      const list = byItem.get(p.item_id) || [];
      list.push(p);
      byItem.set(p.item_id, list);
    }

    // City flips
    const opportunities: Record<string, unknown>[] = [];
    let filtered = 0;

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

          // Layer 3: Cap margin at 200% — anything higher is suspicious
          if (marginPct > 200) {
            filtered++;
            continue;
          }

          // Min 5% margin to be worth showing
          if (marginPct < 5) continue;

          const dataAge = (Date.now() - new Date(buy.fetched_at).getTime()) / 60000;
          const riskScore = Math.min(1, Math.max(0,
            Math.round((0.4 * (dataAge > 30 ? 0.9 : dataAge > 15 ? 0.5 : 0.1) + 0.4 * 0.3 + 0.2 * (marginPct > 100 ? 0.4 : 0)) * 100) / 100
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

    // --- BLACK MARKET FLIPS ---
    // Buy items in royal cities (sell_price_min) → Sell to BM NPCs (buy_price_max)
    // BM buy orders are placed by NPCs and pay well for items they need
    for (const [itemId, entries] of byItem) {
      const bmEntry = entries.find(e => e.city === "Black Market");
      if (!bmEntry || bmEntry.buy_price_max <= 0) continue;

      const royalEntries = entries.filter(e => e.city !== "Black Market" && e.sell_price_min > 0);

      for (const buy of royalEntries) {
        const buyPrice = buy.sell_price_min;
        const sellPrice = bmEntry.buy_price_max; // BM NPC buy price

        if (sellPrice <= buyPrice) continue;

        const marginRaw = sellPrice - buyPrice;
        const marginNet = marginRaw; // No tax on BM sells
        const marginPct = Math.round((marginNet / buyPrice) * 100);

        if (marginPct > 200 || marginPct < 5) continue;

        opportunities.push({
          type: "city", // reuse city type, will show as BM in city name
          buy_item_id: itemId,
          buy_city: buy.city,
          buy_price: buyPrice,
          sell_city: "Black Market",
          sell_price: sellPrice,
          margin_raw: marginRaw,
          margin_net: marginNet,
          margin_pct: marginPct,
          volume: 3,
          risk_score: 0.2, // BM is safe (Caerleon)
          status: "active",
        });
      }
    }

    // Expire old
    await supabase
      .from("opportunities")
      .update({ status: "expired", expired_at: new Date().toISOString() })
      .eq("status", "active");

    // Insert top 100
    const top = opportunities.sort((a, b) => (b.margin_net as number) - (a.margin_net as number)).slice(0, 100);

    if (top.length > 0) {
      await supabase.from("opportunities").insert(top);
    }

    return NextResponse.json({
      success: true,
      opportunities: top.length,
      total_found: opportunities.length,
      filtered_outliers: filtered,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
