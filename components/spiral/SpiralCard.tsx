"use client";

import {
  motion,
  useMotionTemplate,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export type CardData = {
  id: string;
  n: string;
  title: string;
  teaser: string;
};

const RADIUS = 400; // wheel radius
const TWO_PI = Math.PI * 2;
const frac = (v: number) => v - Math.floor(v);

export default function SpiralCard({
  i,
  total,
  progress,
  data,
  onOpen,
  onHover,
}: {
  i: number;
  total: number;
  progress: MotionValue<number>;
  data: CardData;
  onOpen: (id: string) => void;
  onHover: (data: CardData | null) => void;
}) {
  const angle = (p: number) => frac(i / total - p) * TWO_PI;
  const x = useTransform(progress, (p) => Math.sin(angle(p)) * RADIUS);
  const z = useTransform(progress, (p) => Math.cos(angle(p)) * RADIUS);
  const ry = useTransform(progress, (p) => angle(p)); // faces outward
  const scale = useTransform(
    progress,
    (p) => 0.72 + 0.28 * ((Math.cos(angle(p)) + 1) / 2),
  );
  const zIndex = useTransform(progress, (p) =>
    Math.round(Math.cos(angle(p)) * 100),
  );
  const focusGlow = useTransform(progress, (p) => {
    const front = (Math.cos(angle(p)) + 1) / 2;
    return front * front; // 1 at front, ~0 at sides
  });
  const transform = useMotionTemplate`translate(-50%, -50%) translate3d(${x}px, 0px, ${z}px) rotateY(${ry}rad) scale(${scale})`;

  return (
    <motion.button
      style={{ transform, zIndex, transformStyle: "preserve-3d" }}
      onMouseEnter={() => onHover(data)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onOpen(data.id)}
      className="absolute left-1/2 top-1/2 h-[230px] w-[340px]"
    >
      {/* FRONT */}
      <div
        className="group absolute inset-0 overflow-hidden rounded-3xl border border-line transition-colors duration-300 hover:border-lime"
        style={{
          backfaceVisibility: "hidden",
          background: "linear-gradient(155deg, #1c1c22 0%, #0f0f12 100%)",
          boxShadow:
            "0 30px 60px -15px rgba(0,0,0,0.7), 0 0 40px -12px rgba(198,255,58,0.3)",
        }}
      >
        {/* very subtle holographic sheen */}
        <div className="sheen pointer-events-none absolute inset-0 opacity-25" />
        {/* focus glow: lit-from-below, brightens at front */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-12"
          style={{
            opacity: focusGlow,
            background:
              "linear-gradient(to top, rgba(198,255,58,0.4), transparent)",
          }}
        />
        {/* HUD corner ticks */}
        <span className="pointer-events-none absolute left-4 top-4 h-4 w-4 border-l border-t border-lime/40" />
        <span className="pointer-events-none absolute bottom-4 right-4 h-4 w-4 border-b border-r border-lime/40" />

        {/* content */}
        <div className="relative flex h-full flex-col p-7">
          <div className="flex items-start justify-between">
            <span className="font-mono text-sm tracking-[0.2em] text-lime">
              {data.n}
            </span>
            <span className="grid h-11 w-11 place-items-center rounded-full border border-line text-paper transition-all duration-300 group-hover:border-lime group-hover:bg-lime group-hover:text-[#08080a]">
              <ArrowUpRight size={18} />
            </span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-3 h-px w-10 bg-lime" />
            <h3 className="font-display text-[2.6rem] font-bold leading-none tracking-tight text-paper">
              {data.title}
            </h3>
            <p className="mt-3 max-w-[90%] text-sm leading-relaxed text-paper-dim">
              {data.teaser}
            </p>
          </div>
        </div>
      </div>

      {/* Neon tracer racing around the border */}
      <svg
        aria-hidden
        viewBox="0 0 340 230"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ backfaceVisibility: "hidden", overflow: "visible" }}
      >
        <rect
          x="1.5"
          y="1.5"
          width="337"
          height="227"
          rx="22.5"
          fill="none"
          stroke="#c6ff3a"
          strokeWidth="2"
          className="neon-trace"
          style={{ animationDelay: `${-(i % total) * 0.45}s` }}
        />
      </svg>

      {/* BACK */}
      <div
        className="absolute inset-0 grid place-items-center overflow-hidden rounded-3xl border border-line"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: "linear-gradient(155deg, #15151a 0%, #0c0c0f 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(237,237,234,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(237,237,234,0.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative text-center">
          <div className="font-display text-8xl font-extrabold leading-none text-lime/25">
            {data.n}
          </div>
          <div className="mt-3 font-mono text-xs uppercase tracking-[0.3em] text-paper-faint">
            {data.title}
          </div>
        </div>
      </div>
    </motion.button>
  );
}
