"use client";

import { Asterisk } from "lucide-react";
import { marqueeWords } from "@/lib/data";

export default function Marquee() {
  const items = [...marqueeWords, ...marqueeWords];

  return (
    <section
      aria-hidden
      className="marquee-track overflow-hidden border-y border-line bg-ink-soft py-6 sm:py-9"
    >
      <div
        className="marquee"
        style={{ "--marquee-duration": "34s" } as React.CSSProperties}
      >
        {items.map((word, i) => (
          <span key={i} className="flex items-center">
            <span className="whitespace-nowrap px-6 font-display text-3xl font-semibold text-paper-faint transition-colors sm:px-9 sm:text-5xl">
              {word}
            </span>
            <Asterisk className="shrink-0 text-lime" size={22} strokeWidth={1.5} />
          </span>
        ))}
      </div>
    </section>
  );
}
