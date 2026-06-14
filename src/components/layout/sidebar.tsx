"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Search, Star, Palmtree, Wallet, BookOpen, Settings, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Oportunidades", icon: BarChart3 },
  { href: "/prices", label: "Precos", icon: Search },
  { href: "/watchlist", label: "Watchlist", icon: Star },
  { href: "/island", label: "Ilha", icon: Palmtree },
  { href: "/finance", label: "Financeiro", icon: Wallet },
  { href: "/guide", label: "Guia", icon: BookOpen },
  { href: "/assistant", label: "Assistente IA", icon: MessageCircle },
  { href: "/settings", label: "Config", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-[#2a2f3e] bg-[#12151e]">
      <div className="flex h-16 items-center border-b border-[#2a2f3e] px-4 gap-3">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#c8a84e] to-[#8b7635] flex items-center justify-center text-sm font-bold text-[#0c0e14]">AT</div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-[#c8a84e]">Albion Trade Hub</h1>
          <p className="text-[10px] text-[#8b7635]">Market Scanner</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        <p className="text-[10px] uppercase tracking-wider text-[#8b7635] px-3 mb-2">Menu</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[#c8a84e]/10 text-[#c8a84e] border border-[#c8a84e]/20"
                  : "text-[#a89878] hover:bg-[#1e2230] hover:text-[#e8dcc8] border border-transparent"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[#2a2f3e] p-4">
        <p className="text-[10px] text-[#8b7635] text-center">v1.0 — AlguemMeAjudaPF</p>
      </div>
    </aside>
  );
}
