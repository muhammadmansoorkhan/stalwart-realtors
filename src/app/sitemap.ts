import type { MetadataRoute } from "next";

import { getPublishedProjects } from "@/lib/data/public";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const pages = ["", "/about", "/real-estate", "/construction", "/development", "/projects", "/contact", "/privacy", "/terms"];
  const projects = await getPublishedProjects();
  return [
    ...pages.map((path) => ({ url: `${siteUrl}${path}`, changeFrequency: path === "" ? "weekly" as const : "monthly" as const, priority: path === "" ? 1 : 0.7 })),
    ...projects.map((project) => ({ url: `${siteUrl}/projects/${project.slug}`, lastModified: project.updated_at, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
