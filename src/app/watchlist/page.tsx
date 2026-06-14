import { WatchlistTable } from "@/components/watchlist/watchlist-table";

export default function WatchlistPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#e8d5b5]">Watchlist</h2>
        <p className="text-[#8b7635] text-sm">
          Itens monitorados. Configure o threshold de margem minima para cada item.
        </p>
      </div>
      <WatchlistTable />
    </div>
  );
}
