
import type { SectionId } from "./data";

type Listener = () => void;

export type SceneStore = {
  // Boot
  loaded: boolean; // loader finished, intro may start
  introStart: number; // performance.now() when the intro began
  sections: Record<SectionId, number>;
  // Exit progress, 0..1 as a section's last viewport-height scrolls away
  exits: Record<SectionId, number>;
  active: SectionId;
  activeWork: number;
  activeExperience: number;
  // Pointer, normalized -1..1
  pointer: { x: number; y: number };
  material: { roughness: number; noiseScale: number; color: string };
  // Prism orientation readout for the HUD
  quaternion: [number, number, number, number];
  resetTick: number;
  // Light/dark section theme
  light: number; // 0..1
  reducedMotion: boolean;
  // 1 on wide viewports, shrinking toward 0.45 on portrait phones
  viewScale: number;
  heroNabla: { x: number; y: number; h: number };
};

export const store: SceneStore = {
  loaded: false,
  introStart: 0,
  sections: { hero: 0, work: 0, vision: 0, experience: 0, education: 0, outro: 0 },
  exits: { hero: 0, work: 0, vision: 0, experience: 0, education: 0, outro: 0 },
  active: "hero",
  activeWork: 0,
  activeExperience: 0,
  pointer: { x: 0, y: 0 },
  material: { roughness: 0.1, noiseScale: 9, color: "#ffffff" },
  quaternion: [0, 0, 0, 1],
  resetTick: 0,
  light: 0,
  reducedMotion: false,
  viewScale: 1,
  heroNabla: { x: 0.4, y: 0.55, h: 1.5 },
};

const listeners = new Set<Listener>();

export function subscribe(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function emit() {
  listeners.forEach((fn) => fn());
}

export function setActive(id: SectionId) {
  if (store.active !== id) {
    store.active = id;
    emit();
  }
}

export function setActiveWork(i: number) {
  if (store.activeWork !== i) {
    store.activeWork = i;
    emit();
  }
}

export function setActiveExperience(i: number) {
  if (store.activeExperience !== i) {
    store.activeExperience = i;
    emit();
  }
}

export function markLoaded() {
  if (!store.loaded) {
    store.loaded = true;
    store.introStart = performance.now();
    emit();
  }
}

// Small math helpers used by both the scene and the DOM choreography.
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const damp = (a: number, b: number, lambda: number, dt: number) =>
  lerp(a, b, 1 - Math.exp(-lambda * dt));

export function onFrame(fn: () => void) {
  let raf = 0;
  const loop = () => {
    fn();
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(raf);
}
