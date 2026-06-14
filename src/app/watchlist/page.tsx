import { WatchlistTable } from "@/components/watchlist/watchlist-table";

export default function WatchlistPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Watchlist</h2>
        <p className="text-neutral-400 text-sm">
          Itens monitorados. Configure o threshold de margem minima para cada item.
        </p>
      </div>
      <WatchlistTable />
    </div>
  );
}
