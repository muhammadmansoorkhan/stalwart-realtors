import { Container } from "@/components/shared/container";

export default function ProjectsLoading() {
  return (
    <div className="bg-soft-cream py-20"><Container><div className="h-14 w-2/3 animate-pulse bg-travertine-beige/70" /><div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-[30rem] animate-pulse border border-deep-olive/10 bg-warm-ivory" />)}</div></Container></div>
  );
}
