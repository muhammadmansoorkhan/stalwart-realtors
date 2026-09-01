import Link from "next/link";

export default function NotFound() {
  return <main id="main-content" className="architectural-grid flex min-h-screen items-center justify-center bg-deep-olive px-5 text-center text-soft-cream"><div><p className="font-heading text-8xl text-champagne-gold">404</p><h1 className="mt-5 font-heading text-4xl">This page could not be found.</h1><p className="mx-auto mt-4 max-w-md text-sm leading-7 text-warm-ivory/65">The page may have moved, or the project may not be published.</p><Link href="/" className="mt-8 inline-flex min-h-12 items-center bg-soft-cream px-6 text-xs font-bold tracking-[0.1em] text-charcoal uppercase">Return home</Link></div></main>;
}
