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

const process = [
  {
    title: "Consultation",
    description: "Begin with a clear conversation about goals, priorities, and context.",
  },
  {
    title: "Requirement assessment",
    description: "Define the practical, financial, and long-term considerations that matter.",
  },
  {
    title: "Opportunity selection",
    description: "Review suitable properties or projects against the available information.",
  },
  {
    title: "Professional guidance",
    description: "Understand the trade-offs and next steps before making a decision.",
  },
  {
    title: "Continued support",
    description: "Keep communication clear as an approved transaction or project progresses.",
  },
];

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
      <section className="relative isolate min-h-[calc(100svh-5rem)] overflow-hidden bg-deep-olive text-soft-cream">
        <Image src="/images/architectural-hero.png" alt="Conceptual contemporary architecture in warm stone; not a Stalwart Realtors project" fill sizes="100vw" className="-z-20 object-cover object-[62%_center]" priority />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(39,41,37,0.96)_0%,rgba(47,56,40,0.9)_34%,rgba(47,56,40,0.48)_66%,rgba(39,41,37,0.28)_100%)]" />
        <Container className="flex min-h-[calc(100svh-5rem)] items-center py-20">
          <div className="max-w-3xl [&>p:first-child]:!text-champagne-gold">
            <p className="text-xs font-bold tracking-[0.24em] text-deep-olive uppercase">{settings.business_descriptor} · Construction · Development</p>
            <h1 className="mt-6 font-heading text-5xl leading-[0.98] font-semibold text-soft-cream text-balance sm:text-7xl lg:text-[6.8rem]">{settings.primary_tagline}</h1>
            <p className="mt-7 max-w-xl border-l-2 border-champagne-gold pl-5 font-heading text-2xl leading-snug text-warm-ivory sm:text-3xl">{settings.supporting_statement}</p>
            <p className="mt-7 max-w-xl text-base leading-8 text-warm-ivory/72">{settings.company_introduction}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><ButtonLink href="/projects" className="bg-champagne-gold text-charcoal hover:bg-travertine-beige">Explore projects</ButtonLink><ButtonLink href="/contact" variant="outline" className="border-champagne-gold/75 text-soft-cream hover:bg-champagne-gold/12">Discuss your requirements</ButtonLink></div>
          </div>
        </Container>
        <p className="absolute right-4 bottom-4 bg-charcoal/70 px-3 py-1.5 text-[0.6rem] tracking-[0.1em] text-soft-cream/75 uppercase backdrop-blur-sm sm:right-6">Conceptual architectural imagery</p>
      </section>

      <section className="section-reveal bg-soft-cream py-20 sm:py-28">
        <Container className="grid items-stretch gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:grid-rows-[auto_1fr] lg:gap-x-20 lg:gap-y-8">
          <SectionHeading eyebrow="One considered brand" title="Three disciplines, one clear commitment." className="lg:col-start-1 lg:row-start-1" />
          <div className="border-t border-deep-olive/15 pt-7 text-base leading-8 text-charcoal/68 sm:text-lg sm:leading-9 lg:col-start-1 lg:row-start-2">
            <p>Stalwart Realtors works across real estate, construction, and development. That breadth creates a more connected view of property requirements—from the first conversation through to a carefully assessed opportunity or project.</p>
            <p className="mt-5">The approach is grounded in trust, transparent communication, strategic thinking, and the pursuit of long-term value.</p>
            <ButtonLink href="/about" variant="text" className="mt-7">About Stalwart Realtors</ButtonLink>
          </div>
          <div className="border border-deep-olive/14 p-3 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="travertine-texture flex h-full min-h-[28rem] flex-col items-center justify-center border border-champagne-gold/45 p-8 text-center sm:p-12">
              <Image src="/brand/stalwart-logo.jpeg" alt="Stalwart Realtors" width={176} height={176} sizes="176px" className="h-36 w-36 rounded-full object-cover ring-1 ring-champagne-gold/55 sm:h-44 sm:w-44" />
              <p className="mt-14 max-w-xl font-heading text-4xl leading-tight text-charcoal sm:text-5xl">{settings.primary_tagline}</p>
              <span className="mt-8 h-px w-16 bg-champagne-gold" aria-hidden="true" />
              <p className="mt-6 text-xs font-bold tracking-[0.2em] text-deep-olive uppercase">{settings.supporting_statement}</p>
            </div>
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
                <article key={division.slug} className="group relative overflow-hidden bg-soft-cream p-8 transition-colors duration-300 hover:bg-deep-olive focus-within:bg-deep-olive sm:p-10">
                  <span className="absolute top-6 right-7 font-heading text-6xl text-deep-olive/[0.06] transition-colors group-hover:text-champagne-gold/20 group-focus-within:text-champagne-gold/20">0{index + 1}</span>
                  <span className="inline-flex h-14 w-14 items-center justify-center border border-champagne-gold/55 text-champagne-gold">
                    <Icon aria-hidden="true" size={29} strokeWidth={1.35} />
                  </span>
                  <h2 className="mt-8 font-heading text-3xl font-semibold text-charcoal transition-colors group-hover:text-soft-cream group-focus-within:text-soft-cream sm:text-4xl">{division.name}</h2>
                  <p className="mt-5 min-h-20 text-sm leading-7 text-charcoal/65 transition-colors group-hover:text-warm-ivory/70 group-focus-within:text-warm-ivory/70">{division.summary}</p>
                  <ButtonLink href={`/${division.slug}`} variant="text" className="mt-6 group-hover:text-champagne-gold group-focus-within:text-champagne-gold">Explore {division.name}</ButtonLink>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="section-reveal bg-soft-cream py-20 sm:py-28">
        <Container>
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"><SectionHeading eyebrow="Featured projects" title="Verified opportunities, presented with clarity." description="Only projects with approved information are shown publicly." /><ButtonLink href="/projects" variant="outline">View all projects</ButtonLink></div>
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
          <SectionHeading eyebrow="Working process" title="A considered path from first conversation to next step." description="A flexible process that keeps requirements, information, and next actions visible." />
          <ol className="mt-14 grid divide-y divide-deep-olive/12 border-y border-deep-olive/12 md:grid-cols-5 md:divide-x md:divide-y-0">
            {process.map((item, index) => <li key={item.title} className="px-5 py-7 sm:px-6 sm:py-8"><span className="font-heading text-4xl text-champagne-gold/75">{String(index + 1).padStart(2, "0")}</span><h3 className="mt-5 font-heading text-2xl leading-tight text-charcoal">{item.title}</h3><p className="mt-4 text-sm leading-7 text-charcoal/62">{item.description}</p></li>)}
          </ol>
        </Container>
      </section>

      <section className="architectural-grid section-reveal bg-deep-olive py-20 text-soft-cream sm:py-24">
        <Container className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div><p className="text-xs font-bold tracking-[0.2em] text-champagne-gold uppercase">Property and investment conversations</p><h2 className="mt-4 max-w-4xl font-heading text-4xl leading-tight sm:text-6xl">Discuss the opportunity. Understand the context. Decide with clarity.</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-warm-ivory/65">Explore property or development opportunities without promises of guaranteed outcomes.</p></div>
          <div className="flex flex-col gap-3"><ButtonLink href="/contact" variant="light" className="bg-champagne-gold text-charcoal hover:bg-travertine-beige">Start a conversation</ButtonLink>{whatsappUrl ? <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 border border-champagne-gold/60 px-6 text-xs font-bold tracking-[0.1em] uppercase transition-colors hover:bg-champagne-gold/10"><MessageCircle aria-hidden="true" size={16} />WhatsApp</a> : null}</div>
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
