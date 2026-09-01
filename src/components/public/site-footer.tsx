import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { SiteLogo } from "@/components/public/site-logo";
import { Container } from "@/components/shared/container";
import { siteConfig } from "@/config/site";
import type { SiteSettings } from "@/types/domain";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const contacts = [
    settings.phone ? { label: settings.phone, href: `tel:${settings.phone.replace(/\s/g, "")}`, icon: Phone } : null,
    settings.email ? { label: settings.email, href: `mailto:${settings.email}`, icon: Mail } : null,
    settings.office_address ? { label: settings.office_address, href: settings.map_url ?? "/contact", icon: MapPin } : null,
  ].filter(Boolean) as { label: string; href: string; icon: typeof Phone }[];

  const socialLinks = [
    settings.facebook_url ? { label: "Facebook", href: settings.facebook_url } : null,
    settings.instagram_url ? { label: "Instagram", href: settings.instagram_url } : null,
    settings.linkedin_url ? { label: "LinkedIn", href: settings.linkedin_url } : null,
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="border-t border-warm-ivory/15 bg-charcoal text-soft-cream">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.25fr_0.6fr_0.7fr_0.95fr] lg:gap-12 lg:py-20">
        <div>
          <Link href="/" aria-label="Stalwart Realtors homepage"><SiteLogo tone="light" /></Link>
          <p className="mt-7 max-w-md text-sm leading-7 text-warm-ivory/70">{settings.footer_description}</p>
          <p className="mt-4 font-heading text-xl text-champagne-gold">{settings.primary_tagline}</p>
        </div>
        <FooterColumn title="Explore" links={siteConfig.navigation} />
        <FooterColumn title="Divisions" links={siteConfig.serviceNavigation} />
        <div>
          <h2 className="text-xs font-bold tracking-[0.2em] text-champagne-gold uppercase">Contact</h2>
          {contacts.length ? (
            <ul className="mt-5 space-y-4">
              {contacts.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a href={href} className="flex items-start gap-3 text-sm leading-6 text-warm-ivory/75 transition-colors hover:text-soft-cream">
                    <Icon className="mt-1 shrink-0 text-champagne-gold" aria-hidden="true" size={15} />{label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-sm leading-7 text-warm-ivory/55">Verified contact details will appear here when published.</p>
          )}
          {socialLinks.length ? (
            <div className="mt-6 flex flex-wrap gap-4">
              {socialLinks.map((item) => <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="text-xs font-bold tracking-[0.1em] text-warm-ivory/70 uppercase hover:text-champagne-gold">{item.label}</a>)}
            </div>
          ) : null}
        </div>
      </Container>
      <div className="border-t border-warm-ivory/10">
        <Container className="flex flex-col gap-3 py-6 text-xs text-warm-ivory/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Stalwart Realtors. All rights reserved.</p>
          <div className="flex gap-5"><Link href="/privacy" className="hover:text-soft-cream">Privacy</Link><Link href="/terms" className="hover:text-soft-cream">Terms</Link></div>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="text-xs font-bold tracking-[0.2em] text-champagne-gold uppercase">{title}</h2>
      <ul className="mt-5 space-y-3">
        {links.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="inline-flex items-center gap-2 text-sm text-warm-ivory/75 transition-colors hover:text-soft-cream">
              {item.label}<ArrowUpRight aria-hidden="true" size={14} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
