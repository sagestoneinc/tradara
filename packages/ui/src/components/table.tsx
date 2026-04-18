import * as React from "react";

import { cn } from "../lib/utils";

export function Table({
  className,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>): React.JSX.Element {
  return <table className={cn("w-full caption-bottom text-sm", className)} {...props} />;
}

export function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>): React.JSX.Element {
  return <thead className={cn("border-b border-slate-800 text-slate-400", className)} {...props} />;
}

export function TableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>): React.JSX.Element {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>): React.JSX.Element {
  return (
    <tr
      className={cn("border-b border-slate-900/90 transition-colors hover:bg-slate-900/65", className)}
      {...props}
    />
  );
}

export function TableHead({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>): React.JSX.Element {
  return (
    <th
      className={cn(
        "h-11 px-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-400",
        className
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>): React.JSX.Element {
  return <td className={cn("px-4 py-3.5 align-middle text-slate-200", className)} {...props} />;
}

