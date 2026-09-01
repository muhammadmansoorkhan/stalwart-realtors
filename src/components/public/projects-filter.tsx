"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

import { ProjectCard } from "@/components/public/project-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { Project } from "@/types/domain";

export function ProjectsFilter({ projects, initialCategory = "all" }: { projects: Project[]; initialCategory?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [status, setStatus] = useState("all");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesSearch = !normalized || project.name.toLowerCase().includes(normalized) || project.location?.toLowerCase().includes(normalized);
      return matchesSearch && (category === "all" || project.category === category) && (status === "all" || project.status === status);
    });
  }, [projects, query, category, status]);
  const hasFilters = query || category !== "all" || status !== "all";

  return (
    <div>
      <div className="grid gap-4 border border-deep-olive/12 bg-warm-ivory/45 p-4 md:grid-cols-[1fr_0.65fr_0.65fr_auto] md:p-5">
        <label className="relative block">
          <span className="sr-only">Search projects</span><Search className="absolute top-1/2 left-4 -translate-y-1/2 text-charcoal/45" aria-hidden="true" size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or location" className="min-h-12 w-full border border-deep-olive/15 bg-soft-cream pr-4 pl-11 text-sm outline-none transition-colors focus:border-champagne-gold" />
        </label>
        <FilterSelect label="Category" value={category} onChange={setCategory} options={["all", "real-estate", "construction", "development"]} />
        <FilterSelect label="Status" value={status} onChange={setStatus} options={["all", "upcoming", "ongoing", "completed"]} />
        <button type="button" onClick={() => { setQuery(""); setCategory("all"); setStatus("all"); }} disabled={!hasFilters} className="inline-flex min-h-12 items-center justify-center gap-2 border border-deep-olive/15 px-5 text-xs font-bold tracking-[0.08em] uppercase transition-colors hover:border-champagne-gold disabled:cursor-not-allowed disabled:opacity-35">
          {hasFilters ? <X aria-hidden="true" size={16} /> : <SlidersHorizontal aria-hidden="true" size={16} />} Reset
        </button>
      </div>
      <p className="mt-6 text-xs font-semibold tracking-[0.08em] text-charcoal/55 uppercase" aria-live="polite">{filtered.length} {filtered.length === 1 ? "project" : "projects"}</p>
      {filtered.length ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{filtered.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
      ) : (
        <EmptyState className="mt-6" title="No matching projects" description={projects.length ? "Adjust the filters to explore other published projects." : "No verified project has been published yet. The catalogue will update when approved information is available."} />
      )}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label><span className="sr-only">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-12 w-full border border-deep-olive/15 bg-soft-cream px-4 text-sm capitalize outline-none transition-colors focus:border-champagne-gold">{options.map((option) => <option key={option} value={option}>{option.replace("-", " ")}</option>)}</select></label>
  );
}
