"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import Rig from "./Rig";
import TileWall from "./TileWall";
import Words from "./Words";
import Screens from "./Screens";
import Prism from "./Prism";

if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  const original = console.warn;
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].startsWith("THREE.Clock: This module has been deprecated")) return;
    original(...args);
  };
}

function detectQuality(): "high" | "low" {
  if (typeof window === "undefined") return "high";
  const small = window.innerWidth < 900;
  const cores = navigator.hardwareConcurrency ?? 8;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  return small || cores <= 4 || mem <= 4 ? "low" : "high";
}

export default function Scene() {
  const [quality] = useState<"high" | "low">(detectQuality);
  return (
    <div className="fixed inset-0 z-0" aria-hidden>
      <Canvas
        dpr={quality === "high" ? [1, 1.75] : [1, 1.25]}
        camera={{ fov: 42, near: 0.1, far: 120, position: [0, 0, 9] }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.NoToneMapping,
        }}
        onCreated={({ gl }) => gl.setClearColor("#070709")}
      >
        <Rig />
        <TileWall />
        <Words />
        <Screens />
        <Prism quality={quality} />
        <ambientLight intensity={0.5} />
        <pointLight position={[4, 6, 6]} intensity={60} color="#cfc7ff" />
        <pointLight position={[-6, -2, 4]} intensity={25} color="#9ad8dc" />
        <Environment resolution={256} frames={1}>
          <Lightformer intensity={2.5} color="#b8aefc" position={[0, 6, -8]} scale={[12, 3, 1]} />
          <Lightformer intensity={1.8} color="#ffffff" position={[-7, 2, 2]} rotation-y={Math.PI / 2} scale={[8, 1.5, 1]} />
          <Lightformer intensity={1.2} color="#a8ecec" position={[7, -2, 1]} rotation-y={-Math.PI / 2} scale={[8, 1.5, 1]} />
          <Lightformer intensity={0.8} color="#ffffff" position={[0, -6, 4]} rotation-x={Math.PI / 2} scale={[10, 2, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}
