import { siteConfig } from "@/config/site";
import { createClient } from "@/lib/supabase/server";
import { signProjectMedia } from "@/lib/data/public";
import {
  fallbackSettings,
  type Inquiry,
  type Project,
  type Service,
  type SiteSettings,
  type SiteVisit,
  type Testimonial,
} from "@/types/domain";

export async function getDashboardData() {
  const supabase = await createClient();
  const [
    totalProjects,
    publishedProjects,
    draftProjects,
    featuredProjects,
    newInquiries,
    pendingVisits,
    recentInquiries,
    recentVisits,
    recentActivity,
  ] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("published", true),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("published", false),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("featured", true),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("site_visits").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase
      .from("inquiries")
      .select("id, full_name, inquiry_type, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("site_visits")
      .select("id, full_name, preferred_date, status, created_at, projects(name)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("activity_logs")
      .select("id, action, entity_type, entity_label, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  return {
    counts: {
      totalProjects: totalProjects.count ?? 0,
      publishedProjects: publishedProjects.count ?? 0,
      draftProjects: draftProjects.count ?? 0,
      featuredProjects: featuredProjects.count ?? 0,
      newInquiries: newInquiries.count ?? 0,
      pendingVisits: pendingVisits.count ?? 0,
    },
    recentInquiries: recentInquiries.data ?? [],
    recentVisits: recentVisits.data ?? [],
    recentActivity: recentActivity.data ?? [],
  };
}

export async function getAdminProjects() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });
  return (data ?? []) as Project[];
}

export async function getAdminProject(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*, project_images(*)")
    .eq("id", id)
    .order("sort_order", { referencedTable: "project_images" })
    .maybeSingle();
  return data ? signProjectMedia(data as Project, true) : null;
}

export async function getAdminServices() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .order("division")
    .order("sort_order")
    .order("title");
  return (data ?? []) as Service[];
}

export async function getAdminInquiries(search?: string, status?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("inquiries")
    .select("*, projects(name)")
    .order("created_at", { ascending: false });
  if (status && status !== "all") query = query.eq("status", status);
  if (search) query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
  const { data } = await query;
  return (data ?? []) as Inquiry[];
}

export async function getAdminSiteVisits(status?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("site_visits")
    .select("*, projects(name)")
    .order("created_at", { ascending: false });
  if (status && status !== "all") query = query.eq("status", status);
  const { data } = await query;
  return (data ?? []) as SiteVisit[];
}

export async function getAdminTestimonials() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order")
    .order("created_at", { ascending: false });
  return (data ?? []) as Testimonial[];
}

export async function getAdminSettings() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .single();

  const settings = (data ?? {}) as Partial<SiteSettings>;
  return {
    ...fallbackSettings,
    ...settings,
    phone: settings.phone?.trim() || siteConfig.contact.phone,
    whatsapp: settings.whatsapp?.trim() || siteConfig.contact.whatsapp,
    email: settings.email?.trim() || siteConfig.contact.email,
  };
}
