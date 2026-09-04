"use client";

import { useEffect, useRef } from "react";
import type { Project } from "@/lib/data";
import { fontFamilies } from "@/lib/fonts";
import { drawPoster } from "@/lib/poster";

export default function PosterCanvas({
  project,
  className = "",
}: {
  project: Project;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let cancelled = false;
    const c = ref.current!;
    const draw = () => {
      if (cancelled) return;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      drawPoster(ctx, c.width, c.height, project, fontFamilies);
    };
    Promise.all([
      document.fonts.load(`800 100px ${fontFamilies.display}`),
      document.fonts.load(`500 16px ${fontFamilies.mono}`),
      document.fonts.load(`600 16px ${fontFamilies.sans}`),
    ])
      .catch(() => undefined)
      .then(draw);
    return () => {
      cancelled = true;
    };
  }, [project]);
  return (
    <canvas
      ref={ref}
      width={1408}
      height={792}
      className={`block h-auto w-full ${className}`}
      aria-label={`${project.title} poster`}
      role="img"
    />
  );
}
