"use client";

export const PLOT_TYPES = [
  { value: "empty", label: "Vazio", dailyReturn: 0 },
  { value: "carrot", label: "Cenoura (T2)", dailyReturn: 1500 },
  { value: "bean", label: "Feijao (T3)", dailyReturn: 3000 },
  { value: "wheat", label: "Trigo (T4)", dailyReturn: 6000 },
  { value: "turnip", label: "Nabo (T5)", dailyReturn: 12000 },
  { value: "cabbage", label: "Repolho (T6)", dailyReturn: 24000 },
  { value: "potato", label: "Batata (T7)", dailyReturn: 48000 },
  { value: "corn", label: "Milho (T8)", dailyReturn: 96000 },
  { value: "chicken", label: "Galinha (T3)", dailyReturn: 4000 },
  { value: "goat", label: "Cabra (T4)", dailyReturn: 8000 },
  { value: "goose", label: "Ganso (T5)", dailyReturn: 16000 },
  { value: "sheep", label: "Ovelha (T6)", dailyReturn: 32000 },
  { value: "pig", label: "Porco (T7)", dailyReturn: 64000 },
  { value: "cow", label: "Vaca (T8)", dailyReturn: 128000 },
  { value: "warrior_forge", label: "Forja de Guerreiro", dailyReturn: 0 },
  { value: "hunter_lodge", label: "Cabana de Cacador", dailyReturn: 0 },
  { value: "mage_tower", label: "Torre de Mago", dailyReturn: 0 },
  { value: "toolmaker", label: "Oficina de Ferramentas", dailyReturn: 0 },
] as const;

interface PlotSelectorProps { value: string; onChange: (value: string) => void; }

export function PlotSelector({ value, onChange }: PlotSelectorProps) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-[#3a3028] bg-[#12100c] px-2 py-1.5 text-xs text-[#e8d5b5] focus:border-[#c8a84e] focus:outline-none">
      {PLOT_TYPES.map((type) => (
        <option key={type.value} value={type.value}>{type.label}</option>
      ))}
    </select>
  );
}
