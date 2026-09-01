"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  formBoolean,
  formLines,
  projectSchema,
  serviceSchema,
  siteSettingsSchema,
  testimonialSchema,
} from "@/lib/validation";

export type AdminActionState = {
  status: "idle" | "success" | "error";
  message: string;
  redirectTo?: string;
};

async function logActivity(
  action: string,
  entityType: string,
  entityId: string | null,
  entityLabel: string,
) {
  const admin = await requireAdmin();
  const supabase = await createClient();
  await supabase.from("activity_logs").insert({
    actor_id: admin.userId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    entity_label: entityLabel,
  });
}

function fileExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return extension?.replace(/[^a-z0-9]/g, "") || "bin";
}

function isPresentFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0;
}

function validateImage(file: File) {
  if (!file.type.startsWith("image/")) return "Only image files are accepted.";
  if (file.size > 10 * 1024 * 1024) return "Each image must be 10 MB or smaller.";
  return null;
}

function parseTimeline(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...detailParts] = line.split("|");
      return { title: title.trim(), detail: detailParts.join("|").trim() };
    })
    .filter((item) => item.title && item.detail)
    .slice(0, 30);
}

async function uploadProjectFiles(projectId: string, formData: FormData) {
  const supabase = await createClient();
  const cover = formData.get("coverImage");
  let coverPath: string | null = null;

  if (isPresentFile(cover)) {
    const validationError = validateImage(cover);
    if (validationError) throw new Error(validationError);
    coverPath = `${projectId}/cover/${crypto.randomUUID()}.${fileExtension(cover)}`;
    const { error } = await supabase.storage.from("project-media").upload(coverPath, cover, {
      contentType: cover.type,
      upsert: false,
    });
    if (error) throw new Error(`Cover upload failed: ${error.message}`);
  }

  const brochure = formData.get("brochure");
  let brochurePath: string | null = null;
  if (isPresentFile(brochure)) {
    if (brochure.type !== "application/pdf" || brochure.size > 20 * 1024 * 1024) {
      throw new Error("The brochure must be a PDF no larger than 20 MB.");
    }
    brochurePath = `${projectId}/${crypto.randomUUID()}.pdf`;
    const { error } = await supabase.storage
      .from("project-brochures")
      .upload(brochurePath, brochure, { contentType: "application/pdf", upsert: false });
    if (error) throw new Error(`Brochure upload failed: ${error.message}`);
  }

  const galleryFiles = formData
    .getAll("galleryImages")
    .filter(isPresentFile)
    .slice(0, 20);
  const galleryPaths: { storage_path: string; alt_text: string; sort_order: number }[] = [];

  if (galleryFiles.length) {
    const { count } = await supabase
      .from("project_images")
      .select("id", { count: "exact", head: true })
      .eq("project_id", projectId);

    for (const [index, image] of galleryFiles.entries()) {
      const validationError = validateImage(image);
      if (validationError) throw new Error(validationError);
      const path = `${projectId}/gallery/${crypto.randomUUID()}.${fileExtension(image)}`;
      const { error } = await supabase.storage.from("project-media").upload(path, image, {
        contentType: image.type,
        upsert: false,
      });
      if (error) throw new Error(`Gallery upload failed: ${error.message}`);
      galleryPaths.push({
        storage_path: path,
        alt_text: String(formData.get("galleryAlt") ?? "Project gallery image").slice(0, 220),
        sort_order: (count ?? 0) + index,
      });
    }

    const { error } = await supabase.from("project_images").insert(
      galleryPaths.map((image) => ({ ...image, project_id: projectId })),
    );
    if (error) throw new Error(`Gallery metadata could not be saved: ${error.message}`);
  }

  return { coverPath, brochurePath };
}

async function reconcileGallery(projectId: string, formData: FormData) {
  const supabase = await createClient();
  const removeIds = String(formData.get("removeImageIds") ?? "")
    .split(",")
    .filter((id) => z.uuid().safeParse(id).success);

  if (removeIds.length) {
    const { data: images } = await supabase
      .from("project_images")
      .select("id, storage_path")
      .eq("project_id", projectId)
      .in("id", removeIds);
    const paths = (images ?? []).map((image) => image.storage_path);
    if (paths.length) await supabase.storage.from("project-media").remove(paths);
    await supabase
      .from("project_images")
      .delete()
      .eq("project_id", projectId)
      .in("id", removeIds);
  }

  const order = String(formData.get("galleryOrder") ?? "")
    .split(",")
    .filter((id) => z.uuid().safeParse(id).success && !removeIds.includes(id));
  await Promise.all(
    order.map((id, index) =>
      supabase
        .from("project_images")
        .update({ sort_order: index })
        .eq("id", id)
        .eq("project_id", projectId),
    ),
  );
}

