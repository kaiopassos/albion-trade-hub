"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
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
    <header className="flex h-14 items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6">
      <div />
      <button
        className="relative rounded-md p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
        onClick={() => setNewOppsCount(0)}
      >
        <Bell className="h-5 w-5" />
        {newOppsCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white animate-pulse">
            {newOppsCount > 9 ? "9+" : newOppsCount}
          </span>
        )}
      </button>
    </header>
  );
}
