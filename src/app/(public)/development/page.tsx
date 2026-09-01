import type { Metadata } from "next";
import { DivisionPage } from "@/components/public/division-page";
import { divisions } from "@/config/site";
import { getActiveServices, getPublishedProjects } from "@/lib/data/public";

export const metadata: Metadata = { title: "Development", description: "Explore the responsible development perspective of Stalwart Realtors." };
export default async function DevelopmentPage() {
  const division = divisions[2];
  const [services, projects] = await Promise.all([getActiveServices(division.slug), getPublishedProjects({ category: division.slug })]);
  return <DivisionPage division={division} services={services} projects={projects} />;
}
