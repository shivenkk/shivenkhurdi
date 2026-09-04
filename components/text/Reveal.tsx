"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function Reveal({
  text,
  children,
  by = "words",
  as: Tag = "div",
  className = "",
  innerClassName = "",
  delay = 0,
  stagger,
  trigger = "scroll",
  y = "110%",
}: {
  text?: string;
  children?: ReactNode;
  by?: "chars" | "words" | "block";
  as?: "div" | "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  innerClassName?: string;
  delay?: number;
  stagger?: number;
  trigger?: "scroll" | "mount";
  y?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>("[data-reveal]");
    gsap.set(targets, { yPercent: 0, y, opacity: 1 });
    const tween = gsap.to(targets, {
      y: 0,
      duration: 1.3,
      delay,
      ease: "expo.out",
      stagger: stagger ?? (by === "chars" ? 0.025 : by === "words" ? 0.06 : 0),
      paused: trigger === "scroll",
    });
    let st: ScrollTrigger | undefined;
    if (trigger === "scroll") {
      st = ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => tween.play(),
      });
    }
    return () => {
      tween.kill();
      st?.kill();
    };
  }, [text, by, delay, stagger, trigger, y]);

  let content: ReactNode;
  if (by === "block" || !text) {
    content = (
      <span className="block overflow-hidden">
        <span data-reveal className={`block ${innerClassName}`} style={{ opacity: 0 }}>
          {children ?? text}
        </span>
      </span>
    );
  } else if (by === "words") {
    content = text.split(" ").map((w, i) => (
      <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
        <span data-reveal className={`inline-block ${innerClassName}`} style={{ opacity: 0 }}>
          {w}
          {i < text.split(" ").length - 1 ? " " : ""}
        </span>
      </span>
    ));
  } else {
    content = text.split("").map((c, i) => (
      <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
        <span data-reveal className={`inline-block ${innerClassName}`} style={{ opacity: 0 }}>
          {c === " " ? " " : c}
        </span>
      </span>
    ));
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className} aria-label={text}>
      {content}
    </Tag>
  );
}
