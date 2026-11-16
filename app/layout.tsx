import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import { display, mono, sans } from "@/lib/fonts";
import { profile, socials } from "@/lib/data";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Nav from "@/components/ui/Nav";
import PageTransition from "@/components/ui/PageTransition";

const SITE_URL = "https://shivenkhurdi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} · ${profile.role}`,
    template: `%s · ${profile.name}`,
  },
  description:
    "Shiven Khurdi is an AI engineer and M.S. Artificial Intelligence student at Northeastern University in Boston, working on LLM systems, agents, and evaluation.",
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
      "AI engineer working on LLM systems, agents, and evaluation. Founding AI Engineer (Co-op) at Interlock Systems, M.S. AI at Northeastern.",
    siteName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} · ${profile.role}`,
    description:
      "AI engineer working on LLM systems, agents, and evaluation.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#070709",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="bg-ink text-fg antialiased">
        <SmoothScroll>
          <Nav />
          <PageTransition />
          <div className="grain" aria-hidden />
          {children}
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
