import type { Project } from "./data";

export type PosterFonts = { display: string; sans: string; mono: string };

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function drawPoster(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  p: Project,
  fonts: PosterFonts,
) {
  const rnd = mulberry32(p.hue * 7 + p.index.length * 13 + 17);
  const hue = p.hue;
  const accent = `hsl(${hue} 72% 64%)`;
  const accentSoft = `hsla(${hue} 70% 62% / 0.55)`;
  const accentFaint = `hsla(${hue} 60% 55% / 0.18)`;
  const ink = "#e9e9e6";
  const dim = "rgba(233,233,230,0.6)";

  // Surface
  ctx.fillStyle = "#0b0b10";
  ctx.fillRect(0, 0, w, h);
  const g = ctx.createRadialGradient(w * 0.78, h * 0.32, 0, w * 0.78, h * 0.32, w * 0.62);
  g.addColorStop(0, `hsla(${hue} 65% 42% / 0.55)`);
  g.addColorStop(0.6, `hsla(${hue} 65% 30% / 0.12)`);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Fine grid
  ctx.strokeStyle = "rgba(233,233,230,0.06)";
  ctx.lineWidth = 1;
  const step = w / 20;
  ctx.beginPath();
  for (let x = step; x < w; x += step) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
  }
  for (let y = step; y < h; y += step) {
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  ctx.stroke();

  // Art region (right ~58%)
  const ax = w * 0.42;
  const ay = h * 0.14;
  const aw = w * 0.52;
  const ah = h * 0.62;
  ctx.save();
  ctx.beginPath();
  ctx.rect(ax, ay, aw, ah);
  ctx.clip();
  drawArt(ctx, p.art, ax, ay, aw, ah, rnd, accent, accentSoft, accentFaint);
  ctx.restore();

  // Frame around art
  ctx.strokeStyle = "rgba(233,233,230,0.16)";
  ctx.strokeRect(ax + 0.5, ay + 0.5, aw, ah);
  // Corner ticks
  ctx.strokeStyle = "rgba(233,233,230,0.6)";
  const tk = 14;
  [
    [ax, ay],
    [ax + aw, ay],
    [ax, ay + ah],
    [ax + aw, ay + ah],
  ].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.moveTo(x - tk, y);
    ctx.lineTo(x + tk, y);
    ctx.moveTo(x, y - tk);
    ctx.lineTo(x, y + tk);
    ctx.stroke();
  });

  // Text
  const pad = w * 0.055;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = dim;
  ctx.font = `500 ${h * 0.032}px ${fonts.mono}`;
  ctx.fillText(`${p.index} / ${p.year}`, pad, pad + h * 0.03);
  ctx.textAlign = "right";
  ctx.fillText(p.category.toUpperCase(), w - pad, pad + h * 0.03);
  ctx.textAlign = "left";

  // Metric value
  ctx.fillStyle = ink;
  ctx.font = `800 ${h * 0.2}px ${fonts.display}`;
  ctx.fillText(p.metric.value, pad - 4, h * 0.56);
  ctx.fillStyle = accent;
  ctx.font = `500 ${h * 0.034}px ${fonts.mono}`;
  ctx.fillText(p.metric.label.toUpperCase(), pad, h * 0.62);

  // Title
  ctx.fillStyle = ink;
  ctx.font = `600 ${h * 0.07}px ${fonts.sans}`;
  ctx.fillText(p.title, pad - 2, h - pad - h * 0.07);
  ctx.fillStyle = dim;
  ctx.font = `400 ${h * 0.036}px ${fonts.sans}`;
  ctx.fillText(p.subtitle, pad, h - pad);
  const subtitleRight = pad + ctx.measureText(p.subtitle).width + h * 0.05;

  // Stack chips (bottom right), only as many as fit beside the subtitle.
  ctx.font = `500 ${h * 0.028}px ${fonts.mono}`;
  let x = w - pad;
  for (let i = Math.min(3, p.stack.length) - 1; i >= 0; i--) {
    const s = p.stack[i];
    const tw = ctx.measureText(s).width + h * 0.04;
    if (x - tw < subtitleRight) break;
    x -= tw;
    ctx.strokeStyle = "rgba(233,233,230,0.3)";
    ctx.strokeRect(x, h - pad - h * 0.045, tw, h * 0.05);
    ctx.fillStyle = dim;
    ctx.fillText(s, x + h * 0.02, h - pad - h * 0.01);
    x -= h * 0.02;
  }
}

