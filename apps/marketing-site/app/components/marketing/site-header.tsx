import type * as React from "react";
import Link from "next/link";
import { BrandMark, Button } from "@tradara/ui";

import { telegramLaunchLinks } from "../../lib/site";
import { TrackedCtaLink } from "./tracked-cta-link";

const navItems = [
  { label: "Why Tradara", href: "/#why-tradara" },
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" }
] as const;

export function SiteHeader(): React.JSX.Element {
  return (
    <header className="sticky top-0 z-30 border-b border-amber-300/15 bg-slate-950/78 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="group inline-flex items-center">
          <BrandMark className="transition-transform duration-300 group-hover:-translate-y-0.5" />
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
            <Link href="/#pricing">Compare Plans</Link>
          </Button>
          <Button asChild size="sm">
            <TrackedCtaLink
              href={telegramLaunchLinks.headerPrimary}
              eventName="launch_cta_click"
              eventMeta={{ location: "header", cta: "start_free_telegram" }}
            >
              Join Free on Telegram
            </TrackedCtaLink>
          </Button>
        </div>
      </div>
    </header>
  );
}
