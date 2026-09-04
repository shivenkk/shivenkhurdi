"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";

let start: ((href: string) => void) | null = null;
export function navigateWithTransition(href: string) {
  if (start) start(href);
  else window.location.href = href;
}

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const blob = useRef<HTMLDivElement>(null);
  const pending = useRef<string | null>(null);

  useEffect(() => {
    start = (href: string) => {
      if (href === pathname || pending.current) return;
      pending.current = href;
      const el = root.current!;
      const b = blob.current!;
      gsap.killTweensOf([el, b]);
      gsap.set(el, { pointerEvents: "auto" });
      gsap
        .timeline({
          onComplete: () => router.push(href),
        })
        .fromTo(
          b,
          { xPercent: 60, yPercent: 60, scale: 0.4, opacity: 0, rotate: -20 },
          {
            xPercent: 0,
            yPercent: 0,
            scale: 2.2,
            opacity: 1,
            rotate: 8,
            duration: 0.9,
            ease: "power3.inOut",
          },
          0,
        )
        .to(el, { backgroundColor: "rgba(7,7,9,0.92)", duration: 0.7 }, 0.1);
    };
    return () => {
      start = null;
    };
  }, [pathname, router]);

  // Clear when the new route has rendered.
  useEffect(() => {
    if (!pending.current) return;
    pending.current = null;
    const el = root.current!;
    const b = blob.current!;
    gsap
      .timeline({
        onComplete: () => gsap.set(el, { pointerEvents: "none" }),
      })
      .to(
        b,
        {
          xPercent: -70,
          yPercent: -50,
          scale: 0.5,
          opacity: 0,
          duration: 0.9,
          ease: "power3.inOut",
        },
        0,
      )
      .to(el, { backgroundColor: "rgba(7,7,9,0)", duration: 0.6 }, 0.15);
  }, [pathname]);

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
      style={{ backgroundColor: "rgba(7,7,9,0)" }}
    >
      <div
        ref={blob}
        className="absolute left-1/2 top-1/2 h-[46vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 opacity-0"
        style={{
          background:
            "radial-gradient(closest-side, rgba(120,104,236,0.55), rgba(40,36,90,0.35) 55%, transparent 100%)",
          filter: "blur(28px)",
          borderRadius: "48% 52% 40% 60% / 55% 40% 60% 45%",
        }}
      />
    </div>
  );
}
