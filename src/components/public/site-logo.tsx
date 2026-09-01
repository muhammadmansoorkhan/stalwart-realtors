import Image from "next/image";

import { cn } from "@/lib/utils";

type SiteLogoProps = {
  tone?: "dark" | "light";
  compact?: boolean;
  className?: string;
};

export function SiteLogo({
  tone = "dark",
  compact = false,
  className,
}: SiteLogoProps) {
  const isLight = tone === "light";

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Image
        src="/brand/stalwart-logo.jpeg"
        alt=""
        aria-hidden="true"
        width={56}
        height={56}
        sizes="56px"
        className={cn(
          "h-12 w-12 shrink-0 rounded-full object-cover ring-1",
          isLight ? "ring-travertine-beige/45" : "ring-deep-olive/18",
        )}
      />

      <span className="min-w-0">
        <span
          className={cn(
            "block font-heading text-xl leading-none font-semibold tracking-[0.015em] sm:text-2xl",
            isLight ? "text-soft-cream" : "text-charcoal",
          )}
        >
          Stalwart
        </span>

        {!compact ? (
          <span
            className={cn(
              "mt-1 block text-[0.58rem] leading-none font-bold tracking-[0.32em] uppercase",
              isLight ? "text-travertine-beige" : "text-deep-olive",
            )}
          >
            Realtors
          </span>
        ) : null}
      </span>
    </span>
  );
}
