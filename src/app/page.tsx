import { OpportunityList } from "@/components/opportunities/opportunity-list";
import { Swords } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-[#c8a84e]/10 p-2 border border-[#c8a84e]/20">
            <Swords className="h-6 w-6 text-[#c8a84e]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#e8dcc8]">Trades</h2>
            <p className="text-[#8b7635] text-sm">
              Oportunidades de flip atualizadas a cada 5 minutos.
            </p>
          </div>
        </div>
      </div>
      <OpportunityList />
    </div>
  );
}
