"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { damp, setActiveExperience, setActiveWork, store } from "@/lib/store";
import { choreo, updateChoreo } from "./choreo";

export default function Rig() {
  const target = useRef(new THREE.Vector3());
  const themeRef = useRef<"dark" | "light">("dark");
  const debugTick = useRef(0);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      store.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      store.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      // Leaving the home scene: never strand a sub-page in the light theme.
      document.documentElement.dataset.theme = "dark";
    };
  }, []);

  useFrame((state, dt) => {
    updateChoreo(performance.now());
    const d = Math.min(dt, 1 / 30);
    const c = choreo;
    const camera = state.camera;
    store.viewScale = Math.min(1, Math.max(0.45, state.size.width / state.size.height / 1.6));

    camera.position.z = damp(camera.position.z, c.cam.z, 5, d);
    camera.position.x = damp(camera.position.x, Math.sin(c.cam.yaw) * 2.2, 5, d);
    camera.position.y = damp(camera.position.y, c.cam.pitch * 2.0, 5, d);
    target.current.set(Math.sin(c.cam.yaw) * -6, c.cam.pitch * -4, -14);
    camera.lookAt(target.current);

    // Coarse state for the DOM (only emits on change).
    setActiveWork(c.work.index);
    setActiveExperience(c.exp.index);
    const theme = c.wall.light > 0.5 ? "light" : "dark";
    if (theme !== themeRef.current) {
      themeRef.current = theme;
      document.documentElement.dataset.theme = theme;
    }
    store.light = c.wall.light;

    if (process.env.NODE_ENV !== "production" && ++debugTick.current % 3 === 0) {
      const r = (v: number) => Math.round(v * 100) / 100;
      document.documentElement.dataset.scene = JSON.stringify({
        active: store.active,
        loaded: store.loaded,
        sec: Object.fromEntries(Object.entries(store.sections).map(([k, v]) => [k, r(v)])),
        ex: Object.fromEntries(Object.entries(store.exits).map(([k, v]) => [k, r(v)])),
        fill: r(c.fill),
        scale: r(c.prism.scale),
        rod: r(c.prism.rod),
        light: r(c.wall.light),
        mode: r(c.wall.mode),
        workC: r(c.work.c),
      });
    }
    state.invalidate();
  });

  return null;
}