export async function saveProjectAction(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const parsed = projectSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    location: String(formData.get("location") ?? ""),
    category: String(formData.get("category") ?? ""),
    status: String(formData.get("status") ?? ""),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    overview: String(formData.get("overview") ?? ""),
    coverImageAlt: String(formData.get("coverImageAlt") ?? ""),
    featured: formBoolean(formData, "featured"),
    published: formBoolean(formData, "published"),
    informationComplete: formBoolean(formData, "informationComplete"),
    features: formLines(formData, "features"),
    amenities: formLines(formData, "amenities"),
    completionDate: String(formData.get("completionDate") ?? ""),
    mapUrl: String(formData.get("mapUrl") ?? ""),
    mapEmbedUrl: String(formData.get("mapEmbedUrl") ?? ""),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Review the project details." };
  }
  if (parsed.data.published && !parsed.data.informationComplete) {
    return {
      status: "error",
      message: "Mark the project information as verified and complete before publishing.",
    };
  }

  const suppliedId = String(formData.get("projectId") ?? "");
  const projectId = z.uuid().safeParse(suppliedId).success ? suppliedId : crypto.randomUUID();
  const isNew = projectId !== suppliedId;
  const supabase = await createClient();
  const payload = {
    id: projectId,
    name: parsed.data.name,
    slug: parsed.data.slug,
    location: parsed.data.location,
    category: parsed.data.category,
    status: parsed.data.status,
    short_description: parsed.data.shortDescription,
    overview: parsed.data.overview,
    cover_image_alt: parsed.data.coverImageAlt,
    featured: parsed.data.featured,
    published: parsed.data.published,
    information_complete: parsed.data.informationComplete,
    features: parsed.data.features,
    amenities: parsed.data.amenities,
    development_timeline: parseTimeline(String(formData.get("timeline") ?? "")),
    completion_date: parsed.data.completionDate,
    map_url: parsed.data.mapUrl,
    map_embed_url: parsed.data.mapEmbedUrl,
    updated_by: admin.userId,
    ...(isNew ? { created_by: admin.userId } : {}),
  };

  const { error } = isNew
    ? await supabase.from("projects").insert(payload)
    : await supabase.from("projects").update(payload).eq("id", projectId);
  if (error) {
    const duplicate = error.code === "23505" ? "The project slug is already in use." : null;
    return { status: "error", message: duplicate ?? `Project could not be saved: ${error.message}` };
  }

  try {
    const oldCoverPath = String(formData.get("oldCoverPath") ?? "");
    const oldBrochurePath = String(formData.get("oldBrochurePath") ?? "");
    const uploads = await uploadProjectFiles(projectId, formData);
    const uploadUpdate: Record<string, string> = {};
    if (uploads.coverPath) uploadUpdate.cover_image_path = uploads.coverPath;
    if (uploads.brochurePath) uploadUpdate.brochure_path = uploads.brochurePath;
    if (Object.keys(uploadUpdate).length) {
      await supabase.from("projects").update(uploadUpdate).eq("id", projectId);
    }
    if (uploads.coverPath && oldCoverPath) await supabase.storage.from("project-media").remove([oldCoverPath]);
    if (uploads.brochurePath && oldBrochurePath) {
      await supabase.storage.from("project-brochures").remove([oldBrochurePath]);
    }
    await reconcileGallery(projectId, formData);
  } catch (uploadError) {
    return {
      status: "error",
      message: `Project details were saved, but media needs attention: ${uploadError instanceof Error ? uploadError.message : "upload failed"}`,
      redirectTo: `/admin/projects/${projectId}/edit`,
    };
  }

  await logActivity(isNew ? "created" : "updated", "project", projectId, parsed.data.name);
  revalidatePath("/", "layout");
  revalidatePath("/admin/projects");
  return {
    status: "success",
    message: isNew ? "Project created." : "Project updated.",
    redirectTo: `/admin/projects/${projectId}/edit`,
  };
}

async function listStoragePaths(bucket: string, prefix: string) {
  const supabase = await createClient();
  const paths: string[] = [];
  for (const folder of ["cover", "gallery"]) {
    const { data } = await supabase.storage.from(bucket).list(`${prefix}/${folder}`, { limit: 1000 });
    for (const file of data ?? []) {
      if (file.id) paths.push(`${prefix}/${folder}/${file.name}`);
    }
  }
  const { data: rootFiles } = await supabase.storage.from(bucket).list(prefix, { limit: 1000 });
  for (const file of rootFiles ?? []) {
    if (file.id) paths.push(`${prefix}/${file.name}`);
  }
  return paths;
}

