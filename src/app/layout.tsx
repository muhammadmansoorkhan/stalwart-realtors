import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

const montserrat = localFont({
  src: "./fonts/Montserrat-Variable.ttf",
  variable: "--font-montserrat",
  weight: "100 900",
  display: "swap",
});

const playfairDisplay = localFont({
  src: "./fonts/PlayfairDisplay-Variable.ttf",
  variable: "--font-playfair",
  weight: "400 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
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
