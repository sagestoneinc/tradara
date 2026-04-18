import type * as React from "react";

import { cn } from "@tradara/ui";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = "left"
}: SectionHeadingProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "space-y-3",
        align === "center" ? "mx-auto max-w-3xl text-center" : "",
        className
      )}
    >
      {eyebrow ? (
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-amber-200/90">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-[-0.02em] text-white sm:text-[2.4rem]">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-base leading-8 text-slate-300">{description}</p>
      ) : null}
    </div>
  );
}
