import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border border-amber-100/55 bg-[linear-gradient(180deg,#f9df83_0%,#eebf32_58%,#d59a0b_100%)] text-slate-950 shadow-[0_16px_44px_rgba(214,157,18,0.28)] hover:-translate-y-0.5 hover:shadow-[0_22px_54px_rgba(214,157,18,0.34)]",
        secondary:
          "border border-white/10 bg-white/[0.06] text-slate-100 shadow-[0_12px_30px_rgba(2,6,23,0.34)] hover:border-cyan-300/40 hover:bg-cyan-400/[0.08] hover:text-cyan-100",
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
