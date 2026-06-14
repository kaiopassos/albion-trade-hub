"use client";

import { useState } from "react";
import { PriceSearch } from "@/components/prices/price-search";
import { PriceTable } from "@/components/prices/price-table";
import { PriceChart } from "@/components/prices/price-chart";
import { Star } from "lucide-react";
import { usePrices } from "@/hooks/use-prices";
import { createClient } from "@/lib/supabase/client";

export default function PricesPage() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const { prices, history, loading, fetchPricesForItem } = usePrices();

  const handleSelect = (itemId: string) => {
    setSelectedItem(itemId);
    fetchPricesForItem(itemId);
  };

  const handleAddToWatchlist = async () => {
    if (!selectedItem) return;
    const supabase = createClient();
    await supabase.from("watchlist").upsert(
      { item_id: selectedItem, min_margin_threshold: 10, notify: true },
      { onConflict: "item_id" }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#e8d5b5]">Explorador de Precos</h2>
        <p className="text-[#8b7635] text-sm">
          Busque qualquer item e compare precos entre cidades.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <PriceSearch onSelect={handleSelect} />
        {selectedItem && (
          <button
            onClick={handleAddToWatchlist}
            className="flex items-center gap-1 rounded-md border border-[#3a3028] bg-[#12100c] px-3 py-2 text-sm text-[#e8d5b5] hover:bg-[#241e18]"
          >
            <Star className="h-4 w-4" /> Watchlist
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-[#8b7635] text-sm">Buscando precos...</p>
      ) : selectedItem ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <PriceTable prices={prices} />
          <PriceChart data={history} />
        </div>
      ) : (
        <p className="text-[#8b7635] text-sm">Selecione um item para ver os precos.</p>
      )}
    </div>
  );
}
