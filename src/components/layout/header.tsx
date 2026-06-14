"use client";

import { useEffect, useState } from "react";
import { Bell, Swords } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function Header() {
  const [newOppsCount, setNewOppsCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("new-opportunities")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "opportunities", filter: "status=eq.active" },
        () => { setNewOppsCount((prev) => prev + 1); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <header className="flex h-14 items-center justify-between border-b border-[#2a2f3e] bg-[#12151e] px-6">
      <div className="flex items-center gap-2 text-[#8b7635]">
        <Swords className="h-4 w-4" />
        <span className="text-xs">Market Scanner Ativo</span>
        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
      </div>
      <button
        className="relative rounded-lg p-2 text-[#a89878] hover:bg-[#1e2230] hover:text-[#c8a84e] transition-colors"
        onClick={() => setNewOppsCount(0)}
      >
        <Bell className="h-5 w-5" />
        {newOppsCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#8b2020] text-xs font-bold text-white animate-pulse">
            {newOppsCount > 9 ? "9+" : newOppsCount}
          </span>
        )}
      </button>
    </header>
  );
}
