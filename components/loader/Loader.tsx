"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { profile } from "@/lib/data";
import { fontFamilies } from "@/lib/fonts";
import { markLoaded, store } from "@/lib/store";
import { getLenis } from "@/components/providers/SmoothScroll";

const SEEN_KEY = "shiven:booted";

export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const line = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = root.current;
    const s = svg.current;
    // Already booted (client-side return to home): nothing to draw.
    if (!el || !s) return;
    // Seen it this session, or motion is reduced: get out of the way.
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    const quick = seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = getLenis();
    lenis?.stop();
    window.scrollTo(0, 0);

    const guides = Array.from(s.querySelectorAll<SVGElement>("[data-guide]"));
    const dashed = Array.from(s.querySelectorAll<SVGElement>("[data-dashed]"));
    const mark = Array.from(s.querySelectorAll<SVGElement>("[data-mark]"));

    gsap.set([...guides, ...mark], {
      strokeDasharray: 1,
      strokeDashoffset: 1,
      opacity: 1,
    });
    gsap.set(dashed, { opacity: 0 });

    const text = profile.bootLine;
    const p = line.current!;
    const typing = { i: 0 };

    const speed = quick ? 0.25 : 0.8;
    const tl = gsap.timeline();
    tl.to(guides, {
      strokeDashoffset: 0,
      duration: 1.4 * speed,
      ease: "power3.inOut",
      stagger: { each: 0.05 * speed, from: "random" },
    })
      .to(dashed, { opacity: 1, duration: 0.8 * speed, stagger: 0.1 * speed }, 0.5 * speed)
      .to(mark, { strokeDashoffset: 0, duration: 1.2 * speed, ease: "power3.inOut" }, 0.9 * speed)
      .to(
        typing,
        {
          i: text.length,
          duration: 1.3 * speed,
          ease: "none",
          onUpdate: () => {
            const n = Math.round(typing.i);
            p.textContent = text.slice(0, n) + (n < text.length ? "_" : "");
          },
        },
        1.0 * speed,
      );

    const minTime = quick ? 350 : 1900;
    const started = performance.now();
    let cancelled = false;

    const fontsReady = Promise.all([
      document.fonts.load(`800 100px ${fontFamilies.display}`),
      document.fonts.load(`400 16px ${fontFamilies.mono}`),
      document.fonts.load(`500 16px ${fontFamilies.sans}`),
    ]).catch(() => undefined);

    fontsReady.then(() => {
      const wait = Math.max(0, minTime - (performance.now() - started));
      gsap.delayedCall(wait / 1000, () => {
        if (cancelled) return;
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {}
        markLoaded();
        gsap
          .timeline({
            onComplete: () => {
              el.style.display = "none";
              lenis?.start();
            },
          })
          .to(s, { scale: 1.06, duration: 1.1, ease: "power3.in" }, 0)
          .to([s, p], { opacity: 0, duration: 0.5, ease: "power2.in" }, 0.35)
          .to(el, { opacity: 0, duration: 0.7, ease: "power2.inOut" }, 0.45);
      });
    });

    return () => {
      cancelled = true;
      tl.kill();
      lenis?.start();
    };
  }, []);

  if (store.loaded) return null;

  const L = 620;
  const Rr = 980;
  const T = 300;
  const A = 610; // apex y
  const cx = 800;
  const t = 52; // stroke thickness
  // Slope of the left edge: dx/dy = (cx - L) / (A - T)
  const k = (cx - L) / (A - T);
  const ext = (y: number, sign: 1 | -1) => cx + sign * k * (A - y); // x on edge at y

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink"
      aria-label="Loading"
    >
      <svg
        ref={svg}
        viewBox="0 0 1600 900"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke="rgba(233,233,230,0.45)"
        strokeWidth="1"
      >
        {[T, T + t, A - t * 1.15, A].map((y) => (
          <line key={y} data-guide pathLength={1} x1={140} y1={y} x2={1460} y2={y} strokeOpacity={0.35} />
        ))}
        <line data-guide pathLength={1} x1={ext(-80, -1)} y1={-80} x2={ext(980, -1)} y2={980} />
        <line data-guide pathLength={1} x1={ext(-80, -1) + t * 1.2} y1={-80} x2={ext(980, -1) + t * 1.2} y2={980} strokeOpacity={0.5} />
        <line data-guide pathLength={1} x1={ext(-80, 1)} y1={-80} x2={ext(980, 1)} y2={980} />
        <line data-guide pathLength={1} x1={ext(-80, 1) - t * 1.2} y1={-80} x2={ext(980, 1) - t * 1.2} y2={980} strokeOpacity={0.5} />
        <line data-guide pathLength={1} x1={ext(980, -1)} y1={-80} x2={ext(-80, -1)} y2={980} strokeOpacity={0.25} />
        <line data-guide pathLength={1} x1={ext(980, 1)} y1={-80} x2={ext(-80, 1)} y2={980} strokeOpacity={0.25} />
        <line data-guide pathLength={1} x1={L} y1={40} x2={L} y2={860} strokeOpacity={0.25} />
        <line data-guide pathLength={1} x1={Rr} y1={40} x2={Rr} y2={860} strokeOpacity={0.25} />
        <line data-dashed x1={cx} y1={60} x2={cx} y2={840} strokeDasharray="3 6" strokeOpacity={0.4} />
        <circle data-dashed cx={cx} cy={(T + A) / 2 - 20} r={(A - T) * 0.62} strokeDasharray="2 6" strokeOpacity={0.5} />
        <circle data-dashed cx={cx} cy={(T + A) / 2 + 24} r={(A - T) * 0.33} strokeDasharray="2 6" strokeOpacity={0.5} />
        <circle data-guide pathLength={1} cx={cx} cy={(T + A) / 2 - 20} r={(A - T) * 0.95} strokeOpacity={0.18} />
        <path
          data-mark
          pathLength={1}
          d={`M${L} ${T}H${Rr}L${cx} ${A}Z`}
          stroke="rgba(233,233,230,0.9)"
          strokeWidth="1.4"
        />
        <path
          data-mark
          pathLength={1}
          d={`M${L + t * 1.42} ${T + t}H${Rr - t * 1.42}L${cx} ${A - t * 1.16}Z`}
          stroke="rgba(233,233,230,0.7)"
          strokeWidth="1.2"
        />
        {[L, cx, Rr].map((x) => (
          <line key={x} data-guide pathLength={1} x1={x} y1={T - 18} x2={x} y2={T - 6} strokeOpacity={0.6} />
        ))}
      </svg>
      <p
        ref={line}
        className="hud absolute left-1/2 top-[68%] -translate-x-1/2 whitespace-nowrap text-fg-dim"
        aria-hidden
      />
    </div>
  );
}
