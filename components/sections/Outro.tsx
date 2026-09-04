"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { navLinks, socials } from "@/lib/data";
import { clamp01, store } from "@/lib/store";
import TransitionLink from "@/components/ui/TransitionLink";
import { NablaMark } from "@/components/ui/Wordmark";
import { Section } from "./useSection";

const LETTERS = ["S", "H", "I", "V", "E", "N"] as const;

export default function Outro() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const letters = el.querySelectorAll<HTMLElement>("[data-letter]");
    const guides = el.querySelectorAll<HTMLElement>("[data-guide]");
    const foot = el.querySelector<HTMLElement>("[data-foot]");
    const order = [3, 2, 4, 1, 5, 0]; // V first, then outward
    let raf = 0;
    const loop = () => {
      const p = store.sections.outro;
      const e = store.exits.education;
      const show = clamp01((e - 0.7) / 0.3);
      el.style.opacity = String(show);
      letters.forEach((l, idx) => {
        const rank = order.indexOf(idx);
        const start = 0.1 + rank * 0.07;
        const k = clamp01((p - start) / 0.12);
        l.style.opacity = String(idx === 3 ? show : k);
        l.style.transform = `translateY(${(1 - k) * 10}px)`;
      });
      guides.forEach((g, idx) => {
        const k = clamp01((p - 0.02 - idx * 0.04) / 0.2) * (1 - clamp01((p - 0.62) / 0.2));
        g.style.transform = `scaleX(${k})`;
        g.style.opacity = String(k);
      });
      if (foot) {
        const k = clamp01((p - 0.6) / 0.25);
        foot.style.opacity = String(k);
        foot.style.transform = `translateY(${(1 - k) * 16}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <Section id="outro" vh={3}>
      <div ref={root} className="on-stage absolute inset-0 opacity-0">
        <div data-guide className="absolute left-0 right-0 top-[38%] h-px origin-left bg-fg/20" />
        <div data-guide className="absolute left-0 right-0 top-[62%] h-px origin-right bg-fg/20" />
        <div data-guide className="absolute left-0 right-0 top-[50%] h-px origin-left bg-fg/10" />

        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center">
          <div
            className="flex items-baseline font-display font-extrabold uppercase leading-none tracking-[-0.02em] text-fg"
            style={{ fontSize: "clamp(64px, 17vw, 300px)" }}
            aria-label="Shiven"
          >
            {LETTERS.map((ch, idx) =>
              ch === "V" ? (
                <NablaMark
                  key={ch}
                  data-letter
                  className="mx-[0.03em] inline-block h-[0.74em] w-auto translate-y-[0.02em]"
                  title=""
                />
              ) : (
                <span key={ch + idx} data-letter aria-hidden style={{ opacity: 0 }}>
                  {ch}
                </span>
              ),
            )}
          </div>
        </div>

        <div
          data-foot
          className="absolute inset-x-5 bottom-8 flex flex-col gap-8 opacity-0 md:inset-x-10 md:flex-row md:items-end md:justify-between"
        >
          <div className="grid grid-cols-3 gap-x-10 gap-y-2 hud [&_a]:inline-block [&_a]:py-1">
            <ul className="flex flex-col gap-2">
              <li>
                <a href="#hero" className="hover:text-fg">Home</a>
              </li>
              {navLinks.map((l) => (
                <li key={l.href}>
                  <TransitionLink href={l.href} className="hover:text-fg">
                    {l.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
            <ul className="flex flex-col gap-2">
              <li>
                <TransitionLink href={socials.resume} className="hover:text-fg">Résumé</TransitionLink>
              </li>
              <li>
                <a href={socials.github} target="_blank" rel="noreferrer" className="hover:text-fg">GitHub</a>
              </li>
              <li>
                <a href={socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-fg">LinkedIn</a>
              </li>
            </ul>
            <ul className="flex flex-col gap-2 text-fg-faint">
              <li>Boston, MA</li>
              <li>Open to relocate</li>
              <li>
                <a href={socials.phoneHref} className="hover:text-fg">{socials.phone}</a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col items-start gap-4 md:items-end">
            <div className="flex items-center gap-8">
              <a href={`mailto:${socials.email}`} className="group hud inline-flex items-center gap-3 text-fg">
                Contact
                <span className="grid size-7 place-items-center rounded-full border border-rule transition-colors group-hover:bg-fg group-hover:text-bg">
                  <ArrowUpRight size={12} />
                </span>
              </a>
              <TransitionLink href={socials.resume} className="group hud inline-flex items-center gap-3 text-fg">
                Résumé
                <span className="grid size-7 place-items-center rounded-full border border-rule transition-colors group-hover:bg-fg group-hover:text-bg">
                  <ArrowUpRight size={12} />
                </span>
              </TransitionLink>
            </div>
            <p className="font-sans text-sm text-fg-dim">©{new Date().getFullYear()} Shiven Khurdi</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
