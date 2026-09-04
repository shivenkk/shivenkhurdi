"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { ArrowUpRight } from "@phosphor-icons/react";
import { education, skills } from "@/lib/data";
import TransitionLink from "@/components/ui/TransitionLink";
import { onFrame, store } from "@/lib/store";
import Scramble from "@/components/text/Scramble";
import { Section } from "./useSection";

export default function Education() {
  const [shown, setShown] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
      onFrame(() => {
        const next = store.exits.experience > 0.7 && store.exits.education < 0.5;
        setShown((prev) => (prev === next ? prev : next));
        if (root.current) root.current.style.opacity = next ? "1" : "0";
      }),
    [],
  );

  useEffect(() => {
    const el = root.current;
    if (!el || !shown) return;
    gsap.fromTo(
      el.querySelectorAll("[data-line]"),
      { y: 16, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, stagger: 0.05, duration: 1 },
    );
  }, [shown]);

  return (
    <Section id="education" vh={3}>
      <div
        ref={root}
        className="on-stage absolute inset-x-5 top-[110px] bottom-8 grid content-end gap-10 opacity-0 transition-opacity duration-700 md:inset-x-10 md:grid-cols-[1.1fr_1fr] md:content-center lg:inset-x-[12%]"
      >
        <div>
          <h2 data-line className="hud-label mb-6">
            Education
          </h2>
          <div className="flex flex-col gap-8">
            {education.map((e) => (
              <div key={e.school} data-line className="border-t border-rule pt-4">
                <h3 className="font-sans text-2xl font-medium tracking-tight text-fg md:text-3xl">
                  <Scramble text={e.degree} trigger="mount" replayKey={String(shown)} />
                </h3>
                <p className="mt-1 font-sans text-base text-fg-dim">{e.school}</p>
                <p className="hud mt-2 text-fg-dim">
                  {e.period} · {e.location} · {e.gpa}
                </p>
              </div>
            ))}
            <TransitionLink
              data-line
              href="/experience#education"
              className="hud group inline-flex items-center gap-2 text-fg"
            >
              Coursework and full toolkit
              <ArrowUpRight size={12} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </TransitionLink>
          </div>
        </div>
        <div className="hidden md:block">
          <h2 data-line className="hud-label mb-6">
            Toolkit
          </h2>
          <div className="flex flex-col gap-4">
            {skills.map((g) => (
              <div key={g.group} data-line className="border-t border-rule pt-3">
                <p className="hud mb-2 text-fg-dim">{g.group}</p>
                <div className="flex flex-wrap gap-1.5">
                  {g.items.map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
