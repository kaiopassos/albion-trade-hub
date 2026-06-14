"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Bell, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const mainNav = [
  { href: "/", label: "TRADES" },
  { href: "/prices", label: "PRECOS" },
  { href: "/builds", label: "BUILDS" },
];

const moreItems = [
  { href: "/island", label: "Ilha" },
  { href: "/finance", label: "Financeiro" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/guide", label: "Guia" },
  { href: "/assistant", label: "Assistente IA" },
  { href: "/settings", label: "Configuracoes" },
];

export function TopNav() {
  const pathname = usePathname();
  const [newOpps, setNewOpps] = useState(0);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isMoreActive = moreItems.some(i => pathname === i.href || pathname.startsWith(i.href));

  return (
    <header className="border-b border-[#3a3028] bg-[#12100c]">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#c8a84e] to-[#8b7635] flex items-center justify-center">
              <span className="text-sm font-black text-[#12100c]">AT</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-[#c8a84e] tracking-wide uppercase">Albion Trade Hub</h1>
              <p className="text-[10px] text-[#8b7635] uppercase tracking-wider">Market Scanner</p>
            </div>
          </Link>

          <span className="text-[10px] text-[#8b7635] border border-[#3a3028] rounded px-2 py-0.5 uppercase font-bold">Fan-Made</span>
        </div>

        {/* Main nav - center */}
        <nav className="flex items-center gap-1">
          {mainNav.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
                className={cn(
                  "px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors",
                  isActive
                    ? "bg-[#241e18] text-[#c8a84e] border border-[#c8a84e]/30"
                    : "text-[#8b7635] hover:text-[#e8d5b5]"
                )}>
                {item.label}
              </Link>
            );
          })}

          {/* More dropdown */}
          <div className="relative" ref={moreRef}>
            <button onClick={() => setMoreOpen(!moreOpen)}
              className={cn(
                "flex items-center gap-1 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors",
                isMoreActive ? "bg-[#241e18] text-[#c8a84e] border border-[#c8a84e]/30" : "text-[#8b7635] hover:text-[#e8d5b5]"
              )}>
              MAIS <ChevronDown className="h-3 w-3" />
            </button>
            {moreOpen && (
              <div className="absolute top-full mt-1 right-0 w-48 rounded-lg border border-[#3a3028] bg-[#1a1410] shadow-xl z-50 py-1">
                {moreItems.map(item => (
                  <Link key={item.href} href={item.href} onClick={() => setMoreOpen(false)}
                    className={cn(
                      "block px-4 py-2.5 text-sm transition-colors",
                      pathname === item.href ? "text-[#c8a84e] bg-[#241e18]" : "text-[#a89070] hover:text-[#e8d5b5] hover:bg-[#241e18]"
                    )}>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] text-[#8b7635]">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Scanner Ativo
          </div>
          <button className="p-2 rounded-lg text-[#a89070] hover:text-[#c8a84e] hover:bg-[#241e18] transition-colors">
            <Search className="h-4 w-4" />
          </button>
          <button onClick={() => setNewOpps(0)} className="relative p-2 rounded-lg text-[#a89070] hover:text-[#c8a84e] hover:bg-[#241e18] transition-colors">
            <Bell className="h-4 w-4" />
            {newOpps > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#8b2020] text-[10px] font-bold text-white animate-pulse">
                {newOpps > 9 ? "9+" : newOpps}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
