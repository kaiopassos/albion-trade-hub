"use client";

import { PlotSelector, PLOT_TYPES } from "./plot-selector";
import { formatSilver } from "@/lib/utils";

interface Plot { id: number; type: string; }
interface IslandGridProps { plots: Plot[]; onPlotChange: (plotId: number, type: string) => void; }

export function IslandGrid({ plots, onPlotChange }: IslandGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {plots.map((plot) => {
        const plotType = PLOT_TYPES.find((t) => t.value === plot.type);
        const dailyReturn = plotType?.dailyReturn || 0;
        return (
          <div key={plot.id} className="rounded-lg border border-dashed border-[#3a3028] bg-[#241e18] p-3 space-y-2 hover:border-[#c8a84e]/30 transition-colors">
            <p className="text-xs text-[#8b7635]">Plot {plot.id}</p>
            <PlotSelector value={plot.type} onChange={(v) => onPlotChange(plot.id, v)} />
            {dailyReturn > 0 && <p className="text-xs text-[#c8a84e]">~{formatSilver(dailyReturn)}/dia</p>}
          </div>
        );
      })}
    </div>
  );
}
