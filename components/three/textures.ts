import * as THREE from "three";
import type { Experience, Project } from "@/lib/data";
import { fontFamilies } from "@/lib/fonts";
import { drawPoster } from "@/lib/poster";

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

function toTexture(c: HTMLCanvasElement, anisotropy = 8) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = anisotropy;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.needsUpdate = true;
  return t;
}

export function drawNabla(ctx: CanvasRenderingContext2D, x: number, y: number, h: number) {
  const k = h / 86;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(100, 0);
  ctx.lineTo(50, 86);
  ctx.closePath();
  ctx.moveTo(25.5, 14);
  ctx.lineTo(50, 56.4);
  ctx.lineTo(74.5, 14);
  ctx.closePath();
  ctx.fill("evenodd");
  ctx.restore();
}

export const WORDMARK_ASPECT = 4.2;

export function wordmarkTexture(color = "#ffffff") {
  const w = 4096;
  const h = Math.round(w / WORDMARK_ASPECT);
  const c = canvas(w, h);
  const ctx = c.getContext("2d")!;
  const F = h * 0.78;
  ctx.font = `800 ${F}px ${fontFamilies.display}`;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = color;
  const capH = F * 0.72;
  const nablaH = capH;
  const nablaW = (nablaH * 100) / 86;
  const gap = F * 0.04;
  const tracking = -F * 0.02;
  const wSHI = ctx.measureText("SHI").width + tracking * 2;
  const wEN = ctx.measureText("EN").width + tracking;
  const total = wSHI + gap + nablaW + gap + wEN;
  let x = (w - total) / 2;
  const baseline = h / 2 + capH / 2;
  ctx.letterSpacing = `${tracking}px`;
  ctx.fillText("SHI", x, baseline);
  x += wSHI + gap;
  drawNabla(ctx, x, baseline - capH, nablaH);
  const nablaCenter = (x + nablaW / 2) / w;
  x += nablaW + gap;
  ctx.fillText("EN", x, baseline);
  return { texture: toTexture(c, 16), nablaCenter, nablaHeight: nablaH / h };
}

export function wordTexture(text: string, opts?: { aspect?: number; color?: string; weight?: number }) {
  const aspect = opts?.aspect ?? Math.max(1.4, text.length * 0.72);
  const w = 3072;
  const h = Math.round(w / aspect);
  const c = canvas(w, h);
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = opts?.color ?? "#ffffff";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  let F = h * 0.8;
  ctx.font = `${opts?.weight ?? 800} ${F}px ${fontFamilies.display}`;
  const tw = ctx.measureText(text).width;
  if (tw > w * 0.96) {
    F *= (w * 0.96) / tw;
    ctx.font = `${opts?.weight ?? 800} ${F}px ${fontFamilies.display}`;
  }
  ctx.fillText(text, w / 2, h / 2 + F * 0.04);
  return { texture: toTexture(c, 16), aspect };
}

export const POSTER_W = 1408;
export const POSTER_H = 792;

export function posterTexture(p: Project) {
  const c = canvas(POSTER_W, POSTER_H);
  const ctx = c.getContext("2d")!;
  drawPoster(ctx, POSTER_W, POSTER_H, p, fontFamilies);
  return toTexture(c);
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function experienceTexture(x: Experience) {
  const w = POSTER_W;
  const h = POSTER_H;
  const c = canvas(w, h);
  const ctx = c.getContext("2d")!;
  const hue = x.hue;
  ctx.fillStyle = "#0b0b10";
  ctx.fillRect(0, 0, w, h);
  const g = ctx.createRadialGradient(w * 0.2, h * 0.9, 0, w * 0.2, h * 0.9, w * 0.8);
  g.addColorStop(0, `hsla(${hue} 60% 40% / 0.5)`);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(233,233,230,0.06)";
  const step = w / 20;
  ctx.beginPath();
  for (let xx = step; xx < w; xx += step) {
    ctx.moveTo(xx, 0);
    ctx.lineTo(xx, h);
  }
  for (let yy = step; yy < h; yy += step) {
    ctx.moveTo(0, yy);
    ctx.lineTo(w, yy);
  }
  ctx.stroke();

  const pad = w * 0.06;
  const img = await loadImage(x.logo);
  if (img) {
    // white plate for the logo
    const plateW = w * 0.34;
    const plateH = h * 0.42;
    const px = w - pad - plateW;
    const py = pad;
    const dark = x.plate === "dark";
    ctx.fillStyle = dark ? "#121217" : "#e9e9e6";
    ctx.fillRect(px, py, plateW, plateH);
    if (dark) {
      ctx.strokeStyle = "rgba(233,233,230,0.18)";
      ctx.strokeRect(px + 0.5, py + 0.5, plateW - 1, plateH - 1);
    }
    const scale = Math.min((plateW * (dark ? 0.86 : 0.7)) / img.width, (plateH * (dark ? 0.8 : 0.6)) / img.height);
    const iw = img.width * scale;
    const ih = img.height * scale;
    ctx.drawImage(img, px + (plateW - iw) / 2, py + (plateH - ih) / 2, iw, ih);
  }

  ctx.fillStyle = "rgba(233,233,230,0.6)";
  ctx.font = `500 ${h * 0.032}px ${fontFamilies.mono}`;
  ctx.fillText(x.period.toUpperCase(), pad, pad + h * 0.03);
  ctx.fillText(x.location.toUpperCase(), pad, pad + h * 0.075);
  if (x.current) {
    ctx.fillStyle = `hsl(${hue} 70% 65%)`;
    ctx.fillText("● CURRENT", pad, pad + h * 0.12);
  }

  ctx.fillStyle = "#e9e9e6";
  // Fit the display word to the card, whatever its length.
  let F = h * 0.15;
  ctx.font = `800 ${F}px ${fontFamilies.display}`;
  const maxW = w - pad * 2;
  const tw = ctx.measureText(x.short.toUpperCase()).width;
  if (tw > maxW) {
    F *= maxW / tw;
    ctx.font = `800 ${F}px ${fontFamilies.display}`;
  }
  ctx.fillText(x.short.toUpperCase(), pad - 4, h * 0.66);
  ctx.fillStyle = `hsl(${hue} 70% 65%)`;
  ctx.font = `500 ${h * 0.034}px ${fontFamilies.mono}`;
  ctx.fillText(x.role.toUpperCase(), pad, h * 0.73);
  // Stat chips
  ctx.font = `500 ${h * 0.032}px ${fontFamilies.mono}`;
  let cx = pad;
  const cy = h - pad - h * 0.06;
  for (const st of x.stats) {
    const tw = ctx.measureText(st).width + h * 0.05;
    ctx.strokeStyle = "rgba(233,233,230,0.35)";
    ctx.strokeRect(cx, cy, tw, h * 0.06);
    ctx.fillStyle = "rgba(233,233,230,0.75)";
    ctx.fillText(st, cx + h * 0.025, cy + h * 0.042);
    cx += tw + h * 0.02;
  }
  return toTexture(c);
}

export function glowTexture() {
  const w = 1024;
  const h = 512;
  const c = canvas(w, h);
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
  g.addColorStop(0, "rgba(36, 40, 78, 1)");
  g.addColorStop(0.45, "rgba(22, 22, 44, 0.85)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const t = toTexture(c, 1);
  return t;
}
