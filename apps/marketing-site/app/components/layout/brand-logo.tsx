import type * as React from "react";
import Image from "next/image";
import Link from "next/link";

export function BrandLogo(): React.JSX.Element {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <Image src="/brand/tradara-symbol.svg" alt="TRADARA logo symbol" width={36} height={36} priority />
      <div>
        <p className="font-display text-lg font-semibold tracking-[0.08em] text-white">TRADARA</p>
        <p className="text-[11px] uppercase tracking-[0.2em] text-brand-soft">by SageStone Lab</p>
      </div>
    </Link>
  );
}
