import { Download, MapPin, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectCard } from "@/components/public/project-card";
import { SiteVisitForm } from "@/components/public/site-visit-form";
import { ButtonLink } from "@/components/shared/button-link";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatusPill } from "@/components/shared/status-pill";
import { getPublishedProjectBySlug, getRelatedProjects, getSiteSettings, getWhatsappUrl, isSafeMapEmbedUrl } from "@/lib/data/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  const socialImages = project.cover_image_url
    ? [{ url: project.cover_image_url, alt: project.cover_image_alt ?? project.name }]
    : [];
  return {
    title: project.name,
    description: project.short_description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.name} | Stalwart Realtors`,
      description: project.short_description,
      type: "article",
      images: socialImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} | Stalwart Realtors`,
      description: project.short_description,
      images: socialImages.map((image) => image.url),
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) notFound();
  const [related, settings] = await Promise.all([getRelatedProjects(project), getSiteSettings()]);
  const whatsappUrl = getWhatsappUrl(settings.whatsapp, `I would like more information about ${project.name}.`);

  return (
    <>
      <section className="relative min-h-[68svh] overflow-hidden bg-deep-olive text-soft-cream">
        {project.cover_image_url ? <Image src={project.cover_image_url} alt={project.cover_image_alt ?? project.name} fill sizes="100vw" className="object-cover" priority unoptimized /> : <div className="architectural-grid absolute inset-0" />}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(39,41,37,0.92),rgba(39,41,37,0.42)_65%,rgba(39,41,37,0.62))]" />
        <Container className="relative flex min-h-[68svh] flex-col justify-end py-16 sm:py-20">
          <nav className="mb-auto flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.14em] text-warm-ivory/65 uppercase" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/projects">Projects</Link><span>/</span><span className="text-champagne-gold">{project.name}</span></nav>
          <div className="flex flex-wrap gap-3"><StatusPill value={project.category} className="text-champagne-gold" /><StatusPill value={project.status} className="text-soft-cream" /></div>
          <h1 className="mt-5 max-w-5xl font-heading text-5xl leading-none font-semibold sm:text-7xl lg:text-8xl">{project.name}</h1>
          {project.location ? <p className="mt-6 flex items-center gap-2 text-sm text-warm-ivory/75"><MapPin aria-hidden="true" size={17} />{project.location}</p> : null}
        </Container>
      </section>

      <section className="bg-soft-cream py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
          <article><p className="text-xs font-bold tracking-[0.2em] text-deep-olive uppercase">Project overview</p><h2 className="mt-5 font-heading text-4xl leading-tight text-charcoal sm:text-5xl">{project.short_description}</h2><div className="prose-stalwart mt-8 text-base leading-8 text-body-copy">{project.overview.split(/\n\s*\n/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></article>
          <aside className="border-t border-champagne-gold pt-7 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
            <dl className="space-y-6 text-sm"><Info label="Category" value={project.category.replace("-", " ")} /><Info label="Status" value={project.status} />{project.location ? <Info label="Location" value={project.location} /> : null}{project.completion_date ? <Info label="Completion" value={new Intl.DateTimeFormat("en", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(project.completion_date))} /> : null}</dl>
            <div className="mt-8 grid gap-3"><ButtonLink href="#site-visit">Request a site visit</ButtonLink>{whatsappUrl ? <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 border border-deep-olive/20 px-5 text-xs font-bold tracking-[0.08em] text-deep-olive uppercase"><MessageCircle aria-hidden="true" size={16} />WhatsApp inquiry</a> : null}{project.brochure_url ? <a href={project.brochure_url} className="inline-flex min-h-12 items-center justify-center gap-2 border border-champagne-gold/60 px-5 text-xs font-bold tracking-[0.08em] text-charcoal uppercase"><Download aria-hidden="true" size={16} />Download brochure</a> : null}</div>
          </aside>
        </Container>
      </section>

      {project.features.length || project.amenities.length ? <section className="border-y border-deep-olive/10 bg-warm-ivory py-20 sm:py-24"><Container className="grid gap-12 lg:grid-cols-2">{project.features.length ? <ListBlock title="Features" items={project.features} /> : null}{project.amenities.length ? <ListBlock title="Amenities" items={project.amenities} /> : null}</Container></section> : null}

      {project.project_images?.some((image) => image.signed_url) ? <section className="bg-charcoal py-20 text-soft-cream sm:py-28"><Container><SectionHeading eyebrow="Project gallery" title="A closer look." tone="dark" /><div className="mt-12 grid gap-4 md:grid-cols-2">{project.project_images.filter((image) => image.signed_url).map((image, index) => <div key={image.id} className={index === 0 ? "relative aspect-[16/9] overflow-hidden md:col-span-2" : "relative aspect-[4/3] overflow-hidden"}><Image src={image.signed_url!} alt={image.alt_text} fill sizes={index === 0 ? "100vw" : "(max-width: 768px) 100vw, 50vw"} className="object-cover" unoptimized /></div>)}</div></Container></section> : null}

      {project.development_timeline.length ? <section className="travertine-texture py-20 sm:py-28"><Container><SectionHeading eyebrow="Development timeline" title="Progress in context." /><ol className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">{project.development_timeline.map((item, index) => <li key={`${item.title}-${index}`} className="border-t border-champagne-gold pt-6"><span className="font-heading text-3xl text-champagne-gold">{String(index + 1).padStart(2, "0")}</span><h3 className="mt-3 font-heading text-2xl text-charcoal">{item.title}</h3><p className="mt-3 text-sm leading-7 text-body-copy-muted">{item.detail}</p></li>)}</ol></Container></section> : null}

      {isSafeMapEmbedUrl(project.map_embed_url) ? <section className="bg-soft-cream py-20"><Container><SectionHeading eyebrow="Location" title="View the verified map." /><iframe title={`Map for ${project.name}`} src={project.map_embed_url!} className="mt-10 h-[28rem] w-full border border-deep-olive/12" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></Container></section> : project.map_url ? <section className="border-t border-deep-olive/10 bg-soft-cream py-12"><Container><a href={project.map_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-deep-olive"><MapPin aria-hidden="true" size={18} />Open verified map location</a></Container></section> : null}

      <section id="site-visit" className="scroll-mt-36 border-t border-deep-olive/10 bg-warm-ivory py-20 sm:py-28"><Container className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20"><div><SectionHeading eyebrow="Visit request" title="Request a closer look." description="Choose a preferred date and time. The request remains pending until a representative confirms availability." />{whatsappUrl ? <p className="mt-8 text-sm leading-7 text-body-copy-muted">For a general project question, you can also use the verified WhatsApp channel.</p> : null}</div><div className="border border-deep-olive/12 bg-soft-cream p-6 sm:p-9"><SiteVisitForm projects={[project]} initialProjectId={project.id} configured={isSupabaseConfigured()} /></div></Container></section>

      {related.length ? <section className="bg-soft-cream py-20 sm:py-28"><Container><div className="flex items-end justify-between gap-8"><SectionHeading eyebrow="Related projects" title="Explore more." /><ButtonLink href="/projects" variant="outline" className="hidden sm:inline-flex">All projects</ButtonLink></div><div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{related.map((item) => <ProjectCard key={item.id} project={item} />)}</div></Container></section> : null}
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) { return <div><dt className="text-[0.65rem] font-bold tracking-[0.14em] text-charcoal/45 uppercase">{label}</dt><dd className="mt-1 capitalize text-charcoal">{value}</dd></div>; }
function ListBlock({ title, items }: { title: string; items: string[] }) { return <div><h2 className="font-heading text-4xl text-charcoal">{title}</h2><ul className="mt-7 grid gap-3 sm:grid-cols-2">{items.map((item) => <li key={item} className="border-l border-champagne-gold py-1 pl-4 text-sm text-body-copy">{item}</li>)}</ul></div>; }
