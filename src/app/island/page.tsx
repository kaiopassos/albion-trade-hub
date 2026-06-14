"use client";

import { useEffect, useState } from "react";
import { IslandGrid } from "@/components/island/island-grid";
import { RoiCalculator } from "@/components/island/roi-calculator";
import { createClient } from "@/lib/supabase/client";

interface Plot { id: number; type: string; }

const DEFAULT_PLOTS: Plot[] = Array.from({ length: 9 }, (_, i) => ({ id: i + 1, type: "empty" }));

export default function IslandPage() {
  const [plots, setPlots] = useState<Plot[]>(DEFAULT_PLOTS);
  const [configId, setConfigId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("island_config").select("*").limit(1).single();
      if (data) { setConfigId(data.id); setPlots(data.plots as Plot[]); }
    };
    load();
  }, []);

  const handlePlotChange = (plotId: number, type: string) => {
    setPlots((prev) => prev.map((p) => (p.id === plotId ? { ...p, type } : p)));
  };

  const handleSave = async () => {
    const supabase = createClient();
    if (configId) {
      await supabase.from("island_config").update({ plots, updated_at: new Date().toISOString() }).eq("id", configId);
    } else {
      const { data } = await supabase.from("island_config").insert({ plots, island_tier: 1 }).select("id").single();
      if (data) setConfigId(data.id);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Ilha</h2>
          <p className="text-neutral-400 text-sm">Configure seus plots e veja o retorno estimado.</p>
        </div>
        <button onClick={handleSave} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          {saved ? "Salvo!" : "Salvar"}
        </button>
      </div>
      <RoiCalculator plots={plots} />
      <IslandGrid plots={plots} onPlotChange={handlePlotChange} />
    </div>
  );
}