export async function deleteProjectAction(projectId: string) {
  await requireAdmin();
  if (!z.uuid().safeParse(projectId).success) return;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("name")
    .eq("id", projectId)
    .maybeSingle();
  if (!project) return;

  const [mediaPaths, brochurePaths] = await Promise.all([
    listStoragePaths("project-media", projectId),
    listStoragePaths("project-brochures", projectId),
  ]);
  if (mediaPaths.length) await supabase.storage.from("project-media").remove(mediaPaths);
  if (brochurePaths.length) await supabase.storage.from("project-brochures").remove(brochurePaths);
  await supabase.from("projects").delete().eq("id", projectId);
  await logActivity("deleted", "project", projectId, project.name);
  revalidatePath("/", "layout");
  revalidatePath("/admin/projects");
}

export async function saveServiceAction(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const parsed = serviceSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    division: String(formData.get("division") ?? ""),
    icon: String(formData.get("icon") ?? ""),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    detailedDescription: String(formData.get("detailedDescription") ?? ""),
    isActive: formBoolean(formData, "isActive"),
    sortOrder: String(formData.get("sortOrder") ?? "0"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Review the service details." };
  }

  const supabase = await createClient();
  const payload = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    division: parsed.data.division,
    icon: parsed.data.icon,
    short_description: parsed.data.shortDescription,
    detailed_description: parsed.data.detailedDescription,
    is_active: parsed.data.isActive,
    sort_order: parsed.data.sortOrder,
    updated_by: admin.userId,
  };
  const result = parsed.data.id
    ? await supabase.from("services").update(payload).eq("id", parsed.data.id)
    : await supabase.from("services").insert({ ...payload, created_by: admin.userId });
  if (result.error) {
    return { status: "error", message: `Service could not be saved: ${result.error.message}` };
  }
  await logActivity(parsed.data.id ? "updated" : "created", "service", parsed.data.id, parsed.data.title);
  revalidatePath("/", "layout");
  revalidatePath("/admin/services");
  return { status: "success", message: "Service saved." };
}

export async function deleteServiceAction(id: string) {
  await requireAdmin();
  if (!z.uuid().safeParse(id).success) return;
  const supabase = await createClient();
  const { data } = await supabase.from("services").select("title").eq("id", id).maybeSingle();
  if (!data) return;
  await supabase.from("services").delete().eq("id", id);
  await logActivity("deleted", "service", id, data.title);
  revalidatePath("/", "layout");
  revalidatePath("/admin/services");
}

export async function updateInquiryAction(id: string, formData: FormData) {
  await requireAdmin();
  if (!z.uuid().safeParse(id).success) return;
  const status = z.enum(["new", "contacted", "qualified", "closed", "spam"]).safeParse(formData.get("status"));
  if (!status.success) return;
  const privateNotes = String(formData.get("privateNotes") ?? "").trim().slice(0, 4000) || null;
  const supabase = await createClient();
  await supabase.from("inquiries").update({ status: status.data, private_notes: privateNotes }).eq("id", id);
  await logActivity("updated", "inquiry", id, `Inquiry ${id.slice(0, 8)}`);
  revalidatePath("/admin/inquiries");
}

export async function deleteSpamInquiryAction(id: string) {
  await requireAdmin();
  if (!z.uuid().safeParse(id).success) return;
  const supabase = await createClient();
  const { data } = await supabase.from("inquiries").select("status").eq("id", id).maybeSingle();
  if (data?.status !== "spam") return;
  await supabase.from("inquiries").delete().eq("id", id);
  await logActivity("deleted", "inquiry", id, `Spam inquiry ${id.slice(0, 8)}`);
  revalidatePath("/admin/inquiries");
}

export async function updateSiteVisitAction(id: string, formData: FormData) {
  await requireAdmin();
  if (!z.uuid().safeParse(id).success) return;
  const status = z.enum(["pending", "confirmed", "completed", "cancelled"]).safeParse(formData.get("status"));
  if (!status.success) return;
  const privateNotes = String(formData.get("privateNotes") ?? "").trim().slice(0, 4000) || null;
  const supabase = await createClient();
  await supabase.from("site_visits").update({ status: status.data, private_notes: privateNotes }).eq("id", id);
  await logActivity("updated", "site_visit", id, `Site visit ${id.slice(0, 8)}`);
  revalidatePath("/admin/site-visits");
}

