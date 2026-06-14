"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Opportunity {
  id: string;
  type: string;
  buy_item_id: string;
  buy_city: string;
  buy_price: number;
  sell_city: string;
  sell_price: number;
  margin_raw: number;
  margin_net: number;
  margin_pct: number;
  volume: number;
  risk_score: number;
  status: string;
  detected_at: string;
  expired_at: string | null;
}

interface Filters {
  type?: string;
  minMargin?: number;
}

export function useRealtimeOpportunities(filters: Filters = {}) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOpportunities = useCallback(async () => {
    const supabase = createClient();
    let query = supabase
      .from("opportunities")
      .select("*")
      .eq("status", "active")
      .order("margin_net", { ascending: false })
      .limit(50);

    if (filters.type) {
      query = query.eq("type", filters.type);
    }
    if (filters.minMargin) {
      query = query.gte("margin_pct", filters.minMargin);
    }

    const { data } = await query;
    setOpportunities((data as Opportunity[]) || []);
    setLoading(false);
  }, [filters.type, filters.minMargin]);

  useEffect(() => {
    fetchOpportunities();

    const supabase = createClient();
    const channel = supabase
      .channel("opportunities-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "opportunities" },
        () => { fetchOpportunities(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchOpportunities]);

  return { opportunities, loading, refresh: fetchOpportunities };
}
