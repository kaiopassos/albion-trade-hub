"use client";

import { useEffect, useState, useCallback } from "react";
import { TransactionForm } from "@/components/finance/transaction-form";
import { TransactionList } from "@/components/finance/transaction-list";
import { ProfitChart } from "@/components/finance/profit-chart";
import { PremiumProgress } from "@/components/finance/premium-progress";
import { createClient } from "@/lib/supabase/client";
import { formatSilver } from "@/lib/utils";

interface Transaction {
  id: string; item_id: string | null; type: string; city: string;
  price: number; quantity: number; total: number; notes: string | null; created_at: string;
}

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("transactions").select("*").order("created_at", { ascending: false }).limit(200);
    setTransactions((data as Transaction[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const totalBuy = transactions.filter((t) => t.type === "buy").reduce((s, t) => s + Number(t.total), 0);
  const totalSell = transactions.filter((t) => t.type === "sell").reduce((s, t) => s + Number(t.total), 0);
  const totalProfit = totalSell - totalBuy;

  const stats = [
    { label: "Total Compras", value: formatSilver(totalBuy), color: "text-red-400" },
    { label: "Total Vendas", value: formatSilver(totalSell), color: "text-green-400" },
    { label: "Lucro Liquido", value: `${totalProfit >= 0 ? "+" : ""}${formatSilver(totalProfit)}`, color: totalProfit >= 0 ? "text-green-400" : "text-red-400" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Financeiro</h2>
        <p className="text-neutral-400 text-sm">Registre compras e vendas para acompanhar seu lucro.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
            <p className="text-xs text-neutral-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <PremiumProgress totalProfit={totalProfit} />
      <TransactionForm onSaved={fetchTransactions} />

      {!loading && (
        <>
          <ProfitChart transactions={transactions} />
          <TransactionList transactions={transactions} />
        </>
      )}
    </div>
  );
}
