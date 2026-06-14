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
    { label: "Plots ativos", value: `${activePlots}/${plots.length}`, color: "text-[#e8dcc8]" },
    { label: "Retorno diario", value: formatSilver(totalDaily), color: "text-[#c8a84e]" },
    { label: "Retorno semanal", value: formatSilver(totalDaily * 7), color: "text-[#c8a84e]" },
    { label: "Retorno mensal", value: formatSilver(totalDaily * 30), color: "text-green-400" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-lg border border-[#2a2f3e] bg-[#181c28] p-4">
          <p className="text-xs text-[#8b7635] mb-1">{s.label}</p>
          <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}
