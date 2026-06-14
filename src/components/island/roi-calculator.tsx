import { PLOT_TYPES } from "./plot-selector";
import { formatSilver } from "@/lib/utils";

interface Plot { id: number; type: string; }

export function RoiCalculator({ plots }: { plots: Plot[] }) {
  const totalDaily = plots.reduce((sum, plot) => {
    const pt = PLOT_TYPES.find((t) => t.value === plot.type);
    return sum + (pt?.dailyReturn || 0);
  }, 0);
  const activePlots = plots.filter((p) => p.type !== "empty").length;

  const stats = [
    { label: "Plots ativos", value: `${activePlots}/${plots.length}`, color: "text-white" },
    { label: "Retorno diario", value: formatSilver(totalDaily), color: "text-green-400" },
    { label: "Retorno semanal", value: formatSilver(totalDaily * 7), color: "text-green-400" },
    { label: "Retorno mensal", value: formatSilver(totalDaily * 30), color: "text-green-400" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
          <p className="text-xs text-neutral-500 mb-1">{s.label}</p>
          <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}
