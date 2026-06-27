"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/data";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import Magnetic from "@/components/Magnetic";

const EASE = [0.16, 1, 0.3, 1] as const;
const ROLES = ["LLM Systems", "Multi-Agent AI", "Computer Vision", "Generative AI"];

function RotatingRole() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % ROLES.length), 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="relative inline-block whitespace-nowrap">
      {/* Reserve width + baseline with the longest label (kept invisible) so
          the animated words sit exactly on the "Focused on" baseline. */}
      <span aria-hidden className="invisible">
        Computer Vision
      </span>
      <span className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={i}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.45, ease: EASE }}
            className="block font-medium text-lime"
          >
            {ROLES[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}

function LocalClock() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date());
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular">{time}</span>;
}

export default function Hero() {
  const { scrollTo } = useSmoothScroll();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  const baseDelay = 2.0;

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.14, delayChildren: baseDelay } },
  };
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
  };
  const nameGroup: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };
  const line: Variants = {
    hidden: { y: "115%" },
    show: { y: 0, transition: { duration: 1, ease: EASE } },
  };

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-dvh flex-col justify-between overflow-hidden px-5 pb-10 pt-28 sm:px-8 sm:pt-32"
    >
      {/* Ambient glow */}
      <div
        className="glow left-[-10%] top-[8%] h-[55vh] w-[55vh] opacity-50"
        style={{ background: "rgba(198,255,58,0.16)" }}
      />
      <div
        className="glow bottom-[-10%] right-[-5%] h-[40vh] w-[40vh] opacity-40"
        style={{ background: "rgba(120,140,255,0.10)" }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-1 flex-col justify-between"
      >
        {/* Top meta row */}
        <motion.div
          variants={fadeUp}
          className="flex items-start justify-between gap-6"
        >
          <div className="flex flex-col gap-2.5">
            <span className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-paper sm:text-base">
              <span className="inline-block h-2.5 w-2.5 rotate-45 bg-lime" />
              {profile.role}
            </span>
            <span className="font-mono text-sm text-paper-dim sm:text-xl">
              Focused on <RotatingRole />
            </span>
          </div>

          <div className="flex flex-col items-end gap-2.5 text-right">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-paper-dim sm:text-base">
              {profile.location}
              <span className="text-paper-faint"> · {profile.locationNote}</span>
            </span>
            <span className="font-mono text-sm text-paper sm:text-xl">
              <LocalClock /> <span className="text-paper-faint">EST</span>
            </span>
          </div>
        </motion.div>

        {/* Giant name with parallax */}
        <motion.div style={{ y, opacity }} className="my-8 sm:my-0">
          <motion.h1
            variants={nameGroup}
            className="font-display font-extrabold uppercase leading-[0.84] tracking-[-0.03em] text-paper"
            style={{ fontSize: "clamp(3.4rem, 12.5vw, 12rem)" }}
          >
            {[profile.firstName, profile.lastName].map((word, i) => (
              <span
                key={word}
                className="block overflow-hidden"
                style={{ paddingBottom: "0.06em", marginBottom: "-0.06em" }}
              >
                <motion.span variants={line} className="block">
                  {word}
                  {i === 1 && <span className="text-lime">.</span>}
                </motion.span>
              </span>
            ))}
          </motion.h1>
        </motion.div>

        {/* Bottom block */}
        <motion.div
          variants={fadeUp}
          className="grid grid-cols-1 items-end gap-10 md:grid-cols-12"
        >
          {/* Tagline with emphasis */}
          <div className="md:col-span-7">
            <p className="max-w-2xl text-xl leading-snug text-paper-dim sm:text-[1.65rem] sm:leading-[1.32]">
              I design and ship AI systems across{" "}
              <span className="text-paper">LLMs</span>,{" "}
              <span className="text-paper">multi-agent platforms</span>, and{" "}
              <span className="text-paper">computer-vision pipelines</span> built
              to <span className="text-lime">hold up in production.</span>
            </p>
          </div>

          {/* Status card + CTAs */}
          <div className="flex flex-col gap-6 md:col-span-5 md:items-end">
            <div className="inline-flex items-center gap-4 rounded-2xl border border-line bg-surface/30 p-4 pr-6 backdrop-blur-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/interlock-cut.png"
                alt="Interlock Systems"
                className="h-10 w-auto sm:h-12"
              />
              <div className="flex flex-col leading-tight">
                <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-paper-faint">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
                  </span>
                  Currently
                </span>
                <span className="mt-1.5 text-base text-paper sm:text-lg">
                  AI Engineer · Interlock Systems
                </span>
                <span className="text-sm text-paper-dim">
                  Harvard Innovation Labs
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 md:justify-end">
              <Magnetic strength={0.4}>
                <button
                  onClick={() => scrollTo("#work")}
                  data-cursor="hover"
                  className="group inline-flex items-center gap-2 rounded-full bg-lime px-7 py-4 font-medium text-[#08080a] transition-colors hover:bg-lime-soft"
                >
                  View work
                  <ArrowDown
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-y-0.5"
                  />
                </button>
              </Magnetic>
              <Magnetic strength={0.4}>
                <button
                  onClick={() => scrollTo("#contact")}
                  className="group inline-flex items-center gap-2 rounded-full border border-line px-7 py-4 font-medium text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink"
                >
                  Get in touch
                  <ArrowUpRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </button>
              </Magnetic>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: baseDelay + 0.6, duration: 1 }}
        className="relative z-10 mt-10 flex items-center justify-center gap-3"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper-faint">
          Scroll
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="grid h-9 w-9 place-items-center rounded-full border border-line"
        >
          <ArrowDown size={14} className="text-paper-dim" />
        </motion.span>
      </motion.div>
    </section>
  );
}
