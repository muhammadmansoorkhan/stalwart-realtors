import { MessageCircle } from "lucide-react";

import { getWhatsappUrl } from "@/lib/data/public";

export function WhatsAppButton({ number }: { number: string | null }) {
  const url = getWhatsappUrl(number, "I would like to learn more about Stalwart Realtors and its services.");
  if (!url) return null;

  return (
    <a href={url} target="_blank" rel="noreferrer" className="fixed right-4 bottom-4 z-40 inline-flex min-h-12 items-center gap-2 border border-champagne-gold/50 bg-deep-olive px-4 py-3 text-xs font-bold tracking-[0.08em] text-soft-cream uppercase shadow-[0_14px_36px_rgb(39_41_37/0.26)] transition-transform hover:-translate-y-1 sm:right-6 sm:bottom-6" aria-label="Start a WhatsApp conversation with Stalwart Realtors">
      <MessageCircle aria-hidden="true" size={19} /><span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
