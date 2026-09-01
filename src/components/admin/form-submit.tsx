"use client";

import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";

export function FormSubmit({ children, pendingLabel = "Saving…", className }: { children: React.ReactNode; pendingLabel?: string; className?: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className={cn("min-h-11 bg-deep-olive px-5 text-xs font-bold tracking-[0.08em] text-soft-cream uppercase transition-colors hover:bg-charcoal disabled:cursor-wait disabled:opacity-55", className)}>{pending ? pendingLabel : children}</button>;
}
