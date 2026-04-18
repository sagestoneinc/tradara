"use client";

import type * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge, BrandMark, Button, cn } from "@tradara/ui";

const navItems = [
  { href: "/", label: "Dashboard", helper: "Overview", count: "04" },
  { href: "/channel-access", label: "Channel Access", helper: "Delivery layer", count: "12" },
  { href: "/users", label: "Users", helper: "Identity map", count: "36" },
  { href: "/subscriptions", label: "Subscriptions", helper: "Billing truth", count: "09" },
  { href: "/settings", label: "Settings", helper: "Config", count: "02" }
];

export function AdminShell({ children }: { children: React.ReactNode }): React.JSX.Element {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.09),transparent_26%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_30%),linear-gradient(180deg,#020617_0%,#02030f_56%,#020617_100%)]">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-6 lg:px-8">
        <aside className="hidden w-72 shrink-0 rounded-3xl border border-amber-300/15 bg-slate-950/82 p-6 shadow-[0_24px_80px_rgba(250,204,21,0.08)] backdrop-blur lg:block">
          <div className="space-y-3">
            <BrandMark />
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
                    "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-amber-300 text-slate-950"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  )}
                >
                  <span>
                    <span className="block">{item.label}</span>
                    <span className={cn("text-xs", active ? "text-slate-800/80" : "text-slate-500")}>{item.helper}</span>
                  </span>
                  <span className={cn("rounded-full px-2 py-0.5 text-xs", active ? "bg-slate-900/20" : "bg-slate-800 text-slate-400")}>
                    {item.count}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">System state</p>
            <p className="mt-2 text-sm font-medium text-white">All webhook checks healthy</p>
            <p className="mt-1 text-xs text-slate-400">No idempotency collisions in the last 24h snapshot.</p>
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          <header className="rounded-3xl border border-amber-300/15 bg-slate-950/82 px-6 py-5 shadow-[0_24px_80px_rgba(250,204,21,0.08)] backdrop-blur">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Tradara admin</p>
                  <h2 className="mt-2 text-3xl font-semibold text-white">Telegram premium access</h2>
                </div>
                <p className="max-w-xl text-sm leading-6 text-slate-400">
                  Billing remains the source of truth. Telegram access is granted, observed, and revoked
                  through a separate delivery layer with audit coverage.
                </p>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex w-full max-w-lg items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2">
                  <span className="text-sm text-slate-500">Search</span>
                  <input
                    aria-label="Search records"
                    placeholder="Find subscriber, subscription, or Telegram ID"
                    className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="grace">Live monitoring</Badge>
                  <Button variant="secondary" size="sm">Export snapshot</Button>
                  <Button size="sm">Open watchlist</Button>
                </div>
              </div>
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
