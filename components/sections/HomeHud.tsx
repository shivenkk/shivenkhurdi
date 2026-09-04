"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { store, subscribe } from "@/lib/store";
import MaterialPanel from "@/components/hud/MaterialPanel";
import QuaternionPanel from "@/components/hud/QuaternionPanel";
import UpdatesPanel from "@/components/hud/UpdatesPanel";
import SectionRail from "@/components/hud/SectionRail";

export default function HomeHud() {
  const [active, setActive] = useState(store.active);
  const [loaded, setLoaded] = useState(store.loaded);
  const hero = useRef<HTMLDivElement>(null);
  const quat = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
      subscribe(() => {
        setActive(store.active);
        setLoaded(store.loaded);
      }),
    [],
  );

  useEffect(() => {
    const showHero = loaded && active === "hero";
    const showQuat = loaded && (active === "hero" || active === "work");
    gsap.to(hero.current, { autoAlpha: showHero ? 1 : 0, duration: 0.8, delay: showHero ? 0.6 : 0, overwrite: true });
    gsap.to(quat.current, { autoAlpha: showQuat ? 1 : 0, duration: 0.8, delay: showQuat ? 0.6 : 0, overwrite: true });
    gsap.to(rail.current, { autoAlpha: loaded && active !== "outro" ? 1 : 0, duration: 0.8, overwrite: true });
  }, [active, loaded]);

  return (
    <>
      <div ref={rail} className="on-stage pointer-events-auto fixed left-5 top-[40%] z-30 hidden -translate-y-1/2 opacity-0 md:flex">
        <SectionRail />
      </div>
      <div ref={quat} className="on-stage pointer-events-auto fixed right-10 top-[92px] z-30 hidden opacity-0 lg:block">
        <QuaternionPanel />
      </div>
      <div ref={hero} className="on-stage pointer-events-none fixed inset-0 z-30 opacity-0">
        <div className="pointer-events-auto absolute bottom-10 left-[700px] hidden 2xl:block">
          <MaterialPanel />
        </div>
        <div className="pointer-events-auto absolute bottom-8 right-10 hidden md:block">
          <UpdatesPanel />
        </div>
      </div>
    </>
  );
}
