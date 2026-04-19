import type * as React from "react";
import { ClerkProvider } from "@clerk/nextjs";

export function OptionalClerkProvider({
  children
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <>{children}</>;
  }

  return <ClerkProvider>{children}</ClerkProvider>;
}
