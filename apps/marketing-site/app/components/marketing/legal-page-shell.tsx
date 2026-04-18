import type * as React from "react";
import { brand } from "@tradara/shared-config";
import { BrandMark } from "@tradara/ui";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type LegalPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function LegalPageShell({ eyebrow, title, description, children }: LegalPageShellProps): React.JSX.Element {
  return (
    <>
      <SiteHeader />
      <main id="content" className="mx-auto max-w-4xl space-y-8 px-6 pb-20 pt-10 lg:px-8 lg:pt-14">
        <header className="overflow-hidden rounded-3xl border border-amber-300/15 bg-slate-950/78 p-8 sm:p-10">
          <div className="mb-8 flex items-center justify-between gap-4">
            <BrandMark />
            <p className="text-right text-xs uppercase tracking-[0.26em] text-slate-500">Policy and trust</p>
          </div>
          <p className="text-xs uppercase tracking-[0.26em] text-cyan-200">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">{description}</p>
          <p className="mt-4 text-xs leading-6 text-slate-400">{brand.disclaimer}</p>
        </header>
        <section className="space-y-5 rounded-3xl border border-slate-800/80 bg-slate-950/82 p-8 text-sm leading-7 text-slate-300">
          {children}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
