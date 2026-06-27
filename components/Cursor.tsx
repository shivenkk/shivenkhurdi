"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type Variant = "default" | "hover" | "view";

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<Variant>("default");
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 380, damping: 32, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 380, damping: 32, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;

    setEnabled(true);
    document.documentElement.classList.add("cursor-ready");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);

      const target = e.target as HTMLElement | null;
      const el = target?.closest?.("[data-cursor], a, button");
      if (!el) {
        setVariant("default");
        return;
      }
      const flag = el.getAttribute("data-cursor");
      if (flag === "view") setVariant("view");
      else if (flag === "hidden") setVariant("default");
      else setVariant("hover");
    };

    const hide = () => setVisible(false);

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
      document.documentElement.classList.remove("cursor-ready");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!enabled) return null;

  const ringSize = variant === "view" ? 92 : variant === "hover" ? 64 : 38;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.25s ease" }}
    >
      {/* Lagging ring */}
      <motion.div className="absolute top-0 left-0" style={{ x: ringX, y: ringY }}>
        <motion.div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border"
          animate={{
            width: ringSize,
            height: ringSize,
            backgroundColor:
              variant === "view"
                ? "rgba(198,255,58,1)"
                : variant === "hover"
                  ? "rgba(198,255,58,0.10)"
                  : "rgba(198,255,58,0)",
            borderColor:
              variant === "default"
                ? "rgba(237,237,234,0.45)"
                : "rgba(198,255,58,1)",
          }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
        >
          {variant === "view" && (
            <span className="font-mono text-[11px] font-bold tracking-widest text-[#08080a]">
              VIEW
            </span>
          )}
        </motion.div>
      </motion.div>

      {/* Precise dot */}
      <motion.div className="absolute top-0 left-0" style={{ x, y }}>
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-lime"
          animate={{
            width: variant === "default" ? 6 : 0,
            height: variant === "default" ? 6 : 0,
            opacity: variant === "default" ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.div>
    </div>
  );
}
