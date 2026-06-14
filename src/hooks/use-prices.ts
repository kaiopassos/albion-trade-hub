"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface PriceByCity {
  city: string;
  sell_price_min: number;
  buy_price_max: number;
  fetched_at: string;
}

interface PriceHistory {
  date: string;
  price: number;
}

export function usePrices() {
  const [prices, setPrices] = useState<PriceByCity[]>([]);
  const [history, setHistory] = useState<PriceHistory[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPricesForItem = useCallback(async (itemId: string) => {
    setLoading(true);
    const supabase = createClient();

    const { data: latestPrices } = await supabase
      .from("prices")
      .select("city, sell_price_min, buy_price_max, fetched_at")
      .eq("item_id", itemId)
      .gt("sell_price_min", 0)
      .order("fetched_at", { ascending: false })
      .limit(100);

    const byCity = new Map<string, PriceByCity>();
    for (const p of (latestPrices || []) as PriceByCity[]) {
      if (!byCity.has(p.city)) {
        byCity.set(p.city, p);
      }
    }
    setPrices(Array.from(byCity.values()));

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: historyData } = await supabase
      .from("prices")
      .select("sell_price_min, fetched_at")
      .eq("item_id", itemId)
      .gt("sell_price_min", 0)
      .gte("fetched_at", thirtyDaysAgo)
      .order("fetched_at", { ascending: true });

    const historyPoints = ((historyData || []) as { sell_price_min: number; fetched_at: string }[]).map((h) => ({
      date: new Date(h.fetched_at).toLocaleDateString("pt-BR"),
      price: h.sell_price_min,
    }));

    setHistory(historyPoints);
    setLoading(false);
  }, []);

  return { prices, history, loading, fetchPricesForItem };
}
