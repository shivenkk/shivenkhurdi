"use client";

import SectionHeader from "@/components/SectionHeader";
import { Reveal } from "@/components/anim";
import LogoMark from "@/components/LogoMark";
import { experience } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" className="relative px-5 py-24 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeader index="02" title="Experience" kicker="Where I've worked" />

        {/* Experience timeline */}
        <div className="border-t border-line">
          {experience.map((exp) => (
            <Reveal key={exp.company + exp.period}>
              <article className="grid gap-5 border-b border-line py-10 md:grid-cols-12 md:gap-8 md:py-12">
                <div className="md:col-span-4">
                  <LogoMark
                    src={exp.logo}
                    alt={`${exp.company} logo`}
                    className="h-9"
                  />
                  <div className="mt-5 font-mono text-xs text-paper-faint">
                    {exp.period}
                  </div>
                  <h3
                    className="mt-3 font-display font-semibold leading-tight text-paper"
                    style={{ fontSize: "clamp(1.5rem, 2.4vw, 2.1rem)" }}
                  >
                    {exp.role}
                  </h3>
                  <div className="mt-1.5 text-lime">{exp.company}</div>
                  {exp.context && (
                    <div className="text-sm text-paper-dim">{exp.context}</div>
                  )}
                  <div className="mt-0.5 text-sm text-paper-faint">
                    {exp.location}
                  </div>
                  {exp.current && (
                    <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-lime/40 bg-lime/5 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-lime">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime" />
                      </span>
                      Current
                    </span>
                  )}
                </div>

                <div className="md:col-span-8 md:pl-8">
                  <ul className="space-y-4">
                    {exp.points.map((pt, i) => (
                      <li
                        key={i}
                        className="flex gap-3 leading-relaxed text-paper-dim"
                      >
                        <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-paper-faint" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
