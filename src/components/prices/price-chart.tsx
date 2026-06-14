"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface PriceHistory { date: string; price: number; }

export function PriceChart({ data }: { data: PriceHistory[] }) {
  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-800 p-6">
        <p className="text-neutral-400 text-sm">Sem dados de historico.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-800 p-4">
      <h3 className="text-sm font-medium text-white mb-4">Historico de Precos</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#888" }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 11, fill: "#888" }} tickFormatter={(v: number) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `${v}`} />
          <Tooltip contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333", borderRadius: "8px" }} labelStyle={{ color: "#888" }} formatter={(value: number) => [`${value.toLocaleString()} silver`, "Preco"]} />
          <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
