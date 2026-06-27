"use client";

import { useEffect, useRef, useState } from "react";
import { useAnimationFrame, useMotionValue } from "framer-motion";
import SpiralCard, { type CardData } from "./SpiralCard";

const AUTO_SPEED = 0.045; // rise-cycles per second when idle
const WHEEL_GAIN = 0.00016; // how much a wheel notch adds to the boost
const DECAY = 0.92; // boost decay per frame

export default function SpiralCanvas({
  cards,
  onOpen,
  onHover,
  onMove,
}: {
  cards: CardData[];
  onOpen: (id: string) => void;
  onHover: (data: CardData | null) => void;
  onMove: (e: React.MouseEvent) => void;
}) {
  const progress = useMotionValue(0);
  const boost = useRef(0);

  // Drifting particle field (generated client-side to avoid hydration mismatch)
  const [particles, setParticles] = useState<
    { top: string; left: string; size: number; delay: number; duration: number }[]
  >([]);
  useEffect(() => {
    setParticles(
      Array.from({ length: 28 }, () => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: 1 + Math.random() * 2.5,
        delay: -Math.random() * 8,
        duration: 6 + Math.random() * 8,
      })),
    );
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      boost.current += e.deltaY * WHEEL_GAIN;
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  useAnimationFrame((_t, delta) => {
    const dt = Math.min(delta, 60) / 1000;
    progress.set(progress.get() + AUTO_SPEED * dt + boost.current);
    boost.current *= DECAY;
  });

  return (
    <div
      onMouseMove={onMove}
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{ perspective: "1600px" }}
    >
      <div className="pointer-events-none absolute inset-0">
        {particles.map((p, i) => (
          <span
            key={i}
            className="particle"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(rgba(237,237,234,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(237,237,234,0.05) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
          maskImage:
            "radial-gradient(circle at center, black 35%, transparent 82%)",
        }}
      />
      <div
        className="glow left-1/2 top-1/2 h-[55vh] w-[55vh] -translate-x-1/2 -translate-y-1/2 opacity-40"
        style={{ background: "rgba(198,255,58,0.10)" }}
      />

      <div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {cards.map((c, i) => (
          <SpiralCard
            key={`${c.id}-${i}`}
            i={i}
            total={cards.length}
            progress={progress}
            data={c}
            onOpen={onOpen}
            onHover={onHover}
          />
        ))}
      </div>
    </div>
  );
}
