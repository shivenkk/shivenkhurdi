"use client";

import SectionHeader from "@/components/SectionHeader";
import { Reveal } from "@/components/anim";
import LogoMark from "@/components/LogoMark";
import { education } from "@/lib/data";

export default function Education() {
  return (
    <section id="education" className="relative px-5 py-24 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeader index="03" title="Education" kicker="Where I studied" />

        <div className="grid gap-6 md:grid-cols-2">
          {education.map((ed) => (
            <Reveal key={ed.school}>
              <article className="card-line h-full rounded-2xl p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <LogoMark
                    src={ed.logo}
                    alt={`${ed.school} logo`}
                    className="h-9"
                  />
                  <span className="font-mono text-xs text-lime">{ed.gpa}</span>
                </div>
                <div className="mt-5 font-mono text-xs text-paper-faint">
                  {ed.period}
                </div>
                <h3
                  className="mt-3 font-display font-semibold leading-tight text-paper"
                  style={{ fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)" }}
                >
                  {ed.school}
                </h3>
                <div className="mt-1.5 text-paper">{ed.degree}</div>
                <div className="text-sm text-paper-faint">{ed.location}</div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {ed.coursework.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-paper-dim"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
