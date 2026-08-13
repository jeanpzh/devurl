"use client";

import Link from "next/link";
import { BarChart3, Link2, QrCode } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Links", icon: Link2 },
  { href: "/dashboard/analytics", label: "Analítica", icon: BarChart3 },
  { href: "/dashboard/qr", label: "QR", icon: QrCode },
];

export default function DashboardNavigation() {
  const pathname = usePathname();

  return (
    <aside className="border-terminal-border-strong bg-terminal-surface/40 md:w-44 md:shrink-0 md:border-r lg:w-52">
      <nav
        aria-label="Navegación del dashboard"
        className="flex gap-1 overflow-x-auto p-2 md:sticky md:top-14 md:flex-col md:gap-3 md:p-4 md:pt-8"
      >
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === href
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex min-w-24 items-center gap-2 border border-transparent px-3 py-2 text-[10px] uppercase tracking-[0.1em] text-terminal-muted transition-colors hover:border-terminal-border hover:bg-terminal-hover hover:text-terminal-text md:min-w-0 md:flex-col md:items-start md:gap-3 md:px-4 md:py-3",
                active &&
                  "border-terminal-accent bg-terminal-hover text-terminal-accent-strong md:border-l-2 md:border-y-0 md:border-r-0",
              )}
            >
              <Icon className="size-4 md:size-5" strokeWidth={1.5} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
