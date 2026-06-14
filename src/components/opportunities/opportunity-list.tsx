"use client";

import { useState } from "react";
import { OpportunityCard } from "./opportunity-card";
import { OpportunityFilters } from "./opportunity-filters";
import { useRealtimeOpportunities } from "@/hooks/use-realtime-opportunities";

export function OpportunityList() {
  const [type, setType] = useState("all");
  const [minMargin, setMinMargin] = useState("");

  const filters = {
    type: type === "all" ? undefined : type,
    minMargin: minMargin ? Number(minMargin) : undefined,
  };

  const { opportunities, loading } = useRealtimeOpportunities(filters);

  return (
    <div className="space-y-4">
      <OpportunityFilters type={type} minMargin={minMargin} onTypeChange={setType} onMinMarginChange={setMinMargin} />

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#8b7635]">{opportunities.length} oportunidades encontradas</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 border-2 border-[#c8a84e]/30 border-t-[#c8a84e] rounded-full animate-spin" />
        </div>
      ) : opportunities.length === 0 ? (
        <div className="rounded-lg border border-[#2a2f3e] bg-[#181c28] p-12 text-center">
          <p className="text-[#8b7635] text-sm">Nenhuma oportunidade encontrada.</p>
          <p className="text-[#8b7635] text-xs mt-1">Aguarde o scanner processar novos dados ou ajuste os filtros.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {opportunities.map((opp) => (
            <OpportunityCard key={opp.id} opp={opp} />
          ))}
        </div>
      )}
    </div>
  );
}
