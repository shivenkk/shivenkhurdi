"use client";

import { useEffect, useState } from "react";
import { homeSections } from "@/lib/data";
import { scrollToSection } from "@/lib/scroll";
import { store, subscribe } from "@/lib/store";

export default function SectionRail({ className = "" }: { className?: string }) {
  const [active, setActive] = useState(store.active);
  useEffect(() => subscribe(() => setActive(store.active)), []);

  return (
    <nav className={`flex flex-col select-none ${className}`} aria-label="Chapters on this page">
      {homeSections.map((s, i) => {
        const on = s.id === active;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollToSection(s.id)}
            aria-label={`Go to ${s.label.toLowerCase()} chapter`}
            aria-current={on ? "true" : undefined}
            className="group flex h-7 items-center gap-3 pr-3 text-left"
          >
            <span
              className="block h-px bg-fg transition-all duration-500 ease-[var(--ease-expo)]"
              style={{ width: on ? 22 : 10, opacity: on ? 1 : 0.45 }}
            />
            <span
              className={`hud whitespace-nowrap transition-opacity duration-300 ${
                on
                  ? "text-fg opacity-100"
                  : "text-fg-dim opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
              }`}
            >
              <span className="mr-2 text-fg-faint">0{i + 1}</span>
              {s.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
