"use client";

import { useState } from "react";
import { store } from "@/lib/store";

export default function MaterialPanel({ className = "" }: { className?: string }) {
  const [roughness, setRoughness] = useState(store.material.roughness);
  const [noise, setNoise] = useState(store.material.noiseScale);
  const [color, setColor] = useState(store.material.color);

  const rgb = hexToRgb(color);

  return (
    <div className={`hud w-[300px] select-none ${className}`}>
      <div className="mb-2 flex items-center justify-between pl-[92px]">
        <span className="text-fg-dim">Prism Material</span>
        <span className="text-fg-faint">||</span>
      </div>
      <Row label="roughness" value={roughness.toFixed(2)}>
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={roughness}
          onChange={(v) => {
            setRoughness(v);
            store.material.roughness = v;
          }}
        />
      </Row>
      <Row label="noiseScale" value={noise.toFixed(1)}>
        <Slider
          min={1}
          max={20}
          step={0.1}
          value={noise}
          onChange={(v) => {
            setNoise(v);
            store.material.noiseScale = v;
          }}
        />
      </Row>
      <Row label="color" value={`{r: ${rgb.r}, g: ${rgb.g}, b: ${rgb.b}}`}>
        <label className="relative block size-4 cursor-pointer overflow-hidden rounded-[2px] border border-rule">
          <span className="absolute inset-0" style={{ background: color }} />
          <input
            type="color"
            aria-label="Prism color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              store.material.color = e.target.value;
            }}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          />
        </label>
      </Row>
    </div>
  );
}

function Row({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid h-6 grid-cols-[92px_1fr_auto] items-center gap-3 border-t border-rule/60">
      <span className="truncate text-fg-dim">{label}</span>
      <div className="flex items-center">{children}</div>
      <span className="min-w-[36px] whitespace-nowrap text-right tabular-nums text-fg-faint">{value}</span>
    </div>
  );
}

function Slider({
  min,
  max,
  step,
  value,
  onChange,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="h-px w-full cursor-ew-resize appearance-none bg-fg-faint/60 outline-none [&::-webkit-slider-thumb]:size-2 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-fg [&::-moz-range-thumb]:size-2 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-fg"
    />
  );
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
