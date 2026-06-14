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
      {loading ? (
        <p className="text-neutral-400 text-sm">Carregando oportunidades...</p>
      ) : opportunities.length === 0 ? (
        <p className="text-neutral-400 text-sm">Nenhuma oportunidade encontrada. Aguarde o scanner processar novos dados.</p>
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
