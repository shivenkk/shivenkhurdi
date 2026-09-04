"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { gsap } from "@/lib/gsap";
import { experience } from "@/lib/data";
import { scrollToExperience } from "@/lib/scroll";
import { onFrame, store, subscribe } from "@/lib/store";
import TransitionLink from "@/components/ui/TransitionLink";
import Scramble from "@/components/text/Scramble";
import { Section } from "./useSection";

export default function Experience() {
  const [i, setI] = useState(0);
  const col = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => subscribe(() => setI(store.activeExperience)), []);
  useEffect(
    () =>
      onFrame(() => {
        if (!wrap.current) return;
        const shown = store.sections.experience > 0.14 && store.exits.experience < 0.4;
        wrap.current.style.opacity = shown ? "1" : "0";
      }),
    [],
  );

  useEffect(() => {
    const el = col.current;
    if (!el) return;
    gsap.fromTo(
      el.querySelectorAll("[data-line]"),
      { y: 16, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.9, delay: 0.15 },
    );
  }, [i]);

  const x = experience[i];

  return (
    <Section id="experience" vh={6}>
      <div ref={wrap} className="absolute inset-0 opacity-0 transition-opacity duration-700">
      <div className="stage-scrim md:hidden" aria-hidden />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] md:block"
        style={{ background: "linear-gradient(to left, color-mix(in oklab, var(--bg) 82%, transparent), color-mix(in oklab, var(--bg) 40%, transparent) 60%, transparent)" }}
        aria-hidden
      />
      <div className="on-stage absolute inset-x-5 bottom-8 md:inset-x-auto md:bottom-auto md:right-10 md:top-1/2 md:w-[440px] md:-translate-y-1/2 lg:right-[8%]">
        <div className="mb-5 flex flex-wrap gap-x-4 gap-y-1">
          {experience.map((e, j) => (
            <button
              key={e.id}
              type="button"
              onClick={() => scrollToExperience(j)}
              className={`hud min-h-[28px] py-1 transition-colors ${j === i ? "text-fg underline underline-offset-4" : "text-fg-faint hover:text-fg-dim"}`}
            >
              {e.short}
            </button>
          ))}
        </div>
        <div ref={col} key={x.id}>
          <div data-line className="hud mb-3 flex items-center gap-3 text-fg-faint">
            <span>{x.period}</span>
            <span>{x.location}</span>
            {x.current && <span className="text-violet-soft">● current</span>}
          </div>
          <h2 data-line className="font-sans text-3xl font-medium tracking-tight text-fg md:text-4xl">
            <Scramble text={x.company} trigger="mount" duration={0.7} replayKey={x.id} />
          </h2>
          <p data-line className="mt-1 font-sans text-base text-fg-dim">
            {x.role}
            {x.context ? ` · ${x.context}` : ""}
          </p>
          <p data-line className="mt-5 max-w-[48ch] font-sans text-base leading-relaxed text-fg">
            {x.summary}
          </p>
          <ul data-line className="mt-5 hidden flex-col gap-2.5 border-t border-rule pt-4 md:flex">
            {x.points.slice(0, 2).map((pt) => (
              <li key={pt} className="line-clamp-3 font-sans text-[14px] leading-relaxed text-fg-dim">
                {pt}
              </li>
            ))}
          </ul>
          <div data-line className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous role"
                  disabled={i === 0}
                  onClick={() => scrollToExperience(i - 1)}
                  className="grid size-8 place-items-center rounded-full border border-rule text-fg transition-colors hover:bg-fg hover:text-bg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-fg"
                >
                  <ArrowLeft size={13} />
                </button>
                <button
                  type="button"
                  aria-label="Next role"
                  disabled={i === experience.length - 1}
                  onClick={() => scrollToExperience(i + 1)}
                  className="grid size-8 place-items-center rounded-full border border-rule text-fg transition-colors hover:bg-fg hover:text-bg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-fg"
                >
                  <ArrowRight size={13} />
                </button>
              </div>
              <span className="hud tabular-nums text-fg-dim">
                0{i + 1} / 0{experience.length}
              </span>
            </div>
            <TransitionLink href="/experience" className="hud group inline-flex items-center gap-2 text-fg">
              Full timeline
              <ArrowUpRight size={12} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </TransitionLink>
          </div>
        </div>
      </div>
      </div>
    </Section>
  );
}
