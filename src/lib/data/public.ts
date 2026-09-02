import { cache } from "react";

import { siteConfig, type DivisionSlug } from "@/config/site";
import { fallbackProjects } from "@/lib/data/fallback-projects";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import {
  fallbackSettings,
  type Project,
  type ProjectImage,
  type Service,
  type SiteSettings,
  type Testimonial,
} from "@/types/domain";

const publicProjectColumns = "id,name,slug,location,category,status,short_description,overview,cover_image_path,cover_image_alt,featured,published,information_complete,features,amenities,development_timeline,completion_date,map_url,map_embed_url,brochure_path,created_at,updated_at";
const publicProjectDetailColumns = "id,name,slug,location,category,status,short_description,overview,cover_image_path,cover_image_alt,featured,published,information_complete,features,amenities,development_timeline,completion_date,map_url,map_embed_url,brochure_path,created_at,updated_at,project_images(id,project_id,storage_path,alt_text,sort_order,created_at)";
const publicServiceColumns = "id,title,slug,division,icon,short_description,detailed_description,is_active,sort_order,created_at,updated_at";
const publicTestimonialColumns = "id,client_name,client_context,quote,approved,verified_at,sort_order,created_at,updated_at";
const publicSettingsColumns = "id,company_name,business_descriptor,primary_tagline,supporting_statement,company_introduction,mission,vision,phone,whatsapp,email,office_address,business_hours,facebook_url,instagram_url,linkedin_url,map_url,announcement,default_seo_title,default_seo_description,statistics,show_statistics,footer_description,created_at,updated_at";

function isLocalPublicAsset(path: string) {
  return path.startsWith("/") && !path.startsWith("//");
}

export async function signProjectMedia(project: Project, includeGallery = false) {
  const supabase = await createClient();
  let coverImageUrl: string | null = null;
  let brochureUrl: string | null = null;

  if (project.cover_image_path) {
    if (isLocalPublicAsset(project.cover_image_path)) {
      coverImageUrl = project.cover_image_path;
    } else {
      const { data } = await supabase.storage
        .from("project-media")
        .createSignedUrl(project.cover_image_path, 3600);
      coverImageUrl = data?.signedUrl ?? null;
    }
  }

  if (project.brochure_path) {
    if (isLocalPublicAsset(project.brochure_path)) {
      brochureUrl = project.brochure_path;
    } else {
      const { data } = await supabase.storage
        .from("project-brochures")
        .createSignedUrl(project.brochure_path, 900, { download: true });
      brochureUrl = data?.signedUrl ?? null;
    }
  }

  let images = project.project_images ?? [];
  if (includeGallery && images.length) {
    images = await Promise.all(
      images.map(async (image: ProjectImage) => {
        if (isLocalPublicAsset(image.storage_path)) {
          return { ...image, signed_url: image.storage_path };
        }
        const { data } = await supabase.storage
          .from("project-media")
          .createSignedUrl(image.storage_path, 3600);
        return { ...image, signed_url: data?.signedUrl ?? null };
      }),
    );
  }

  return {
    ...project,
    cover_image_url: coverImageUrl,
    brochure_url: brochureUrl,
    project_images: images,
  };
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (!isSupabaseConfigured()) return fallbackSettings;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select(publicSettingsColumns)
    .eq("id", fallbackSettings.id)
    .maybeSingle();

  if (error || !data) return fallbackSettings;

  const settings = data as Partial<SiteSettings>;
  return {
    ...fallbackSettings,
    ...settings,
    phone: settings.phone?.trim() || siteConfig.contact.phone,
    whatsapp: settings.whatsapp?.trim() || siteConfig.contact.whatsapp,
    email: settings.email?.trim() || siteConfig.contact.email,
  };
});

export const getActiveServices = cache(
  async (division?: DivisionSlug): Promise<Service[]> => {
    if (!isSupabaseConfigured()) return [];
    const supabase = await createClient();
    let query = supabase
      .from("services")
      .select(publicServiceColumns)
      .eq("is_active", true)
      .order("sort_order")
      .order("title");

    if (division) query = query.eq("division", division);
    const { data } = await query;
    return (data ?? []) as Service[];
  },
);

export const getApprovedTestimonials = cache(async (): Promise<Testimonial[]> => {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select(publicTestimonialColumns)
    .eq("approved", true)
    .order("sort_order")
    .limit(12);
  return (data ?? []) as Testimonial[];
});

type ProjectFilters = {
  category?: DivisionSlug;
  featured?: boolean;
  limit?: number;
};

function getFallbackPublishedProjects(filters: ProjectFilters = {}) {
  let projects = fallbackProjects.filter((project) => project.published);
  if (filters.category) {
    projects = projects.filter((project) => project.category === filters.category);
  }
  if (typeof filters.featured === "boolean") {
    projects = projects.filter((project) => project.featured === filters.featured);
  }
  return filters.limit ? projects.slice(0, filters.limit) : projects;
}

export async function getPublishedProjects(filters: ProjectFilters = {}) {
  if (!isSupabaseConfigured()) return getFallbackPublishedProjects(filters);
  const supabase = await createClient();
  let query = supabase
    .from("projects")
    .select(publicProjectColumns)
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("updated_at", { ascending: false });

  if (filters.category) query = query.eq("category", filters.category);
  if (typeof filters.featured === "boolean") query = query.eq("featured", filters.featured);
  if (filters.limit) query = query.limit(filters.limit);

  const { data } = await query;
  return Promise.all(((data ?? []) as Project[]).map((project) => signProjectMedia(project)));
}

export const getPublishedProjectBySlug = cache(
  async (slug: string): Promise<Project | null> => {
    if (!isSupabaseConfigured()) {
      return fallbackProjects.find(
        (project) => project.published && project.slug === slug,
      ) ?? null;
    }
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select(publicProjectDetailColumns)
      .eq("slug", slug)
      .eq("published", true)
      .order("sort_order", { referencedTable: "project_images" })
      .maybeSingle();

    if (!data) return null;
    return signProjectMedia(data as Project, true);
  },
);

export async function getRelatedProjects(project: Project) {
  const projects = await getPublishedProjects({ category: project.category, limit: 4 });
  return projects.filter((item) => item.id !== project.id).slice(0, 3);
}

export function getWhatsappUrl(number: string | null, message: string) {
  if (!number) return null;
  const digits = number.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function isSafeMapEmbedUrl(value: string | null) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      ["www.google.com", "maps.google.com"].includes(url.hostname) &&
      url.pathname.startsWith("/maps/embed")
    );
  } catch {
    return false;
  }
}
