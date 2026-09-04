"use client";

import { useEffect, useRef } from "react";
import { ArrowDown } from "@phosphor-icons/react";
import { profile, socials } from "@/lib/data";
import { scrollToWork } from "@/lib/scroll";
import { clamp01, onFrame, store } from "@/lib/store";
import { Section } from "./useSection";

export default function Hero() {
  const pane = useRef<HTMLDivElement>(null);
  useEffect(
    () =>
      onFrame(() => {
        if (pane.current) pane.current.style.opacity = String(1 - clamp01(store.exits.hero / 0.35));
      }),
    [],
  );
  return (
    <Section id="hero" vh={1}>
      <h1 className="sr-only">
        {profile.name}, {profile.role}
      </h1>
      <div ref={pane} className="absolute inset-0">
      <div className="stage-scrim" aria-hidden />
      <div className="on-stage absolute inset-x-5 bottom-8 flex max-w-[600px] flex-col gap-5 md:left-10 md:right-auto md:bottom-10">
        <p className="hud text-fg-dim">
          {profile.name} <span className="text-fg-faint">·</span> {profile.role}
        </p>
        <p className="max-w-[26ch] font-sans text-[22px] font-medium leading-[1.2] tracking-tight text-fg md:text-[26px]">
          {profile.intro}
        </p>
        <p className="hud max-w-[62ch] text-fg-dim">{profile.introMeta}</p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => scrollToWork(0)} className="pill">
            See work
            <ArrowDown size={12} />
          </button>
          <a href={`mailto:${socials.email}`} className="hud ml-1 text-fg-dim hover:text-fg">
            {socials.email}
          </a>
        </div>
      </div>
      </div>
    </Section>
  );
}
