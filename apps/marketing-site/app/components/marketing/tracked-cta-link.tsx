"use client";

import type * as React from "react";
import Link from "next/link";

type TrackedCtaLinkProps = React.ComponentProps<typeof Link> & {
  eventName: string;
  eventMeta: Record<string, string>;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    plausible?: (eventName: string, options?: { props?: Record<string, string> }) => void;
  }
}

function trackEvent(eventName: string, eventMeta: Record<string, string>): void {
  if (typeof window === "undefined") {
    return;
  }

  const payload = { event: eventName, ...eventMeta };
  window.dispatchEvent(new CustomEvent("tradara:marketing-event", { detail: payload }));

  if (window.dataLayer) {
    window.dataLayer.push(payload);
  }

  if (window.gtag) {
    window.gtag("event", eventName, eventMeta);
  }

  if (window.plausible) {
    window.plausible(eventName, { props: eventMeta });
  }
}

export function TrackedCtaLink({
  eventName,
  eventMeta,
  onClick,
  ...props
}: TrackedCtaLinkProps): React.JSX.Element {
  return (
    <Link
      {...props}
      onClick={(event) => {
        trackEvent(eventName, eventMeta);
        onClick?.(event);
      }}
    />
  );
}
