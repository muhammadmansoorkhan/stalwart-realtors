import { Building2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={cn("border border-deep-olive/15 bg-warm-ivory/45 px-6 py-14 text-center sm:px-10", className)}>
      <Building2 className="mx-auto text-champagne-gold" aria-hidden="true" size={34} strokeWidth={1.5} />
      <h3 className="mt-5 font-heading text-2xl font-semibold text-charcoal">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-body-copy-muted">{description}</p>
    </div>
  );
}
