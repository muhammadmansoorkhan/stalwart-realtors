"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { submitSiteVisit, type PublicActionState } from "@/lib/actions/public";
import type { Project } from "@/types/domain";

type VisitFields = { fullName: string; phone: string; email: string; projectId: string; preferredDate: string; preferredTime: string; visitorCount: string; message: string; website: string };

export function SiteVisitForm({ projects, configured, initialProjectId = "" }: { projects: Project[]; configured: boolean; initialProjectId?: string }) {
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<PublicActionState>({ status: "idle", message: "" });
  const { register, handleSubmit, reset, setError, clearErrors, formState: { errors } } = useForm<VisitFields>({ defaultValues: { projectId: initialProjectId, visitorCount: "", website: "" } });
  const today = new Date().toISOString().slice(0, 10);

  function onSubmit(values: VisitFields) {
    clearErrors();
    setState({ status: "idle", message: "" });
    startTransition(async () => {
      const result = await submitSiteVisit(values);
      setState(result);
      if (result.fieldErrors) Object.entries(result.fieldErrors).forEach(([field, messages]) => { if (messages?.[0]) setError(field as keyof VisitFields, { message: messages[0] }); });
      if (result.status === "success") reset();
    });
  }

  const available = configured && projects.length > 0;
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5" noValidate aria-busy={pending}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" error={errors.fullName?.message}><input {...register("fullName", { required: "Enter your full name." })} autoComplete="name" className="form-control" /></Field>
        <Field label="Phone number" error={errors.phone?.message}><input {...register("phone", { required: "Enter your phone number.", validate: (value) => { const digits = value.replace(/\D/g, "").length; return (/^[+()\d\s-]+$/.test(value) && digits >= 7 && digits <= 15) || "Enter a valid phone number."; } })} type="tel" autoComplete="tel" className="form-control" /></Field>
      </div>
      <Field label="Email (optional)" error={errors.email?.message}><input {...register("email", { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address." } })} type="email" autoComplete="email" className="form-control" /></Field>
      <Field label="Project" error={errors.projectId?.message}><select {...register("projectId", { required: "Select a project." })} className="form-control"><option value="">Select a published project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></Field>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Preferred date" error={errors.preferredDate?.message}><input {...register("preferredDate", { required: "Choose a date.", validate: (value) => value >= today || "Choose today or a future date." })} type="date" min={today} className="form-control" /></Field>
        <Field label="Preferred time" error={errors.preferredTime?.message}><input {...register("preferredTime", { required: "Choose a time." })} type="time" className="form-control" /></Field>
        <Field label="Visitors (optional)" error={errors.visitorCount?.message}><input {...register("visitorCount")} type="number" min="1" max="30" className="form-control" /></Field>
      </div>
      <Field label="Message (optional)" error={errors.message?.message}><textarea {...register("message")} rows={4} className="form-control resize-y" /></Field>
      <input {...register("website")} className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <p className="text-xs leading-6 text-body-copy-muted">Submitting this form does not confirm a visit. A representative will contact you to confirm availability.</p>
      {state.message ? <p role="status" className={state.status === "success" ? "text-sm text-deep-olive" : "text-sm text-red-700"}>{state.message}</p> : null}
      {!available ? <p className="border-l-2 border-champagne-gold pl-4 text-xs leading-6 text-body-copy-muted">Site-visit requests will activate when a verified project is published.</p> : null}
      <button type="submit" disabled={pending || !available} className="min-h-12 justify-self-start bg-deep-olive px-7 text-xs font-bold tracking-[0.1em] text-soft-cream uppercase transition-colors hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-45">{pending ? "Sending…" : "Request a site visit"}</button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="grid gap-2 text-xs font-bold tracking-[0.08em] text-charcoal uppercase"><span>{label}</span>{children}{error ? <span role="alert" className="font-medium tracking-normal text-red-700 normal-case">{error}</span> : null}</label>;
}
