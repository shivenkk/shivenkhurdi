"use client";

import { useEffect, useMemo, useRef, type ComponentRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { damp, lerp, store } from "@/lib/store";
import { choreo } from "./choreo";
import { prismGeometry } from "./geometry";

type TransmissionMat = THREE.MeshPhysicalMaterial & {
  chromaticAberration: number;
  distortion: number;
  distortionScale: number;
  temporalDistortion: number;
  anisotropicBlur: number;
};

const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _col = new THREE.Color();

export default function Prism({ quality }: { quality: "high" | "low" }) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<ComponentRef<typeof MeshTransmissionMaterial>>(null);
  const geo = useMemo(() => prismGeometry(), []);
  const spin = useRef(0);
  const tilt = useRef({ x: 0, y: 0 });
  const lastReset = useRef(0);

  useEffect(() => () => geo.dispose(), [geo]);

  useFrame((_, dt) => {
    const g = group.current;
    const m = mesh.current;
    if (!g || !m) return;
    const c = choreo;
    const d = Math.min(dt, 1 / 30);

    // Pose from the choreography, damped so scroll jitter never reaches it.
    g.position.x = damp(g.position.x, c.prism.x, 6, d);
    g.position.y = damp(g.position.y, c.prism.y, 6, d);
    g.position.z = damp(g.position.z, c.prism.z, 6, d);
    // Narrow viewports get a smaller prism so the wordmark stays legible.
    const s = c.prism.scale * lerp(store.viewScale, 1, c.fill);
    const sx = lerp(1, 0.07, c.prism.rod);
    g.scale.set(damp(g.scale.x, s * sx, 8, d), damp(g.scale.y, s, 8, d), damp(g.scale.z, s, 8, d));

    // Orientation: a slow spin, a pointer-driven tilt, reset on demand.
    if (store.resetTick !== lastReset.current) {
      lastReset.current = store.resetTick;
      spin.current = 0;
      tilt.current.x = 0;
      tilt.current.y = 0;
    }
    if (!store.reducedMotion) spin.current += d * 0.35 * c.prism.spin;
    const tx = store.pointer.y * 0.35;
    const ty = store.pointer.x * 0.5;
    tilt.current.x = damp(tilt.current.x, tx, 3, d);
    tilt.current.y = damp(tilt.current.y, ty, 3, d);
    const rodTwist = c.prism.rod * 0.55;
    _e.set(
      tilt.current.x + Math.sin(c.time * 0.5) * 0.06,
      spin.current + tilt.current.y + Math.PI * 0.5 * c.prism.rod,
      rodTwist + Math.sin(c.time * 0.37) * 0.04,
      "YXZ",
    );
    _q.setFromEuler(_e);
    m.quaternion.slerp(_q, 1 - Math.exp(-10 * d));
    store.quaternion[0] = m.quaternion.x;
    store.quaternion[1] = m.quaternion.y;
    store.quaternion[2] = m.quaternion.z;
    store.quaternion[3] = m.quaternion.w;

    // Material: debug-panel values plus the chromatic wash when filling.
    const mt = mat.current as unknown as TransmissionMat | null;
    if (mt) {
      mt.roughness = store.material.roughness * (1 - c.fill * 0.6);
      _col.set(store.material.color);
      mt.color.lerp(_col, 0.2);
      mt.chromaticAberration = lerp(0.08, 1.2, c.fill);
      mt.distortion = lerp(0.45, 1.2, c.fill);
      mt.distortionScale = lerp(0.35, 0.7, c.fill);
      mt.temporalDistortion = lerp(0.08, 0.25, c.fill);
      mt.thickness = lerp(1.4, 0.6, c.fill);
      mt.attenuationDistance = lerp(2.5, 40, c.fill);
      mt.ior = lerp(1.45, 1.15, Math.max(c.prism.rod * 0.5, c.fill));
      mt.iridescence = Math.min(1, c.prism.rod * 0.9 + c.fill);
    }
    m.visible = s > 0.002;
  });

  const high = quality === "high";

  return (
    <group ref={group} position={[0, 0.05, 4]}>
      <mesh ref={mesh} geometry={geo}>
        <MeshTransmissionMaterial
          ref={mat}
          transmission={1}
          thickness={1.4}
          roughness={0.1}
          ior={1.45}
          chromaticAberration={0.08}
          anisotropy={0.25}
          anisotropicBlur={0.2}
          distortion={0.45}
          distortionScale={0.35}
          temporalDistortion={0.08}
          clearcoat={1}
          clearcoatRoughness={0.1}
          iridescence={0}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[120, 460]}
          attenuationDistance={2.5}
          attenuationColor="#d9d4ff"
          samples={high ? 8 : 4}
          resolution={high ? 1024 : 512}
          backside={high}
          backsideThickness={0.4}
          color="#ffffff"
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
