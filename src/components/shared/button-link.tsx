import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: "primary" | "light" | "outline" | "text";
  showArrow?: boolean;
};

export function ButtonLink({
  className,
  children,
  variant = "primary",
  showArrow = true,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 px-6 py-3 text-xs font-bold tracking-[0.1em] uppercase transition-all",
        variant === "primary" && "bg-deep-olive text-soft-cream hover:bg-charcoal",
        variant === "light" && "bg-soft-cream text-charcoal hover:bg-warm-ivory",
        variant === "outline" &&
          "border border-champagne-gold/60 text-charcoal hover:border-champagne-gold hover:bg-champagne-gold/10",
        variant === "text" && "min-h-0 justify-start px-0 py-1 text-deep-olive hover:text-champagne-gold",
        className,
      )}
      {...props}
    >
      {children}
      {showArrow ? <ArrowUpRight aria-hidden="true" size={16} /> : null}
    </Link>
  );
}
