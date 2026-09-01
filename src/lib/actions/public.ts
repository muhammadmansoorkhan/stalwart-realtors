"use server";

import { revalidatePath } from "next/cache";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { inquirySchema, siteVisitSchema } from "@/lib/validation";

export type PublicActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitInquiry(input: unknown): Promise<PublicActionState> {
  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message: "Online inquiries are not active yet. Please return after contact details are published.",
    };
  }

  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please review the highlighted information.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").insert({
    full_name: parsed.data.fullName,
    phone: parsed.data.phone,
    email: parsed.data.email,
    inquiry_type: parsed.data.inquiryType,
    project_id: parsed.data.projectId,
    message: parsed.data.message,
    consent_given: parsed.data.consent,
    status: "new",
  });

  if (error) {
    return {
      status: "error",
      message: "We could not receive your inquiry. Please try again shortly.",
    };
  }

  revalidatePath("/admin/inquiries");
  return {
    status: "success",
    message: "Thank you. Your inquiry has been received and will be reviewed.",
  };
}

export async function submitSiteVisit(input: unknown): Promise<PublicActionState> {
  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message: "Site-visit requests are not active until a verified project is published.",
    };
  }

  const parsed = siteVisitSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please review the highlighted information.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", parsed.data.projectId)
    .eq("published", true)
    .maybeSingle();

  if (!project) {
    return { status: "error", message: "That project is not available for requests." };
  }

  const { error } = await supabase.from("site_visits").insert({
    full_name: parsed.data.fullName,
    phone: parsed.data.phone,
    email: parsed.data.email,
    project_id: parsed.data.projectId,
    preferred_date: parsed.data.preferredDate,
    preferred_time: parsed.data.preferredTime,
    visitor_count: parsed.data.visitorCount,
    message: parsed.data.message,
    status: "pending",
  });

  if (error) {
    return {
      status: "error",
      message: "We could not receive your request. Please try again shortly.",
    };
  }

  revalidatePath("/admin/site-visits");
  return {
    status: "success",
    message:
      "Your request has been received. A representative will contact you to confirm availability.",
  };
}
