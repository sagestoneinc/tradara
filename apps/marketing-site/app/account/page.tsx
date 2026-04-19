import type * as React from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function AccountPage(): React.JSX.Element {
  return (
    <main
      id="content"
      className="mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col justify-center px-6 py-16"
    >
      <SignedOut>
        <section className="rounded-[2rem] border border-slate-800 bg-slate-950/75 p-8 text-slate-200 shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">Tradara account</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
            Sign in to manage billing and Telegram access.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            This account surface is where Tradara will connect your website identity, billing
            status, and Telegram delivery state. Billing still controls entitlement, and Telegram
            remains the revocable delivery layer.
          </p>
          <div className="mt-8">
            <SignInButton mode="modal">
              <button className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">
                Sign in with Clerk
              </button>
            </SignInButton>
          </div>
        </section>
      </SignedOut>

      <SignedIn>
        <section className="rounded-[2rem] border border-slate-800 bg-slate-950/75 p-8 text-slate-200 shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">Tradara account</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                Identity is connected. Billing and Telegram linkage come next.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                This is the first Clerk-backed account surface. The next slice will connect live
                billing checkout, Telegram linking, and a unified membership status view.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2">
              <span className="text-xs uppercase tracking-[0.18em] text-slate-500">Signed in</span>
              <UserButton />
            </div>
          </div>
        </section>
      </SignedIn>
    </main>
  );
}
