import { formatSilver } from "@/lib/utils";

interface PriceByCity { city: string; sell_price_min: number; buy_price_max: number; fetched_at: string; }

export function PriceTable({ prices }: { prices: PriceByCity[] }) {
  if (prices.length === 0) return null;
  const minPrice = Math.min(...prices.map((p) => p.sell_price_min).filter((p) => p > 0));
  const maxPrice = Math.max(...prices.map((p) => p.sell_price_min));

  return (
    <div className="rounded-lg border border-[#3a3028] overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-[#12100c]">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-[#8b7635] uppercase">Cidade</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-[#8b7635] uppercase">Sell Min</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-[#8b7635] uppercase">Buy Max</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-[#8b7635] uppercase">Atualizado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#3a3028]">
          {prices.map((p) => (
            <tr key={p.city} className="hover:bg-[#241e18]">
              <td className="px-4 py-3 font-medium text-[#e8d5b5]">{p.city}</td>
              <td className={`px-4 py-3 text-right font-mono ${p.sell_price_min === minPrice ? "text-green-400 font-bold" : p.sell_price_min === maxPrice ? "text-red-400" : "text-[#e8d5b5]"}`}>
                {formatSilver(p.sell_price_min)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-[#e8d5b5]">{formatSilver(p.buy_price_max)}</td>
              <td className="px-4 py-3 text-right text-xs text-[#8b7635]">{new Date(p.fetched_at).toLocaleTimeString("pt-BR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
