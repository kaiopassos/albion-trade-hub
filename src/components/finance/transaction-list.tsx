import { formatSilver } from "@/lib/utils";

interface Transaction { id: string; type: string; city: string; price: number; quantity: number; total: number; notes: string | null; created_at: string; }

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) return <p className="text-neutral-400 text-sm">Nenhuma transacao registrada.</p>;

  return (
    <div className="rounded-lg border border-neutral-800 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-neutral-900">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Tipo</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Cidade</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-neutral-400 uppercase">Preco</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-neutral-400 uppercase">Qtd</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-neutral-400 uppercase">Total</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Notas</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-neutral-400 uppercase">Data</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-neutral-800/50">
              <td className="px-4 py-3">
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${tx.type === "buy" ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                  {tx.type === "buy" ? "Compra" : "Venda"}
                </span>
              </td>
              <td className="px-4 py-3 text-white">{tx.city}</td>
              <td className="px-4 py-3 text-right font-mono text-white">{formatSilver(Number(tx.price))}</td>
              <td className="px-4 py-3 text-right text-white">{tx.quantity}</td>
              <td className="px-4 py-3 text-right font-mono font-bold text-white">{formatSilver(Number(tx.total))}</td>
              <td className="px-4 py-3 text-xs text-neutral-500 max-w-[150px] truncate">{tx.notes || "—"}</td>
              <td className="px-4 py-3 text-right text-xs text-neutral-500">{new Date(tx.created_at).toLocaleDateString("pt-BR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
