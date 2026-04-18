import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em]",
  {
    variants: {
      variant: {
        active: "border-emerald-400/40 bg-emerald-500/15 text-emerald-300",
        grace: "border-amber-300/45 bg-amber-500/15 text-amber-200",
        inactive: "border-slate-700 bg-slate-800 text-slate-300",
        outline: "border-slate-700 text-slate-300"
      }
    },
    defaultVariants: {
      variant: "outline"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps): React.JSX.Element {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

