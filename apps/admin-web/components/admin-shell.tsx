"use client";

import type * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@tradara/shared-config";
import { cn } from "@tradara/ui";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/channel-access", label: "Channel Access" },
  { href: "/users", label: "Users" },
  { href: "/subscriptions", label: "Subscriptions" },
  { href: "/settings", label: "Settings" }
];

export function AdminShell({ children }: { children: React.ReactNode }): React.JSX.Element {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-6 lg:px-8">
        <aside className="hidden w-72 shrink-0 rounded-3xl border border-slate-800 bg-slate-950/75 p-6 shadow-[0_24px_80px_rgba(34,211,238,0.1)] backdrop-blur lg:block">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-cyan-300">
              {brand.name}
            </p>
            <h1 className="text-2xl font-semibold text-white">{brand.tagline}</h1>
            <p className="text-sm leading-6 text-slate-400">
              Premium operations for subscriptions, access control, and analyst oversight.
            </p>
          </div>

          <nav className="mt-10 space-y-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-cyan-400 text-slate-950"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 space-y-6">
          <header className="rounded-3xl border border-slate-800 bg-slate-950/75 px-6 py-5 shadow-[0_24px_80px_rgba(34,211,238,0.08)] backdrop-blur">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Tradara admin</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Telegram premium access</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-slate-400">
                Billing remains the source of truth. Telegram access is granted, observed, and revoked
                through a separate delivery layer with audit coverage.
              </p>
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
