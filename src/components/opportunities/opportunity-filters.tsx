"use client";

interface FiltersProps {
  type: string;
  minMargin: string;
  onTypeChange: (value: string) => void;
  onMinMarginChange: (value: string) => void;
}

export function OpportunityFilters({ type, minMargin, onTypeChange, onMinMarginChange }: FiltersProps) {
  return (
    <div className="flex items-end gap-4">
      <div className="space-y-1">
        <label className="text-xs text-neutral-400">Tipo de flip</label>
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="all">Todos</option>
          <option value="city">City Flip</option>
          <option value="time">Time Flip</option>
          <option value="craft">Craft Flip</option>
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-xs text-neutral-400">Margem minima (%)</label>
        <input
          type="number"
          placeholder="0"
          className="w-[120px] rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
          value={minMargin}
          onChange={(e) => onMinMarginChange(e.target.value)}
        />
      </div>
    </div>
  );
}
