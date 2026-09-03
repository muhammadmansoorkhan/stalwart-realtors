import { z } from "zod";

import { reservedProjectSlugs } from "@/config/site";

const optionalEmail = z
  .union([z.literal(""), z.email("Enter a valid email address.")])
  .transform((value) => value || null);

const optionalUrl = z
  .union([z.literal(""), z.url("Enter a complete URL beginning with https://.")])
  .transform((value) => value || null);

const phoneNumber = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number.")
  .max(32, "Enter a valid phone number.")
  .refine((value) => /^[+()\d\s-]+$/.test(value), "Enter a valid phone number.")
  .refine((value) => {
    const digitCount = value.replace(/\D/g, "").length;
    return digitCount >= 7 && digitCount <= 15;
  }, "Enter a valid phone number.");

export const inquirySchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(120),
  phone: phoneNumber,
  email: optionalEmail,
  inquiryType: z.enum([
    "real-estate",
    "construction",
    "development",
    "investment",
    "general",
  ]),
  projectId: z
    .union([z.literal(""), z.uuid("Select a valid project.")])
    .transform((value) => value || null),
  message: z.string().trim().min(10, "Please add a little more detail.").max(3000),
  consent: z.literal(true, { error: "Consent is required to submit this inquiry." }),
  website: z.string().max(0, "Automated submission rejected."),
});

export const siteVisitSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(120),
  phone: phoneNumber,
  email: optionalEmail,
  projectId: z.uuid("Select a published project."),
  preferredDate: z
    .iso.date("Choose a valid date.")
    .refine(
      (value) => value >= new Date().toISOString().slice(0, 10),
      "Choose today or a future date.",
    ),
  preferredTime: z.string().trim().min(2, "Choose a preferred time.").max(60),
  visitorCount: z
    .union([z.literal(""), z.coerce.number().int().min(1).max(30)])
    .transform((value) => value || null),
  message: z.string().trim().max(2000).transform((value) => value || null),
  website: z.string().max(0, "Automated submission rejected."),
});

export function toProjectSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 100);
}

export const projectSchema = z.object({
  name: z.string().trim().min(2).max(160),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens.")
    .refine((slug) => !reservedProjectSlugs.has(slug), "This slug is reserved."),
  location: z.string().trim().max(180).transform((value) => value || null),
  category: z.enum(["real-estate", "construction", "development"]),
  status: z.enum(["upcoming", "ongoing", "completed"]),
  shortDescription: z.string().trim().min(20).max(320),
  overview: z.string().trim().min(40).max(12000),
  coverImageAlt: z.string().trim().max(220).transform((value) => value || null),
  featured: z.boolean(),
  published: z.boolean(),
  informationComplete: z.boolean(),
  features: z.array(z.string().trim().min(1).max(140)).max(30),
  amenities: z.array(z.string().trim().min(1).max(140)).max(30),
  completionDate: z
    .union([z.literal(""), z.iso.date()])
    .transform((value) => value || null),
  mapUrl: optionalUrl,
  mapEmbedUrl: optionalUrl,
});

export const serviceSchema = z.object({
  id: z.union([z.literal(""), z.uuid()]).transform((value) => value || null),
  title: z.string().trim().min(2).max(120),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100),
  division: z.enum(["real-estate", "construction", "development"]),
  icon: z.string().trim().min(1).max(50),
  shortDescription: z.string().trim().min(10).max(300),
  detailedDescription: z.string().trim().max(4000).transform((value) => value || null),
  isActive: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(1000),
});

export const testimonialSchema = z.object({
  id: z.union([z.literal(""), z.uuid()]).transform((value) => value || null),
  clientName: z.string().trim().min(2).max(120),
  clientContext: z.string().trim().max(180).transform((value) => value || null),
  quote: z.string().trim().min(20).max(1200),
  approved: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(1000),
});

export const siteSettingsSchema = z.object({
  companyName: z.string().trim().min(2).max(160),
  businessDescriptor: z.string().trim().min(2).max(160),
  primaryTagline: z.string().trim().min(2).max(220),
  supportingStatement: z.string().trim().min(2).max(220),
  companyIntroduction: z.string().trim().min(40).max(4000),
  mission: z.string().trim().max(3000).refine((value) => !value || value.length >= 20, "Use at least 20 characters or leave this blank until verified."),
  vision: z.string().trim().max(3000).refine((value) => !value || value.length >= 20, "Use at least 20 characters or leave this blank until verified."),
  phone: z.string().trim().max(40).transform((value) => value || null),
  whatsapp: z.string().trim().max(40).transform((value) => value || null),
  email: optionalEmail,
  officeAddress: z.string().trim().max(500).transform((value) => value || null),
  businessHours: z.string().trim().max(300).transform((value) => value || null),
  facebookUrl: optionalUrl,
  instagramUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  mapUrl: optionalUrl,
  announcement: z.string().trim().max(240).transform((value) => value || null),
  defaultSeoTitle: z.string().trim().min(10).max(120),
  defaultSeoDescription: z.string().trim().min(40).max(320),
  footerDescription: z.string().trim().min(20).max(600),
  statistics: z
    .array(z.object({ label: z.string().min(1).max(80), value: z.string().min(1).max(40) }))
    .max(8),
  showStatistics: z.boolean(),
});

export const optionalUrlField = optionalUrl;

export function formBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

export function formLines(formData: FormData, key: string) {
  return String(formData.get(key) ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}
