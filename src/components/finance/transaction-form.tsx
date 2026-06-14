"use client";

import { useState } from "react";
import { CITIES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

interface TransactionFormProps { onSaved: () => void; }

export function TransactionForm({ onSaved }: TransactionFormProps) {
  const [type, setType] = useState<"buy" | "sell">("buy");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || !price) return;
    setSaving(true);
    const supabase = createClient();
    const priceNum = Number(price);
    const qtyNum = Number(quantity) || 1;
    await supabase.from("transactions").insert({ type, city, price: priceNum, quantity: qtyNum, total: priceNum * qtyNum, notes: notes || null, item_id: null });
    setPrice(""); setQuantity("1"); setNotes("");
    setSaving(false);
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-6 items-end">
      <div className="space-y-1">
        <label className="text-xs text-neutral-400">Tipo</label>
        <select value={type} onChange={(e) => setType(e.target.value as "buy" | "sell")} className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white">
          <option value="buy">Compra</option>
          <option value="sell">Venda</option>
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-xs text-neutral-400">Item</label>
        <input placeholder="Nome do item" className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-neutral-400">Cidade</label>
        <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white">
          <option value="">Cidade</option>
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-xs text-neutral-400">Preco unit.</label>
        <input type="number" placeholder="0" className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-neutral-400">Qtd</label>
        <input type="number" placeholder="1" className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      </div>
      <button type="submit" disabled={saving} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
        {saving ? "Salvando..." : "Registrar"}
      </button>
    </form>
  );
}
