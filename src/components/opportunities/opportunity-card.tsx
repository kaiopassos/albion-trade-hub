import { cn, formatSilver } from "@/lib/utils";
import { getItemName, getTierBadgeColor } from "@/lib/item-names";

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
  city: "bg-[#a89070]/10 text-[#a89070] border-[#a89070]/20",
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
  const itemIcon = `https://render.albiononline.com/v1/item/${opp.buy_item_id}.png?size=50&quality=1`;
  const tierMatch = opp.buy_item_id.match(/^T(\d)/);
  const tier = tierMatch ? `T${tierMatch[1]}` : "";
  const itemName = getItemName(opp.buy_item_id);
  const tierBadge = getTierBadgeColor(opp.buy_item_id);

  return (
    <div className="rounded-lg border border-[#3a3028] bg-[#241e18] p-4 transition-all hover:border-[#c8a84e]/30 hover:bg-[#2e2620]">
      <div className="flex items-center gap-4">
        {/* Item icon + info */}
        <img src={itemIcon} alt={opp.buy_item_id} className="h-12 w-12 rounded-lg border border-[#3a3028]" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("rounded border px-1.5 py-0.5 text-[10px] font-bold", tierBadge)}>{tier}</span>
            <span className="font-medium text-sm text-[#e8d5b5] truncate">{itemName}</span>
            <span className={cn("rounded border px-1.5 py-0.5 text-[10px] font-medium", typeColors[opp.type])}>{typeLabels[opp.type]}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#8b7635]">
            <span>{opp.buy_item_id}</span>
          </div>
        </div>

        {/* Buy city */}
        <div className="text-center min-w-[100px]">
          <p className="text-[10px] text-[#8b7635] uppercase">Comprar em</p>
          <p className="text-sm font-medium text-[#e8d5b5]">{opp.buy_city}</p>
          <p className="text-sm font-mono text-[#a89070]">{formatSilver(Number(opp.buy_price))}</p>
        </div>

        {/* Arrow */}
        <div className="text-[#c8a84e] text-lg px-2">&rarr;</div>

        {/* Sell city */}
        <div className="text-center min-w-[100px]">
          <p className="text-[10px] text-[#8b7635] uppercase">Vender em</p>
          <p className="text-sm font-medium text-[#e8d5b5]">{opp.sell_city}</p>
          <p className="text-sm font-mono text-[#a89070]">{formatSilver(Number(opp.sell_price))}</p>
        </div>

        {/* Profit */}
        <div className="text-center min-w-[90px]">
          <p className="text-[10px] text-[#8b7635] uppercase">Lucro liq.</p>
          <p className={cn("text-base font-bold", marginColor(Number(opp.margin_pct)))}>
            {formatSilver(Number(opp.margin_net))}
          </p>
          <p className={cn("text-xs font-medium", marginColor(Number(opp.margin_pct)))}>
            {Number(opp.margin_pct) > 0 ? "+" : ""}{opp.margin_pct}%
          </p>
        </div>

        {/* Risk */}
        <div className="text-center min-w-[60px]">
          <p className="text-[10px] text-[#8b7635] uppercase">Risco</p>
          <p className={cn("text-sm font-medium", risk.color)}>{risk.label}</p>
        </div>
      </div>
    </div>
  );
}
