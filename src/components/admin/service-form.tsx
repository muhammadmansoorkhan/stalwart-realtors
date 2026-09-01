"use client";

import { useActionState, useState } from "react";

import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { FormSubmit } from "@/components/admin/form-submit";
import { deleteServiceAction, saveServiceAction, type AdminActionState } from "@/lib/actions/admin";
import { toProjectSlug } from "@/lib/validation";
import type { Service } from "@/types/domain";

const icons = ["building", "compass", "hammer", "home", "key", "land", "location", "paint", "ruler", "shield", "sparkles", "trees"];

export function ServiceForm({ service }: { service?: Service }) {
  const [state, action] = useActionState(saveServiceAction, { status: "idle", message: "" } satisfies AdminActionState);
  const [title, setTitle] = useState(service?.title ?? "");
  const [slug, setSlug] = useState(service?.slug ?? "");
  return (
    <div className="border border-deep-olive/12 bg-soft-cream">
      <details open={!service}>
        <summary className="cursor-pointer list-none px-5 py-5"><div className="flex items-center justify-between gap-4"><div><h2 className="font-heading text-2xl text-charcoal">{service?.title ?? "Add a service"}</h2><p className="mt-1 text-xs capitalize text-charcoal/45">{service ? `${service.division.replace("-", " ")} · ${service.is_active ? "Active" : "Hidden"}` : "Publish only confirmed capabilities"}</p></div><span className="text-xs font-bold tracking-[0.08em] text-deep-olive uppercase">Edit</span></div></summary>
        <form action={action} className="grid gap-5 border-t border-deep-olive/10 p-5">
          <input type="hidden" name="id" value={service?.id ?? ""} />
          <div className="grid gap-5 sm:grid-cols-2"><Field label="Title"><input name="title" required value={title} onChange={(event) => setTitle(event.target.value)} className="form-control" /></Field><Field label="Slug"><div className="flex"><input name="slug" required value={slug} onChange={(event) => setSlug(event.target.value)} className="form-control" /><button type="button" onClick={() => setSlug(toProjectSlug(title))} className="border border-l-0 border-deep-olive/15 px-3 text-[0.62rem] font-bold uppercase">Generate</button></div></Field></div>
          <div className="grid gap-5 sm:grid-cols-3"><Field label="Division"><select name="division" defaultValue={service?.division ?? "real-estate"} className="form-control"><option value="real-estate">Real Estate</option><option value="construction">Construction</option><option value="development">Development</option></select></Field><Field label="Icon"><select name="icon" defaultValue={service?.icon ?? "building"} className="form-control">{icons.map((icon) => <option key={icon} value={icon}>{icon}</option>)}</select></Field><Field label="Display order"><input name="sortOrder" type="number" min="0" defaultValue={service?.sort_order ?? 0} className="form-control" /></Field></div>
          <Field label="Short description"><textarea name="shortDescription" required minLength={10} maxLength={300} defaultValue={service?.short_description ?? ""} rows={3} className="form-control resize-y" /></Field>
          <Field label="Detailed description (optional)"><textarea name="detailedDescription" defaultValue={service?.detailed_description ?? ""} rows={5} className="form-control resize-y" /></Field>
          <label className="flex items-center gap-3 text-xs font-bold text-charcoal"><input name="isActive" type="checkbox" defaultChecked={service?.is_active ?? false} className="h-4 w-4 accent-deep-olive" />Confirmed and active on the public website</label>
          {state.message ? <p role="status" className={state.status === "success" ? "text-sm text-deep-olive" : "text-sm text-red-700"}>{state.message}</p> : null}
          <div className="flex flex-wrap gap-3"><FormSubmit>{service ? "Save service" : "Add service"}</FormSubmit>{service ? <ConfirmSubmit formAction={deleteServiceAction.bind(null, service.id)} message={`Delete ${service.title}?`} className="min-h-11 border border-red-700/25 px-4 text-xs font-bold text-red-700">Delete</ConfirmSubmit> : null}</div>
        </form>
      </details>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-2 text-xs font-bold tracking-[0.07em] text-charcoal uppercase"><span>{label}</span>{children}</label>; }
