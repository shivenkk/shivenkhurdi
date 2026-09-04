import { Geist, JetBrains_Mono, Unbounded } from "next/font/google";

// Wide geometric display face for the wordmark and section-scale words.
export const display = Unbounded({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

// Neutral UI face.
export const sans = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

// HUD / labels / nav.
export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const fontFamilies = {
  display: display.style.fontFamily,
  sans: sans.style.fontFamily,
  mono: mono.style.fontFamily,
};
