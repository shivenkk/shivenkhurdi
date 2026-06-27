"use client";

import SectionHeader from "@/components/SectionHeader";
import { Reveal } from "@/components/anim";
import { skills } from "@/lib/data";

export default function Skills() {
  return (
    <section id="skills" className="relative px-5 py-24 sm:px-8 sm:py-36">
      <div className="mx-auto max-w-[1600px]">
        <SectionHeader index="04" title="Capabilities" kicker="Tools & techniques" />

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
          {skills.map((group, i) => (
            <Reveal key={group.group} delay={i * 0.06}>
              <div className="h-full bg-ink p-6 sm:p-8">
                <h3 className="mb-5 flex items-baseline gap-3 font-mono text-xs uppercase tracking-wider text-lime">
                  <span className="text-paper-faint">0{i + 1}</span>
                  {group.group}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-line px-3 py-1.5 text-sm text-paper-dim transition-colors duration-300 hover:border-lime hover:text-paper"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
