"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface PriceHistory { date: string; price: number; }

export function PriceChart({ data }: { data: PriceHistory[] }) {
  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-[#3a3028] p-6">
        <p className="text-[#8b7635] text-sm">Sem dados de historico.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#3a3028] p-4">
      <h3 className="text-sm font-medium text-[#e8d5b5] mb-4">Historico de Precos</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3a3028" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#8b7635" }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 11, fill: "#8b7635" }} tickFormatter={(v) => Number(v) >= 1000000 ? `${(Number(v) / 1000000).toFixed(1)}M` : Number(v) >= 1000 ? `${(Number(v) / 1000).toFixed(0)}K` : `${v}`} />
          <Tooltip contentStyle={{ backgroundColor: "#241e18", border: "1px solid #3a3028", borderRadius: "8px" }} labelStyle={{ color: "#8b7635" }} formatter={(value) => [`${Number(value).toLocaleString()} silver`, "Preco"]} />
          <Line type="monotone" dataKey="price" stroke="#c8a84e" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
