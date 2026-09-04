"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { profile } from "@/lib/data";
import TransitionLink from "@/components/ui/TransitionLink";
import { store } from "@/lib/store";
import { Section } from "./useSection";

export default function Vision() {
  const root = useRef<HTMLDivElement>(null);
  const word = useRef<SVGTextElement>(null);

  useEffect(() => {
    let raf = 0;
    const lines = root.current?.querySelectorAll<HTMLElement>(".mark-line") ?? [];
    const dash = 1900;
    const loop = () => {
      const p = store.sections.vision;
      const e = store.exits.vision;
      lines.forEach((el, i) => {
        const start = 0.04 + i * 0.09;
        const w = Math.min(1, Math.max(0, (p - start) / 0.16)) * (1 - Math.min(1, Math.max(0, (e - 0.1) / 0.3)));
        el.style.setProperty("--wipe", w.toFixed(3));
      });
      if (word.current) {
        const d = Math.min(1, Math.max(0, p / 0.45));
        word.current.style.strokeDashoffset = String(dash * (1 - d));
        word.current.style.opacity = String(1 - Math.min(1, Math.max(0, (e - 0.1) / 0.3)));
      }
      if (root.current) {
        const fade = 1 - Math.min(1, Math.max(0, (p - 0.72) / 0.2));
        root.current.style.opacity = String(fade);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <Section id="vision" vh={3}>
      <h2 className="sr-only">Approach</h2>
      <div ref={root} className="on-stage absolute inset-0">
        <svg
          className="absolute left-5 top-[120px] h-[52px] w-auto md:left-10 md:top-[140px] md:h-[96px]"
          viewBox="0 0 760 110"
          aria-hidden
        >
          <text
            ref={word}
            x="0"
            y="92"
            className="font-display"
            style={{
              fontSize: 96,
              fontWeight: 800,
              fill: "none",
              stroke: "var(--fg)",
              strokeWidth: 1.2,
              strokeDasharray: 1900,
              strokeDashoffset: 1900,
              opacity: 0.55,
            }}
          >
            APPROACH
          </text>
        </svg>

        <div className="absolute left-5 top-[38%] flex flex-col items-start gap-1 md:left-[14%]">
          {profile.vision.lines.map((l) => (
            <span key={l} className="mark-line font-sans text-2xl font-medium tracking-tight md:text-4xl">
              <span>{l}</span>
            </span>
          ))}
        </div>
        <div className="absolute right-5 top-[58%] flex flex-col items-end gap-1 md:right-[14%]">
          {profile.vision.answer.map((l) => (
            <span key={l} className="mark-line font-sans text-2xl font-medium tracking-tight md:text-4xl">
              <span>{l}</span>
            </span>
          ))}
          <span className="mark-line mt-3 font-mono text-[11px] tracking-[0.06em]">
            <span>{profile.vision.english}</span>
          </span>
          <TransitionLink
            href="/about"
            className="hud group mt-6 inline-flex items-center gap-2 text-fg"
          >
            More about me
            <ArrowUpRight size={12} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </TransitionLink>
        </div>
      </div>
    </Section>
  );
}
