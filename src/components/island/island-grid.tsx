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
          <div key={plot.id} className="rounded-lg border border-dashed border-neutral-700 bg-neutral-900/50 p-3 space-y-2">
            <p className="text-xs text-neutral-500">Plot {plot.id}</p>
            <PlotSelector value={plot.type} onChange={(v) => onPlotChange(plot.id, v)} />
            {dailyReturn > 0 && <p className="text-xs text-green-400">~{formatSilver(dailyReturn)}/dia</p>}
          </div>
        );
      })}
    </div>
  );
}
