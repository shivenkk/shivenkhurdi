"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { store, subscribe } from "@/lib/store";
import { choreo } from "./choreo";
import { curvedPlaneGeometry } from "./geometry";
import { WALL_RADIUS } from "./TileWall";
import { glowTexture, wordTexture, wordmarkTexture, WORDMARK_ASPECT } from "./textures";

export function useReady() {
  return useSyncExternalStore(subscribe, () => store.loaded, () => false);
}

// Slightly above centre: the hero intro lives in the lower third.
const WORDMARK_Y = 0.55;

function Wordmark3D() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const { texture: tex, nablaCenter, nablaHeight } = useMemo(() => wordmarkTexture(), []);
  useEffect(() => () => tex.dispose(), [tex]);

  const width = useMemo(() => {
    const dist = 9;
    const h = 2 * dist * Math.tan((camera.fov * Math.PI) / 360);
    const w = h * (size.width / size.height);
    return Math.min(11.2, w * 0.92);
  }, [camera.fov, size.width, size.height]);

  // Tell the choreography where the glyph is so the prism can sit on it.
  useEffect(() => {
    store.heroNabla.x = (nablaCenter - 0.5) * width;
    store.heroNabla.y = WORDMARK_Y;
    store.heroNabla.h = nablaHeight * (width / WORDMARK_ASPECT);
  }, [nablaCenter, nablaHeight, width]);

  useFrame(() => {
    if (!mat.current || !mesh.current) return;
    mat.current.opacity = choreo.wordmark;
    mesh.current.visible = choreo.wordmark > 0.002;
    // Tiny breathing so the boot landing feels physical.
    const s = 1 + (1 - choreo.intro) * 0.25;
    mesh.current.scale.setScalar(s);
  });

  return (
    <mesh ref={mesh} position={[0, WORDMARK_Y, 0]}>
      <planeGeometry args={[width, width / WORDMARK_ASPECT]} />
      <meshBasicMaterial ref={mat} map={tex} transparent toneMapped={false} depthWrite={false} />
    </mesh>
  );
}

const WORD_R = WALL_RADIUS - 0.35;

function WallWord({
  text,
  width,
  y = 0,
  angleOffset = 0,
  rows = 1,
  read,
}: {
  text: string;
  width: number;
  y?: number;
  angleOffset?: number;
  rows?: number;
  read: () => { opacity: number; angle: number };
}) {
  const { texture, aspect } = useMemo(() => wordTexture(text), [text]);
  const geo = useMemo(() => curvedPlaneGeometry(width, width / aspect, WORD_R, 48), [width, aspect]);
  useEffect(
    () => () => {
      texture.dispose();
      geo.dispose();
    },
    [texture, geo],
  );
  const group = useRef<THREE.Group>(null);
  const mats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

  useFrame(() => {
    const { opacity, angle } = read();
    const g = group.current;
    if (!g) return;
    g.visible = opacity > 0.002;
    g.rotation.y = -(angle + angleOffset);
    mats.current.forEach((m, i) => {
      if (!m) return;
      const rowFade = rows === 1 ? 1 : i === Math.floor(rows / 2) ? 1 : 0.32;
      m.opacity = opacity * rowFade;
    });
  });

  const rowH = width / aspect;
  return (
    <group ref={group}>
      {Array.from({ length: rows }).map((_, i) => {
        const offset = (i - (rows - 1) / 2) * rowH * 1.08;
        const shift = (i - (rows - 1) / 2) * 0.08;
        return (
          <group key={i} rotation-y={-shift}>
            <mesh geometry={geo} position={[0, y - offset, -WORD_R]}>
              <meshBasicMaterial
                ref={(m) => {
                  mats.current[i] = m;
                }}
                map={texture}
                transparent
                toneMapped={false}
                depthWrite={false}
                opacity={0}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function OutroGlow() {
  const tex = useMemo(() => glowTexture(), []);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const mesh = useRef<THREE.Mesh>(null);
  useEffect(() => () => tex.dispose(), [tex]);
  useFrame(() => {
    if (!mat.current || !mesh.current) return;
    mat.current.opacity = choreo.outro.glow;
    mesh.current.visible = choreo.outro.glow > 0.002;
  });
  return (
    <mesh ref={mesh} position={[0, 0, -6]}>
      <planeGeometry args={[30, 15]} />
      <meshBasicMaterial
        ref={mat}
        map={tex}
        transparent
        toneMapped={false}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default function Words() {
  const ready = useReady();
  if (!ready) return null;
  return (
    <>
      <Wordmark3D />
      <WallWord
        text="WORK"
        width={16}
        read={() => ({ opacity: choreo.workWord.opacity, angle: choreo.workWord.angle })}
      />
      <WallWord
        text="EXPERIENCE"
        width={24}
        rows={3}
        read={() => ({ opacity: choreo.expWord.opacity, angle: 0.05 })}
      />
      <OutroGlow />
    </>
  );
}
