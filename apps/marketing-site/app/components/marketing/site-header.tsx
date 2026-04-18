import type * as React from "react";
import Link from "next/link";
import { Button } from "@tradara/ui";

import { site } from "../../lib/site";

const navItems = [
  { label: "Why Tradara", href: "/#why-tradara" },
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/#faq" }
] as const;

export function SiteHeader(): React.JSX.Element {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="group inline-flex flex-col">
          <span className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-200/90">Tradara</span>
          <span className="text-xs text-slate-400 transition-colors group-hover:text-slate-300">by SageStone Lab</span>
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Button key={item.label} asChild variant="ghost" size="sm">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="secondary" size="sm" className="hidden sm:inline-flex">
            <Link href="/pricing">View plans</Link>
          </Button>
          <Button asChild size="sm">
            <Link href={site.social.telegram}>Join Telegram</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
