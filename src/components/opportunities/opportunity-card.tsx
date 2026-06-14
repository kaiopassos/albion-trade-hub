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

function marginColor(pct: number): string {
  if (pct >= 30) return "text-green-400";
  if (pct >= 15) return "text-[#c8a84e]";
  return "text-[#a89070]";
}

export function OpportunityTableHeader() {
  return (
    <div className="grid grid-cols-[40px_1fr_160px_160px_120px_60px] items-center gap-2 px-4 py-2.5 text-[10px] text-[#8b7635] uppercase tracking-wider border-b border-[#3a3028] bg-[#12100c]">
      <span>#</span>
      <span>Item</span>
      <span className="text-center">Comprar</span>
      <span className="text-center">Vender</span>
      <span className="text-right">Lucro</span>
      <span className="text-right">%</span>
    </div>
  );
}

export function OpportunityCard({ opp, rank }: { opp: Opportunity; rank: number }) {
  const itemIcon = `https://render.albiononline.com/v1/item/${opp.buy_item_id}.png?size=50&quality=1`;
  const tierMatch = opp.buy_item_id.match(/^T(\d)/);
  const tier = tierMatch ? `T${tierMatch[1]}` : "";
  const itemName = getItemName(opp.buy_item_id);
  const tierBadge = getTierBadgeColor(opp.buy_item_id);
  const pct = Number(opp.margin_pct);

  const rankStyle = rank === 1
    ? "bg-[#c8a84e] text-[#12100c]"
    : rank === 2
    ? "bg-[#a89070] text-[#12100c]"
    : rank === 3
    ? "bg-[#8b7635] text-[#12100c]"
    : "bg-[#3a3028] text-[#8b7635]";

  return (
    <div className="grid grid-cols-[40px_1fr_160px_160px_120px_60px] items-center gap-2 px-4 py-3 border-b border-[#3a3028]/50 hover:bg-[#2e2620] transition-colors">
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
          <p className="text-[10px] text-[#8b7635]">{opp.buy_item_id}</p>
        </div>
      </div>

      {/* Buy */}
      <div className="text-center">
        <p className="text-sm font-mono font-semibold text-[#e8d5b5]">{formatSilver(Number(opp.buy_price))}</p>
        <p className="text-[10px] text-[#8b7635]">{opp.buy_city}</p>
      </div>

      {/* Sell */}
      <div className="text-center">
        <p className="text-sm font-mono font-semibold text-[#e8d5b5]">{formatSilver(Number(opp.sell_price))}</p>
        <p className="text-[10px] text-[#8b7635]">{opp.sell_city}</p>
      </div>

      {/* Profit */}
      <p className={cn("text-right text-sm font-bold", marginColor(pct))}>
        +{formatSilver(Number(opp.margin_net))}
      </p>

      {/* Margin % */}
      <p className={cn("text-right text-sm font-bold", marginColor(pct))}>
        +{pct}%
      </p>
    </div>
  );
}
