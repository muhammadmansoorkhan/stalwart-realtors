import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { WhatsAppButton } from "@/components/public/whatsapp-button";
import { getSiteSettings } from "@/lib/data/public";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader settings={settings} />
      <main id="main-content" className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
      <WhatsAppButton number={settings.whatsapp} />
    </div>
  );
}
