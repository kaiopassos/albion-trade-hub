"use client";

import { useEffect, useState } from "react";
import { Shield, Swords, Trophy } from "lucide-react";
import { formatSilver } from "@/lib/utils";

interface Build {
  rank: number;
  weapon: string;
  helmet: string;
  armor: string;
  shoes: string;
  cape: string;
  avgIP: number;
  kills: number;
  totalFame: number;
  players: string[];
}

function itemIcon(itemId: string) {
  if (!itemId) return null;
  return `https://render.albiononline.com/v1/item/${itemId}.png?size=45&quality=1`;
}

function rankStyle(rank: number) {
  if (rank === 1) return "border-[#c8a84e] bg-[#c8a84e]/5";
  if (rank === 2) return "border-[#a89878] bg-[#a89878]/5";
  if (rank === 3) return "border-[#8b7635] bg-[#8b7635]/5";
  return "border-[#2a2f3e] bg-[#181c28]";
}

function rankBadge(rank: number) {
  if (rank === 1) return "bg-[#c8a84e] text-[#0c0e14]";
  if (rank === 2) return "bg-[#a89878] text-[#0c0e14]";
  if (rank === 3) return "bg-[#8b7635] text-[#0c0e14]";
  return "bg-[#2a2f3e] text-[#a89878]";
}

export default function BuildsPage() {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEvents, setTotalEvents] = useState(0);

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        const res = await fetch("/api/builds");
        const data = await res.json();
        setBuilds(data.builds || []);
        setTotalEvents(data.totalEvents || 0);
      } catch {
        setBuilds([]);
      }
      setLoading(false);
    };
    fetchBuilds();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-[#c8a84e]/10 p-2 border border-[#c8a84e]/20">
            <Shield className="h-6 w-6 text-[#c8a84e]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#e8dcc8]">Meta Builds</h2>
            <p className="text-[#8b7635] text-sm">
              Builds mais usadas em PvP baseado em {totalEvents} eventos recentes.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 border-2 border-[#c8a84e]/30 border-t-[#c8a84e] rounded-full animate-spin" />
        </div>
      ) : builds.length === 0 ? (
        <div className="rounded-lg border border-[#2a2f3e] bg-[#181c28] p-12 text-center">
          <p className="text-[#8b7635]">Nao foi possivel carregar builds. Tente novamente.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {builds.map((build) => (
            <div key={build.rank} className={`rounded-lg border p-4 transition-all hover:border-[#c8a84e]/30 ${rankStyle(build.rank)}`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${rankBadge(build.rank)}`}>
                    #{build.rank}
                  </span>
                  {build.rank <= 3 && <Trophy className="h-4 w-4 text-[#c8a84e]" />}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#8b7635]">
                  <Swords className="h-3 w-3" />
                  <span>{build.kills} kills</span>
                </div>
              </div>

              {/* Equipment icons */}
              <div className="flex items-center gap-1 mb-3">
                {[build.weapon, build.helmet, build.armor, build.shoes, build.cape].map((item, i) => (
                  item ? (
                    <img key={i} src={itemIcon(item)!} alt={item} className="h-11 w-11 rounded border border-[#2a2f3e] bg-[#12151e]"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  ) : (
                    <div key={i} className="h-11 w-11 rounded border border-[#2a2f3e] bg-[#12151e]" />
                  )
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 text-xs">
                <span className="rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5">
                  IP {build.avgIP}
                </span>
                <span className="rounded bg-[#c8a84e]/10 text-[#c8a84e] border border-[#c8a84e]/20 px-2 py-0.5">
                  {formatSilver(build.totalFame)} fame
                </span>
              </div>

              {/* Players */}
              {build.players.length > 0 && (
                <div className="mt-2 text-[10px] text-[#8b7635]">
                  Jogadores: {build.players.join(", ")}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
