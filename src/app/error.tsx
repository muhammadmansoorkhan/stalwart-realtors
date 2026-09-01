"use client";

import { useEffect } from "react";

export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("A route failed to render", { digest: error.digest });
  }, [error.digest]);

  return (
    <main id="main-content" className="travertine-texture grid min-h-[70svh] place-items-center px-5 py-20">
      <div className="max-w-xl text-center"><p className="text-[0.7rem] font-bold tracking-[0.2em] text-deep-olive uppercase">Temporary problem</p><h1 className="mt-5 font-heading text-5xl text-charcoal">This section could not be loaded.</h1><p className="mt-5 text-sm leading-7 text-charcoal/65">Please try again. If the problem continues, return later or use a verified contact channel when one is available.</p><button type="button" onClick={reset} className="mt-8 min-h-12 bg-deep-olive px-6 py-3 text-xs font-bold tracking-[0.1em] text-soft-cream uppercase">Try again</button></div>
    </main>
  );
}
