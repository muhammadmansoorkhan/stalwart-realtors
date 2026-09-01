import { Building2, CalendarClock, FileCheck2, FilePenLine, Inbox, Star } from "lucide-react";
import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/page-header";
import { getDashboardData } from "@/lib/data/admin";

const cards = [
  { key: "totalProjects", label: "Total projects", icon: Building2, href: "/admin/projects" },
  { key: "publishedProjects", label: "Published", icon: FileCheck2, href: "/admin/projects" },
  { key: "draftProjects", label: "Drafts", icon: FilePenLine, href: "/admin/projects" },
  { key: "featuredProjects", label: "Featured", icon: Star, href: "/admin/projects" },
  { key: "newInquiries", label: "New inquiries", icon: Inbox, href: "/admin/inquiries" },
  { key: "pendingVisits", label: "Pending visits", icon: CalendarClock, href: "/admin/site-visits" },
] as const;

export default async function AdminOverviewPage() {
  const data = await getDashboardData();
  return <><AdminPageHeader eyebrow="Dashboard" title="Overview" description="Live values from the secure database—no generated analytics." /><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(({ key, label, icon: Icon, href }) => <Link key={key} href={href} className="border border-deep-olive/12 bg-soft-cream p-5 transition-colors hover:border-champagne-gold"><div className="flex items-center justify-between"><Icon className="text-champagne-gold" aria-hidden="true" size={23} /><span className="font-heading text-4xl text-charcoal">{data.counts[key]}</span></div><p className="mt-5 text-xs font-bold tracking-[0.08em] text-charcoal/55 uppercase">{label}</p></Link>)}</section><div className="mt-8 grid gap-6 xl:grid-cols-3"><DataPanel title="Recent inquiries" empty="No inquiries received yet.">{data.recentInquiries.map((item) => <Link href="/admin/inquiries" key={item.id} className="block border-t border-deep-olive/10 py-4 first:border-0"><p className="text-sm font-semibold text-charcoal">{item.full_name}</p><p className="mt-1 text-xs capitalize text-charcoal/45">{item.inquiry_type.replace("-", " ")} · {item.status}</p></Link>)}</DataPanel><DataPanel title="Recent site visits" empty="No site-visit requests yet.">{data.recentVisits.map((item) => <Link href="/admin/site-visits" key={item.id} className="block border-t border-deep-olive/10 py-4 first:border-0"><p className="text-sm font-semibold text-charcoal">{item.full_name}</p><p className="mt-1 text-xs text-charcoal/45">{item.preferred_date} · {item.status}</p></Link>)}</DataPanel><DataPanel title="Recent activity" empty="No administrator activity yet.">{data.recentActivity.map((item) => <div key={item.id} className="border-t border-deep-olive/10 py-4 first:border-0"><p className="text-sm text-charcoal"><span className="capitalize">{item.action}</span> {item.entity_label}</p><p className="mt-1 text-xs capitalize text-charcoal/45">{item.entity_type.replace("_", " ")}</p></div>)}</DataPanel></div></>;
}

function DataPanel({ title, empty, children }: { title: string; empty: string; children: React.ReactNode }) { const isEmpty = Array.isArray(children) && children.length === 0; return <section className="border border-deep-olive/12 bg-soft-cream p-5"><h2 className="font-heading text-2xl text-charcoal">{title}</h2><div className="mt-4">{isEmpty ? <p className="py-5 text-sm text-charcoal/45">{empty}</p> : children}</div></section>; }
