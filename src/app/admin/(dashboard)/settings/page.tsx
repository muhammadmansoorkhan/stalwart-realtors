import { AdminPageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "@/components/admin/settings-form";
import { getAdminSettings } from "@/lib/data/admin";

export default async function AdminSettingsPage() { const settings = await getAdminSettings(); return <><AdminPageHeader eyebrow="Configuration" title="Site settings" description="Manage approved company copy, verified contact channels, SEO, and optional statistics." /><SettingsForm settings={settings} /></>; }
