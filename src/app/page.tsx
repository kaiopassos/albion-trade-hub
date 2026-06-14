"use client";

import { useEffect, useState } from "react";
import { OpportunityList } from "@/components/opportunities/opportunity-list";
import { createClient } from "@/lib/supabase/client";
import { formatSilver } from "@/lib/utils";

export default function HomePage() {
  const [stats, setStats] = useState({ totalOpps: 0, totalItems: 0, avgMargin: 0, lastUpdate: "" });

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();

      const { count: oppCount } = await supabase
        .from("opportunities")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      const { count: itemCount } = await supabase
        .from("items")
        .select("*", { count: "exact", head: true });

      const { data: margins } = await supabase
        .from("opportunities")
        .select("margin_net")
        .eq("status", "active")
        .order("margin_net", { ascending: false })
        .limit(20);

      const { data: lastPrice } = await supabase
        .from("prices")
        .select("fetched_at")
        .order("fetched_at", { ascending: false })
        .limit(1);

      const avgMargin = margins && margins.length > 0
        ? Math.round(margins.reduce((s, m) => s + Number(m.margin_net), 0) / margins.length)
        : 0;

      const lastUpdate = lastPrice?.[0]?.fetched_at
        ? new Date(lastPrice[0].fetched_at).toLocaleTimeString("pt-BR")
        : "--";

      setStats({
        totalOpps: oppCount || 0,
        totalItems: itemCount || 0,
        avgMargin,
        lastUpdate,
      });
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero stats */}
      <div className="rounded-lg border border-[#3a3028] bg-[#241e18] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#c8a84e] uppercase tracking-wide">Albion Trade Hub</h1>
            <p className="text-xs text-[#8b7635] mt-1 uppercase tracking-wider">Scanner de Mercado</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-xs text-[#8b7635] uppercase">Oportunidades</p>
              <p className="text-2xl font-bold text-[#c8a84e]">{stats.totalOpps}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[#8b7635] uppercase">Lucro Medio</p>
              <p className="text-2xl font-bold text-green-400">{formatSilver(stats.avgMargin)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[#8b7635] uppercase">Itens Monitorados</p>
              <p className="text-2xl font-bold text-[#e8d5b5]">{stats.totalItems}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[#8b7635] uppercase">Ultima Atualizacao</p>
              <p className="text-lg font-mono text-[#a89070]">{stats.lastUpdate}</p>
            </div>
          </div>
        </div>
      </div>

      <OpportunityList />
    </div>
  );
}
