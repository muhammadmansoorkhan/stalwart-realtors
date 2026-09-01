import { AdminPageHeader } from "@/components/admin/page-header";
import { ServiceForm } from "@/components/admin/service-form";
import { getAdminServices } from "@/lib/data/admin";

export default async function AdminServicesPage() { const services = await getAdminServices(); return <><AdminPageHeader eyebrow="Content" title="Services" description="Enable only capabilities confirmed as active. Hidden services never appear publicly." /><div className="grid gap-5"><ServiceForm />{services.map((service) => <ServiceForm key={service.id} service={service} />)}</div></>; }
