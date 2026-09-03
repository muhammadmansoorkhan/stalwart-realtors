import type { Metadata } from "next";
import localFont from "next/font/local";

import { getSiteUrl } from "@/lib/site-url";

import "./globals.css";

const montserrat = localFont({
  src: "./fonts/Montserrat-Variable.woff2",
  variable: "--font-montserrat",
  weight: "100 900",
  display: "swap",
});

const playfairDisplay = localFont({
  src: "./fonts/PlayfairDisplay-Variable.woff2",
  variable: "--font-playfair",
  weight: "400 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Stalwart Realtors | Real Estate, Construction & Development",
    template: "%s | Stalwart Realtors",
  },
  description:
    "Stalwart Realtors brings real estate, construction, and development together under one unified brand.",
  applicationName: "Stalwart Realtors",
  category: "Real Estate",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Stalwart Realtors",
    title: "Stalwart Realtors | Real Estate, Construction & Development",
    description:
      "Building Better Tomorrow, Together through real estate, construction, and development.",
    images: [
      {
        url: "/images/architectural-hero.webp",
        alt: "Stalwart Realtors architectural concept in warm stone",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stalwart Realtors | Real Estate, Construction & Development",
    description:
      "Building Better Tomorrow, Together through real estate, construction, and development.",
    images: ["/images/architectural-hero.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${playfairDisplay.variable} antialiased`}
      >
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
