
import { experience, projects } from "@/lib/data";
import { clamp01, lerp, smoothstep, store } from "@/lib/store";

export type PrismState = {
  x: number;
  y: number;
  z: number;
  scale: number;
  rod: number; // 0 = prism, 1 = thin edge-on rod
  spin: number; // spin speed multiplier
};

export const choreo = {
  time: 0,
  intro: 0,
  introRaw: 0,
  wordmark: 0,
  wall: { mode: 0, intensity: 0, light: 0, black: 0 },
  cam: { yaw: 0, pitch: 0, z: 9 },
  prism: { x: 0, y: 0, z: 1.6, scale: 1, rod: 0, spin: 1 } as PrismState,
  fill: 0, // prism expanded to fill the frame (chromatic wash)
  workWord: { opacity: 0, angle: 0.4 },
  work: { c: -1.5, visible: 0, index: 0 },
  expWord: { opacity: 0 },
  exp: { index: 0, t: 0, visible: 0 },
  edu: { visible: 0 },
  outro: { glow: 0, mark: 0 },
};

const PRISM: Record<string, PrismState> = {
  hero: { x: 0, y: 0.02, z: 1.5, scale: 0.62, rod: 0, spin: 1 },
  work: { x: 2.9, y: 1.55, z: 0.2, scale: 0.5, rod: 0, spin: 1.6 },
  vision: { x: -1.9, y: 0.25, z: 1.4, scale: 1.25, rod: 1, spin: 0.35 },
  experience: { x: 3.3, y: 1.7, z: -0.2, scale: 0.5, rod: 0, spin: 1.3 },
  education: { x: -3.4, y: 0.9, z: 0.6, scale: 0.9, rod: 1, spin: 0.4 },
  outro: { x: 0, y: 0, z: 1.6, scale: 0, rod: 0, spin: 1 },
};

