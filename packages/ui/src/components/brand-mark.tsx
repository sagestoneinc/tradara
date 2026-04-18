import * as React from "react";

import { cn } from "../lib/utils";

type BrandMarkProps = {
  className?: string;
  showWordmark?: boolean;
};

type EmblemIds = {
  glow: string;
  ring: string;
  ringHighlight: string;
  core: string;
  bars: string;
  candles: string;
  arrow: string;
};

function EmblemArtwork({
  ids,
  simplified = false
}: {
  ids: EmblemIds;
  simplified?: boolean;
}): React.JSX.Element {
  return (
    <>
      <defs>
        <radialGradient id={ids.glow} cx="50%" cy="28%" r="70%">
          <stop offset="0%" stopColor="rgba(251, 191, 36, 0.18)" />
          <stop offset="55%" stopColor="rgba(14, 165, 233, 0.08)" />
          <stop offset="100%" stopColor="rgba(2, 6, 23, 0)" />
        </radialGradient>
        <linearGradient
          id={ids.ring}
          x1="22"
          y1="18"
          x2="138"
          y2="144"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#fff2b2" />
          <stop offset="28%" stopColor="#f9d76d" />
          <stop offset="62%" stopColor="#e8b11c" />
          <stop offset="100%" stopColor="#8f5b00" />
        </linearGradient>
        <linearGradient
          id={ids.ringHighlight}
          x1="38"
          y1="26"
          x2="118"
          y2="112"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient
          id={ids.core}
          x1="36"
          y1="34"
          x2="126"
          y2="132"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#102746" />
          <stop offset="55%" stopColor="#08152d" />
          <stop offset="100%" stopColor="#040b17" />
        </linearGradient>
        <linearGradient
          id={ids.bars}
          x1="54"
          y1="72"
          x2="112"
          y2="126"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#6bd9ff" />
          <stop offset="45%" stopColor="#1797d5" />
          <stop offset="100%" stopColor="#0a4e8a" />
        </linearGradient>
        <linearGradient
          id={ids.candles}
          x1="44"
          y1="30"
          x2="104"
          y2="84"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#fff0a2" />
          <stop offset="48%" stopColor="#ffd44f" />
          <stop offset="100%" stopColor="#d29400" />
        </linearGradient>
        <linearGradient
          id={ids.arrow}
          x1="24"
          y1="102"
          x2="132"
          y2="42"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#f5c42e" />
          <stop offset="42%" stopColor="#ffe07a" />
          <stop offset="100%" stopColor="#d59607" />
        </linearGradient>
      </defs>

      <circle cx="80" cy="80" r="66" fill={`url(#${ids.glow})`} />
      <circle cx="80" cy="80" r="56" fill={`url(#${ids.core})`} />
      <circle
        cx="80"
        cy="80"
        r="56"
        fill="none"
        stroke="rgba(125, 211, 252, 0.12)"
        strokeWidth="1.5"
      />
      <circle cx="80" cy="80" r="64" fill="none" stroke={`url(#${ids.ring})`} strokeWidth="10" />
      <path
        d="M35 37C46 24 63 16 80 16"
        fill="none"
        stroke={`url(#${ids.ringHighlight})`}
        strokeLinecap="round"
        strokeWidth="4"
      />

      {simplified ? (
        <>
          <rect x="44" y="86" width="14" height="28" rx="4.5" fill={`url(#${ids.bars})`} />
          <rect x="63" y="72" width="15" height="42" rx="4.5" fill={`url(#${ids.bars})`} />
          <rect x="84" y="58" width="17" height="56" rx="4.5" fill={`url(#${ids.bars})`} />
        </>
      ) : (
        <>
          <rect x="42" y="92" width="12" height="22" rx="4" fill={`url(#${ids.bars})`} />
          <rect x="58" y="78" width="12" height="36" rx="4" fill={`url(#${ids.bars})`} />
          <rect x="74" y="62" width="13" height="52" rx="4.5" fill={`url(#${ids.bars})`} />
          <rect x="91" y="72" width="12" height="42" rx="4" fill={`url(#${ids.bars})`} />
          <rect x="107" y="58" width="12" height="56" rx="4" fill={`url(#${ids.bars})`} />

          <rect x="46" y="42" width="2.5" height="24" rx="1.25" fill={`url(#${ids.candles})`} />
          <rect x="42" y="46" width="10" height="13" rx="3" fill={`url(#${ids.candles})`} />
          <rect x="63" y="28" width="2.5" height="39" rx="1.25" fill={`url(#${ids.candles})`} />
          <rect x="58" y="35" width="11" height="24" rx="3.5" fill={`url(#${ids.candles})`} />
          <rect x="81" y="18" width="2.5" height="53" rx="1.25" fill={`url(#${ids.candles})`} />
          <rect x="75.5" y="25" width="13" height="31" rx="4" fill={`url(#${ids.candles})`} />
          <rect x="99" y="34" width="2.5" height="34" rx="1.25" fill={`url(#${ids.candles})`} />
          <rect x="94" y="40" width="11.5" height="19" rx="3" fill={`url(#${ids.candles})`} />
        </>
      )}

      <path
        d="M18 95C36 91 52 82 68 72C86 61 103 47 124 32"
        fill="none"
        stroke={`url(#${ids.arrow})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={simplified ? 13 : 10}
      />
      <path
        d="M110 26L127 31L115 45"
        fill="none"
        stroke={`url(#${ids.arrow})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={simplified ? 13 : 10}
      />
    </>
  );
}

export function BrandMark({ className, showWordmark = true }: BrandMarkProps): React.JSX.Element {
  const baseId = React.useId();
  const emblemIds: EmblemIds = {
    glow: `${baseId}-glow`,
    ring: `${baseId}-ring`,
    ringHighlight: `${baseId}-ring-highlight`,
    core: `${baseId}-core`,
    bars: `${baseId}-bars`,
    candles: `${baseId}-candles`,
    arrow: `${baseId}-arrow`
  };
  const wordId = `${baseId}-word`;
  const subtitleId = `${baseId}-subtitle`;

  if (!showWordmark) {
    return (
      <div className={cn("inline-flex shrink-0 items-center", className)}>
        <svg
          viewBox="0 0 160 160"
          role="img"
          aria-label="Tradara emblem"
          className="h-12 w-12 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          <EmblemArtwork ids={emblemIds} simplified />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn("inline-flex shrink-0 items-center", className)}>
      <svg
        viewBox="0 0 332 236"
        role="img"
        aria-label="Tradara logo"
        className="h-auto w-[10.75rem] shrink-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id={wordId}
            x1="62"
            y1="152"
            x2="270"
            y2="214"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#fff0aa" />
            <stop offset="45%" stopColor="#f5c53d" />
            <stop offset="100%" stopColor="#b17606" />
          </linearGradient>
          <linearGradient
            id={subtitleId}
            x1="74"
            y1="203"
            x2="258"
            y2="203"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="rgba(253, 230, 138, 0.85)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.95)" />
            <stop offset="100%" stopColor="rgba(103, 232, 249, 0.85)" />
          </linearGradient>
        </defs>

        <g transform="translate(86 0)">
          <EmblemArtwork ids={emblemIds} />
        </g>

        <text
          x="166"
          y="187"
          fill={`url(#${wordId})`}
          fontFamily="DM Sans, ui-sans-serif, system-ui, sans-serif"
          fontSize="42"
          fontWeight="800"
          letterSpacing="0.18em"
          textAnchor="middle"
        >
          TRADARA
        </text>
        <line
          x1="60"
          y1="208"
          x2="104"
          y2="208"
          stroke="rgba(245, 197, 61, 0.55)"
          strokeWidth="2.5"
        />
        <line
          x1="228"
          y1="208"
          x2="272"
          y2="208"
          stroke="rgba(56, 189, 248, 0.4)"
          strokeWidth="2.5"
        />
        <text
          x="166"
          y="214"
          fill={`url(#${subtitleId})`}
          fontFamily="DM Sans, ui-sans-serif, system-ui, sans-serif"
          fontSize="18"
          fontWeight="600"
          letterSpacing="0.03em"
          textAnchor="middle"
        >
          by SageStone Lab
        </text>
      </svg>
    </div>
  );
}
