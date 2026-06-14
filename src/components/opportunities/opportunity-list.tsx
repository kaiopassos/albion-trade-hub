"use client";

import { useState } from "react";
import { OpportunityCard } from "./opportunity-card";
import { OpportunityFilters } from "./opportunity-filters";
import { useRealtimeOpportunities } from "@/hooks/use-realtime-opportunities";
import { getItemName } from "@/lib/item-names";

export function OpportunityList() {
  const [type, setType] = useState("all");
  const [minMargin, setMinMargin] = useState("");
  const [category, setCategory] = useState("all");
  const [tier, setTier] = useState("all");
  const [sortBy, setSortBy] = useState("margin_net");
  const [search, setSearch] = useState("");

  const filters = {
    type: type === "all" ? undefined : type,
    minMargin: minMargin ? Number(minMargin) : undefined,
  };

  const { opportunities, loading } = useRealtimeOpportunities(filters);

  // Client-side filtering
  let filtered = opportunities;

  if (tier !== "all") {
    filtered = filtered.filter(o => o.buy_item_id.startsWith(`T${tier}_`));
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(o =>
      o.buy_item_id.toLowerCase().includes(q) ||
      getItemName(o.buy_item_id).toLowerCase().includes(q) ||
      o.buy_city.toLowerCase().includes(q) ||
      o.sell_city.toLowerCase().includes(q)
    );
  }

  // Sort
  if (sortBy === "margin_pct") {
    filtered = [...filtered].sort((a, b) => Number(b.margin_pct) - Number(a.margin_pct));
  } else if (sortBy === "buy_price") {
    filtered = [...filtered].sort((a, b) => Number(a.buy_price) - Number(b.buy_price));
  }

  return (
    <div className="space-y-4">
      <OpportunityFilters
        type={type} minMargin={minMargin} category={category} tier={tier} sortBy={sortBy} search={search}
        onTypeChange={setType} onMinMarginChange={setMinMargin} onCategoryChange={setCategory}
        onTierChange={setTier} onSortChange={setSortBy} onSearchChange={setSearch}
      />

      <div className="flex items-center justify-between">
        <p className="text-xs text-[#8b7635]">{filtered.length} oportunidades encontradas</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 border-2 border-[#c8a84e]/30 border-t-[#c8a84e] rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-[#3a3028] bg-[#241e18] p-12 text-center">
          <p className="text-[#8b7635] text-sm">Nenhuma oportunidade encontrada.</p>
          <p className="text-[#8b7635] text-xs mt-1">Ajuste os filtros ou aguarde novos dados.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((opp) => (
            <OpportunityCard key={opp.id} opp={opp} />
          ))}
        </div>
      )}
    </div>
  );
}
