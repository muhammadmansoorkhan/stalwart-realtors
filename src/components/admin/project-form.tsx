"use client";

import { ArrowDown, ArrowUp, ExternalLink, FileText, ImagePlus, Save, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

import { FormSubmit } from "@/components/admin/form-submit";
import { saveProjectAction, type AdminActionState } from "@/lib/actions/admin";
import { toProjectSlug } from "@/lib/validation";
import type { Project, ProjectImage } from "@/types/domain";

export function ProjectForm({ project }: { project?: Project | null }) {
  const router = useRouter();
  const [state, action] = useActionState(saveProjectAction, { status: "idle", message: "" } satisfies AdminActionState);
  const [name, setName] = useState(project?.name ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [gallery, setGallery] = useState<ProjectImage[]>(project?.project_images ?? []);
  const [removeIds, setRemoveIds] = useState<string[]>([]);

  useEffect(() => {
    if (state.redirectTo && (!project || state.status === "success")) router.replace(state.redirectTo);
  }, [state.redirectTo, state.status, project, router]);

  function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= gallery.length) return;
    setGallery((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function removeImage(id: string) {
    setRemoveIds((current) => [...current, id]);
    setGallery((current) => current.filter((image) => image.id !== id));
  }

  return (
    <form action={action} className="grid gap-7">
      <input type="hidden" name="projectId" value={project?.id ?? ""} />
      <input type="hidden" name="oldCoverPath" value={project?.cover_image_path ?? ""} />
      <input type="hidden" name="oldBrochurePath" value={project?.brochure_path ?? ""} />
      <input type="hidden" name="galleryOrder" value={gallery.map((image) => image.id).join(",")} />
      <input type="hidden" name="removeImageIds" value={removeIds.join(",")} />

      <AdminPanel title="Project identity" description="Use only information approved for this project.">
        <div className="grid gap-5 sm:grid-cols-2"><AdminField label="Project name"><input name="name" required value={name} onChange={(event) => setName(event.target.value)} className="form-control" /></AdminField><AdminField label="URL slug"><div className="flex"><input name="slug" required value={slug} onChange={(event) => setSlug(event.target.value)} className="form-control" /><button type="button" onClick={() => setSlug(toProjectSlug(name))} className="border border-l-0 border-deep-olive/15 px-3 text-[0.62rem] font-bold tracking-[0.08em] uppercase">Generate</button></div></AdminField></div>
        <div className="grid gap-5 sm:grid-cols-3"><AdminField label="Category"><select name="category" defaultValue={project?.category ?? "real-estate"} className="form-control"><option value="real-estate">Real Estate</option><option value="construction">Construction</option><option value="development">Development</option></select></AdminField><AdminField label="Status"><select name="status" defaultValue={project?.status ?? "upcoming"} className="form-control"><option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option></select></AdminField><AdminField label="Location (verified only)"><input name="location" defaultValue={project?.location ?? ""} className="form-control" /></AdminField></div>
        <AdminField label="Short description" hint="20–320 characters; shown on project cards."><textarea name="shortDescription" required minLength={20} maxLength={320} defaultValue={project?.short_description ?? ""} rows={3} className="form-control resize-y" /></AdminField>
        <AdminField label="Full overview"><textarea name="overview" required minLength={40} defaultValue={project?.overview ?? ""} rows={10} className="form-control resize-y" /></AdminField>
      </AdminPanel>

      <AdminPanel title="Details" description="Enter one feature or amenity per line. Timeline format: Title | Detail.">
        <div className="grid gap-5 lg:grid-cols-2"><AdminField label="Features"><textarea name="features" defaultValue={project?.features.join("\n") ?? ""} rows={7} className="form-control resize-y" /></AdminField><AdminField label="Amenities"><textarea name="amenities" defaultValue={project?.amenities.join("\n") ?? ""} rows={7} className="form-control resize-y" /></AdminField></div>
        <AdminField label="Development timeline"><textarea name="timeline" defaultValue={project?.development_timeline.map((item) => `${item.title} | ${item.detail}`).join("\n") ?? ""} rows={6} className="form-control resize-y" /></AdminField>
        <div className="grid gap-5 sm:grid-cols-2"><AdminField label="Optional completion date"><input name="completionDate" type="date" defaultValue={project?.completion_date ?? ""} className="form-control" /></AdminField><AdminField label="Verified Google Maps URL"><input name="mapUrl" type="url" defaultValue={project?.map_url ?? ""} placeholder="https://…" className="form-control" /></AdminField></div>
        <AdminField label="Google Maps embed URL" hint="Only google.com/maps/embed HTTPS URLs render as an iframe."><input name="mapEmbedUrl" type="url" defaultValue={project?.map_embed_url ?? ""} placeholder="https://www.google.com/maps/embed…" className="form-control" /></AdminField>
      </AdminPanel>

      <AdminPanel title="Media" description="Private storage is used; the public site receives short-lived signed URLs.">
        {project?.cover_image_url ? <div className="relative aspect-[16/7] max-w-3xl overflow-hidden bg-deep-olive"><Image src={project.cover_image_url} alt={project.cover_image_alt ?? project.name} fill sizes="800px" className="object-cover" unoptimized /></div> : null}
        <div className="grid gap-5 sm:grid-cols-2"><AdminField label={project?.cover_image_path ? "Replace cover image" : "Cover image"} hint="Image, maximum 10 MB."><input name="coverImage" type="file" accept="image/*" className="form-control file:mr-4 file:border-0 file:bg-deep-olive file:px-3 file:py-2 file:text-xs file:text-soft-cream" /></AdminField><AdminField label="Cover image alternative text"><input name="coverImageAlt" defaultValue={project?.cover_image_alt ?? ""} className="form-control" /></AdminField></div>
        <div className="grid gap-5 sm:grid-cols-2"><AdminField label="Add gallery images" hint="Up to 20 images per save; maximum 10 MB each."><input name="galleryImages" type="file" accept="image/*" multiple className="form-control file:mr-4 file:border-0 file:bg-deep-olive file:px-3 file:py-2 file:text-xs file:text-soft-cream" /></AdminField><AdminField label="Alt text for new gallery images"><input name="galleryAlt" defaultValue={`${project?.name ?? "Project"} gallery image`} className="form-control" /></AdminField></div>
        {gallery.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{gallery.map((image, index) => <div key={image.id} className="border border-deep-olive/12 bg-soft-cream p-3"><div className="relative aspect-[4/3] overflow-hidden bg-warm-ivory">{image.signed_url ? <Image src={image.signed_url} alt={image.alt_text} fill sizes="300px" className="object-cover" unoptimized /> : null}</div><p className="mt-2 line-clamp-1 text-xs text-charcoal/55">{image.alt_text}</p><div className="mt-3 flex gap-2"><button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0} className="inline-flex h-9 w-9 items-center justify-center border border-deep-olive/15 disabled:opacity-25" aria-label="Move image earlier"><ArrowUp aria-hidden="true" size={15} /></button><button type="button" onClick={() => moveImage(index, 1)} disabled={index === gallery.length - 1} className="inline-flex h-9 w-9 items-center justify-center border border-deep-olive/15 disabled:opacity-25" aria-label="Move image later"><ArrowDown aria-hidden="true" size={15} /></button><button type="button" onClick={() => removeImage(image.id)} className="ml-auto inline-flex h-9 w-9 items-center justify-center border border-red-700/20 text-red-700" aria-label="Remove gallery image"><Trash2 aria-hidden="true" size={15} /></button></div></div>)}</div> : null}
        <AdminField label={project?.brochure_path ? "Replace brochure" : "Project brochure"} hint="PDF, maximum 20 MB."><input name="brochure" type="file" accept="application/pdf" className="form-control file:mr-4 file:border-0 file:bg-deep-olive file:px-3 file:py-2 file:text-xs file:text-soft-cream" /></AdminField>
        {project?.brochure_url ? <a href={project.brochure_url} className="inline-flex items-center gap-2 text-xs font-bold text-deep-olive"><FileText aria-hidden="true" size={16} />Download current brochure</a> : null}
      </AdminPanel>

      <AdminPanel title="Publishing" description="A project cannot be published until its information is explicitly marked verified and complete.">
        <div className="grid gap-4 sm:grid-cols-3"><Toggle name="informationComplete" label="Information verified" defaultChecked={project?.information_complete ?? false} /><Toggle name="published" label="Published" defaultChecked={project?.published ?? false} /><Toggle name="featured" label="Featured" defaultChecked={project?.featured ?? false} /></div>
      </AdminPanel>

      {state.message ? <p role="status" className={state.status === "success" ? "border-l-2 border-deep-olive pl-4 text-sm text-deep-olive" : "border-l-2 border-red-700 pl-4 text-sm text-red-700"}>{state.message}</p> : null}
      <div className="sticky bottom-4 z-20 flex flex-wrap items-center gap-3 border border-deep-olive/12 bg-soft-cream/95 p-3 shadow-[0_18px_45px_rgb(39_41_37/0.16)] backdrop-blur"><FormSubmit pendingLabel="Saving project…"><span className="inline-flex items-center gap-2"><Save aria-hidden="true" size={15} />Save project</span></FormSubmit>{project ? <><Link href={`/admin/preview/projects/${project.id}`} target="_blank" className="inline-flex min-h-11 items-center gap-2 border border-deep-olive/15 px-4 text-xs font-bold tracking-[0.06em] text-charcoal uppercase"><ExternalLink aria-hidden="true" size={15} />Preview</Link><label className="ml-auto inline-flex min-h-11 cursor-pointer items-center gap-2 border border-deep-olive/15 px-4 text-xs font-bold text-charcoal"><ImagePlus aria-hidden="true" size={15} />Media can be replaced above</label></> : null}</div>
    </form>
  );
}

function AdminPanel({ title, description, children }: { title: string; description: string; children: React.ReactNode }) { return <section className="border border-deep-olive/12 bg-soft-cream p-5 sm:p-7"><div className="mb-6 border-b border-deep-olive/10 pb-5"><h2 className="font-heading text-2xl text-charcoal">{title}</h2><p className="mt-2 text-xs leading-6 text-charcoal/50">{description}</p></div><div className="grid gap-5">{children}</div></section>; }
function AdminField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) { return <label className="grid gap-2 text-xs font-bold tracking-[0.07em] text-charcoal uppercase"><span>{label}</span>{children}{hint ? <span className="font-medium tracking-normal text-charcoal/45 normal-case">{hint}</span> : null}</label>; }
function Toggle({ name, label, defaultChecked }: { name: string; label: string; defaultChecked: boolean }) { return <label className="flex min-h-12 items-center gap-3 border border-deep-olive/12 bg-warm-ivory/40 px-4 text-xs font-bold text-charcoal"><input name={name} type="checkbox" defaultChecked={defaultChecked} className="h-4 w-4 accent-deep-olive" />{label}</label>; }
