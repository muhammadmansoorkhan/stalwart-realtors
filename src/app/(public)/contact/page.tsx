import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";

import { InquiryForm } from "@/components/public/inquiry-form";
import { SiteVisitForm } from "@/components/public/site-visit-form";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { siteConfig } from "@/config/site";
import { getPublishedProjects, getSiteSettings, getWhatsappUrl } from "@/lib/data/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Stalwart Realtors about real estate, construction, development, or a site-visit request.",
};

export default async function ContactPage() {
  const [settings, projects] = await Promise.all([getSiteSettings(), getPublishedProjects()]);
  const whatsapp = getWhatsappUrl(settings.whatsapp, "I would like to learn more about Stalwart Realtors and its services.");
  const contactMethods = [
    settings.phone ? { icon: Phone, label: "Phone", value: settings.phone, href: `tel:${settings.phone.replace(/\s/g, "")}` } : null,
    whatsapp ? { icon: MessageCircle, label: "WhatsApp", value: "Start a conversation", href: whatsapp } : null,
    settings.email ? { icon: Mail, label: "Email", value: settings.email, href: `mailto:${siteConfig.contact.emailRecipient}` } : null,
    settings.office_address ? { icon: MapPin, label: "Office", value: settings.office_address, href: settings.map_url ?? "#" } : null,
    settings.business_hours ? { icon: Clock, label: "Business hours", value: settings.business_hours, href: null } : null,
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href: string | null }[];

  return (
    <>
      <PageHero eyebrow="Contact" title="Start with a clear conversation." description="Share a real estate, construction, development, or investment requirement with Stalwart Realtors." current="Contact" />
      <section className="bg-soft-cream py-20 sm:py-28"><Container className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20"><div><SectionHeading eyebrow="General inquiry" title="Tell us what you are considering." description="Verified channels are shown here as they become available. Online submissions are stored securely when Supabase is connected." />{contactMethods.length ? <div className="mt-9 grid gap-3">{contactMethods.map(({ icon: Icon, label, value, href }) => { const content = <><Icon className="shrink-0 text-champagne-gold" aria-hidden="true" size={20} /><span><span className="block text-[0.62rem] font-bold tracking-[0.13em] text-charcoal/45 uppercase">{label}</span><span className="mt-1 block text-sm leading-6 text-charcoal">{value}</span></span></>; return href ? <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="flex items-start gap-4 border border-deep-olive/10 p-4 transition-colors hover:border-champagne-gold">{content}</a> : <div key={label} className="flex items-start gap-4 border border-deep-olive/10 p-4">{content}</div>; })}</div> : <p className="mt-8 border-l-2 border-champagne-gold pl-4 text-sm leading-7 text-body-copy-muted">Official contact details are awaiting confirmation and are intentionally not shown as placeholders.</p>}</div><div className="border border-deep-olive/12 bg-warm-ivory/45 p-6 sm:p-9"><InquiryForm projects={projects} configured={isSupabaseConfigured()} /></div></Container></section>
      <section id="site-visit" className="scroll-mt-36 border-y border-deep-olive/10 bg-warm-ivory py-20 sm:py-28"><Container className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20"><div><SectionHeading eyebrow="Site-visit request" title="Request a preferred date and time." description="Site visits are available only for published projects. A request is not a confirmed booking." /></div><div className="border border-deep-olive/12 bg-soft-cream p-6 sm:p-9"><SiteVisitForm projects={projects} configured={isSupabaseConfigured()} /></div></Container></section>
      {settings.map_url ? <section className="bg-charcoal py-14 text-soft-cream"><Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold tracking-[0.18em] text-champagne-gold uppercase">Verified map location</p><h2 className="mt-2 font-heading text-3xl">Plan your visit after confirmation.</h2></div><a href={settings.map_url} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 border border-champagne-gold/60 px-6 text-xs font-bold tracking-[0.1em] uppercase"><MapPin aria-hidden="true" size={16} />Open map</a></Container></section> : null}
    </>
  );
}
