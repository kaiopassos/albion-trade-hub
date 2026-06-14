"use client";

import { useEffect, useState } from "react";
import { IslandGrid } from "@/components/island/island-grid";
import { RoiCalculator } from "@/components/island/roi-calculator";
import { CITY_BONUSES, FARM_CROPS, FARM_ANIMALS, getRecommendation } from "@/lib/island-data";
import { createClient } from "@/lib/supabase/client";
import { formatSilver } from "@/lib/utils";
import { Palmtree, MapPin, Lightbulb, Sprout, PawPrint } from "lucide-react";

interface Plot { id: number; type: string; }

const DEFAULT_PLOTS: Plot[] = Array.from({ length: 9 }, (_, i) => ({ id: i + 1, type: "empty" }));

export default function IslandPage() {
  const [plots, setPlots] = useState<Plot[]>(DEFAULT_PLOTS);
  const [configId, setConfigId] = useState<string | null>(null);
  const [islandTier, setIslandTier] = useState(3);
  const [selectedCity, setSelectedCity] = useState("Lymhurst");
  const [silverBudget, setSilverBudget] = useState(100000);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"plots" | "guide" | "crops">("plots");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("island_config").select("*").limit(1).single();
      if (data) { setConfigId(data.id); setPlots(data.plots as Plot[]); setIslandTier(data.island_tier); }
    };
    load();
  }, []);

  const handlePlotChange = (plotId: number, type: string) => {
    setPlots((prev) => prev.map((p) => (p.id === plotId ? { ...p, type } : p)));
  };

  const handleSave = async () => {
    const supabase = createClient();
    if (configId) {
      await supabase.from("island_config").update({ plots, island_tier: islandTier, updated_at: new Date().toISOString() }).eq("id", configId);
    } else {
      const { data } = await supabase.from("island_config").insert({ plots, island_tier: islandTier }).select("id").single();
      if (data) setConfigId(data.id);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const recommendations = getRecommendation(silverBudget, islandTier, selectedCity);
  const cityBonus = CITY_BONUSES.find(c => c.city === selectedCity);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-[#c8a84e]/10 p-2 border border-[#c8a84e]/20">
            <Palmtree className="h-6 w-6 text-[#c8a84e]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#e8dcc8]">Ilha</h2>
            <p className="text-[#8b7635] text-sm">Planeje sua ilha e maximize o retorno.</p>
          </div>
        </div>
        <button onClick={handleSave} className="rounded-lg bg-[#c8a84e] px-4 py-2 text-sm font-medium text-[#0c0e14] hover:bg-[#d4b85e] transition-colors">
          {saved ? "Salvo!" : "Salvar"}
        </button>
      </div>

      {/* Config bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-[#2a2f3e] bg-[#181c28] p-4 space-y-2">
          <label className="text-xs text-[#8b7635]">Cidade da Ilha</label>
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full rounded-lg border border-[#2a2f3e] bg-[#12151e] px-3 py-2 text-sm text-[#e8dcc8]">
            {CITY_BONUSES.map(c => <option key={c.city} value={c.city}>{c.city}</option>)}
          </select>
        </div>
        <div className="rounded-lg border border-[#2a2f3e] bg-[#181c28] p-4 space-y-2">
          <label className="text-xs text-[#8b7635]">Tier da Ilha</label>
          <select value={islandTier} onChange={(e) => setIslandTier(Number(e.target.value))}
            className="w-full rounded-lg border border-[#2a2f3e] bg-[#12151e] px-3 py-2 text-sm text-[#e8dcc8]">
            {[1,2,3,4,5,6].map(t => <option key={t} value={t}>Tier {t} ({t+2} plots)</option>)}
          </select>
        </div>
        <div className="rounded-lg border border-[#2a2f3e] bg-[#181c28] p-4 space-y-2">
          <label className="text-xs text-[#8b7635]">Silver Disponivel</label>
          <input type="number" value={silverBudget} onChange={(e) => setSilverBudget(Number(e.target.value))}
            className="w-full rounded-lg border border-[#2a2f3e] bg-[#12151e] px-3 py-2 text-sm text-[#e8dcc8]" />
        </div>
      </div>

      {/* City bonus card */}
      {cityBonus && (
        <div className="rounded-lg border border-[#c8a84e]/20 bg-[#c8a84e]/5 p-4 flex items-start gap-3">
          <MapPin className="h-5 w-5 text-[#c8a84e] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-[#c8a84e]">{cityBonus.city} — {cityBonus.resourceBonus}</p>
            <p className="text-xs text-[#a89878] mt-1">{cityBonus.description}</p>
            <div className="flex gap-2 mt-2">
              {cityBonus.bestFor.map(b => (
                <span key={b} className="rounded bg-[#c8a84e]/10 px-2 py-0.5 text-[10px] text-[#c8a84e] border border-[#c8a84e]/20">{b}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#2a2f3e] pb-2">
        {[
          { id: "plots" as const, label: "Meus Plots", icon: Palmtree },
          { id: "crops" as const, label: "Cultivos & Animais", icon: Sprout },
          { id: "guide" as const, label: "Recomendacoes", icon: Lightbulb },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id ? "bg-[#181c28] text-[#c8a84e] border border-[#2a2f3e] border-b-transparent" : "text-[#8b7635] hover:text-[#a89878]"
            }`}>
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "plots" && (
        <>
          <RoiCalculator plots={plots} />
          <IslandGrid plots={plots} onPlotChange={handlePlotChange} />
        </>
      )}

      {activeTab === "crops" && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sprout className="h-4 w-4 text-green-400" />
              <h3 className="text-sm font-medium text-[#e8dcc8]">Plantacoes</h3>
            </div>
            <div className="rounded-lg border border-[#2a2f3e] overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#12151e]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#8b7635] uppercase">Crop</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-[#8b7635] uppercase">Tier</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-[#8b7635] uppercase">Custo Semente</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-[#8b7635] uppercase">Tempo</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-[#8b7635] uppercase">Retorno Est.</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-[#8b7635] uppercase">Lucro</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#8b7635] uppercase">Notas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2f3e]">
                  {FARM_CROPS.map(crop => (
                    <tr key={crop.id} className="hover:bg-[#1e2230]">
                      <td className="px-4 py-3 font-medium text-[#e8dcc8]">{crop.name}</td>
                      <td className="px-4 py-3 text-center text-[#a89878]">T{crop.tier}</td>
                      <td className="px-4 py-3 text-right font-mono text-[#a89878]">{formatSilver(crop.seedCost)}</td>
                      <td className="px-4 py-3 text-center text-[#a89878]">{crop.growthTime}</td>
                      <td className="px-4 py-3 text-right font-mono text-[#c8a84e]">{formatSilver(crop.estimatedReturn)}</td>
                      <td className="px-4 py-3 text-right font-mono text-green-400">+{formatSilver(crop.estimatedReturn - crop.seedCost)}</td>
                      <td className="px-4 py-3 text-xs text-[#8b7635]">{crop.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <PawPrint className="h-4 w-4 text-[#c8a84e]" />
              <h3 className="text-sm font-medium text-[#e8dcc8]">Criacoes</h3>
            </div>
            <div className="rounded-lg border border-[#2a2f3e] overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#12151e]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#8b7635] uppercase">Animal</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-[#8b7635] uppercase">Tier</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-[#8b7635] uppercase">Custo Filhote</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-[#8b7635] uppercase">Tempo</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-[#8b7635] uppercase">Retorno Est.</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-[#8b7635] uppercase">Lucro</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#8b7635] uppercase">Notas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2f3e]">
                  {FARM_ANIMALS.map(animal => (
                    <tr key={animal.id} className="hover:bg-[#1e2230]">
                      <td className="px-4 py-3 font-medium text-[#e8dcc8]">{animal.name}</td>
                      <td className="px-4 py-3 text-center text-[#a89878]">T{animal.tier}</td>
                      <td className="px-4 py-3 text-right font-mono text-[#a89878]">{formatSilver(animal.seedCost)}</td>
                      <td className="px-4 py-3 text-center text-[#a89878]">{animal.growthTime}</td>
                      <td className="px-4 py-3 text-right font-mono text-[#c8a84e]">{formatSilver(animal.estimatedReturn)}</td>
                      <td className="px-4 py-3 text-right font-mono text-green-400">+{formatSilver(animal.estimatedReturn - animal.seedCost)}</td>
                      <td className="px-4 py-3 text-xs text-[#8b7635]">{animal.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "guide" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-[#c8a84e]" />
            <h3 className="text-sm font-medium text-[#e8dcc8]">Recomendacoes para voce</h3>
            <span className="text-xs text-[#8b7635]">(Tier {islandTier} em {selectedCity}, {formatSilver(silverBudget)} silver)</span>
          </div>
          {recommendations.map((tip, i) => (
            <div key={i} className="rounded-lg border border-[#2a2f3e] bg-[#181c28] p-4 flex items-start gap-3">
              <span className="rounded-full bg-[#c8a84e]/10 px-2 py-0.5 text-xs text-[#c8a84e] font-bold shrink-0">{i + 1}</span>
              <p className="text-sm text-[#a89878]">{tip}</p>
            </div>
          ))}

          <div className="mt-6">
            <h3 className="text-sm font-medium text-[#e8dcc8] mb-3">Comparativo de Cidades</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CITY_BONUSES.map(city => (
                <div key={city.city} className={`rounded-lg border p-4 space-y-2 transition-colors ${
                  city.city === selectedCity ? "border-[#c8a84e]/40 bg-[#c8a84e]/5" : "border-[#2a2f3e] bg-[#181c28]"
                }`}>
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm text-[#e8dcc8]">{city.city}</p>
                    {city.city === selectedCity && <span className="text-[10px] bg-[#c8a84e] text-[#0c0e14] px-2 py-0.5 rounded font-bold">SUA ILHA</span>}
                  </div>
                  <p className="text-xs text-[#c8a84e]">{city.craftBonus}</p>
                  <p className="text-xs text-[#8b7635]">{city.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
