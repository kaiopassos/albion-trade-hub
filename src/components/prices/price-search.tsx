"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Item { id: string; name: string; tier: number; }
interface PriceSearchProps { onSelect: (itemId: string) => void; }

export function PriceSearch({ onSelect }: PriceSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    const timer = setTimeout(async () => {
      const supabase = createClient();
      const { data } = await supabase.from("items").select("id, name, tier")
        .or(`name.ilike.%${query}%,id.ilike.%${query}%`)
        .order("tier", { ascending: true }).limit(20);
      setResults(data || []);
      setOpen(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full max-w-md">
      <input
        placeholder="Buscar item (ex: Titanium, T4_BAG)..."
        className="w-full rounded-md border border-[#3a3028] bg-[#12100c] px-3 py-2 text-sm text-[#e8d5b5] placeholder:text-[#8b7635] focus:border-[#c8a84e] focus:outline-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
      />
      {open && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-[#3a3028] bg-[#12100c] shadow-lg max-h-60 overflow-auto">
          {results.map((item) => (
            <button key={item.id}
              className="w-full px-3 py-2 text-left text-sm text-[#e8d5b5] hover:bg-[#241e18] transition-colors"
              onMouseDown={() => { onSelect(item.id); setQuery(item.name); setOpen(false); }}
            >
              <span className="text-[#8b7635]">T{item.tier}</span>{" "}
              <span className="font-medium">{item.name}</span>{" "}
              <span className="text-xs text-[#8b7635]">{item.id}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
