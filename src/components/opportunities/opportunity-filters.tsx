"use client";

import { Search } from "lucide-react";

interface FiltersProps {
  type: string;
  minMargin: string;
  category: string;
  tier: string;
  sortBy: string;
  search: string;
  onTypeChange: (value: string) => void;
  onMinMarginChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTierChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

const TRADE_TABS = [
  { id: "all", label: "FLIP", color: "bg-[#241e18] border-[#3a3028] text-[#a89070]" },
  { id: "city", label: "CITY FLIP", color: "bg-[#8b2020]/80 border-[#8b2020] text-[#e8d5b5]" },
  { id: "time", label: "TIME FLIP", color: "bg-[#2d5a27]/80 border-[#2d5a27] text-[#e8d5b5]" },
  { id: "craft", label: "CRAFT TRADES", color: "bg-[#1a4a6b]/80 border-[#1a4a6b] text-[#e8d5b5]" },
];

const CATEGORIES = [
  { value: "all", label: "Categoria" },
  { value: "material", label: "Materiais" },
  { value: "resource", label: "Recursos" },
  { value: "weapon", label: "Armas" },
  { value: "armor", label: "Armaduras" },
  { value: "accessory", label: "Acessorios" },
  { value: "consumable", label: "Consumiveis" },
  { value: "mount", label: "Montarias" },
];

const TIERS = [
  { value: "all", label: "Grau" },
  { value: "3", label: "T3" },
  { value: "4", label: "T4" },
  { value: "5", label: "T5" },
  { value: "6", label: "T6" },
  { value: "7", label: "T7" },
  { value: "8", label: "T8" },
];

const selectClass = "appearance-none rounded-lg border border-[#3a3028] bg-[#241e18] px-3 py-2.5 text-xs text-[#e8d5b5] focus:border-[#c8a84e] focus:outline-none cursor-pointer hover:border-[#c8a84e]/50 transition-colors";

export function OpportunityFilters({ type, minMargin, category, tier, sortBy, search, onTypeChange, onMinMarginChange, onCategoryChange, onTierChange, onSortChange, onSearchChange }: FiltersProps) {
  return (
    <div className="space-y-3">
      {/* Search + filters row (like AlbionMarketHub) */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8b7635]" />
          <input
            type="text"
            placeholder="Procurar..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-40 rounded-lg border border-[#3a3028] bg-[#241e18] pl-9 pr-3 py-2.5 text-xs text-[#e8d5b5] placeholder:text-[#8b7635] focus:border-[#c8a84e] focus:outline-none"
          />
        </div>
        <select value={category} onChange={(e) => onCategoryChange(e.target.value)} className={selectClass}>
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <select value={tier} onChange={(e) => onTierChange(e.target.value)} className={selectClass}>
          {TIERS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <input
          type="number"
          placeholder="Margem min %"
          className="w-28 rounded-lg border border-[#3a3028] bg-[#241e18] px-3 py-2.5 text-xs text-[#e8d5b5] placeholder:text-[#8b7635] focus:border-[#c8a84e] focus:outline-none"
          value={minMargin}
          onChange={(e) => onMinMarginChange(e.target.value)}
        />
        <div className="flex-1" />
        <select value={sortBy} onChange={(e) => onSortChange(e.target.value)} className={selectClass}>
          <option value="margin_net">Ordenar: Lucro</option>
          <option value="margin_pct">Ordenar: Margem %</option>
          <option value="buy_price">Ordenar: Preco</option>
        </select>
      </div>

      {/* Trade type tabs (colored like AlbionMarketHub) */}
      <div className="flex items-center gap-2">
        {TRADE_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTypeChange(tab.id)}
            className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider rounded-lg border transition-all ${
              type === tab.id
                ? tab.color + " ring-1 ring-white/10"
                : "bg-[#241e18] text-[#8b7635] border-[#3a3028] hover:text-[#a89070]"
            }`}
          >
            {tab.label}
          </button>
        ))}

        <div className="flex-1" />

        {/* Warning inline */}
        <p className="text-[10px] text-[#8b7635] max-w-md">
          ⚠ Confirme os precos no jogo antes de comprar. Oportunidades podem ser arrematadas rapidamente.
        </p>
      </div>
    </div>
  );
}
