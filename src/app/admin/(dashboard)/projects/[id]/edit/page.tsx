import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/page-header";
import { ProjectForm } from "@/components/admin/project-form";
import { getAdminProject } from "@/lib/data/admin";

type Props = { params: Promise<{ id: string }> };
export default async function EditProjectPage({ params }: Props) { const { id } = await params; const project = await getAdminProject(id); if (!project) notFound(); return <><AdminPageHeader eyebrow="Projects" title={project.name} description={project.information_complete ? "Information marked verified. Review each edit before keeping the project published." : "Information is incomplete. Keep this project in draft until verified."} /><ProjectForm project={project} /></>; }
