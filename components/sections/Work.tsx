"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowUpRight, Code, Plus } from "lucide-react";
import { projects } from "@/lib/data";
import SectionHeader from "@/components/SectionHeader";

const EASE = [0.16, 1, 0.3, 1] as const;

const TILE_BG = [
  "linear-gradient(140deg, rgba(198,255,58,0.28), rgba(20,20,24,0.95))",
  "linear-gradient(140deg, rgba(120,140,255,0.26), rgba(20,20,24,0.95))",
  "linear-gradient(140deg, rgba(255,150,80,0.24), rgba(20,20,24,0.95))",
];

export default function Work() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [open, setOpen] = useState<string | null>(projects[0]?.id ?? null);
  const [isFine, setIsFine] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 240, damping: 26, mass: 0.5 });
  const y = useSpring(my, { stiffness: 240, damping: 26, mass: 0.5 });

  useEffect(() => {
    setIsFine(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  const onMove = (e: React.MouseEvent) => {
    mx.set(e.clientX);
    my.set(e.clientY);
  };

  return (
    <section
      id="work"
      onMouseMove={onMove}
      className="relative px-5 py-24 sm:px-8 sm:py-36"
    >
      <div className="mx-auto max-w-[1600px]">
        <SectionHeader index="04" title="Selected Projects" kicker="Things I've built" />

        <div className="border-t border-line">
          {projects.map((p, i) => {
            const isOpen = open === p.id;
            return (
              <motion.div
                key={p.id}
                className="border-b border-line"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                transition={{ duration: 0.7, ease: EASE, delay: (i % 4) * 0.05 }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : p.id)}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  data-cursor="hidden"
                  aria-expanded={isOpen}
                  className="group flex w-full items-center gap-4 py-7 text-left sm:gap-8 sm:py-9"
                >
                  <span className="w-6 shrink-0 font-mono text-xs text-paper-faint sm:w-10">
                    {p.index}
                  </span>

                  <div className="flex-1 overflow-hidden">
                    <h3
                      className="font-display font-bold leading-[0.95] tracking-tight text-paper transition-all duration-500 group-hover:translate-x-2 group-hover:text-lime"
                      style={{ fontSize: "clamp(1.7rem, 4.6vw, 4rem)" }}
                    >
                      {p.title}
                    </h3>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-paper-dim">
                      {p.subtitle}
                      <span className="font-mono text-[11px] uppercase tracking-wider text-paper-faint">
                        / {p.category}
                      </span>
                    </p>
                  </div>

                  <span className="hidden shrink-0 font-mono text-sm text-paper-faint md:block">
                    {p.year}
                  </span>

                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-paper transition-colors duration-300 group-hover:border-lime group-hover:text-lime">
                    <Plus
                      size={18}
                      className="transition-transform duration-500"
                      style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                    />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-8 pb-12 sm:pl-[4.5rem] md:grid-cols-12 md:gap-10">
                        <div className="md:col-span-7">
                          {p.affiliation && (
                            <span className="mb-4 inline-block rounded-full border border-lime/40 bg-lime/5 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-lime">
                              {p.affiliation}
                            </span>
                          )}
                          <p className="max-w-2xl text-lg leading-relaxed text-paper sm:text-xl">
                            {p.description}
                          </p>
                          <ul className="mt-7 space-y-3">
                            {p.highlights.map((h) => (
                              <li
                                key={h}
                                className="flex gap-3 text-sm leading-relaxed text-paper-dim sm:text-base"
                              >
                                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-lime" />
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex flex-col gap-6 md:col-span-5">
                          <div
                            className="relative overflow-hidden rounded-2xl border border-line p-6"
                            style={{ background: TILE_BG[i % TILE_BG.length] }}
                          >
                            <div
                              className="font-display font-extrabold leading-none tracking-tight text-paper"
                              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
                            >
                              {p.metric.value}
                            </div>
                            <div className="mt-2 font-mono text-xs uppercase tracking-wider text-paper-dim">
                              {p.metric.label}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {p.stack.map((s) => (
                              <span
                                key={s}
                                className="rounded-full border border-line px-3 py-1.5 font-mono text-xs text-paper-dim"
                              >
                                {s}
                              </span>
                            ))}
                          </div>

                          <div className="flex flex-wrap gap-3">
                            {p.links.code && (
                              <a
                                href={p.links.code}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-[#08080a] transition-opacity hover:opacity-90"
                              >
                                <Code size={16} /> View code
                              </a>
                            )}
                            {p.links.live && (
                              <a
                                href={p.links.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:border-lime hover:text-lime"
                              >
                                Live demo <ArrowUpRight size={16} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Cursor-following preview tile (desktop only) */}
      <AnimatePresence>
        {hovered !== null && isFine && (
          <motion.div
            className="pointer-events-none fixed left-0 top-0 z-30 hidden md:block"
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <div
              className="-translate-x-1/2 -translate-y-1/2 rotate-[-4deg] rounded-2xl border border-line p-7 shadow-2xl"
              style={{
                width: 320,
                background: TILE_BG[hovered % TILE_BG.length],
              }}
            >
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-paper-dim">
                <span>{projects[hovered].category}</span>
                <span>{projects[hovered].year}</span>
              </div>
              <div
                className="mt-8 font-display font-extrabold leading-none tracking-tight text-paper"
                style={{ fontSize: "3.25rem" }}
              >
                {projects[hovered].metric.value}
              </div>
              <div className="mt-2 font-mono text-xs uppercase tracking-wider text-lime">
                {projects[hovered].metric.label}
              </div>
              <div className="mt-6 border-t border-line pt-4 text-sm text-paper">
                {projects[hovered].blurb}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
