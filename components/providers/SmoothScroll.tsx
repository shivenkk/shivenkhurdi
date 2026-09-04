"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { store } from "@/lib/store";

let lenisRef: Lenis | null = null;
export const getLenis = () => lenisRef;

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    store.reducedMotion = reduce;

    const lenis = new Lenis({
      lerp: reduce ? 1 : 0.09,
      smoothWheel: !reduce,
      syncTouch: false,
    });
    lenisRef = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef = null;
    };
  }, []);

  // Route change: jump to the top and let ScrollTrigger re-measure.
  useEffect(() => {
    lenisRef?.scrollTo(0, { immediate: true });
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 80);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return <>{children}</>;
}
