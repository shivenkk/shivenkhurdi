"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { experience, projects } from "@/lib/data";
import { lerp, smoothstep, store } from "@/lib/store";
import { choreo } from "./choreo";
import { curvedPlaneGeometry } from "./geometry";
import { experienceTexture, posterTexture } from "./textures";
import { useReady } from "./Words";

const PIVOT_Z = 9.4;
const SCREEN_R = 10.5;
const SCREEN_W = 6.6;
const SCREEN_H = (SCREEN_W * 9) / 16;
const DELTA = 0.86;

function WorkScreens() {
  const [texs, setTexs] = useState<THREE.Texture[] | null>(null);
  const geo = useMemo(() => curvedPlaneGeometry(SCREEN_W, SCREEN_H, SCREEN_R, 40), []);
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);

  useEffect(() => {
    let cancelled = false;
    const out: THREE.Texture[] = [];
    // Rasterise posters across idle frames so boot stays smooth.
    const step = (i: number) => {
      if (cancelled) return;
      if (i >= projects.length) {
        setTexs(out);
        return;
      }
      out.push(posterTexture(projects[i]));
      requestAnimationFrame(() => step(i + 1));
    };
    step(0);
    return () => {
      cancelled = true;
      out.forEach((t) => t.dispose());
      geo.dispose();
    };
  }, [geo]);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const c = choreo.work.c;
    const vis = choreo.work.visible;
    const vs = store.viewScale;
    const delta = DELTA * vs;
    g.visible = vis > 0.002;
    g.rotation.y = c * delta;
    meshes.current.forEach((m, i) => {
      if (!m) return;
      if (m.parent) m.parent.rotation.y = -i * delta;
      const dist = Math.abs(i - c);
      const s = lerp(1, 0.6, smoothstep(0.1, 1, dist)) * vs;
      m.scale.setScalar(s);
      m.position.y = 0.15 + (1 - vs) * 2.4;
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = vis * lerp(1, 0.55, smoothstep(0.1, 1.2, dist)) * (dist < 2.2 ? 1 : 0);
      m.visible = mat.opacity > 0.01;
    });
  });

  return (
    <group position={[0, 0, PIVOT_Z]}>
      <group ref={group}>
        {projects.map((p, i) => (
          <group key={p.id}>
            <mesh
              ref={(m) => {
                meshes.current[i] = m;
              }}
              geometry={geo}
              position={[0, 0.15, -SCREEN_R]}
            >
              <meshBasicMaterial
                map={texs?.[i] ?? null}
                color={texs ? "#ffffff" : "#15151c"}
                transparent
                toneMapped={false}
                depthWrite={false}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

const XP_W = 7.4;
const XP_H = (XP_W * 9) / 16;

function ExperienceScreens() {
  const [texs, setTexs] = useState<THREE.Texture[] | null>(null);
  const geo = useMemo(() => curvedPlaneGeometry(XP_W, XP_H, SCREEN_R, 40), []);
  const groups = useRef<(THREE.Group | null)[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all(experience.map((x) => experienceTexture(x))).then((t) => {
      if (cancelled) t.forEach((x) => x.dispose());
      else setTexs(t);
    });
    return () => {
      cancelled = true;
      geo.dispose();
    };
  }, [geo]);

  useEffect(() => () => texs?.forEach((t) => t.dispose()), [texs]);

  useFrame(() => {
    const { index, t, visible } = choreo.exp;
    const vs = store.viewScale;
    const rest = -0.22 * smoothstep(0.45, 1, vs); // centred on phones, left of centre on desktop
    const ms = lerp(0.8, 1, vs) * vs;
    groups.current.forEach((g, i) => {
      if (!g) return;
      let angle = 1.4;
      let opacity = 0;
      if (i === index) {
        const k = smoothstep(0, 0.3, t);
        angle = lerp(1.1, rest, k);
        opacity = k;
      } else if (i === index - 1) {
        const k = smoothstep(0, 0.3, t);
        angle = lerp(rest, -1.4, k);
        opacity = 1 - k;
      }
      opacity *= visible;
      g.visible = opacity > 0.01;
      g.rotation.y = -angle;
      const mesh = g.children[0] as THREE.Mesh;
      mesh.scale.setScalar(ms);
      mesh.position.y = 0.3 + (1 - vs) * 3.2;
      (mesh.material as THREE.MeshBasicMaterial).opacity = opacity;
    });
  });

  return (
    <group position={[0, 0, PIVOT_Z]}>
      {experience.map((x, i) => (
        <group
          key={x.id}
          ref={(g) => {
            groups.current[i] = g;
          }}
          visible={false}
        >
          <mesh geometry={geo} position={[0, 0.3, -SCREEN_R]}>
            <meshBasicMaterial
              map={texs?.[i] ?? null}
              color={texs ? "#ffffff" : "#15151c"}
              transparent
              toneMapped={false}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function Screens() {
  const ready = useReady();
  if (!ready) return null;
  return (
    <>
      <WorkScreens />
      <ExperienceScreens />
    </>
  );
}
