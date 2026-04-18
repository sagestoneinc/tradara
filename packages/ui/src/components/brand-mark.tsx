import * as React from "react";

import { cn } from "../lib/utils";

type BrandMarkProps = {
  className?: string;
  showWordmark?: boolean;
};

export function BrandMark({ className, showWordmark = true }: BrandMarkProps): React.JSX.Element {
  const ringId = React.useId();
  const barsId = React.useId();
  const arrowId = React.useId();

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <svg
        viewBox="0 0 104 104"
        role="img"
        aria-label="Tradara logo"
        className="h-12 w-12 shrink-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={ringId} x1="18" y1="18" x2="88" y2="92" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="45%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id={barsId} x1="26" y1="46" x2="78" y2="86" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>
          <linearGradient id={arrowId} x1="24" y1="30" x2="84" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <circle cx="52" cy="52" r="42" fill="none" stroke={`url(#${ringId})`} strokeWidth="5.5" />
        <rect x="28" y="56" width="8" height="18" rx="2" fill={`url(#${barsId})`} />
        <rect x="40" y="47" width="8" height="27" rx="2" fill={`url(#${barsId})`} />
        <rect x="52" y="39" width="8" height="35" rx="2" fill={`url(#${barsId})`} />
        <rect x="64" y="32" width="8" height="42" rx="2" fill={`url(#${barsId})`} />
        <path
          d="M20 64C34 58 44 50 54 44C64 38 73 31 84 24"
          fill="none"
          stroke={`url(#${arrowId})`}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="6"
        />
        <path
          d="M77 23L84 24L81 31"
          fill="none"
          stroke={`url(#${arrowId})`}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="6"
        />
      </svg>
      {showWordmark ? (
        <div className="leading-none">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.38em] text-amber-200/90">Tradara</p>
          <p className="mt-1 text-xs text-slate-400">by SageStone Lab</p>
        </div>
      ) : null}
    </div>
  );
}