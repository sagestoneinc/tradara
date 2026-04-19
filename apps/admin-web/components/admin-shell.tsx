"use client";

import type * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge, BrandMark, Button, cn } from "@tradara/ui";

const navItems = [
  { href: "/", label: "Dashboard", helper: "Command center", count: "04" },
  { href: "/channel-access", label: "Channel Access", helper: "Delivery layer", count: "12" },
  { href: "/diagnostics", label: "Diagnostics", helper: "Ops health", count: "07" },
  { href: "/signals/review-queue", label: "Signals", helper: "Review queue", count: "05" },
  { href: "/signals/approved", label: "Approved", helper: "Ready to publish", count: "04" },
  { href: "/signals/market-insights", label: "Insights", helper: "Market drafts", count: "03" },
  { href: "/users", label: "Users", helper: "Identity map", count: "36" },
  { href: "/subscriptions", label: "Subscriptions", helper: "Billing truth", count: "09" },
  { href: "/settings", label: "Settings", helper: "Config", count: "02" }
];

const topSummary = [
  { label: "Billing authority", value: "source of truth" },
  { label: "Telegram role", value: "revocable delivery" },
  { label: "Audit posture", value: "fully visible" }
];

function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || (href === "/signals/review-queue" && pathname.startsWith("/signals/"));
}

export function AdminShell({ children }: { children: React.ReactNode }): React.JSX.Element {
  const pathname = usePathname();
  const activeItem = navItems.find((item) => isActivePath(pathname, item.href)) ?? navItems[0];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.18),transparent_58%)]" />
      <div className="pointer-events-none absolute right-0 top-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="mx-auto flex min-h-screen max-w-[1500px] gap-5 px-4 py-4 lg:px-6 lg:py-6">
        <aside className="hidden w-[19rem] shrink-0 flex-col rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(5,12,23,0.9),rgba(5,10,18,0.8))] p-5 shadow-[0_28px_90px_rgba(2,6,23,0.42)] backdrop-blur-xl lg:flex">
          <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-4">
            <BrandMark className="[&_svg]:w-[10rem]" />
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Mission control for billing-backed access, analyst workflow, and Telegram delivery oversight.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="active">Live delivery</Badge>
              <Badge variant="grace">Audit protected</Badge>
            </div>
          </div>

          <div className="mt-6">
            <p className="px-2 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-slate-500">
              Navigation
            </p>
            <nav className="mt-3 space-y-2">
              {navItems.map((item) => {
                const active = isActivePath(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-between rounded-[1.35rem] border px-4 py-3.5 transition-all duration-200",
                      active
                        ? "border-amber-300/35 bg-[linear-gradient(135deg,rgba(245,158,11,0.22),rgba(56,189,248,0.12))] shadow-[0_18px_50px_rgba(14,165,233,0.12)]"
                        : "border-transparent bg-transparent hover:border-white/8 hover:bg-white/[0.035]"
                    )}
                  >
                    <span>
                      <span className={cn("block text-sm font-semibold", active ? "text-white" : "text-slate-200")}>
                        {item.label}
                      </span>
                      <span
                        className={cn(
                          "block text-xs tracking-[0.14em] uppercase",
                          active ? "text-slate-300" : "text-slate-500"
                        )}
                      >
                        {item.helper}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em]",
                        active
                          ? "border-white/15 bg-slate-950/35 text-amber-100"
                          : "border-white/8 bg-slate-900/60 text-slate-400 group-hover:text-slate-300"
                      )}
                    >
                      {item.count}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto space-y-4 rounded-[1.6rem] border border-white/10 bg-[linear-gradient(180deg,rgba(9,18,34,0.9),rgba(6,12,22,0.8))] p-4">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-slate-500">
                System state
              </p>
              <p className="mt-2 text-sm font-semibold text-white">Webhook verification intact</p>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Provider execution, correlation IDs, and failure visibility stay explicit across the admin surface.
              </p>
            </div>
            <div className="grid gap-2">
              {topSummary.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2"
                >
                  <span className="text-xs uppercase tracking-[0.16em] text-slate-500">{item.label}</span>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 space-y-4 lg:space-y-6">
          <header className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,18,34,0.9),rgba(5,11,22,0.78))] px-4 py-4 shadow-[0_24px_80px_rgba(2,6,23,0.32)] backdrop-blur-xl md:px-6 md:py-5">
            <div className="flex flex-col gap-5">
              <div className="flex items-start justify-between gap-4 lg:hidden">
                <BrandMark className="[&_svg]:w-[9.2rem]" />
                <Badge variant="active">Live ops</Badge>
              </div>

              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="grace">Tradara admin</Badge>
                    <span className="text-[0.72rem] uppercase tracking-[0.28em] text-slate-500">
                      {activeItem.helper}
                    </span>
                  </div>

                  <div>
                    <h1 className="text-3xl font-semibold text-white md:text-[2.4rem]">
                      Operational clarity for premium delivery
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400 md:text-[0.96rem]">
                      Billing stays authoritative. Telegram remains a revocable delivery layer. Every admin
                      screen is designed to show entitlement truth, execution risk, and follow-up pressure at a glance.
                    </p>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-3 xl:min-w-[27rem] xl:max-w-[29rem]">
                  {topSummary.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[1.4rem] border border-white/10 bg-white/[0.035] p-3"
                    >
                      <p className="text-[0.66rem] uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
                      <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-white">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <div className="flex w-full items-center gap-3 rounded-[1.35rem] border border-white/10 bg-slate-950/45 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] lg:max-w-xl">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.9)]" />
                    <div className="w-full">
                      <p className="text-[0.68rem] uppercase tracking-[0.22em] text-slate-500">Fast search</p>
                      <input
                        aria-label="Search records"
                        placeholder="Find subscriber, subscription, signal, or Telegram ID"
                        className="mt-1 w-full bg-transparent text-sm text-slate-100 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="active">Signals flowing</Badge>
                    <Badge variant="outline">Read-only provider truth</Badge>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="secondary" size="sm">
                    Export snapshot
                  </Button>
                  <Button size="sm">Open watchlist</Button>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
                {navItems.map((item) => {
                  const active = isActivePath(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "shrink-0 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors",
                        active
                          ? "border-amber-300/30 bg-amber-400/15 text-amber-100"
                          : "border-white/10 bg-white/[0.03] text-slate-300"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}
