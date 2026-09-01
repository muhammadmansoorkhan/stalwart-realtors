import { cn } from "@/lib/utils";

export function StatusPill({ value, className }: { value: string; className?: string }) {
  return (
    <span className={cn("inline-flex border border-current/25 px-2.5 py-1 text-[0.62rem] font-bold tracking-[0.12em] uppercase", className)}>
      {value.replaceAll("-", " ")}
    </span>
  );
}