function mixPrism(a: PrismState, b: PrismState, t: number, out: PrismState) {
  out.x = lerp(a.x, b.x, t);
  out.y = lerp(a.y, b.y, t);
  out.z = lerp(a.z, b.z, t);
  out.scale = lerp(a.scale, b.scale, t);
  out.rod = lerp(a.rod, b.rod, t);
  out.spin = lerp(a.spin, b.spin, t);
  return out;
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const tmp: PrismState = { ...PRISM.hero };

export function updateChoreo(now: number) {
  const s = store.sections;
  const e = store.exits;
  const c = choreo;
  c.time = store.reducedMotion ? 1 : now / 1000;

  // Boot
  const introRaw = store.loaded ? clamp01((now - store.introStart) / 2600) : 0;
  c.introRaw = introRaw;
  c.intro = 1 - Math.pow(1 - introRaw, 4);

  const eh = e.hero;
  const pw = s.work;
  const ew = e.work;
  const pv = s.vision;
  const ev = e.vision;
  const pe = s.experience;
  const ee = e.experience;
  const eed = e.education;
  const po = s.outro;

  // Hero wordmark
  c.wordmark = c.intro * (1 - smoothstep(0.04, 0.5, eh));

  // "WORK" on the wall
  c.workWord.opacity = smoothstep(0.3, 0.85, eh) * (1 - smoothstep(0.1, 0.24, pw));
  c.workWord.angle = lerp(0.46, -0.75, smoothstep(0, 0.32, pw));

  const n = projects.length;
  const raw = lerp(-1.5, n - 1, smoothstep(0.12, 1, pw)) + smoothstep(0, 1, ew) * 1.6;
  let cc = raw;
  if (cc > 0 && cc < n - 1) {
    const i = Math.floor(cc);
    cc = i + easeInOut(cc - i);
  }
  c.work.c = cc;
  c.work.index = Math.round(Math.min(n - 1, Math.max(0, raw)));
  c.work.visible = smoothstep(0.06, 0.16, pw) * (1 - smoothstep(0.15, 0.7, ew));

  // Light theme windows: vision, and again (softer) for education.
  const lightVision = smoothstep(0.5, 1, ew) * (1 - smoothstep(0.15, 0.7, ev));
  const lightEdu = smoothstep(0.55, 1, ee) * 0.92 * (1 - smoothstep(0.25, 0.75, eed));
  c.wall.light = Math.max(lightVision, lightEdu);

  // The handoff to experience is a single crossfade: no full-frame fill.
  c.fill = 0;

  // "EXPERIENCE" word + role screens
  c.expWord.opacity = smoothstep(0.3, 0.8, ev) * (1 - smoothstep(0.08, 0.2, pe));
  const m = experience.length;
  const et = clamp01((pe - 0.16) / 0.84) * m;
  c.exp.index = Math.min(m - 1, Math.floor(et));
  c.exp.t = et - Math.floor(et);
  c.exp.visible = smoothstep(0.1, 0.18, pe) * (1 - smoothstep(0.1, 0.5, ee));

  c.edu.visible = smoothstep(0.6, 1, ee) * (1 - smoothstep(0.2, 0.6, eed));

  // Outro: wall to black, glow up, mark builds.
  c.wall.black = smoothstep(0.4, 1, eed);
  c.outro.glow = smoothstep(0.6, 1, eed) * (0.7 + 0.3 * smoothstep(0, 0.5, po));
  c.outro.mark = smoothstep(0.7, 1, eed);

  const cycle = (c.time / 9) % 3;
  const ci = Math.floor(cycle);
  const heroMode = ci + smoothstep(0.82, 1, cycle - ci);
  let mode = heroMode;
  mode = lerp(mode, heroMode > 2 ? 4 : 1, smoothstep(0.2, 0.9, eh)); // work: marble (4 ≡ 1)
  mode = lerp(mode, 2, smoothstep(0.2, 0.9, ev)); // experience: teal
  c.wall.mode = mode;
  let intensity = c.intro;
  intensity = lerp(intensity, 0.55, smoothstep(0.2, 0.9, ev));
  intensity = lerp(intensity, 0.35, smoothstep(0.3, 1, ee));
  c.wall.intensity = intensity;

  // Camera: subtle yaw through work so the wall reads as a curved room.
  let yaw = -0.16 * smoothstep(0.1, 1, eh);
  yaw = lerp(yaw, -0.05 + 0.02 * Math.sin(c.time * 0.3), smoothstep(0, 0.4, pw));
  yaw = lerp(yaw, 0.12, smoothstep(0.3, 1, ew));
  yaw = lerp(yaw, 0.02, smoothstep(0.2, 1, ev));
  yaw = lerp(yaw, 0.05, smoothstep(0.2, 1, ee));
  yaw = lerp(yaw, 0, smoothstep(0.2, 1, eed));
  c.cam.yaw = yaw + store.pointer.x * 0.035;
  c.cam.pitch = 0.02 * smoothstep(0, 1, eh) + store.pointer.y * 0.025;
  c.cam.z = 9 - 0.6 * smoothstep(0.4, 1, eh) + 0.4 * smoothstep(0.3, 1, ew);

  PRISM.hero.x = store.heroNabla.x;
  PRISM.hero.y = store.heroNabla.y + 0.02;
  PRISM.hero.scale = Math.min(0.72, (store.heroNabla.h / 2.8) * 1.22);
  let p = mixPrism(PRISM.hero, PRISM.work, smoothstep(0.1, 0.9, eh), tmp);
  p = mixPrism(p, PRISM.vision, smoothstep(0.15, 0.9, ew), tmp);
  // One continuous move to the experience pose across the exit.
  const toExp = smoothstep(0.1, 0.95, ev);
  p = mixPrism(p, PRISM.experience, toExp, tmp);
  p = mixPrism(p, PRISM.education, smoothstep(0.2, 0.9, ee), tmp);
  p = mixPrism(p, PRISM.outro, smoothstep(0.1, 0.7, eed), tmp);
  // Boot: the glass starts huge and lands.
  const bootScale = lerp(9, 1, c.intro);
  c.prism.x = p.x;
  c.prism.y = p.y;
  c.prism.z = p.z + (1 - c.intro) * 2.5;
  c.prism.scale = p.scale * bootScale;
  const rodKill = smoothstep(0.7, 1, pv) * (1 - smoothstep(0.3, 0.8, ee));
  c.prism.rod = p.rod * (1 - rodKill);
  c.prism.spin = p.spin;
}
