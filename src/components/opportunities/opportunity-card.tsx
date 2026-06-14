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
const typeColors: Record<string, string> = {
  city: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  time: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  craft: "bg-[#c8a84e]/10 text-[#c8a84e] border-[#c8a84e]/20"
};

function marginColor(pct: number): string {
  if (pct >= 30) return "text-green-400";
  if (pct >= 15) return "text-[#c8a84e]";
  return "text-[#8b2020]";
}

function riskLabel(score: number) {
  if (score < 0.3) return { label: "Baixo", color: "text-green-400" };
  if (score < 0.6) return { label: "Medio", color: "text-[#c8a84e]" };
  return { label: "Alto", color: "text-[#8b2020]" };
}

export function OpportunityCard({ opp }: { opp: Opportunity }) {
  const risk = riskLabel(Number(opp.risk_score));
  const itemIcon = `https://render.albiononline.com/v1/item/${opp.buy_item_id}.png?size=40&quality=1`;

  return (
    <div className="grid grid-cols-7 items-center gap-4 rounded-lg border border-[#2a2f3e] bg-[#181c28] p-4 transition-all hover:border-[#c8a84e]/30 hover:bg-[#1e2230] glow-gold">
      <div className="col-span-2 flex items-center gap-3">
        <img src={itemIcon} alt={opp.buy_item_id} className="h-10 w-10 rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        <div>
          <p className="font-medium text-sm text-[#e8dcc8]">{opp.buy_item_id}</p>
          <span className={cn("mt-1 inline-block rounded border px-2 py-0.5 text-[10px] font-medium", typeColors[opp.type])}>
            {typeLabels[opp.type]}
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[10px] text-[#8b7635]">Comprar</p>
        <p className="text-sm font-medium text-[#e8dcc8]">{opp.buy_city}</p>
        <p className="text-sm text-[#a89878]">{formatSilver(Number(opp.buy_price))}</p>
      </div>
      <div className="text-center text-[#2a2f3e] text-lg">&rarr;</div>
      <div className="text-center">
        <p className="text-[10px] text-[#8b7635]">Vender</p>
        <p className="text-sm font-medium text-[#e8dcc8]">{opp.sell_city}</p>
        <p className="text-sm text-[#a89878]">{formatSilver(Number(opp.sell_price))}</p>
      </div>
      <div className="text-center">
        <p className="text-[10px] text-[#8b7635]">Lucro liq.</p>
        <p className={cn("text-sm font-bold", marginColor(Number(opp.margin_pct)))}>{formatSilver(Number(opp.margin_net))}</p>
        <p className={cn("text-xs", marginColor(Number(opp.margin_pct)))}>{opp.margin_pct}%</p>
      </div>
      <div className="text-center">
        <p className="text-[10px] text-[#8b7635]">Risco</p>
        <p className={cn("text-sm font-medium", risk.color)}>{risk.label}</p>
      </div>
    </div>
  );
}
