import { formatSilver } from "@/lib/utils";

interface PriceByCity { city: string; sell_price_min: number; buy_price_max: number; fetched_at: string; }

export function PriceTable({ prices }: { prices: PriceByCity[] }) {
  if (prices.length === 0) return null;
  const minPrice = Math.min(...prices.map((p) => p.sell_price_min).filter((p) => p > 0));
  const maxPrice = Math.max(...prices.map((p) => p.sell_price_min));

  return (
    <div className="rounded-lg border border-neutral-800 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-neutral-900">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Cidade</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-neutral-400 uppercase">Sell Min</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-neutral-400 uppercase">Buy Max</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-neutral-400 uppercase">Atualizado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {prices.map((p) => (
            <tr key={p.city} className="hover:bg-neutral-800/50">
              <td className="px-4 py-3 font-medium text-white">{p.city}</td>
              <td className={`px-4 py-3 text-right font-mono ${p.sell_price_min === minPrice ? "text-green-400 font-bold" : p.sell_price_min === maxPrice ? "text-red-400" : "text-white"}`}>
                {formatSilver(p.sell_price_min)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-white">{formatSilver(p.buy_price_max)}</td>
              <td className="px-4 py-3 text-right text-xs text-neutral-500">{new Date(p.fetched_at).toLocaleTimeString("pt-BR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
