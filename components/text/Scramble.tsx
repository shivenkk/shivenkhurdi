"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/[]{}=+*#";

export default function Scramble({
  text,
  as: Tag = "span",
  className = "",
  trigger = "scroll",
  delay = 0,
  duration = 1.1,
  replayKey,
}: {
  text: string;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  trigger?: "mount" | "scroll";
  delay?: number;
  duration?: number;
  replayKey?: string | number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const final = text;
    const len = final.length;
    const state = { p: 0 };
    let frame = 0;
    const render = () => {
      frame++;
      let out = "";
      for (let i = 0; i < len; i++) {
        const ch = final[i];
        const threshold = state.p * (len + 3) - 3;
        if (ch === " " || i < threshold) out += ch;
        else if (i < threshold + 4)
          out += GLYPHS[(frame * 7 + i * 13) % GLYPHS.length];
        else out += " ";
      }
      el.textContent = out;
    };
    render();
    const tween = gsap.to(state, {
      p: 1,
      duration,
      delay,
      ease: "power2.inOut",
      onUpdate: render,
      onComplete: () => {
        el.textContent = final;
      },
      paused: trigger === "scroll",
    });
    let st: ScrollTrigger | undefined;
    if (trigger === "scroll") {
      st = ScrollTrigger.create({
        trigger: el,
        start: "top 92%",
        once: true,
        onEnter: () => tween.play(),
      });
    }
    return () => {
      tween.kill();
      st?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, replayKey]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className} aria-label={text}>
      {text}
    </Tag>
  );
}
