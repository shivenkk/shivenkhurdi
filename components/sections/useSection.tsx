"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { SectionId } from "@/lib/data";
import { clamp01, setActive, store } from "@/lib/store";

export function useSection(id: SectionId, vh: number) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          const p = self.progress;
          if (vh > 1) {
            store.sections[id] = clamp01((p * vh) / (vh - 1));
            store.exits[id] = clamp01(p * vh - (vh - 1));
          } else {
            store.sections[id] = 0;
            store.exits[id] = p;
          }
        },
      });
      ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) setActive(id);
        },
      });
    });
    return () => ctx.revert();
  }, [id, vh]);
  return ref;
}

export function Section({
  id,
  vh,
  children,
  className = "",
  paneClassName = "",
}: {
  id: SectionId;
  vh: number;
  children: React.ReactNode;
  className?: string;
  paneClassName?: string;
}) {
  const ref = useSection(id, vh);
  return (
    <section
      ref={ref}
      id={id}
      className={`relative ${className}`}
      style={{ height: `${vh * 100}svh` }}
    >
      <div className={`sticky top-0 h-[100svh] overflow-hidden ${paneClassName}`}>{children}</div>
    </section>
  );
}
