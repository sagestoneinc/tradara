import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border border-amber-200/40 bg-gradient-to-b from-amber-200 to-amber-300 text-slate-950 shadow-[0_14px_40px_rgba(251,191,36,0.22)] hover:-translate-y-0.5 hover:from-amber-100 hover:to-amber-200",
        secondary:
          "border border-slate-700/85 bg-slate-900/70 text-slate-100 shadow-[0_8px_30px_rgba(2,6,23,0.32)] hover:border-cyan-300/60 hover:text-cyan-200",
        ghost: "text-slate-300 hover:bg-slate-900/70 hover:text-white"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-6 text-base"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default"
    }
  }
);

type ButtonNativeProps = React.ComponentPropsWithoutRef<"button">;

export type ButtonProps = ButtonNativeProps &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    children?: React.ReactNode;
    className?: string;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps): React.JSX.Element {
  const Comp: React.ElementType = asChild ? Slot : "button";

  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
