"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Search, Star, Palmtree, Wallet, BookOpen, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Oportunidades", icon: BarChart3 },
  { href: "/prices", label: "Precos", icon: Search },
  { href: "/watchlist", label: "Watchlist", icon: Star },
  { href: "/island", label: "Ilha", icon: Palmtree },
  { href: "/finance", label: "Financeiro", icon: Wallet },
  { href: "/guide", label: "Guia", icon: BookOpen },
  { href: "/settings", label: "Config", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-neutral-800 bg-neutral-950">
      <div className="flex h-14 items-center border-b border-neutral-800 px-4">
        <h1 className="text-lg font-bold tracking-tight text-white">Albion Trade Hub</h1>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
