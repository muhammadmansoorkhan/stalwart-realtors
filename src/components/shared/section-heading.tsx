import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className,
}: SectionHeadingProps) {
  const isDark = tone === "dark";

  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <div
        className={cn(
          "mb-5 flex items-center gap-3 text-[0.7rem] font-bold tracking-[0.24em] uppercase",
          align === "center" && "justify-center",
          isDark ? "text-champagne-gold" : "text-deep-olive",
        )}
      >
        <span
          className="h-px w-9 bg-champagne-gold"
          aria-hidden="true"
        />
        {eyebrow}
      </div>

      <h2
        className={cn(
          "font-heading text-4xl leading-[1.08] font-semibold text-balance sm:text-5xl lg:text-6xl",
          isDark ? "text-soft-cream" : "text-charcoal",
        )}
      >
        {title}
      </h2>

      {description ? (
        <p
          className={cn(
            "mt-6 max-w-2xl text-base leading-8 sm:text-lg",
            align === "center" && "mx-auto",
            isDark ? "text-warm-ivory/75" : "text-charcoal/70",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}