import {
  Building2,
  Compass,
  Hammer,
  Home,
  KeyRound,
  LandPlot,
  MapPinned,
  PaintBucket,
  Ruler,
  ShieldCheck,
  Sparkles,
  Trees,
  type LucideIcon,
} from "lucide-react";

export const siteConfig = {
  name: "Stalwart Realtors",
  descriptor: "Real Estate Solutions",
  primaryTagline: "Building Better Tomorrow, Together.",
  supportingStatement: "Your Trust. Our Commitment.",
  description:
    "Real estate, construction, and development brought together under one considered brand.",
  navigation: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
  ],
  serviceNavigation: [
    { label: "Real Estate", href: "/real-estate" },
    { label: "Construction", href: "/construction" },
    { label: "Development", href: "/development" },
  ],
  contact: {
    phone: "0319 7713784",
    whatsapp: "+92 319 7713784",
    email: "info@stalwartrealtors.com",
    emailRecipient: "mansoortheprogrammer101@gmail.com",
    address: null,
    businessHours: null,
  },
} as const;

export type DivisionSlug = "real-estate" | "construction" | "development";

export type DivisionConfig = {
  slug: DivisionSlug;
  name: string;
  eyebrow: string;
  summary: string;
  overview: string;
  process: { title: string; description: string }[];
  icon: LucideIcon;
};

export const divisions: DivisionConfig[] = [
  {
    slug: "real-estate",
    name: "Real Estate",
    eyebrow: "Considered property decisions",
    summary:
      "Clear, client-focused guidance for property opportunities and requirements.",
    overview:
      "Stalwart Realtors approaches property decisions through careful requirement assessment, transparent communication, and a long-term perspective. Specific services and listings are published only after they are confirmed.",
    icon: KeyRound,
    process: [
      {
        title: "Understand",
        description: "We begin with your objectives, priorities, and practical requirements.",
      },
      {
        title: "Assess",
        description: "Relevant opportunities can be reviewed against the information available.",
      },
      {
        title: "Guide",
        description: "You receive clear context to support a considered next step.",
      },
    ],
  },
  {
    slug: "construction",
    name: "Construction",
    eyebrow: "From requirement to built form",
    summary:
      "A structured path for turning construction requirements into well-considered spaces.",
    overview:
      "The construction division is designed around clear scopes, thoughtful planning, and accountable communication. Detailed capabilities are made public only when their delivery status has been confirmed by the business.",
    icon: Hammer,
    process: [
      {
        title: "Brief",
        description: "Define the purpose, constraints, priorities, and desired outcome.",
      },
      {
        title: "Plan",
        description: "Establish a clear scope and the professional inputs the work requires.",
      },
      {
        title: "Coordinate",
        description: "Maintain transparent communication as an approved project progresses.",
      },
    ],
  },
  {
    slug: "development",
    name: "Development",
    eyebrow: "Planning for enduring value",
    summary:
      "Development thinking shaped by context, strategy, and responsible decision-making.",
    overview:
      "Stalwart Realtors considers development through the relationship between land, use, planning, and long-term value. No approval, ownership, return, or delivery claim is published without verification.",
    icon: LandPlot,
    process: [
      {
        title: "Explore",
        description: "Clarify the development objective and the available verified context.",
      },
      {
        title: "Evaluate",
        description: "Consider suitability, requirements, dependencies, and professional advice.",
      },
      {
        title: "Shape",
        description: "Create a transparent path for an approved development opportunity.",
      },
    ],
  },
];

export const supportedServiceIcons: Record<string, LucideIcon> = {
  building: Building2,
  compass: Compass,
  hammer: Hammer,
  home: Home,
  key: KeyRound,
  land: LandPlot,
  location: MapPinned,
  paint: PaintBucket,
  ruler: Ruler,
  shield: ShieldCheck,
  sparkles: Sparkles,
  trees: Trees,
};

export const reservedProjectSlugs = new Set([
  "about",
  "admin",
  "api",
  "construction",
  "contact",
  "development",
  "login",
  "new",
  "preview",
  "privacy",
  "projects",
  "real-estate",
  "settings",
  "terms",
]);
