"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import { Reveal } from "@/components/anim";
import { profile } from "@/lib/data";

const FACTS = [
  { label: "Based in", value: "Boston, MA · open to relocate" },
  { label: "Studying", value: "M.S. Artificial Intelligence, Northeastern" },
  { label: "Focus", value: "LLMs · Multi-Agent · Computer Vision · Gen AI" },
  { label: "Currently", value: "Interlock Systems (Harvard Innovation Labs)" },
];

export default function About() {
  const imgWrap = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imgWrap,
    offset: ["start end", "end start"],
  });
  const yImg = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);

  return (
    <section id="about" className="relative px-5 py-24 sm:px-8 sm:py-36">
      <div
        className="glow right-[-5%] top-[20%] h-[40vh] w-[40vh] opacity-30"
        style={{ background: "rgba(198,255,58,0.12)" }}
      />
      <div className="mx-auto max-w-[1600px]">
        <SectionHeader index="01" title="About" kicker="The person behind the work" />

        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          {/* Text */}
          <div className="order-2 md:order-1 md:col-span-7">
            <div className="space-y-6">
              {profile.about.map((para, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <p
                    className={`max-w-2xl leading-relaxed ${
                      i === 0
                        ? "text-2xl text-paper sm:text-3xl"
                        : "text-lg text-paper-dim"
                    }`}
                  >
                    {para}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* Facts */}
            <Reveal delay={0.1}>
              <dl className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
                {FACTS.map((f) => (
                  <div key={f.label} className="bg-ink p-5">
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-paper-faint">
                      {f.label}
                    </dt>
                    <dd className="mt-1.5 text-paper">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* Photo */}
          <div className="order-1 md:order-2 md:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                ref={imgWrap}
                className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line"
              >
                <motion.div
                  style={{ y: yImg }}
                  className="absolute inset-x-0 -inset-y-[10%]"
                >
                  <Image
                    src="/shiven.jpg"
                    alt="Shiven Khurdi at his Northeastern University graduation on the Boston waterfront"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover object-center"
                  />
                </motion.div>

                {/* Top overlay label */}
                <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4 font-mono text-[10px] uppercase tracking-widest text-paper/80 mix-blend-difference">
                  <span>Boston Seaport</span>
                  <span>41.0°N</span>
                </div>
              </div>
            </motion.div>

            <p className="mt-4 font-mono text-xs text-paper-faint">
              ↳ Graduation day, Boston. M.S. Artificial Intelligence, Northeastern University.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
