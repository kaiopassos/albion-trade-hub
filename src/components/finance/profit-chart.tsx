"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Transaction { id: string; type: string; total: number; created_at: string; }

export function ProfitChart({ transactions }: { transactions: Transaction[] }) {
  const byDay = new Map<string, { buy: number; sell: number }>();
  for (const tx of transactions) {
    const day = new Date(tx.created_at).toLocaleDateString("pt-BR");
    const entry = byDay.get(day) || { buy: 0, sell: 0 };
    if (tx.type === "buy") entry.buy += Number(tx.total);
    else entry.sell += Number(tx.total);
    byDay.set(day, entry);
  }
  const data = Array.from(byDay.entries()).map(([day, { buy, sell }]) => ({ day, lucro: sell - buy }));
  if (data.length === 0) return null;

  return (
    <div className="rounded-lg border border-neutral-800 p-4">
      <h3 className="text-sm font-medium text-white mb-4">Lucro Diario</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#888" }} />
          <YAxis tick={{ fontSize: 11, fill: "#888" }} tickFormatter={(v) => Number(v) >= 1000000 ? `${(Number(v) / 1000000).toFixed(1)}M` : Number(v) >= 1000 ? `${(Number(v) / 1000).toFixed(0)}K` : `${v}`} />
          <Tooltip contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333", borderRadius: "8px" }} formatter={(value) => [`${Number(value).toLocaleString()} silver`, "Lucro"]} />
          <Bar dataKey="lucro" fill="#22c55e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
