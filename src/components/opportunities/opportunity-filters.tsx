"use client";

interface FiltersProps {
  type: string;
  minMargin: string;
  onTypeChange: (value: string) => void;
  onMinMarginChange: (value: string) => void;
}

const TRADE_TABS = [
  { id: "all", label: "Todos", icon: "🔍" },
  { id: "city", label: "City Flip", icon: "🏰" },
  { id: "time", label: "Time Flip", icon: "⏰" },
  { id: "craft", label: "Craft Trades", icon: "⚒️" },
];

export function OpportunityFilters({ type, minMargin, onTypeChange, onMinMarginChange }: FiltersProps) {
  return (
    <div className="space-y-4">
      {/* Warning banner */}
      <div className="rounded-lg border border-[#c8a84e]/20 bg-[#c8a84e]/5 px-4 py-3 flex items-center gap-2">
        <span className="text-[#c8a84e]">⚠</span>
        <p className="text-xs text-[#a89070]">
          <span className="text-[#c8a84e] font-medium">Atencao:</span> O mercado e dinamico. Confirme os precos atuais no jogo antes de comprar, pois as oportunidades podem ser arrematadas rapidamente por outros jogadores.
        </p>
      </div>

      {/* Tabs + filters */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {TRADE_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTypeChange(tab.id)}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                type === tab.id
                  ? "bg-[#c8a84e]/10 text-[#c8a84e] border border-[#c8a84e]/30"
                  : "text-[#8b7635] hover:bg-[#2e2620] hover:text-[#a89070] border border-transparent"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-[#8b7635]">Margem min:</label>
          <input
            type="number"
            placeholder="0%"
            className="w-20 rounded-lg border border-[#3a3028] bg-[#12100c] px-2 py-1.5 text-sm text-[#e8d5b5] focus:border-[#c8a84e] focus:outline-none"
            value={minMargin}
            onChange={(e) => onMinMarginChange(e.target.value)}
          />
          <span className="text-xs text-[#8b7635]">%</span>
        </div>
      </div>
    </div>
  );
}
