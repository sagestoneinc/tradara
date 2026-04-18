import * as React from "react";

import { cn } from "../lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-800/80 bg-slate-950/74 shadow-[0_20px_64px_rgba(2,6,23,0.45)] backdrop-blur",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return <div className={cn("space-y-1.5 p-6", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>): React.JSX.Element {
  return <h3 className={cn("text-lg font-semibold text-white", className)} {...props} />;
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>): React.JSX.Element {
  return <p className={cn("text-sm leading-6 text-slate-400", className)} {...props} />;
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

