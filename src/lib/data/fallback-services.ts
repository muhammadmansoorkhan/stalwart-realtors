import type { DivisionSlug } from "@/config/site";
import type { Service } from "@/types/domain";

const confirmedAt = "2026-09-03T00:00:00.000Z";

export const fallbackServices: Service[] = [
  {
    id: "00000000-0000-4000-8000-000000000101",
    title: "Development",
    slug: "development",
    division: "development",
    icon: "land",
    short_description: "Purpose-driven real estate development.",
    detailed_description: null,
    is_active: true,
    sort_order: 10,
    created_at: confirmedAt,
    updated_at: confirmedAt,
  },
  {
    id: "00000000-0000-4000-8000-000000000102",
    title: "Real Estate",
    slug: "real-estate",
    division: "real-estate",
    icon: "home",
    short_description: "Premium residential and commercial opportunities.",
    detailed_description: null,
    is_active: true,
    sort_order: 10,
    created_at: confirmedAt,
    updated_at: confirmedAt,
  },
  {
    id: "00000000-0000-4000-8000-000000000103",
    title: "Construction",
    slug: "construction",
    division: "construction",
    icon: "hammer",
    short_description: "Quality construction with considered execution.",
    detailed_description: null,
    is_active: true,
    sort_order: 10,
    created_at: confirmedAt,
    updated_at: confirmedAt,
  },
  {
    id: "00000000-0000-4000-8000-000000000104",
    title: "Sales",
    slug: "sales",
    division: "real-estate",
    icon: "key",
    short_description: "Strategic sales and commercial management.",
    detailed_description: null,
    is_active: true,
    sort_order: 20,
    created_at: confirmedAt,
    updated_at: confirmedAt,
  },
  {
    id: "00000000-0000-4000-8000-000000000105",
    title: "Investment",
    slug: "investment",
    division: "real-estate",
    icon: "compass",
    short_description: "Carefully selected opportunities for long-term value.",
    detailed_description: null,
    is_active: true,
    sort_order: 30,
    created_at: confirmedAt,
    updated_at: confirmedAt,
  },
  {
    id: "00000000-0000-4000-8000-000000000106",
    title: "Advisory",
    slug: "advisory",
    division: "real-estate",
    icon: "sparkles",
    short_description: "Informed real estate guidance and consultancy.",
    detailed_description: null,
    is_active: true,
    sort_order: 40,
    created_at: confirmedAt,
    updated_at: confirmedAt,
  },
];

export function getFallbackServices(division?: DivisionSlug) {
  return division
    ? fallbackServices.filter((service) => service.division === division)
    : fallbackServices;
}
