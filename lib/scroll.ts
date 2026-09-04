// Programmatic navigation inside the home scroll story.
import { experience, projects } from "./data";
import { getLenis } from "@/components/providers/SmoothScroll";

function go(y: number) {
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(y, { duration: 1.3 });
  else window.scrollTo({ top: y, behavior: "smooth" });
}

function section(id: string) {
  const el = document.getElementById(id);
  if (!el) return null;
  const top = el.getBoundingClientRect().top + window.scrollY;
  return { top, pinned: el.offsetHeight - window.innerHeight };
}

export function scrollToSection(id: string) {
  const s = section(id);
  if (s) go(s.top);
}

function invSmooth(v: number) {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    const f = mid * mid * (3 - 2 * mid);
    if (f < v) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export function scrollToWork(i: number) {
  const s = section("work");
  if (!s) return;
  const n = projects.length;
  const idx = Math.max(0, Math.min(n - 1, i));
  const target = (idx + 1.5) / (n - 1 + 1.5);
  const pw = 0.12 + invSmooth(target) * 0.88;
  go(s.top + pw * s.pinned);
}

export function scrollToExperience(i: number) {
  const s = section("experience");
  if (!s) return;
  const m = experience.length;
  const idx = Math.max(0, Math.min(m - 1, i));
  const pe = 0.16 + ((idx + 0.5) / m) * 0.84;
  go(s.top + pe * s.pinned);
}
