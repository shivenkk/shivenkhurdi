"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { store } from "@/lib/store";
import { choreo } from "./choreo";

export const WALL_RADIUS = 14;
export const WALL_HEIGHT = 19;

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uMode;
  uniform float uLight;
  uniform float uBlack;
  uniform float uIntensity;
  uniform float uNoiseScale;
  uniform vec3 uAccent;
  uniform vec2 uTiles;
  varying vec2 vUv;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * vnoise(p);
      p = p * 2.03 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }
  // Signed distance to an inverted equilateral triangle of "radius" r.
  float sdTri(vec2 p, float r) {
    const float k = sqrt(3.0);
    p.y = -p.y;
    p.x = abs(p.x) - r;
    p.y = p.y + r / k;
    if (p.x + k * p.y > 0.0) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
    p.x -= clamp(p.x, -2.0 * r, 0.0);
    return -length(p) * sign(p.y);
  }
  vec3 lin(vec3 c) { return pow(c, vec3(2.2)); }

  void main() {
    vec2 uv = vUv;
    vec2 tuv = uv * uTiles;
    vec2 id = floor(tuv);
    vec2 f = fract(tuv);

    // Major tile seams and a finer sub-grid.
    float aa = fwidth(tuv.x) * 1.2 + 0.002;
    float lw = 0.012;
    float edge = min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y));
    float major = 1.0 - smoothstep(lw, lw + aa, edge);
    vec2 mf = fract(tuv * 6.0);
    float medge = min(min(mf.x, 1.0 - mf.x), min(mf.y, 1.0 - mf.y));
    float maa = aa * 6.0;
    float minor = 1.0 - smoothstep(0.03, 0.03 + maa, medge);

    // Which tiles are lit: slow drifting clusters plus a per-tile flicker.
    float t = uTime * 0.16;
    float n1 = vnoise(id * 0.31 + vec2(t, -t * 0.55));
    float n2 = vnoise(id * 0.87 + vec2(-t * 0.35, t * 0.7) + 10.0);
    float blocks = smoothstep(0.5, 0.6, n1) * (0.5 + 0.5 * smoothstep(0.3, 0.85, n2));
    float flick = 0.86 + 0.14 * sin(uTime * 1.6 + hash21(id) * 6.2831);

    vec2 p = vec2(uv.x * uTiles.x * 0.16, uv.y * uTiles.y * 0.34) * (uNoiseScale / 9.0);
    float q = fbm(p + vec2(0.0, t * 0.6));
    float m = fbm(p * 1.5 + q * 2.6 + vec2(t * 0.35, 0.0));
    float band1 = smoothstep(0.40, 0.43, m) - smoothstep(0.47, 0.50, m);
    float band2 = smoothstep(0.55, 0.57, m) - smoothstep(0.61, 0.63, m);
    float marble = clamp(band1 + band2, 0.0, 1.0);
    marble *= 0.45 + 0.55 * smoothstep(0.3, 0.5, n1);

    // Faint nabla mark etched in every tile.
    float dTri = sdTri((f - 0.5) * 1.15, 0.24);
    float tri = (1.0 - smoothstep(0.0, aa * 3.0, abs(dTri) - 0.03));

    vec3 accent = lin(uAccent);
    vec3 c0 = accent * blocks * flick;
    vec3 c1 = vec3(0.62) * marble;
    vec3 c2 = lin(vec3(0.24, 0.62, 0.64)) * blocks * flick;
    // Cyclic blend: 0 purple, 1 marble, 2 teal, 3 ≡ 0, 4 ≡ 1.
    float mode = mod(uMode, 3.0);
    float w0 = max(0.0, 1.0 - abs(mode)) + max(0.0, 1.0 - abs(mode - 3.0));
    float w1 = max(0.0, 1.0 - abs(mode - 1.0)) + max(0.0, 1.0 - abs(mode - 4.0));
    float w2 = max(0.0, 1.0 - abs(mode - 2.0));
    vec3 panel = (c0 * w0 + c1 * w1 + c2 * w2) * uIntensity;

    vec3 base = lin(vec3(0.045, 0.045, 0.055));
    vec3 col = base + panel;
    col += tri * (0.02 + panel * 0.5) * 0.35;
    col = mix(col, col * 0.45, minor * 0.6);
    col = mix(col, lin(vec3(0.10, 0.10, 0.115)) + panel * 0.25, major);
    float vig = smoothstep(0.0, 0.22, uv.y) * smoothstep(1.0, 0.78, uv.y);
    col *= mix(0.25, 1.0, vig);

    // Light variant: bone surface, darker seams, small crosses at corners.
    vec3 lcol = lin(vec3(0.905, 0.905, 0.895));
    lcol = mix(lcol, lin(vec3(0.875)), minor * 0.6);
    lcol = mix(lcol, lin(vec3(0.80)), major);
    // Sparse crosses: every other tile corner.
    vec2 cf = abs(f - 0.5);
    float odd = mod(id.x + id.y, 2.0);
    float cross = (1.0 - smoothstep(0.003, 0.003 + aa, min(cf.x, cf.y))) * step(max(cf.x, cf.y), 0.075) * odd;
    lcol = mix(lcol, lin(vec3(0.55)), cross * 0.9);
    lcol *= mix(0.8, 1.0, vig);

    col = mix(col, lcol, uLight);
    col = mix(col, vec3(0.0), uBlack);
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export default function TileWall() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMode: { value: 0 },
      uLight: { value: 0 },
      uBlack: { value: 0 },
      uIntensity: { value: 0 },
      uNoiseScale: { value: 9 },
      uAccent: { value: new THREE.Color("#6d5ae6") },
      uTiles: { value: new THREE.Vector2(52, 11) },
    }),
    [],
  );

  useFrame(() => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value = choreo.time;
    u.uMode.value = choreo.wall.mode;
    u.uLight.value = choreo.wall.light;
    u.uBlack.value = choreo.wall.black;
    u.uIntensity.value = choreo.wall.intensity;
    u.uNoiseScale.value = store.material.noiseScale;
  });

  return (
    <mesh position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
      <cylinderGeometry args={[WALL_RADIUS, WALL_RADIUS, WALL_HEIGHT, 160, 1, true]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        side={THREE.BackSide}
      />
    </mesh>
  );
}
