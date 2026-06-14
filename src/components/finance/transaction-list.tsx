import { formatSilver } from "@/lib/utils";

interface Transaction { id: string; type: string; city: string; price: number; quantity: number; total: number; notes: string | null; created_at: string; }

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) return <p className="text-[#8b7635] text-sm">Nenhuma transacao registrada.</p>;

  return (
    <div className="rounded-lg border border-[#3a3028] overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-[#12100c]">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#8b7635] uppercase">Tipo</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#8b7635] uppercase">Cidade</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-[#8b7635] uppercase">Preco</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-[#8b7635] uppercase">Qtd</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-[#8b7635] uppercase">Total</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#8b7635] uppercase">Notas</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-[#8b7635] uppercase">Data</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#3a3028]">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-[#241e18]">
              <td className="px-4 py-3">
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${tx.type === "buy" ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                  {tx.type === "buy" ? "Compra" : "Venda"}
                </span>
              </td>
              <td className="px-4 py-3 text-[#e8d5b5]">{tx.city}</td>
              <td className="px-4 py-3 text-right font-mono text-[#e8d5b5]">{formatSilver(Number(tx.price))}</td>
              <td className="px-4 py-3 text-right text-[#e8d5b5]">{tx.quantity}</td>
              <td className="px-4 py-3 text-right font-mono font-bold text-[#e8d5b5]">{formatSilver(Number(tx.total))}</td>
              <td className="px-4 py-3 text-xs text-[#8b7635] max-w-[150px] truncate">{tx.notes || "—"}</td>
              <td className="px-4 py-3 text-right text-xs text-[#8b7635]">{new Date(tx.created_at).toLocaleDateString("pt-BR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
