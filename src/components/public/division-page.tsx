import { ProjectCard } from "@/components/public/project-card";
import { ServiceGrid } from "@/components/public/service-grid";
import { ButtonLink } from "@/components/shared/button-link";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import type { DivisionConfig } from "@/config/site";
import type { Project, Service } from "@/types/domain";

export function DivisionPage({ division, services, projects }: { division: DivisionConfig; services: Service[]; projects: Project[] }) {
  return (
    <>
      <PageHero eyebrow={division.eyebrow} title={division.name} description={division.summary} current={division.name} />
      <section className="section-reveal bg-soft-cream py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <SectionHeading eyebrow="Our approach" title={`A considered ${division.name.toLowerCase()} perspective.`} />
          <p className="border-t border-deep-olive/15 pt-7 text-base leading-8 text-body-copy sm:text-lg sm:leading-9">{division.overview}</p>
        </Container>
      </section>
      <section className="section-reveal border-y border-deep-olive/10 bg-warm-ivory py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="What we do" title={`${division.name} expertise, delivered with purpose.`} description="Explore the confirmed capabilities Stalwart Realtors brings to every client relationship." />
          {services.length ? <div className="mt-12"><ServiceGrid services={services} /></div> : <EmptyState className="mt-12" title="Services awaiting confirmation" description="Detailed services will appear here after the business confirms which capabilities are active." />}
        </Container>
      </section>
      <section className="architectural-grid section-reveal bg-deep-olive py-20 text-soft-cream sm:py-28">
        <Container>
          <SectionHeading eyebrow="How we work" title="A clear path forward." description="The exact scope is shaped around the requirement, with transparent communication throughout." tone="dark" />
          <ol className="mt-12 grid gap-px bg-warm-ivory/15 md:grid-cols-3">
            {division.process.map((step, index) => <li key={step.title} className="bg-deep-olive p-8"><span className="font-heading text-4xl text-champagne-gold">0{index + 1}</span><h3 className="mt-6 font-heading text-2xl">{step.title}</h3><p className="mt-3 text-sm leading-7 text-warm-ivory/65">{step.description}</p></li>)}
          </ol>
        </Container>
      </section>
      <section className="section-reveal bg-soft-cream py-20 sm:py-28">
        <Container>
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"><SectionHeading eyebrow="Relevant projects" title={`Published ${division.name.toLowerCase()} work.`} /><ButtonLink href={`/projects?category=${division.slug}`} variant="outline">All projects</ButtonLink></div>
          {projects.length ? <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div> : <EmptyState className="mt-12" title="No verified project is published in this division" description="Projects will appear only after their information has been approved for public release." />}
        </Container>
      </section>
      <section className="travertine-texture border-t border-deep-olive/10 py-16 sm:py-20"><Container className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold tracking-[0.18em] text-deep-olive uppercase">Start with your requirement</p><h2 className="mt-3 font-heading text-3xl text-charcoal sm:text-4xl">Discuss a {division.name.toLowerCase()} need.</h2></div><ButtonLink href={`/contact?type=${division.slug}`}>Make an inquiry</ButtonLink></Container></section>
    </>
  );
}
