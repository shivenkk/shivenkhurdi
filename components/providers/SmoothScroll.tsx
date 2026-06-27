"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type ScrollAPI = {
  scrollTo: (target: string | number | HTMLElement, opts?: Record<string, unknown>) => void;
  stop: () => void;
  start: () => void;
};

const ScrollCtx = createContext<ScrollAPI>({
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
});

export const useSmoothScroll = () => useContext(ScrollCtx);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const api: ScrollAPI = {
    scrollTo: (target, opts) => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.3, offset: 0, ...opts });
        return;
      }
      // Reduced-motion / no-Lenis fallback
      if (typeof target === "string") {
        document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
      } else if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "smooth" });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    },
    // Lock both Lenis (if ready) and native overflow, so the lock holds
    // regardless of provider/child effect ordering on first mount.
    stop: () => {
      lenisRef.current?.stop();
      document.documentElement.style.overflow = "hidden";
    },
    start: () => {
      lenisRef.current?.start();
      document.documentElement.style.overflow = "";
    },
  };

  return (
    <ScrollCtx.Provider value={api}>
      <MotionConfig reducedMotion="never">{children}</MotionConfig>
    </ScrollCtx.Provider>
  );
}
