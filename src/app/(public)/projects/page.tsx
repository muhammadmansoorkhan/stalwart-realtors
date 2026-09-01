import type { Metadata } from "next";

import { ProjectsFilter } from "@/components/public/projects-filter";
import { Container } from "@/components/shared/container";
import { PageHero } from "@/components/shared/page-hero";
import { getPublishedProjects } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore verified, published Stalwart Realtors projects across real estate, construction, and development.",
};

type Props = { searchParams: Promise<{ category?: string }> };

export default async function ProjectsPage({ searchParams }: Props) {
  const [{ category }, projects] = await Promise.all([searchParams, getPublishedProjects()]);
  const initialCategory = ["real-estate", "construction", "development"].includes(category ?? "") ? category : "all";
  return (
    <>
      <PageHero eyebrow="Verified portfolio" title="Projects published with clarity." description="Search and filter approved project information across the three Stalwart Realtors divisions." current="Projects" />
      <section className="bg-soft-cream py-16 sm:py-24"><Container><ProjectsFilter projects={projects} initialCategory={initialCategory} /></Container></section>
    </>
  );
}
