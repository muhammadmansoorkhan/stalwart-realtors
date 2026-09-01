"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { siteConfig } from "@/config/site";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, []);

  const links = [siteConfig.navigation[0], siteConfig.navigation[1], ...siteConfig.serviceNavigation, ...siteConfig.navigation.slice(2)];

  return (
    <div className="lg:hidden">
      <button type="button" className="inline-flex min-h-11 min-w-11 items-center justify-center border border-deep-olive/20 text-charcoal transition-colors hover:border-champagne-gold" aria-expanded={isOpen} aria-controls="mobile-navigation-panel" aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"} onClick={() => setIsOpen((current) => !current)}>
        {isOpen ? <X aria-hidden="true" size={21} /> : <Menu aria-hidden="true" size={21} />}
      </button>
      {isOpen ? (
        <div id="mobile-navigation-panel" className="absolute top-full left-1/2 h-[calc(100dvh-100%)] w-screen -translate-x-1/2 overflow-y-auto border-t border-deep-olive/10 bg-soft-cream shadow-[0_24px_55px_rgb(39_41_37/0.16)]">
          <nav className="mx-auto max-w-[90rem] px-5 py-6 sm:px-8" aria-label="Mobile navigation">
            <ul className="divide-y divide-deep-olive/10">
              {links.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="flex min-h-14 items-center justify-between py-3 text-sm font-semibold tracking-[0.08em] text-charcoal uppercase" onClick={() => setIsOpen(false)}>
                    {item.label}<ArrowUpRight aria-hidden="true" size={17} />
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/contact#site-visit" className="mt-6 flex min-h-12 items-center justify-center gap-2 bg-deep-olive px-5 py-3 text-sm font-bold text-soft-cream" onClick={() => setIsOpen(false)}>
              Book a site visit <ArrowUpRight aria-hidden="true" size={17} />
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
