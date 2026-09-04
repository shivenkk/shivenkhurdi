"use client";

import { useEffect, useRef } from "react";
import { store } from "@/lib/store";

const fmt = (v: number) => {
  const s = Math.abs(v).toFixed(2).replace(/^0/, "");
  return (v < 0 ? "-" : " ") + s;
};

function rot(q: number[], v: number[]) {
  const [qx, qy, qz, qw] = q;
  const [x, y, z] = v;
  // t = 2 * cross(q.xyz, v)
  const tx = 2 * (qy * z - qz * y);
  const ty = 2 * (qz * x - qx * z);
  const tz = 2 * (qx * y - qy * x);
  return [
    x + qw * tx + (qy * tz - qz * ty),
    y + qw * ty + (qz * tx - qx * tz),
    z + qw * tz + (qx * ty - qy * tx),
  ];
}

export default function QuaternionPanel({ className = "" }: { className?: string }) {
  const nums = useRef<HTMLSpanElement>(null);
  const dots = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const R = 26;
    const axes = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
    const loop = () => {
      const q = store.quaternion;
      if (nums.current) {
        nums.current.textContent = q.map(fmt).join(" ");
      }
      axes.forEach((a, i) => {
        const [x, y, z] = rot(q, a);
        const c = dots.current[i];
        if (!c) return;
        c.setAttribute("cx", (40 + x * R).toFixed(2));
        c.setAttribute("cy", (40 - y * R).toFixed(2));
        c.setAttribute("r", (2.2 + z * 1.2).toFixed(2));
        c.style.opacity = (0.55 + z * 0.45).toFixed(2);
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={`hud flex flex-col items-end gap-2 select-none ${className}`}>
      <div className="flex items-center gap-3">
        <span className="text-fg-dim">Prism Quaternion</span>
        <span className="text-fg-faint">||</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-fg-dim" />
        <span ref={nums} className="tabular-nums text-fg-faint">
          {" .00  .00  .00  1.00"}
        </span>
      </div>
      <svg viewBox="0 0 80 80" className="mt-3 size-[84px] overflow-visible">
        <circle cx="40" cy="40" r="28" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.6" />
        <ellipse cx="40" cy="40" rx="28" ry="9" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.6" />
        <ellipse cx="40" cy="40" rx="9" ry="28" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.6" />
        <line x1="40" y1="10" x2="40" y2="70" stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.6" />
        <line x1="10" y1="40" x2="70" y2="40" stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.6" />
        <circle cx="40" cy="40" r="1.4" fill="currentColor" />
        {["#e06a6a", "#8fd18a", "#7b8cff"].map((c, i) => (
          <circle
            key={c}
            ref={(el) => {
              dots.current[i] = el;
            }}
            cx="40"
            cy="40"
            r="2.2"
            fill={c}
          />
        ))}
      </svg>
      <button
        type="button"
        onClick={() => {
          store.resetTick += 1;
        }}
        className="mt-2 text-fg-dim transition-colors hover:text-fg"
      >
        Reset Quaternion
      </button>
    </div>
  );
}
