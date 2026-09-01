import Link from "next/link";

import { Container } from "@/components/shared/container";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  current: string;
};

export function PageHero({ eyebrow, title, description, current }: PageHeroProps) {
  return (
    <section className="architectural-grid relative overflow-hidden bg-deep-olive py-20 text-soft-cream sm:py-24 lg:py-32">
      <div className="absolute inset-y-0 right-[12%] w-px bg-champagne-gold/30" aria-hidden="true" />
      <div className="absolute right-[12%] bottom-0 h-40 w-40 border-t border-l border-champagne-gold/30" aria-hidden="true" />
      <Container className="relative">
        <nav className="mb-10 flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.16em] text-warm-ivory/60 uppercase" aria-label="Breadcrumb">
          <Link href="/" className="transition-colors hover:text-soft-cream">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="text-champagne-gold">{current}</span>
        </nav>
        <p className="text-xs font-bold tracking-[0.22em] text-champagne-gold uppercase">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl font-heading text-5xl leading-[1.05] font-semibold text-balance sm:text-6xl lg:text-8xl">{title}</h1>
        <p className="mt-7 max-w-2xl text-base leading-8 text-warm-ivory/72 sm:text-lg">{description}</p>
      </Container>
    </section>
  );
}
