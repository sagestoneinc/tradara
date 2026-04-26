import type * as React from "react";
import Link from "next/link";

import { navLinks, site } from "../../lib/site";

export function Footer(): React.JSX.Element {
  return (
    <footer className="border-t border-white/10 bg-brand-midnight/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <h2 className="font-display text-lg text-white">TRADARA</h2>
          <p className="mt-2 text-sm text-brand-soft">Trade smarter. Grow faster.</p>
          <p className="mt-4 text-xs leading-6 text-slate-400">{site.disclaimer}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">Platform</h3>
          <ul className="mt-3 space-y-2 text-sm text-brand-soft">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-brand-cyan">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">Legal</h3>
          <ul className="mt-3 space-y-2 text-sm text-brand-soft">
            <li>
              <Link href="/legal/risk-disclaimer" className="transition hover:text-brand-cyan">
                Risk Disclaimer
              </Link>
            </li>
            <li>
              <Link href="/legal/privacy-policy" className="transition hover:text-brand-cyan">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/legal/terms" className="transition hover:text-brand-cyan">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition hover:text-brand-cyan">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
