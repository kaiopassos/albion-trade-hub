"use client";

interface FiltersProps {
  type: string;
  minMargin: string;
  category: string;
  tier: string;
  sortBy: string;
  onTypeChange: (value: string) => void;
  onMinMarginChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTierChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

const TRADE_TABS = [
  { id: "all", label: "FLIP" },
  { id: "city", label: "CITY FLIP" },
  { id: "time", label: "TIME FLIP" },
  { id: "craft", label: "CRAFT TRADES" },
];

const CATEGORIES = [
  { value: "all", label: "Todas" },
  { value: "material", label: "Materiais" },
  { value: "resource", label: "Recursos" },
  { value: "weapon", label: "Armas" },
  { value: "armor", label: "Armaduras" },
  { value: "accessory", label: "Acessorios" },
  { value: "consumable", label: "Consumiveis" },
  { value: "mount", label: "Montarias" },
];

const TIERS = [
  { value: "all", label: "Todos" },
  { value: "4", label: "T4" },
  { value: "5", label: "T5" },
  { value: "6", label: "T6" },
  { value: "7", label: "T7" },
  { value: "8", label: "T8" },
];

const SORT_OPTIONS = [
  { value: "margin_net", label: "Lucro" },
  { value: "margin_pct", label: "Margem %" },
  { value: "buy_price", label: "Preco" },
];

const selectClass = "rounded-lg border border-[#3a3028] bg-[#12100c] px-3 py-2 text-xs text-[#e8d5b5] focus:border-[#c8a84e] focus:outline-none";

export function OpportunityFilters({ type, minMargin, category, tier, sortBy, onTypeChange, onMinMarginChange, onCategoryChange, onTierChange, onSortChange }: FiltersProps) {
  return (
    <div className="space-y-3">
      {/* Warning banner */}
      <div className="rounded-lg border border-[#c8a84e]/20 bg-[#c8a84e]/5 px-4 py-2.5 flex items-center gap-2">
        <span className="text-[#c8a84e] text-sm">&#9888;</span>
        <p className="text-[11px] text-[#a89070]">
          <span className="text-[#c8a84e] font-medium">Atencao:</span> O mercado e dinamico. Confirme os precos atuais no jogo antes de comprar.
        </p>
      </div>

      {/* Search bar with filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <select value={category} onChange={(e) => onCategoryChange(e.target.value)} className={selectClass}>
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <select value={tier} onChange={(e) => onTierChange(e.target.value)} className={selectClass}>
          <option value="all">Grau</option>
          {TIERS.filter(t => t.value !== "all").map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <input
          type="number"
          placeholder="Margem min %"
          className="w-28 rounded-lg border border-[#3a3028] bg-[#12100c] px-3 py-2 text-xs text-[#e8d5b5] placeholder:text-[#8b7635] focus:border-[#c8a84e] focus:outline-none"
          value={minMargin}
          onChange={(e) => onMinMarginChange(e.target.value)}
        />
        <div className="flex-1" />
        <select value={sortBy} onChange={(e) => onSortChange(e.target.value)} className={selectClass}>
          {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>Ordenar: {s.label}</option>)}
        </select>
      </div>

      {/* Trade type tabs */}
      <div className="flex gap-1">
        {TRADE_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTypeChange(tab.id)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              type === tab.id
                ? "bg-[#c8a84e] text-[#1a1410]"
                : "bg-[#241e18] text-[#8b7635] hover:text-[#a89070] border border-[#3a3028]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
