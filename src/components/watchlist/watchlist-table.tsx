"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatSilver } from "@/lib/utils";

interface WatchlistItem {
  id: string;
  item_id: string;
  min_margin_threshold: number;
  notify: boolean;
  created_at: string;
  items?: { name: string; tier: number } | null;
  latest_price?: number;
}

export function WatchlistTable() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("watchlist").select("*, items(name, tier)").order("created_at", { ascending: false });
    if (!data) { setItems([]); setLoading(false); return; }

    const enriched = await Promise.all(
      data.map(async (item: WatchlistItem) => {
        const { data: priceData } = await supabase.from("prices").select("sell_price_min").eq("item_id", item.item_id).gt("sell_price_min", 0).order("fetched_at", { ascending: false }).limit(1).single();
        return { ...item, latest_price: priceData?.sell_price_min || 0 };
      })
    );
    setItems(enriched);
    setLoading(false);
  };

  useEffect(() => { fetchWatchlist(); }, []);

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    await supabase.from("watchlist").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleThresholdChange = async (id: string, value: number) => {
    const supabase = createClient();
    await supabase.from("watchlist").update({ min_margin_threshold: value }).eq("id", id);
  };

  if (loading) return <p className="text-[#8b7635] text-sm">Carregando...</p>;
  if (items.length === 0) return <p className="text-[#8b7635] text-sm">Nenhum item na watchlist. Va ao Explorador de Precos e adicione itens.</p>;

  return (
    <div className="rounded-lg border border-[#3a3028] overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-[#12100c]">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#8b7635] uppercase">Item</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#8b7635] uppercase">Tier</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-[#8b7635] uppercase">Preco Atual</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-[#8b7635] uppercase">Margem Min (%)</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#3a3028]">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-[#241e18]">
              <td className="px-4 py-3 font-medium text-[#e8d5b5]">{item.items?.name || item.item_id}</td>
              <td className="px-4 py-3 text-[#a89070]">T{item.items?.tier || "?"}</td>
              <td className="px-4 py-3 text-right font-mono text-[#e8d5b5]">{item.latest_price && item.latest_price > 0 ? formatSilver(item.latest_price) : "---"}</td>
              <td className="px-4 py-3 text-right">
                <input type="number" className="w-20 ml-auto rounded border border-[#3a3028] bg-[#12100c] px-2 py-1 text-sm text-[#e8d5b5] text-right" defaultValue={item.min_margin_threshold} onBlur={(e) => handleThresholdChange(item.id, Number(e.target.value))} />
              </td>
              <td className="px-4 py-3">
                <button onClick={() => handleDelete(item.id)} className="rounded p-1 text-red-400 hover:bg-red-500/20">
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
