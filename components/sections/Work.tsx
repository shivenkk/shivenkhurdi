"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { gsap } from "@/lib/gsap";
import { projects } from "@/lib/data";
import { scrollToWork } from "@/lib/scroll";
import { onFrame, store, subscribe } from "@/lib/store";
import TransitionLink from "@/components/ui/TransitionLink";
import Scramble from "@/components/text/Scramble";
import { Section } from "./useSection";

export default function Work() {
  const [i, setI] = useState(0);
  const caption = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => subscribe(() => setI(store.activeWork)), []);
  useEffect(
    () =>
      onFrame(() => {
        if (!wrap.current) return;
        const shown = store.sections.work > 0.1 && store.exits.work < 0.5;
        wrap.current.style.opacity = shown ? "1" : "0";
      }),
    [],
  );

  useEffect(() => {
    const el = caption.current;
    if (!el) return;
    gsap.fromTo(
      el.querySelectorAll("[data-line]"),
      { y: 18, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, stagger: 0.07, duration: 0.9 },
    );
  }, [i]);

  const p = projects[i];

  return (
    <Section id="work" vh={6}>
      <div ref={wrap} className="absolute inset-0 opacity-0 transition-opacity duration-700">
      <div className="stage-scrim" aria-hidden />
      <div className="on-stage absolute inset-x-5 bottom-8 flex flex-col gap-6 md:inset-x-10 md:flex-row md:items-end md:justify-between">
        <div ref={caption} key={p.id} className="max-w-[680px]">
          <div data-line className="hud mb-3 flex items-center gap-3 text-fg-faint">
            <span>{p.date}</span>
            <span className="rounded-[2px] bg-fg/10 px-2 py-0.5 text-fg-dim">
              {p.metric.value} {p.metric.label}
            </span>
          </div>
          <h2 data-line className="font-sans text-3xl font-medium tracking-tight text-fg md:text-4xl">
            <Scramble text={p.title} trigger="mount" duration={0.7} replayKey={p.id} />
          </h2>
          <p data-line className="mt-2 font-sans text-[15px] text-fg-dim md:text-base">
            {p.subtitle}
          </p>
          <p data-line className="mt-3 hidden max-w-[52ch] font-sans text-[15px] leading-relaxed text-fg/85 md:block">
            {p.blurb}
          </p>
          <div data-line className="mt-4 flex flex-wrap items-center gap-2">
            {p.links.code && (
              <a href={p.links.code} target="_blank" rel="noreferrer noopener" className="chip text-fg hover:border-fg">
                Code <ArrowUpRight size={11} className="ml-1" />
              </a>
            )}
            {p.links.paper && (
              <a href={p.links.paper} target="_blank" rel="noreferrer noopener" className="chip text-fg hover:border-fg">
                Paper <ArrowUpRight size={11} className="ml-1" />
              </a>
            )}
            <span className="mx-1 h-3 w-px bg-rule" />
            {p.tags.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
            {p.stack.slice(0, 3).map((t) => (
              <span key={t} className="chip opacity-60">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous project"
              disabled={i === 0}
              onClick={() => scrollToWork(i - 1)}
              className="grid size-8 place-items-center rounded-full border border-rule text-fg transition-colors hover:bg-fg hover:text-bg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-fg"
            >
              <ArrowLeft size={13} />
            </button>
            <button
              type="button"
              aria-label="Next project"
              disabled={i === projects.length - 1}
              onClick={() => scrollToWork(i + 1)}
              className="grid size-8 place-items-center rounded-full border border-rule text-fg transition-colors hover:bg-fg hover:text-bg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-fg"
            >
              <ArrowRight size={13} />
            </button>
          </div>
          <span className="hud tabular-nums text-fg-dim">
            {p.index} / {String(projects.length).padStart(2, "0")}
          </span>
          <TransitionLink
            href="/work"
            className="hud group inline-flex items-center gap-2 text-fg transition-colors hover:text-fg"
          >
            All work
            <ArrowUpRight size={12} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </TransitionLink>
        </div>
      </div>
      </div>
    </Section>
  );
}
