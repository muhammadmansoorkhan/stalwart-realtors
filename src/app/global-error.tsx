"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="en"><body><main className="flex min-h-screen items-center justify-center bg-[#2f3828] px-5 text-center text-[#faf7f0]"><div><h1 className="font-serif text-4xl">Something went wrong.</h1><p className="mt-4 text-sm text-[#f5f0e6]/70">The page could not be completed. Please try again.</p><button type="button" onClick={reset} className="mt-7 min-h-12 bg-[#faf7f0] px-6 text-xs font-bold tracking-widest text-[#272925] uppercase">Try again</button></div></main></body></html>;
}
