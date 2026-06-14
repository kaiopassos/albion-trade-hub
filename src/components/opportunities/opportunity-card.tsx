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

function marginTag(pct: number) {
  if (pct >= 30) return { label: "Bom preco", color: "text-green-400 bg-green-500/10 border-green-500/20" };
  if (pct >= 15) return { label: `${pct}% margem`, color: "text-[#c8a84e] bg-[#c8a84e]/10 border-[#c8a84e]/20" };
  return { label: `${pct}% margem`, color: "text-[#a89070] bg-[#a89070]/10 border-[#a89070]/20" };
}

function riskDot(score: number) {
  if (score < 0.3) return "bg-green-500";
  if (score < 0.6) return "bg-yellow-500";
  return "bg-red-500";
}

export function OpportunityCard({ opp }: { opp: Opportunity }) {
  const itemIcon = `https://render.albiononline.com/v1/item/${opp.buy_item_id}.png?size=60&quality=1`;
  const tierMatch = opp.buy_item_id.match(/^T(\d)/);
  const tier = tierMatch ? `T${tierMatch[1]}` : "";
  const itemName = getItemName(opp.buy_item_id);
  const tierBadge = getTierBadgeColor(opp.buy_item_id);
  const margin = marginTag(Number(opp.margin_pct));

  return (
    <div className="rounded-lg border border-[#3a3028] bg-[#241e18] p-4 transition-all hover:border-[#c8a84e]/30 hover:bg-[#2e2620]">
      <div className="flex items-center gap-4">
        {/* Item icon */}
        <div className="shrink-0 relative">
          <img src={itemIcon} alt={opp.buy_item_id} className="h-14 w-14 rounded-lg border border-[#3a3028] bg-[#12100c] p-1" onError={(e) => { (e.target as HTMLImageElement).src = ''; (e.target as HTMLImageElement).className = 'h-14 w-14 rounded-lg border border-[#3a3028] bg-[#12100c]' }} />
          <span className={cn("absolute -top-1 -left-1 rounded px-1 py-0.5 text-[9px] font-bold border", tierBadge)}>{tier}</span>
        </div>

        {/* Item info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-[#e8d5b5] truncate">{itemName}</p>
          <p className="text-[10px] text-[#8b7635] mt-0.5">{opp.buy_item_id}</p>
        </div>

        {/* Buy info */}
        <div className="text-center min-w-[110px]">
          <p className="text-[10px] text-[#8b7635] uppercase mb-0.5">Comprar em</p>
          <p className="text-sm font-medium text-[#e8d5b5]">{opp.buy_city}</p>
          <p className="text-sm font-mono text-[#c8a84e]">{formatSilver(Number(opp.buy_price))}</p>
        </div>

        {/* Arrow */}
        <div className="text-[#c8a84e] text-lg font-bold">&rarr;</div>

        {/* Sell info */}
        <div className="text-center min-w-[110px]">
          <p className="text-[10px] text-[#8b7635] uppercase mb-0.5">Vender em</p>
          <p className="text-sm font-medium text-[#e8d5b5]">{opp.sell_city}</p>
          <p className="text-sm font-mono text-[#c8a84e]">{formatSilver(Number(opp.sell_price))}</p>
        </div>

        {/* Profit */}
        <div className="text-center min-w-[100px]">
          <p className="text-[10px] text-[#8b7635] uppercase mb-0.5">Lucro Liquido</p>
          <p className="text-lg font-bold text-green-400">+{formatSilver(Number(opp.margin_net))}</p>
          <span className={cn("inline-block rounded border px-1.5 py-0.5 text-[10px] font-medium mt-0.5", margin.color)}>
            {margin.label}
          </span>
        </div>

        {/* Risk + Type */}
        <div className="text-center min-w-[70px] space-y-1">
          <span className="inline-block rounded border border-[#3a3028] bg-[#12100c] px-2 py-0.5 text-[10px] font-medium text-[#a89070]">
            {typeLabels[opp.type]}
          </span>
          <div className="flex items-center justify-center gap-1">
            <span className={cn("h-2 w-2 rounded-full", riskDot(Number(opp.risk_score)))} />
            <span className="text-[10px] text-[#8b7635]">
              {Number(opp.risk_score) < 0.3 ? "Baixo" : Number(opp.risk_score) < 0.6 ? "Medio" : "Alto"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
