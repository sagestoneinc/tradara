import type * as React from "react";
type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps): React.JSX.Element {
  return (
    <header className="max-w-3xl space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-cyan">{eyebrow}</p>
      <h2 className="font-display text-3xl font-bold leading-tight text-white md:text-4xl">{title}</h2>
      <p className="text-base leading-7 text-brand-soft">{description}</p>
    </header>
  );
}
