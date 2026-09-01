import { ChevronDown } from "lucide-react";
import Link from "next/link";

import { MobileNavigation } from "@/components/public/mobile-navigation";
import { SiteLogo } from "@/components/public/site-logo";
import { Container } from "@/components/shared/container";
import { siteConfig } from "@/config/site";
import type { SiteSettings } from "@/types/domain";

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  return (
    <header className="sticky top-0 z-50 border-b border-deep-olive/10 bg-soft-cream/95 backdrop-blur-md">
      {settings.announcement ? (
        <div className="bg-deep-olive text-soft-cream">
          <Container className="flex min-h-9 items-center justify-center py-2 text-center text-[0.64rem] font-semibold tracking-[0.14em] uppercase sm:text-[0.7rem]">
            {settings.announcement}
          </Container>
        </div>
      ) : (
        <div className="bg-deep-olive text-soft-cream">
          <Container className="flex min-h-9 items-center justify-between gap-4 py-2 text-[0.63rem] font-semibold tracking-[0.16em] uppercase sm:text-[0.68rem]">
            <span>Real Estate · Construction · Development</span>
            <span className="hidden text-travertine-beige sm:inline">{settings.supporting_statement}</span>
          </Container>
        </div>
      )}

      <Container className="relative flex min-h-20 items-center justify-between gap-6 py-3">
        <Link href="/" aria-label="Stalwart Realtors homepage">
          <SiteLogo />
        </Link>

        <nav className="hidden lg:block" aria-label="Primary navigation">
          <ul className="flex items-center gap-6 xl:gap-8">
            {siteConfig.navigation.slice(0, 2).map((item) => (
              <li key={item.href}><NavLink href={item.href}>{item.label}</NavLink></li>
            ))}
            <li className="group relative">
              <button className="inline-flex min-h-11 items-center gap-1.5 py-3 text-[0.7rem] font-bold tracking-[0.14em] text-charcoal/75 uppercase transition-colors group-hover:text-charcoal" type="button">
                Services <ChevronDown aria-hidden="true" size={14} />
              </button>
              <div className="invisible absolute top-full left-1/2 w-60 -translate-x-1/2 border border-deep-olive/10 bg-soft-cream p-2 opacity-0 shadow-[0_22px_50px_rgb(39_41_37/0.16)] transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                {siteConfig.serviceNavigation.map((item) => (
                  <Link key={item.href} href={item.href} className="block px-4 py-3 text-xs font-semibold tracking-[0.08em] text-charcoal uppercase transition-colors hover:bg-warm-ivory hover:text-deep-olive">
                    {item.label}
                  </Link>
                ))}
              </div>
            </li>
            {siteConfig.navigation.slice(2).map((item) => (
              <li key={item.href}><NavLink href={item.href}>{item.label}</NavLink></li>
            ))}
          </ul>
        </nav>

        <Link href="/contact#site-visit" className="hidden min-h-11 items-center bg-deep-olive px-5 py-3 text-xs font-bold tracking-[0.08em] text-soft-cream uppercase transition-colors hover:bg-charcoal xl:inline-flex">
          Book a site visit
        </Link>
        <MobileNavigation />
      </Container>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="relative py-3 text-[0.7rem] font-bold tracking-[0.14em] text-charcoal/75 uppercase transition-colors after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-right after:scale-x-0 after:bg-champagne-gold after:transition-transform hover:text-charcoal hover:after:origin-left hover:after:scale-x-100">
      {children}
    </Link>
  );
}
