"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { submitInquiry, type PublicActionState } from "@/lib/actions/public";
import type { Project } from "@/types/domain";

type InquiryFields = {
  fullName: string;
  phone: string;
  email: string;
  inquiryType: "real-estate" | "construction" | "development" | "investment" | "general";
  projectId: string;
  message: string;
  consent: boolean;
  website: string;
};

export function InquiryForm({ projects, configured }: { projects: Project[]; configured: boolean }) {
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<InquiryFields>({
    defaultValues: { inquiryType: "general", projectId: "", consent: false, website: "" },
  });
  const [state, setState] = useState<PublicActionState>({ status: "idle", message: "" });

  function onSubmit(values: InquiryFields) {
    startTransition(async () => {
      const result = await submitInquiry(values);
      setState(result);
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, messages]) => {
          if (messages?.[0]) setError(field as keyof InquiryFields, { message: messages[0] });
        });
      }
      if (result.status === "success") reset();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" error={errors.fullName?.message}><input {...register("fullName", { required: "Enter your full name." })} autoComplete="name" className="form-control" /></Field>
        <Field label="Phone number" error={errors.phone?.message}><input {...register("phone", { required: "Enter your phone number." })} type="tel" autoComplete="tel" className="form-control" /></Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email (optional)" error={errors.email?.message}><input {...register("email")} type="email" autoComplete="email" className="form-control" /></Field>
        <Field label="Inquiry type" error={errors.inquiryType?.message}>
          <select {...register("inquiryType")} className="form-control"><option value="real-estate">Real Estate</option><option value="construction">Construction</option><option value="development">Development</option><option value="investment">Investment</option><option value="general">General Inquiry</option></select>
        </Field>
      </div>
      {projects.length ? (
        <Field label="Related project (optional)" error={errors.projectId?.message}><select {...register("projectId")} className="form-control"><option value="">No specific project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></Field>
      ) : null}
      <Field label="How can we help?" error={errors.message?.message}><textarea {...register("message", { required: "Tell us how we can help.", minLength: { value: 10, message: "Please add a little more detail." } })} rows={6} className="form-control resize-y" /></Field>
      <input {...register("website")} className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label className="flex items-start gap-3 text-xs leading-6 text-charcoal/65"><input {...register("consent", { required: "Consent is required." })} type="checkbox" className="mt-1 h-4 w-4 accent-deep-olive" />I agree that Stalwart Realtors may use these details to respond to my inquiry.</label>
      {errors.consent ? <p className="text-xs text-red-700">{errors.consent.message}</p> : null}
      {state.message ? <p role="status" className={state.status === "success" ? "text-sm text-deep-olive" : "text-sm text-red-700"}>{state.message}</p> : null}
      {!configured ? <p className="border-l-2 border-champagne-gold pl-4 text-xs leading-6 text-charcoal/60">Online submissions will activate when the secure database is connected.</p> : null}
      <button type="submit" disabled={pending || !configured} className="min-h-12 justify-self-start bg-deep-olive px-7 text-xs font-bold tracking-[0.1em] text-soft-cream uppercase transition-colors hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-45">{pending ? "Sending…" : "Send inquiry"}</button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className="grid gap-2 text-xs font-bold tracking-[0.08em] text-charcoal uppercase"><span>{label}</span>{children}{error ? <span className="font-medium tracking-normal text-red-700 normal-case">{error}</span> : null}</label>;
}
