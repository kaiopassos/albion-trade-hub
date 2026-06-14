import { formatSilver } from "@/lib/utils";

const PREMIUM_COST = 9_000_000;

export function PremiumProgress({ totalProfit }: { totalProfit: number }) {
  const progress = Math.min(100, (Math.max(0, totalProfit) / PREMIUM_COST) * 100);
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 space-y-2">
      <h3 className="text-sm font-medium text-white">Progresso Premium</h3>
      <div className="flex justify-between text-sm">
        <span className="text-white">{formatSilver(Math.max(0, totalProfit))}</span>
        <span className="text-neutral-500">{formatSilver(PREMIUM_COST)}</span>
      </div>
      <div className="h-3 w-full rounded-full bg-neutral-800 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-xs text-neutral-500 text-center">{progress.toFixed(1)}% do custo de premium</p>
    </div>
  );
}
