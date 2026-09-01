import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { SiteLogo } from "@/components/public/site-logo";
import { getAdminContext } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };
type Props = { searchParams: Promise<{ next?: string }> };

export default async function AdminLoginPage({ searchParams }: Props) {
  const [admin, { next }] = await Promise.all([getAdminContext(), searchParams]);
  if (admin) redirect("/admin");
  return <main id="main-content" className="architectural-grid grid min-h-screen place-items-center bg-deep-olive px-5 py-16"><div className="w-full max-w-md border border-warm-ivory/15 bg-soft-cream p-7 shadow-2xl sm:p-10"><div className="flex items-center justify-between"><SiteLogo /><Link href="/" className="text-[0.65rem] font-bold tracking-[0.1em] text-deep-olive uppercase">Public site</Link></div><div className="mt-9 border-t border-deep-olive/12 pt-8"><p className="text-xs font-bold tracking-[0.16em] text-champagne-gold uppercase">Authorized access</p><h1 className="mt-3 font-heading text-4xl text-charcoal">Admin sign in</h1><p className="mt-3 text-sm leading-7 text-charcoal/55">There is no public registration. Only accounts explicitly listed in the secure administrator table can continue.</p></div><div className="mt-7"><LoginForm nextPath={next ?? "/admin"} configured={isSupabaseConfigured()} /></div></div></main>;
}
