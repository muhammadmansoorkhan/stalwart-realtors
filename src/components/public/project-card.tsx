import { ArrowUpRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { StatusPill } from "@/components/shared/status-pill";
import type { Project } from "@/types/domain";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col border border-deep-olive/12 bg-soft-cream">
      <Link href={`/projects/${project.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-deep-olive" aria-label={`View ${project.name}`}>
        {project.cover_image_url ? (
          <Image src={project.cover_image_url} alt={project.cover_image_alt ?? project.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" unoptimized />
        ) : (
          <div className="architectural-grid absolute inset-0 flex items-end bg-deep-olive p-6">
            <div className="h-24 w-32 border-t border-l border-champagne-gold/60" aria-hidden="true" />
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
          <StatusPill value={project.status} className="bg-soft-cream/95 text-deep-olive" />
          {project.featured ? <StatusPill value="Featured" className="bg-champagne-gold text-charcoal" /> : null}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className="text-[0.68rem] font-bold tracking-[0.16em] text-champagne-gold uppercase">{project.category.replace("-", " ")}</p>
        <h3 className="mt-3 font-heading text-2xl font-semibold text-charcoal sm:text-3xl">
          <Link href={`/projects/${project.slug}`} className="transition-colors hover:text-deep-olive">{project.name}</Link>
        </h3>
        {project.location ? <p className="mt-3 flex items-center gap-2 text-xs text-charcoal/55"><MapPin aria-hidden="true" size={14} />{project.location}</p> : null}
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-charcoal/65">{project.short_description}</p>
        <Link href={`/projects/${project.slug}`} className="mt-6 inline-flex items-center gap-2 self-start text-xs font-bold tracking-[0.1em] text-deep-olive uppercase transition-colors hover:text-champagne-gold">
          View project <ArrowUpRight aria-hidden="true" size={15} />
        </Link>
      </div>
    </article>
  );
}
