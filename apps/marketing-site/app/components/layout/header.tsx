import type * as React from "react";
import Link from "next/link";

import { ctaLinks, navLinks } from "../../lib/site";
import { BrandLogo } from "./brand-logo";

export function Header(): React.JSX.Element {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-navy/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <BrandLogo />
        <nav className="hidden items-center gap-4 md:flex" aria-label="Primary">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-slate-200 transition hover:text-brand-cyan">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href={ctaLinks.getStarted} className="btn-primary text-sm" target="_blank" rel="noreferrer">
          Get Started
        </Link>
      </div>
    </header>
  );
}
