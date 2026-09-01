import { Eye, Handshake, Scale, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

import { ButtonLink } from "@/components/shared/button-link";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { divisions } from "@/config/site";
import { getSiteSettings } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the principles and three core divisions of Stalwart Realtors.",
};

const values = [
  { title: "Trust", description: "Relationships begin with clarity, respect, and responsible communication.", icon: Handshake },
  { title: "Transparency", description: "Known information, open questions, and next steps are kept visible.", icon: Eye },
  { title: "Considered guidance", description: "Decisions are supported with context, never unsupported guarantees.", icon: Scale },
  { title: "Long-term thinking", description: "Immediate requirements are considered alongside enduring value.", icon: ShieldCheck },
];

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageHero eyebrow="The company" title="Built around trust, shaped by clear thinking." description="Stalwart Realtors brings three connected property disciplines together under one client-focused approach." current="About" />
      <section className="section-reveal bg-soft-cream py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <SectionHeading eyebrow="Who we are" title="A connected view of property requirements." />
          <div className="prose-stalwart border-t border-deep-olive/15 pt-7 text-base leading-8 text-charcoal/68 sm:text-lg sm:leading-9"><p>{settings.company_introduction}</p><p>The company’s positioning is centred on trust, transparency, strategic decisions, client-focused service, and the pursuit of long-term value. Specific claims and capabilities are published only after confirmation.</p></div>
        </Container>
      </section>
      {settings.mission || settings.vision ? (
        <section className="section-reveal border-y border-deep-olive/10 bg-warm-ivory py-20 sm:py-28">
          <Container className="grid gap-6 lg:grid-cols-2">
            {settings.mission ? <article className="bg-deep-olive p-8 text-soft-cream sm:p-12"><p className="text-xs font-bold tracking-[0.2em] text-champagne-gold uppercase">Mission</p><h2 className="mt-5 font-heading text-4xl">Our stated purpose.</h2><p className="mt-6 text-base leading-8 text-warm-ivory/70">{settings.mission}</p></article> : null}
            {settings.vision ? <article className="border border-deep-olive/15 bg-soft-cream p-8 sm:p-12"><p className="text-xs font-bold tracking-[0.2em] text-deep-olive uppercase">Vision</p><h2 className="mt-5 font-heading text-4xl text-charcoal">Our stated direction.</h2><p className="mt-6 text-base leading-8 text-charcoal/68">{settings.vision}</p></article> : null}
          </Container>
        </section>
      ) : null}
      <section className="architectural-grid section-reveal bg-charcoal py-20 text-soft-cream sm:py-28">
        <Container><SectionHeading eyebrow="Core values" title="What guides the work." tone="dark" /><div className="mt-12 grid gap-px bg-warm-ivory/15 sm:grid-cols-2 lg:grid-cols-4">{values.map(({ title, description, icon: Icon }) => <article key={title} className="bg-charcoal p-7 sm:p-8"><Icon className="text-champagne-gold" aria-hidden="true" size={28} strokeWidth={1.4} /><h3 className="mt-6 font-heading text-2xl">{title}</h3><p className="mt-3 text-sm leading-7 text-warm-ivory/62">{description}</p></article>)}</div></Container>
      </section>
      <section className="section-reveal bg-soft-cream py-20 sm:py-28">
        <Container><SectionHeading eyebrow="Three divisions" title="Distinct disciplines. Shared principles." /><div className="mt-12 grid gap-6 lg:grid-cols-3">{divisions.map((division) => { const Icon = division.icon; return <article key={division.slug} className="border border-deep-olive/12 p-8"><Icon className="text-champagne-gold" aria-hidden="true" size={30} strokeWidth={1.4} /><h3 className="mt-7 font-heading text-3xl text-charcoal">{division.name}</h3><p className="mt-4 text-sm leading-7 text-charcoal/65">{division.summary}</p><ButtonLink href={`/${division.slug}`} variant="text" className="mt-6">Explore division</ButtonLink></article>; })}</div></Container>
      </section>
      <section className="travertine-texture border-t border-deep-olive/10 py-16 sm:py-20"><Container className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold tracking-[0.18em] text-deep-olive uppercase">A transparent first step</p><h2 className="mt-3 font-heading text-3xl text-charcoal sm:text-4xl">Begin with a clear conversation.</h2></div><ButtonLink href="/contact">Contact Stalwart Realtors</ButtonLink></Container></section>
    </>
  );
}
