import { AdminPageHeader } from "@/components/admin/page-header";
import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() { return <><AdminPageHeader eyebrow="Projects" title="New project" description="The project begins as a draft. Publication requires an explicit information-verification check." /><ProjectForm /></>; }
