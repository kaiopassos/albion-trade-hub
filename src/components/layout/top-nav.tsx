"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/", label: "TRADES" },
  { href: "/prices", label: "PRECOS" },
  { href: "/builds", label: "BUILDS" },
  { href: "/island", label: "ILHA" },
  { href: "/finance", label: "FINANCEIRO" },
  { href: "/guide", label: "GUIA" },
  { href: "/assistant", label: "ASSISTENTE" },
  { href: "/watchlist", label: "WATCHLIST" },
  { href: "/settings", label: "CONFIG" },
];

export function TopNav() {
  const pathname = usePathname();
  const [newOpps, setNewOpps] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("new-opportunities")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "opportunities", filter: "status=eq.active" },
        () => { setNewOpps((prev) => prev + 1); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <header className="border-b border-[#3a3028] bg-[#12100c]">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#c8a84e] to-[#8b7635] flex items-center justify-center">
            <span className="text-sm font-black text-[#12100c]">AT</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-[#c8a84e] tracking-wide uppercase">Albion Trade Hub</h1>
            <p className="text-[10px] text-[#8b7635] uppercase tracking-wider">Market Scanner</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-[#8b7635]">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Scanner Ativo
          </div>
          <button onClick={() => setNewOpps(0)} className="relative p-2 rounded-lg text-[#a89070] hover:text-[#c8a84e] hover:bg-[#241e18] transition-colors">
            <Bell className="h-5 w-5" />
            {newOpps > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#8b2020] text-[10px] font-bold text-white animate-pulse">
                {newOpps > 9 ? "9+" : newOpps}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex gap-1 -mb-px">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2",
                  isActive
                    ? "border-[#c8a84e] text-[#c8a84e] bg-[#241e18]"
                    : "border-transparent text-[#8b7635] hover:text-[#e8d5b5] hover:bg-[#1e1812]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
