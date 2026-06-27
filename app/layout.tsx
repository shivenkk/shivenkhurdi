import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, Space_Mono } from "next/font/google";
import "./globals.css";

import SmoothScroll from "@/components/providers/SmoothScroll";
import Cursor from "@/components/Cursor";
import { profile, socials } from "@/lib/data";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

// Live site URL (used for OG/canonical). Update if you add a custom domain.
const SITE_URL = "https://shivenkhurdi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} · ${profile.role}`,
    template: `%s · ${profile.name}`,
  },
  description:
    "Shiven Khurdi is an AI Engineer and M.S. Artificial Intelligence student at Northeastern University, building LLM systems, multi-agent platforms, and computer-vision pipelines.",
  keywords: [
    "Shiven Khurdi",
    "AI Engineer",
    "Machine Learning Engineer",
    "LLM",
    "Multi-Agent Systems",
    "Computer Vision",
    "Northeastern University",
    "Boston",
    "Portfolio",
  ],
  authors: [{ name: profile.name, url: socials.linkedin }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: `${profile.name} · ${profile.role}`,
    description:
      "AI Engineer building LLM systems, multi-agent platforms, and computer-vision pipelines that hold up in production.",
    siteName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} · ${profile.role}`,
    description:
      "AI Engineer building LLM systems, multi-agent platforms, and computer-vision pipelines.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="bg-ink text-paper antialiased">
        <SmoothScroll>
          <Cursor />
          <div className="grain" aria-hidden />
          <main>{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
