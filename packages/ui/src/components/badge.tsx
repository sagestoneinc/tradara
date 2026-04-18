import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-[0.12em]",
  {
    variants: {
      variant: {
        active: "bg-emerald-500/15 text-emerald-300",
        grace: "bg-amber-500/15 text-amber-200",
        inactive: "bg-slate-800 text-slate-300",
        outline: "border border-slate-700 text-slate-300"
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

