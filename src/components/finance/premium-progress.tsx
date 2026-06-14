import { formatSilver } from "@/lib/utils";

const PREMIUM_COST = 9_000_000;

export function PremiumProgress({ totalProfit }: { totalProfit: number }) {
  const progress = Math.min(100, (Math.max(0, totalProfit) / PREMIUM_COST) * 100);
  return (
    <div className="rounded-lg border border-[#3a3028] bg-[#241e18] p-4 space-y-2">
      <h3 className="text-sm font-medium text-[#e8d5b5]">Progresso Premium</h3>
      <div className="flex justify-between text-sm">
        <span className="text-[#e8d5b5]">{formatSilver(Math.max(0, totalProfit))}</span>
        <span className="text-[#8b7635]">{formatSilver(PREMIUM_COST)}</span>
      </div>
      <div className="h-3 w-full rounded-full bg-[#12100c] overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-[#c8a84e] to-[#e8d5b5] transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-xs text-[#8b7635] text-center">{progress.toFixed(1)}% do custo de premium</p>
    </div>
  );
}