function drawArt(
  ctx: CanvasRenderingContext2D,
  art: Project["art"],
  x: number,
  y: number,
  w: number,
  h: number,
  rnd: () => number,
  accent: string,
  accentSoft: string,
  accentFaint: string,
) {
  ctx.lineWidth = 2;
  switch (art) {
    case "waveform": {
      // loss curves: noisy descending lines
      for (let k = 0; k < 6; k++) {
        ctx.strokeStyle = k === 5 ? accent : accentFaint;
        ctx.lineWidth = k === 5 ? 3 : 1.5;
        ctx.beginPath();
        const amp = 0.08 + rnd() * 0.1;
        for (let i = 0; i <= 120; i++) {
          const t = i / 120;
          const base = h * (0.18 + 0.62 * Math.exp(-t * (2.2 + k * 0.2)));
          const noise = (rnd() - 0.5) * h * amp * (1 - t * 0.6);
          const yy = y + h - base + noise;
          const xx = x + t * w;
          if (i === 0) ctx.moveTo(xx, yy);
          else ctx.lineTo(xx, yy);
        }
        ctx.stroke();
      }
      break;
    }
    case "matrix": {
      const cols = 14;
      const rows = 8;
      const cw = w / cols;
      const rh = h / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const v = rnd();
          ctx.fillStyle =
            v > 0.86 ? accent : v > 0.55 ? accentSoft : v > 0.3 ? accentFaint : "rgba(233,233,230,0.04)";
          ctx.fillRect(x + c * cw + 2, y + r * rh + 2, cw - 4, rh - 4);
        }
      }
      break;
    }
    case "flow": {
      const left = 4;
      const right = 3;
      ctx.strokeStyle = accentSoft;
      for (let i = 0; i < left; i++) {
        for (let j = 0; j < right; j++) {
          if (rnd() < 0.35) continue;
          const y1 = y + h * ((i + 0.5) / left);
          const y2 = y + h * ((j + 0.5) / right);
          ctx.lineWidth = 1 + rnd() * 3;
          ctx.strokeStyle = rnd() > 0.7 ? accent : accentFaint;
          ctx.beginPath();
          ctx.moveTo(x + w * 0.08, y1);
          ctx.bezierCurveTo(x + w * 0.5, y1, x + w * 0.5, y2, x + w * 0.92, y2);
          ctx.stroke();
        }
      }
      ctx.fillStyle = "#e9e9e6";
      for (let i = 0; i < left; i++) {
        ctx.beginPath();
        ctx.arc(x + w * 0.08, y + h * ((i + 0.5) / left), 6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = accent;
      for (let j = 0; j < right; j++) {
        ctx.fillRect(x + w * 0.92 - 8, y + h * ((j + 0.5) / right) - 8, 16, 16);
      }
      break;
    }
    case "lattice": {
      const n = 14;
      const pts = Array.from({ length: n }, () => [x + w * (0.08 + rnd() * 0.84), y + h * (0.1 + rnd() * 0.8)]);
      ctx.strokeStyle = accentFaint;
      ctx.lineWidth = 1.2;
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
          if (d < w * 0.3) {
            ctx.beginPath();
            ctx.moveTo(pts[i][0], pts[i][1]);
            ctx.lineTo(pts[j][0], pts[j][1]);
            ctx.stroke();
          }
        }
      }
      pts.forEach(([px, py], i) => {
        ctx.fillStyle = i % 4 === 0 ? accent : "#e9e9e6";
        ctx.beginPath();
        ctx.arc(px, py, i % 4 === 0 ? 7 : 4, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }
    case "bars": {
      const n = 26;
      const bw = w / n;
      for (let i = 0; i < n; i++) {
        const mid = h * (0.35 + Math.sin(i * 0.5) * 0.12 + (rnd() - 0.5) * 0.1);
        const span = h * (0.12 + rnd() * 0.18);
        const inside = rnd() > 0.08;
        ctx.fillStyle = inside ? accentFaint : "rgba(233,233,230,0.14)";
        ctx.fillRect(x + i * bw + 3, y + h - mid - span / 2, bw - 6, span);
        ctx.fillStyle = inside ? accent : "#e9e9e6";
        const dot = y + h - mid + (rnd() - 0.5) * span * (inside ? 0.8 : 1.6);
        ctx.fillRect(x + i * bw + 3, dot - 1.5, bw - 6, 3);
      }
      break;
    }
    case "contour": {
      const cx = x + w * 0.5;
      const cy = y + h * 0.5;
      for (let r = 1; r <= 9; r++) {
        ctx.strokeStyle = r % 3 === 0 ? accentSoft : accentFaint;
        ctx.lineWidth = r % 3 === 0 ? 2 : 1.2;
        ctx.beginPath();
        const base = r * Math.min(w, h) * 0.055;
        for (let i = 0; i <= 72; i++) {
          const a = (i / 72) * Math.PI * 2;
          const wob = 1 + 0.22 * Math.sin(a * 3 + r * 0.7) + 0.12 * Math.cos(a * 5 - r);
          const rr = base * wob;
          const px = cx + Math.cos(a) * rr * 1.35;
          const py = cy + Math.sin(a) * rr * 0.8;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
      break;
    }
    case "scatter": {
      for (let i = 0; i < 160; i++) {
        const px = x + w * rnd();
        const py = y + h * rnd();
        ctx.fillStyle = rnd() > 0.85 ? accent : "rgba(233,233,230,0.35)";
        ctx.fillRect(px, py, 3, 3);
      }
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        const bx = x + w * (0.1 + rnd() * 0.6);
        const by = y + h * (0.1 + rnd() * 0.5);
        const bw = w * (0.12 + rnd() * 0.16);
        const bh = h * (0.18 + rnd() * 0.25);
        ctx.strokeRect(bx, by, bw, bh);
        ctx.fillStyle = accent;
        ctx.fillRect(bx, by - 14, 46, 12);
      }
      break;
    }
    case "rings": {
      const cx = x + w * 0.5;
      const cy = y + h * 0.5;
      const R = Math.min(w, h) * 0.46;
      for (let r = 0; r < 8; r++) {
        const rr = R * (0.2 + r * 0.11);
        const segs = 4 + r * 2;
        for (let s = 0; s < segs; s++) {
          if (rnd() < 0.3) continue;
          ctx.strokeStyle = r % 2 === 0 ? accent : accentSoft;
          ctx.lineWidth = 6;
          ctx.beginPath();
          const a0 = (s / segs) * Math.PI * 2;
          ctx.arc(cx, cy, rr, a0, a0 + ((Math.PI * 2) / segs) * 0.75);
          ctx.stroke();
        }
      }
      break;
    }
  }
}
