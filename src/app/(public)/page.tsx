import { ArrowDownRight, Compass, Handshake, MessageCircle, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import { InquiryForm } from "@/components/public/inquiry-form";
import { ProjectCard } from "@/components/public/project-card";
import { ButtonLink } from "@/components/shared/button-link";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeading } from "@/components/shared/section-heading";
import { divisions } from "@/config/site";
import { getApprovedTestimonials, getPublishedProjects, getSiteSettings, getWhatsappUrl } from "@/lib/data/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Building Better Tomorrow, Together",
  description: "Discover Stalwart Realtors across real estate, construction, and development.",
};

const principles = [
  { title: "Strategic Locations", description: "Location and context are considered carefully before an opportunity is presented.", icon: Compass },
  { title: "Trust & Transparency", description: "Clear information and honest communication sit at the centre of every conversation.", icon: ShieldCheck },
  { title: "Smart Guidance", description: "Decisions are approached thoughtfully, without unsupported promises or pressure.", icon: ArrowDownRight },
  { title: "Client-Focused", description: "Requirements, priorities, and long-term objectives shape the path forward.", icon: Handshake },
];

const process = ["Consultation", "Requirement Assessment", "Opportunity or Project Selection", "Professional Guidance", "Continued Support"];

export default async function HomePage() {
  const [settings, featuredProjects, allProjects, testimonials] = await Promise.all([
    getSiteSettings(),
    getPublishedProjects({ featured: true, limit: 3 }),
    getPublishedProjects(),
    getApprovedTestimonials(),
  ]);
  const whatsappUrl = getWhatsappUrl(settings.whatsapp, "I would like to learn more about Stalwart Realtors and its services.");

  return (
    <>
      <section className="relative isolate min-h-[calc(100svh-7.25rem)] overflow-hidden bg-warm-ivory">
        <Image src="/images/architectural-hero.png" alt="Conceptual contemporary architecture in warm stone; not a Stalwart Realtors project" fill sizes="100vw" className="-z-20 object-cover object-[62%_center]" priority />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#faf7f0_0%,rgba(250,247,240,0.96)_31%,rgba(250,247,240,0.46)_57%,rgba(39,41,37,0.22)_100%)]" />
        <Container className="flex min-h-[calc(100svh-7.25rem)] items-center py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-bold tracking-[0.24em] text-deep-olive uppercase">{settings.business_descriptor} · Construction · Development</p>
            <h1 className="mt-6 font-heading text-5xl leading-[0.98] font-semibold text-charcoal text-balance sm:text-7xl lg:text-[6.8rem]">{settings.primary_tagline}</h1>
            <p className="mt-7 max-w-xl border-l-2 border-champagne-gold pl-5 font-heading text-2xl leading-snug text-deep-olive sm:text-3xl">{settings.supporting_statement}</p>
            <p className="mt-7 max-w-xl text-base leading-8 text-charcoal/70">{settings.company_introduction}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><ButtonLink href="/projects">Explore projects</ButtonLink><ButtonLink href="/contact" variant="outline">Discuss your requirements</ButtonLink></div>
          </div>
        </Container>
        <p className="absolute right-4 bottom-4 bg-charcoal/70 px-3 py-1.5 text-[0.6rem] tracking-[0.1em] text-soft-cream/75 uppercase backdrop-blur-sm sm:right-6">Conceptual architectural visual</p>
      </section>

      <section className="section-reveal bg-soft-cream py-20 sm:py-28">
        <Container className="grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="One considered brand" title="Three disciplines, one clear commitment." />
          <div className="border-t border-deep-olive/15 pt-7 text-base leading-8 text-charcoal/68 sm:text-lg sm:leading-9">
            <p>Stalwart Realtors works across real estate, construction, and development. That breadth creates a more connected view of property requirements—from the first conversation through to a carefully assessed opportunity or project.</p>
            <p className="mt-5">The approach is grounded in trust, transparent communication, strategic thinking, and the pursuit of long-term value.</p>
            <ButtonLink href="/about" variant="text" className="mt-7">About Stalwart Realtors</ButtonLink>
          </div>
        </Container>
      </section>

      <section className="section-reveal border-y border-deep-olive/10 bg-warm-ivory py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Core divisions" title="A joined-up view of property and place." description="Explore the three areas through which Stalwart Realtors responds to client requirements." />
          <div className="mt-12 grid gap-px bg-deep-olive/15 lg:grid-cols-3">
            {divisions.map((division, index) => {
              const Icon = division.icon;
              return (
                <article key={division.slug} className="group relative overflow-hidden bg-soft-cream p-8 sm:p-10">
                  <span className="absolute top-6 right-7 font-heading text-6xl text-deep-olive/[0.06]">0{index + 1}</span>
                  <Icon className="text-champagne-gold" aria-hidden="true" size={31} strokeWidth={1.4} />
                  <h2 className="mt-8 font-heading text-3xl font-semibold text-charcoal sm:text-4xl">{division.name}</h2>
                  <p className="mt-5 min-h-20 text-sm leading-7 text-charcoal/65">{division.summary}</p>
                  <ButtonLink href={`/${division.slug}`} variant="text" className="mt-6">Explore {division.name}</ButtonLink>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="section-reveal bg-soft-cream py-20 sm:py-28">
        <Container>
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"><SectionHeading eyebrow="Featured projects" title="Published with care." description="Only projects with approved information are shown publicly." /><ButtonLink href="/projects" variant="outline">View all projects</ButtonLink></div>
          {featuredProjects.length ? <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{featuredProjects.map((project) => <ProjectCard key={project.id} project={project} />)}</div> : <EmptyState className="mt-12" title="No featured project is published yet" description="Verified project information will appear here when it is ready for public release." />}
        </Container>
      </section>

      <section className="architectural-grid section-reveal bg-deep-olive py-20 text-soft-cream sm:py-28">
        <Container>
          <SectionHeading eyebrow="Why Stalwart" title="Principles that shape every conversation." tone="dark" />
          <div className="mt-12 grid gap-px bg-warm-ivory/15 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map(({ title, description, icon: Icon }) => <article key={title} className="bg-deep-olive p-7 sm:p-8"><Icon className="text-champagne-gold" aria-hidden="true" size={28} strokeWidth={1.4} /><h3 className="mt-6 font-heading text-2xl">{title}</h3><p className="mt-3 text-sm leading-7 text-warm-ivory/65">{description}</p></article>)}
          </div>
          {settings.show_statistics && settings.statistics.length ? <dl className="mt-14 grid gap-px bg-warm-ivory/15 sm:grid-cols-2 lg:grid-cols-4">{settings.statistics.map((stat) => <div key={`${stat.value}-${stat.label}`} className="bg-charcoal/35 p-7 text-center"><dd className="font-heading text-4xl text-champagne-gold sm:text-5xl">{stat.value}</dd><dt className="mt-2 text-xs font-bold tracking-[0.14em] text-warm-ivory/60 uppercase">{stat.label}</dt></div>)}</dl> : null}
        </Container>
      </section>

      <section className="section-reveal travertine-texture py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Working process" title="Clarity at every step." description="A flexible process that keeps requirements, information, and next actions visible." align="center" />
          <ol className="mt-14 grid gap-8 md:grid-cols-5">
            {process.map((item, index) => <li key={item} className="relative border-t border-champagne-gold pt-6"><span className="font-heading text-3xl text-champagne-gold">{String(index + 1).padStart(2, "0")}</span><h3 className="mt-3 text-sm font-bold tracking-[0.07em] text-charcoal uppercase">{item}</h3></li>)}
          </ol>
        </Container>
      </section>

      <section className="section-reveal bg-charcoal py-20 text-soft-cream sm:py-24">
        <Container className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div><p className="text-xs font-bold tracking-[0.2em] text-champagne-gold uppercase">Property and investment conversations</p><h2 className="mt-4 max-w-4xl font-heading text-4xl leading-tight sm:text-6xl">Discuss the opportunity. Understand the context. Decide with clarity.</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-warm-ivory/65">Explore property or development opportunities without promises of guaranteed outcomes.</p></div>
          <div className="flex flex-col gap-3"><ButtonLink href="/contact" variant="light">Start a conversation</ButtonLink>{whatsappUrl ? <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 border border-champagne-gold/50 px-6 text-xs font-bold tracking-[0.1em] uppercase"><MessageCircle aria-hidden="true" size={16} />WhatsApp</a> : null}</div>
        </Container>
      </section>

      {testimonials.length ? (
        <section className="section-reveal bg-soft-cream py-20 sm:py-28"><Container><SectionHeading eyebrow="Verified perspectives" title="Client experiences, published responsibly." /><div className="mt-12 grid gap-6 lg:grid-cols-3">{testimonials.map((item) => <figure key={item.id} className="border border-deep-olive/12 bg-warm-ivory/45 p-8"><blockquote className="font-heading text-2xl leading-relaxed text-charcoal">“{item.quote}”</blockquote><figcaption className="mt-7 border-t border-deep-olive/10 pt-5 text-xs font-bold tracking-[0.1em] text-deep-olive uppercase">{item.client_name}{item.client_context ? <span className="mt-1 block font-medium tracking-normal text-charcoal/50 normal-case">{item.client_context}</span> : null}</figcaption></figure>)}</div></Container></section>
      ) : null}

      <section className="section-reveal border-t border-deep-olive/10 bg-warm-ivory py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div><SectionHeading eyebrow="Begin a conversation" title="Tell us what you are considering." description="Share your requirement and the team can respond once verified contact channels and the secure lead system are active." />{settings.phone || settings.email ? <div className="mt-8 space-y-3 text-sm">{settings.phone ? <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="block text-deep-olive hover:text-champagne-gold">{settings.phone}</a> : null}{settings.email ? <a href={`mailto:${settings.email}`} className="block text-deep-olive hover:text-champagne-gold">{settings.email}</a> : null}</div> : null}</div>
          <div className="border border-deep-olive/12 bg-soft-cream p-6 sm:p-9"><InquiryForm projects={allProjects} configured={isSupabaseConfigured()} /></div>
        </Container>
      </section>
    </>
  );
}
