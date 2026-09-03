import { supportedServiceIcons } from "@/config/site";
import type { Service } from "@/types/domain";

export function ServiceGrid({ services }: { services: Service[] }) {
  if (!services.length) return null;
  return (
    <div className="grid gap-px bg-deep-olive/12 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => {
        const Icon = supportedServiceIcons[service.icon] ?? supportedServiceIcons.building;
        return (
          <article key={service.id} className="bg-soft-cream p-7 sm:p-9">
            <Icon aria-hidden="true" className="text-champagne-gold" size={28} strokeWidth={1.5} />
            <h3 className="mt-5 font-heading text-2xl font-semibold text-charcoal">{service.title}</h3>
            <p className="mt-3 text-sm leading-7 text-body-copy-muted">{service.short_description}</p>
            {service.detailed_description ? <p className="mt-4 border-t border-deep-olive/10 pt-4 text-sm leading-7 text-body-copy-muted">{service.detailed_description}</p> : null}
          </article>
        );
      })}
    </div>
  );
}
