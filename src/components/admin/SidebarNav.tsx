"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type NavItem = { href: string; label: string; badge?: number };

export default function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
      {items.map((item) => {
        // `/admin` would otherwise light up on every child route, so the
        // overview matches exactly and the sections match their subtree.
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center justify-between gap-3 rounded-full px-4 py-2.5 text-sm transition-colors duration-300 lg:rounded-[var(--radius-xs)]",
              active
                ? "bg-bone text-white"
                : "text-mist hover:bg-ink hover:text-bone",
            )}
          >
            <span>{item.label}</span>
            {item.badge ? (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[0.65rem] font-medium tabular-nums",
                  active ? "bg-white/20 text-white" : "bg-gold/15 text-gold",
                )}
              >
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
