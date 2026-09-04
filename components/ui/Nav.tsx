"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import { gsap } from "@/lib/gsap";
import { navLinks, socials } from "@/lib/data";
import { store, subscribe } from "@/lib/store";
import { getLenis } from "@/components/providers/SmoothScroll";
import TransitionLink from "./TransitionLink";
import Wordmark, { NablaMark } from "./Wordmark";

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const loaded = useSyncExternalStore(subscribe, () => store.loaded, () => false);
  // On the home route the bar waits for the loader.
  const visible = pathname !== "/" || loaded;
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!bar.current) return;
    gsap.to(bar.current, {
      autoAlpha: visible ? 1 : 0,
      y: visible ? 0 : -8,
      duration: 1,
      delay: visible ? 0.4 : 0,
    });
  }, [visible]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const el = menu.current;
    if (!el) return;
    const items = el.querySelectorAll("[data-menu-item]");
    if (open) {
      gsap.set(el, { pointerEvents: "auto" });
      gsap.to(el, { autoAlpha: 1, duration: 0.5, ease: "power2.out" });
      gsap.fromTo(
        items,
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.9, delay: 0.1 },
      );
      // The panel is visibility:hidden until the first tween tick.
      const t = window.setTimeout(() => el.querySelector<HTMLElement>("a")?.focus({ preventScroll: true }), 120);
      return () => window.clearTimeout(t);
    } else {
      gsap.to(el, {
        autoAlpha: 0,
        duration: 0.4,
        onComplete: () => gsap.set(el, { pointerEvents: "none" }),
      });
    }
  }, [open]);

  return (
    <>
      <header
        ref={bar}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 opacity-0"
      >
        <div className="flex h-[72px] items-center justify-between px-5 md:px-10">
          <TransitionLink
            href="/"
            className="pointer-events-auto text-fg"
            aria-label="Home"
            onClick={(e) => {
              if (pathname !== "/") return;
              e.preventDefault();
              const lenis = getLenis();
              if (lenis) lenis.scrollTo(0, { duration: 1.4 });
              else window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <Wordmark size="22px" />
          </TransitionLink>

          <nav className="pointer-events-auto absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 md:flex">
            {navLinks.map((l) => (
              <TransitionLink
                key={l.href}
                href={l.href}
                className={`hud link-underline inline-block py-2 transition-colors hover:text-fg ${
                  pathname === l.href ? "text-fg" : ""
                }`}
              >
                {l.label}
              </TransitionLink>
            ))}
          </nav>

          <div className="pointer-events-auto flex items-center gap-4">
            <TransitionLink href={socials.resume} className="pill">
              Résumé
              <ArrowUpRight size={12} />
            </TransitionLink>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid size-9 place-items-center text-fg-dim transition-colors hover:text-fg"
            >
              {open ? <X size={18} /> : <List size={18} />}
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menu}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        className="pointer-events-none fixed inset-0 z-40 flex flex-col justify-between bg-ink/95 px-5 pb-8 pt-28 opacity-0 backdrop-blur-md md:px-10"
        style={{ color: "var(--color-paper)" }}
      >
        <ul className="flex flex-col gap-2">
          {[{ label: "Home", href: "/" }, ...navLinks, { label: "Résumé", href: socials.resume }].map(
            (l, i) => (
              <li key={l.href} data-menu-item>
                <TransitionLink
                  href={l.href}
                  className="group flex items-baseline gap-5 py-2 font-display text-4xl font-bold uppercase tracking-tight md:text-6xl"
                >
                  <span className="hud w-8 text-paper-faint">0{i + 1}</span>
                  <span className="transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-3">
                    {l.label}
                  </span>
                </TransitionLink>
              </li>
            ),
          )}
        </ul>
        <div className="flex items-end justify-between" data-menu-item>
          <div className="hud flex flex-col gap-1">
            <a href={socials.github} className="hover:text-paper" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={socials.linkedin} className="hover:text-paper" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={`mailto:${socials.email}`} className="hover:text-paper">
              {socials.email}
            </a>
          </div>
          <NablaMark className="h-10 w-auto text-paper-faint" />
        </div>
      </div>
    </>
  );
}
