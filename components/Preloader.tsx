"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { profile } from "@/lib/data";

export default function Preloader() {
  const [active, setActive] = useState(true);
  const [count, setCount] = useState(0);
  const { stop, start } = useSmoothScroll();

  useEffect(() => {
    stop();
    window.scrollTo(0, 0);

    const startTime = performance.now();
    const total = 1500;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / total, 1);
      // ease-out for the counter
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setActive(false), 350);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!active) {
      start();
      window.scrollTo(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col justify-between bg-ink px-6 py-8 sm:px-10"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex items-center justify-between">
            <span className="eyebrow">Portfolio</span>
            <span className="eyebrow">© {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-end justify-between">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[12vw] leading-[0.85] tracking-tight text-paper sm:text-[8vw]"
            >
              {profile.firstName}
              <br />
              {profile.lastName}
            </motion.h2>

            <span className="font-mono text-paper-dim tabular text-2xl sm:text-4xl">
              {count}
              <span className="text-lime">%</span>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
