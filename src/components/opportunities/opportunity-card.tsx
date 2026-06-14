import { cn, formatSilver } from "@/lib/utils";
import { getItemName, getTierBadgeColor } from "@/lib/item-names";
import { ArrowRight } from "lucide-react";

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

function marginColor(pct: number): string {
  if (pct >= 30) return "text-green-400";
  if (pct >= 15) return "text-[#c8a84e]";
  return "text-[#a89070]";
}

function riskInfo(score: number) {
  if (score < 0.3) return { label: "Seguro", color: "text-green-400", desc: "Rota segura, sem PvP" };
  if (score < 0.6) return { label: "Moderado", color: "text-[#c8a84e]", desc: "Pode ter PvP no caminho" };
  return { label: "Perigoso", color: "text-red-400", desc: "Rota com zona vermelha/preta" };
}

export function OpportunityTableHeader() {
  return (
    <div className="grid grid-cols-[40px_1fr_140px_30px_140px_100px_60px] items-center gap-2 px-4 py-2.5 text-[10px] text-[#8b7635] uppercase tracking-wider border-b border-[#3a3028] bg-[#12100c]">
      <span>#</span>
      <span>Item</span>
      <span className="text-center">Compre em</span>
      <span></span>
      <span className="text-center">Venda em</span>
      <span className="text-right">Seu Lucro</span>
      <span className="text-right">Risco</span>
    </div>
  );
}

export function OpportunityCard({ opp, rank }: { opp: Opportunity; rank: number }) {
  const itemIcon = "https://render.albiononline.com/v1/item/" + opp.buy_item_id + ".png?size=50&quality=1";
  const tierMatch = opp.buy_item_id.match(/^T(\d)/);
  const tier = tierMatch ? "T" + tierMatch[1] : "";
  const itemName = getItemName(opp.buy_item_id);
  const tierBadge = getTierBadgeColor(opp.buy_item_id);
  const pct = Number(opp.margin_pct);
  const risk = riskInfo(Number(opp.risk_score));

  const rankStyle = rank === 1
    ? "bg-[#c8a84e] text-[#12100c]"
    : rank === 2
    ? "bg-[#a89070] text-[#12100c]"
    : rank === 3
    ? "bg-[#8b7635] text-[#12100c]"
    : "bg-[#3a3028] text-[#8b7635]";

  return (
    <div className="border-b border-[#3a3028]/50 hover:bg-[#2e2620] transition-colors">
      {/* Main row */}
      <div className="grid grid-cols-[40px_1fr_140px_30px_140px_100px_60px] items-center gap-2 px-4 py-3">
        {/* Rank */}
        <span className={cn("h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-bold", rankStyle)}>
          {rank}
        </span>

        {/* Item */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <img src={itemIcon} alt="" className="h-11 w-11 rounded border border-[#3a3028] bg-[#12100c] p-0.5"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
            <span className={cn("absolute -top-1.5 -left-1.5 rounded px-1 py-0.5 text-[8px] font-bold border leading-none", tierBadge)}>{tier}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#e8d5b5] truncate">{itemName}</p>
            <p className="text-[10px] text-[#8b7635]">{tier + " - " + opp.buy_item_id}</p>
          </div>
        </div>

        {/* Buy city + price */}
        <div className="text-center rounded-lg bg-[#12100c] border border-[#3a3028] px-2 py-1.5">
          <p className="text-xs font-bold text-[#e8d5b5]">{opp.buy_city}</p>
          <p className="text-sm font-mono text-[#c8a84e]">{formatSilver(Number(opp.buy_price))}</p>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <ArrowRight className="h-4 w-4 text-[#c8a84e]" />
        </div>

        {/* Sell city + price */}
        <div className="text-center rounded-lg bg-[#12100c] border border-[#3a3028] px-2 py-1.5">
          <p className="text-xs font-bold text-[#e8d5b5]">{opp.sell_city}</p>
          <p className="text-sm font-mono text-[#c8a84e]">{formatSilver(Number(opp.sell_price))}</p>
        </div>

        {/* Profit */}
        <div className="text-right">
          <p className={cn("text-base font-bold", marginColor(pct))}>
            +{formatSilver(Number(opp.margin_net))}
          </p>
          <p className={cn("text-[10px] font-medium", marginColor(pct))}>
            {pct}% retorno
          </p>
        </div>

        {/* Risk */}
        <div className="text-right">
          <p className={cn("text-xs font-medium", risk.color)}>{risk.label}</p>
        </div>
      </div>

      {/* Helper text for beginners */}
      <div className="px-4 pb-2 -mt-1">
        <p className="text-[10px] text-[#8b7635]">
          {"Compre " + itemName + " em " + opp.buy_city + " por " + formatSilver(Number(opp.buy_price)) + ", viaje ate " + opp.sell_city + " e venda por " + formatSilver(Number(opp.sell_price)) + ". " + risk.desc + "."}
        </p>
      </div>
    </div>
  );
}