export async function saveTestimonialAction(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const parsed = testimonialSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    clientName: String(formData.get("clientName") ?? ""),
    clientContext: String(formData.get("clientContext") ?? ""),
    quote: String(formData.get("quote") ?? ""),
    approved: formBoolean(formData, "approved"),
    sortOrder: String(formData.get("sortOrder") ?? "0"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Review the testimonial." };
  }
  const supabase = await createClient();
  const payload = {
    client_name: parsed.data.clientName,
    client_context: parsed.data.clientContext,
    quote: parsed.data.quote,
    approved: parsed.data.approved,
    sort_order: parsed.data.sortOrder,
    verified_at: new Date().toISOString(),
    updated_by: admin.userId,
  };
  const result = parsed.data.id
    ? await supabase.from("testimonials").update(payload).eq("id", parsed.data.id)
    : await supabase.from("testimonials").insert({ ...payload, created_by: admin.userId });
  if (result.error) return { status: "error", message: `Testimonial could not be saved: ${result.error.message}` };
  await logActivity(parsed.data.id ? "updated" : "created", "testimonial", parsed.data.id, parsed.data.clientName);
  revalidatePath("/", "layout");
  revalidatePath("/admin/testimonials");
  return { status: "success", message: "Verified testimonial saved." };
}

export async function deleteTestimonialAction(id: string) {
  await requireAdmin();
  if (!z.uuid().safeParse(id).success) return;
  const supabase = await createClient();
  const { data } = await supabase.from("testimonials").select("client_name").eq("id", id).maybeSingle();
  if (!data) return;
  await supabase.from("testimonials").delete().eq("id", id);
  await logActivity("deleted", "testimonial", id, data.client_name);
  revalidatePath("/", "layout");
  revalidatePath("/admin/testimonials");
}

export async function saveSettingsAction(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const admin = await requireAdmin();
  const statistics = String(formData.get("statistics") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [value, ...labelParts] = line.split("|");
      return { value: value.trim(), label: labelParts.join("|").trim() };
    })
    .filter((item) => item.value && item.label);
  const parsed = siteSettingsSchema.safeParse({
    companyName: String(formData.get("companyName") ?? ""),
    businessDescriptor: String(formData.get("businessDescriptor") ?? ""),
    primaryTagline: String(formData.get("primaryTagline") ?? ""),
    supportingStatement: String(formData.get("supportingStatement") ?? ""),
    companyIntroduction: String(formData.get("companyIntroduction") ?? ""),
    mission: String(formData.get("mission") ?? ""),
    vision: String(formData.get("vision") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    email: String(formData.get("email") ?? ""),
    officeAddress: String(formData.get("officeAddress") ?? ""),
    businessHours: String(formData.get("businessHours") ?? ""),
    facebookUrl: String(formData.get("facebookUrl") ?? ""),
    instagramUrl: String(formData.get("instagramUrl") ?? ""),
    linkedinUrl: String(formData.get("linkedinUrl") ?? ""),
    mapUrl: String(formData.get("mapUrl") ?? ""),
    announcement: String(formData.get("announcement") ?? ""),
    defaultSeoTitle: String(formData.get("defaultSeoTitle") ?? ""),
    defaultSeoDescription: String(formData.get("defaultSeoDescription") ?? ""),
    footerDescription: String(formData.get("footerDescription") ?? ""),
    statistics,
    showStatistics: formBoolean(formData, "showStatistics"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Review the site settings." };
  }
  if (parsed.data.showStatistics && !parsed.data.statistics.length) {
    return { status: "error", message: "Add verified statistics before showing the section." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").update({
    company_name: parsed.data.companyName,
    business_descriptor: parsed.data.businessDescriptor,
    primary_tagline: parsed.data.primaryTagline,
    supporting_statement: parsed.data.supportingStatement,
    company_introduction: parsed.data.companyIntroduction,
    mission: parsed.data.mission,
    vision: parsed.data.vision,
    phone: parsed.data.phone,
    whatsapp: parsed.data.whatsapp,
    email: parsed.data.email,
    office_address: parsed.data.officeAddress,
    business_hours: parsed.data.businessHours,
    facebook_url: parsed.data.facebookUrl,
    instagram_url: parsed.data.instagramUrl,
    linkedin_url: parsed.data.linkedinUrl,
    map_url: parsed.data.mapUrl,
    announcement: parsed.data.announcement,
    default_seo_title: parsed.data.defaultSeoTitle,
    default_seo_description: parsed.data.defaultSeoDescription,
    footer_description: parsed.data.footerDescription,
    statistics: parsed.data.statistics,
    show_statistics: parsed.data.showStatistics,
    updated_by: admin.userId,
  }).eq("id", "00000000-0000-0000-0000-000000000001");

  if (error) return { status: "error", message: `Settings could not be saved: ${error.message}` };
  await logActivity("updated", "site_settings", null, "Site settings");
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { status: "success", message: "Site settings saved." };
}
