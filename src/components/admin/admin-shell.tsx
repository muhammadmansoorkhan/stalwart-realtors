"use client";

import { Building2, CalendarDays, ChevronLeft, Home, Inbox, LayoutDashboard, Menu, MessageSquareQuote, Settings, Wrench, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { SiteLogo } from "@/components/public/site-logo";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const links = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: Building2 },
  { label: "Services", href: "/admin/services", icon: Wrench },
  { label: "Inquiries", href: "/admin/inquiries", icon: Inbox },
  { label: "Site visits", href: "/admin/site-visits", icon: CalendarDays },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminShell({ children, admin }: { children: React.ReactNode; admin: { email: string; displayName: string | null } }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-[#f2efe8] lg:grid lg:grid-cols-[17rem_1fr]">
      <button type="button" onClick={() => setOpen(true)} className="fixed top-4 left-4 z-40 inline-flex h-11 w-11 items-center justify-center bg-deep-olive text-soft-cream shadow-lg lg:hidden" aria-label="Open admin navigation"><Menu aria-hidden="true" size={20} /></button>
      {open ? <button className="fixed inset-0 z-40 bg-charcoal/45 lg:hidden" type="button" aria-label="Close admin navigation" onClick={() => setOpen(false)} /> : null}
      <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-[17rem] flex-col bg-charcoal text-soft-cream transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex min-h-24 items-center justify-between border-b border-warm-ivory/10 px-6"><Link href="/admin"><SiteLogo tone="light" compact /></Link><button type="button" onClick={() => setOpen(false)} className="inline-flex h-10 w-10 items-center justify-center lg:hidden" aria-label="Close admin navigation"><X aria-hidden="true" size={20} /></button></div>
        <nav className="flex-1 overflow-y-auto p-3" aria-label="Admin navigation"><ul className="space-y-1">{links.map(({ label, href, icon: Icon }) => { const active = href === "/admin" ? pathname === href : pathname.startsWith(href); return <li key={href}><Link href={href} onClick={() => setOpen(false)} className={cn("flex min-h-11 items-center gap-3 px-4 text-sm text-warm-ivory/65 transition-colors hover:bg-warm-ivory/8 hover:text-soft-cream", active && "bg-warm-ivory/10 text-champagne-gold")}><Icon aria-hidden="true" size={17} />{label}</Link></li>; })}</ul></nav>
        <div className="border-t border-warm-ivory/10 p-5"><p className="truncate text-xs font-semibold text-warm-ivory/80">{admin.displayName ?? admin.email}</p><p className="mt-1 truncate text-[0.68rem] text-warm-ivory/40">{admin.email}</p><div className="mt-4 flex items-center justify-between"><Link href="/" className="inline-flex items-center gap-1.5 text-[0.68rem] font-bold tracking-[0.08em] text-warm-ivory/55 uppercase hover:text-soft-cream"><Home aria-hidden="true" size={14} />View site</Link><form action={logoutAction}><button type="submit" className="inline-flex items-center gap-1 text-[0.68rem] font-bold tracking-[0.08em] text-warm-ivory/55 uppercase hover:text-soft-cream"><ChevronLeft aria-hidden="true" size={14} />Log out</button></form></div></div>
      </aside>
      <main id="main-content" className="min-w-0 px-5 py-20 sm:px-8 lg:px-10 lg:py-10 xl:px-14">{children}</main>
    </div>
  );
}
