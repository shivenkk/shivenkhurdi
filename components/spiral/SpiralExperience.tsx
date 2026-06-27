"use client";

import { useEffect, useState, type ComponentType } from "react";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import SpiralCanvas from "./SpiralCanvas";
import ListView from "./ListView";
import { type CardData } from "./SpiralCard";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { profile, socials } from "@/lib/data";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import Work from "@/components/sections/Work";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";

const EASE = [0.16, 1, 0.3, 1] as const;

const ROLES = [
  "LLM Systems",
  "Multi-Agent AI",
  "RAG",
  "Computer Vision",
  "Generative AI",
];

function RotatingRole() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % ROLES.length), 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="relative inline-block whitespace-nowrap">
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

const CARDS: (CardData & { Content: ComponentType })[] = [
  {
    id: "about",
    n: "01",
    title: "About",
    teaser: "Who I am, the engineer behind the work.",
    Content: About,
  },
  {
    id: "experience",
    n: "02",
    title: "Experience",
    teaser: "Four roles across AI, web dev & research.",
    Content: Experience,
  },
  {
    id: "education",
    n: "03",
    title: "Education",
    teaser: "M.S. AI at Northeastern · B.E. CS at BITS.",
    Content: Education,
  },
  {
    id: "work",
    n: "04",
    title: "Projects",
    teaser: "Six projects in LLMs, agents, CV & ML.",
    Content: Work,
  },
  {
    id: "skills",
    n: "05",
    title: "Skills",
    teaser: "My languages, ML stack & tooling.",
    Content: Skills,
  },
  {
    id: "contact",
    n: "06",
    title: "Contact",
    teaser: "Let's build something. Reach out.",
    Content: Contact,
  },
];

export default function SpiralExperience() {
  const [view, setView] = useState<"spiral" | "list">("spiral");
  const [openId, setOpenId] = useState<string | null>(null);
  const [hovered, setHovered] = useState<CardData | null>(null);
  const { stop, start } = useSmoothScroll();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const [booted, setBooted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 1700);
    return () => clearTimeout(t);
  }, []);

  // Phones get the scrollable Detailed view by default (spiral is desktop-first).
  // Runs under the boot overlay, so there's no visible flash.
  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) setView("list");
  }, []);

  // Spiral mode (and open cards) lock page scroll; list mode scrolls normally.
  useEffect(() => {
    if (view === "spiral" || openId) stop();
    else start();
  }, [view, openId, stop, start]);

  const open = (id: string) => setOpenId(id);
  const close = () => setOpenId(null);
  const onMove = (e: React.MouseEvent) => {
    mx.set(e.clientX);
    my.set(e.clientY);
  };

  const OpenContent = openId
    ? CARDS.find((c) => c.id === openId)?.Content
    : null;
  const isSpiral = view === "spiral";

  return (
    <>
      {isSpiral ? (
        <SpiralCanvas
          cards={CARDS}
          onOpen={open}
          onHover={setHovered}
          onMove={onMove}
        />
      ) : (
        <ListView />
      )}

      {/* Cursor light (spiral) */}
      {isSpiral && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[40]"
          style={{ x: mx, y: my }}
        >
          <div
            className="h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(198,255,58,0.10), transparent 70%)",
            }}
          />
        </motion.div>
      )}

      {/* ---------- Perimeter HUD ---------- */}
      <div className="pointer-events-none fixed inset-0 z-[50]">
        {/* Spiral / Detailed toggle (both modes) */}
        <div className="pointer-events-auto absolute left-1/2 top-5 flex -translate-x-1/2 items-center gap-1 rounded-full border border-line bg-ink/70 p-1 backdrop-blur sm:top-7">
          {(
            [
              ["spiral", "Spiral"],
              ["list", "Detailed"],
            ] as const
          ).map(([v, label]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                view === v
                  ? "bg-lime text-[#08080a]"
                  : "text-paper-dim hover:text-paper"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Spiral-only chrome (hidden in Detailed so it never overlaps scrolling content) */}
        {isSpiral && (
          <>
            <div className="absolute left-5 top-5 sm:left-8 sm:top-8">
              <div className="font-display text-2xl font-extrabold tracking-tight text-paper sm:text-4xl">
                {profile.name}
              </div>
              <div className="mt-2 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.2em] text-paper-dim sm:text-sm">
                <span className="inline-block h-2.5 w-2.5 rotate-45 bg-lime" />
                {profile.role}
              </div>
              <div className="mt-1.5 hidden font-mono text-sm text-paper-faint sm:block">
                Focused on <RotatingRole />
              </div>
            </div>

            <div className="absolute right-5 top-5 hidden items-center gap-3 rounded-full border border-line bg-ink/60 px-5 py-3 backdrop-blur sm:right-8 sm:top-8 sm:flex">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime" />
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-paper-dim sm:text-sm">
                Currently · Interlock Systems
              </span>
            </div>

            {/* GitHub · LinkedIn · Résumé · Get in touch, one centered row */}
            <div className="pointer-events-auto absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-wrap items-center justify-center gap-2.5 sm:bottom-7 sm:gap-3">
              <a
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-ink/70 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-paper backdrop-blur transition-colors hover:border-lime hover:text-lime"
              >
                GitHub <ArrowUpRight size={14} />
              </a>
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-ink/70 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-paper backdrop-blur transition-colors hover:border-lime hover:text-lime"
              >
                LinkedIn <ArrowUpRight size={14} />
              </a>
              <a
                href={socials.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-ink/70 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-paper backdrop-blur transition-colors hover:border-lime hover:text-lime"
              >
                Résumé <ArrowUpRight size={14} />
              </a>
              <a
                href={`mailto:${socials.email}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-ink/70 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-paper backdrop-blur transition-colors hover:border-lime hover:text-lime"
              >
                Get in touch
              </a>
            </div>
          </>
        )}
      </div>

      {/* Hover preview */}
      <AnimatePresence>
        {hovered && !openId && isSpiral && (
          <motion.div
            className="pointer-events-none fixed left-0 top-0 z-[60] hidden md:block"
            style={{ x: mx, y: my }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="translate-x-5 translate-y-5 rounded-xl border border-line bg-ink/90 px-4 py-3 shadow-xl backdrop-blur"
              style={{ width: 250 }}
            >
              <div className="font-mono text-[10px] uppercase tracking-wider text-lime">
                Open · {hovered.title}
              </div>
              <div className="mt-1.5 text-sm leading-snug text-paper">
                {hovered.teaser}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen section view */}
      <AnimatePresence>
        {openId && OpenContent && (
          <motion.div
            key={openId}
            data-lenis-prevent="true"
            className="fixed inset-0 z-[80] overflow-y-auto overscroll-contain bg-ink"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <button
              onClick={close}
              aria-label="Close"
              className="fixed right-5 top-5 z-[90] grid h-11 w-11 place-items-center rounded-full border border-line bg-ink/70 text-paper backdrop-blur transition-colors hover:border-lime hover:text-lime sm:right-8 sm:top-8"
            >
              <X size={20} />
            </button>
            <div className="pt-12">
              <OpenContent />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Boot-up intro */}
      <AnimatePresence>
        {!booted && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="text-center font-mono">
              <div className="text-xs uppercase tracking-[0.3em] text-lime">
                Initializing interface
              </div>
              <div className="mx-auto mt-4 h-px w-56 overflow-hidden bg-line">
                <motion.div
                  className="h-full bg-lime"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </div>
              <div className="mt-3 text-[10px] uppercase tracking-widest text-paper-faint">
                {profile.name} · {profile.role}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
