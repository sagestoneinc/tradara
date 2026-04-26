import type * as React from "react";

import { Footer } from "./footer";
import { Header } from "./header";

type PageShellProps = {
  children: React.ReactNode;
  title: string;
  description: string;
};

export function PageShell({ children, title, description }: PageShellProps): React.JSX.Element {
  return (
    <>
      <Header />
      <main id="content" className="mx-auto max-w-6xl space-y-10 px-4 pb-20 pt-10 md:px-6">
        <header className="glass-card p-8">
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-brand-soft">{description}</p>
        </header>
        {children}
      </main>
      <Footer />
    </>
  );
}
