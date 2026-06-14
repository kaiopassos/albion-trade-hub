import { cn, formatSilver } from "@/lib/utils";

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
}

const typeLabels: Record<string, string> = { city: "City Flip", time: "Time Flip", craft: "Craft Flip" };
const typeColors: Record<string, string> = { city: "bg-blue-500/20 text-blue-400 border-blue-500/30", time: "bg-purple-500/20 text-purple-400 border-purple-500/30", craft: "bg-amber-500/20 text-amber-400 border-amber-500/30" };

function marginColor(pct: number): string {
  if (pct >= 30) return "text-green-400";
  if (pct >= 15) return "text-yellow-400";
  return "text-red-400";
}

function riskLabel(score: number) {
  if (score < 0.3) return { label: "Baixo", color: "text-green-400" };
  if (score < 0.6) return { label: "Medio", color: "text-yellow-400" };
  return { label: "Alto", color: "text-red-400" };
}

export function OpportunityCard({ opp }: { opp: Opportunity }) {
  const risk = riskLabel(Number(opp.risk_score));
  return (
    <div className="grid grid-cols-7 items-center gap-4 rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 transition-colors hover:bg-neutral-800/50">
      <div className="col-span-2">
        <p className="font-medium text-sm text-white">{opp.buy_item_id}</p>
        <span className={cn("mt-1 inline-block rounded-md border px-2 py-0.5 text-xs font-medium", typeColors[opp.type])}>
          {typeLabels[opp.type]}
        </span>
      </div>
      <div className="text-center">
        <p className="text-xs text-neutral-500">Comprar</p>
        <p className="text-sm font-medium text-white">{opp.buy_city}</p>
        <p className="text-sm text-neutral-400">{formatSilver(Number(opp.buy_price))}</p>
      </div>
      <div className="text-center text-neutral-600">&rarr;</div>
      <div className="text-center">
        <p className="text-xs text-neutral-500">Vender</p>
        <p className="text-sm font-medium text-white">{opp.sell_city}</p>
        <p className="text-sm text-neutral-400">{formatSilver(Number(opp.sell_price))}</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-neutral-500">Lucro liq.</p>
        <p className={cn("text-sm font-bold", marginColor(Number(opp.margin_pct)))}>{formatSilver(Number(opp.margin_net))}</p>
        <p className={cn("text-xs", marginColor(Number(opp.margin_pct)))}>{opp.margin_pct}%</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-neutral-500">Risco</p>
        <p className={cn("text-sm font-medium", risk.color)}>{risk.label}</p>
      </div>
    </div>
  );
}
