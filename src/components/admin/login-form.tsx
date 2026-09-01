"use client";

import { useActionState } from "react";

import { loginAction } from "@/lib/actions/auth";

export function LoginForm({ nextPath, configured }: { nextPath: string; configured: boolean }) {
  const [state, action, pending] = useActionState(loginAction, { error: "" });
  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="next" value={nextPath} />
      <label className="grid gap-2 text-xs font-bold tracking-[0.08em] text-charcoal uppercase"><span>Email</span><input name="email" type="email" autoComplete="username" required className="form-control" /></label>
      <label className="grid gap-2 text-xs font-bold tracking-[0.08em] text-charcoal uppercase"><span>Password</span><input name="password" type="password" autoComplete="current-password" required className="form-control" /></label>
      {state.error ? <p role="alert" className="text-sm leading-6 text-red-700">{state.error}</p> : null}
      {!configured ? <p className="border-l-2 border-champagne-gold pl-4 text-xs leading-6 text-charcoal/60">Connect Supabase and add the first authorized administrator before signing in.</p> : null}
      <button type="submit" disabled={pending || !configured} className="min-h-12 bg-deep-olive px-6 text-xs font-bold tracking-[0.1em] text-soft-cream uppercase disabled:cursor-not-allowed disabled:opacity-45">{pending ? "Verifying…" : "Secure sign in"}</button>
    </form>
  );
}
