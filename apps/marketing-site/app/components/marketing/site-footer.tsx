import type * as React from "react";
import Link from "next/link";
import { brand } from "@tradara/shared-config";
import { BrandMark } from "@tradara/ui";

const productLinks = [
  { label: "Homepage", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Feature grid", href: "/#features" }
] as const;

const legalLinks = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Risk disclosure", href: "/risk-disclosure" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/#faq" },
  { label: "Sitemap", href: "/sitemap.xml" },
  { label: "Robots", href: "/robots.txt" }
] as const;

export function SiteFooter(): React.JSX.Element {
  return (
    <footer className="border-t border-amber-300/15 bg-slate-950/88">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="space-y-3">
          <BrandMark />
          <p className="max-w-xl text-sm leading-7 text-slate-300">
            SEO-friendly crypto guidance for traders who want clearer structure, cleaner signal presentation, and
            Telegram delivery anchored to verified billing state.
          </p>
          <p id="disclaimer" className="text-xs leading-6 text-slate-400">
            {brand.disclaimer}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Product</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {productLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="transition-colors hover:text-cyan-200">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Legal & trust</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {legalLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="transition-colors hover:text-cyan-200">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800/70 px-6 py-4 text-xs text-slate-400 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SageStone Lab. All rights reserved.</p>
          <p>Built for disciplined traders.</p>
        </div>
      </div>
    </footer>
  );
}
