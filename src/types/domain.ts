import type { DivisionSlug } from "@/config/site";

export type ProjectCategory = "real-estate" | "construction" | "development";
export type ProjectStatus = "upcoming" | "ongoing" | "completed";
export type InquiryStatus = "new" | "contacted" | "qualified" | "closed" | "spam";
export type SiteVisitStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type ProjectImage = {
  id: string;
  project_id: string;
  storage_path: string;
  alt_text: string;
  sort_order: number;
  signed_url?: string | null;
};

export type Project = {
  id: string;
  name: string;
  slug: string;
  location: string | null;
  category: ProjectCategory;
  status: ProjectStatus;
  short_description: string;
  overview: string;
  cover_image_path: string | null;
  cover_image_alt: string | null;
  cover_image_url?: string | null;
  featured: boolean;
  published: boolean;
  features: string[];
  amenities: string[];
  development_timeline: { title: string; detail: string }[];
  completion_date: string | null;
  map_url: string | null;
  map_embed_url: string | null;
  brochure_path: string | null;
  brochure_url?: string | null;
  information_complete: boolean;
  created_at: string;
  updated_at: string;
  project_images?: ProjectImage[];
};

export type Service = {
  id: string;
  title: string;
  slug: string;
  division: DivisionSlug;
  icon: string;
  short_description: string;
  detailed_description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Testimonial = {
  id: string;
  client_name: string;
  client_context: string | null;
  quote: string;
  approved: boolean;
  verified_at: string;
  sort_order: number;
};

export type Statistic = { label: string; value: string };

export type SiteSettings = {
  id: string;
  company_name: string;
  business_descriptor: string;
  primary_tagline: string;
  supporting_statement: string;
  company_introduction: string;
  mission: string;
  vision: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  office_address: string | null;
  business_hours: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  map_url: string | null;
  announcement: string | null;
  default_seo_title: string;
  default_seo_description: string;
  statistics: Statistic[];
  show_statistics: boolean;
  footer_description: string;
  updated_at: string | null;
};

export type Inquiry = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  inquiry_type: "real-estate" | "construction" | "development" | "investment" | "general";
  project_id: string | null;
  message: string;
  consent_given: boolean;
  status: InquiryStatus;
  private_notes: string | null;
  created_at: string;
  projects?: { name: string } | null;
};

export type SiteVisit = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  project_id: string;
  preferred_date: string;
  preferred_time: string;
  visitor_count: number | null;
  message: string | null;
  status: SiteVisitStatus;
  private_notes: string | null;
  created_at: string;
  projects?: { name: string } | null;
};

export const fallbackSettings: SiteSettings = {
  id: "00000000-0000-0000-0000-000000000001",
  company_name: "Stalwart Realtors",
  business_descriptor: "Real Estate Solutions",
  primary_tagline: "Building Better Tomorrow, Together.",
  supporting_statement: "Your Trust. Our Commitment.",
  company_introduction:
    "Stalwart Realtors brings real estate, construction, and development together with an emphasis on trust, transparency, considered decisions, and long-term value.",
  mission: "",
  vision: "",
  phone: null,
  whatsapp: null,
  email: null,
  office_address: null,
  business_hours: null,
  facebook_url: null,
  instagram_url: null,
  linkedin_url: null,
  map_url: null,
  announcement: null,
  default_seo_title: "Stalwart Realtors | Real Estate, Construction & Development",
  default_seo_description:
    "Stalwart Realtors brings real estate, construction, and development together under one considered brand.",
  statistics: [],
  show_statistics: false,
  footer_description:
    "Real estate, construction, and development brought together under one considered brand.",
  updated_at: null,
};
