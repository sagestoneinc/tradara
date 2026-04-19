import type * as React from "react";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage(): React.JSX.Element {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center px-6 py-16">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-8 text-center text-slate-200">
          <h1 className="text-2xl font-semibold text-white">Sign in is not configured yet.</h1>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Add Clerk publishable and secret keys to enable the authenticated Tradara account flow.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-6xl items-center justify-center px-6 py-16">
      <SignIn />
    </main>
  );
}
