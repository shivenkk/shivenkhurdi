"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navLinks, socials } from "@/lib/data";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";

export default function Navbar() {
  const { scrollTo, stop, start } = useSmoothScroll();
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setAtTop(y < 40);
      if (y > last && y > 220 && !menuOpen) setHidden(true);
      else setHidden(false);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const openMenu = () => {
    setMenuOpen(true);
    stop();
  };
  const closeMenu = () => {
    setMenuOpen(false);
    start();
  };
  const go = (href: string) => {
    closeMenu();
    scrollTo(href);
  };
  const toTop = () => {
    closeMenu();
    scrollTo(0);
  };

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 z-[60] h-[2px] w-full origin-left bg-lime"
        style={{ scaleX: progress }}
      />

      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hidden ? "-110%" : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          atTop
            ? "bg-transparent"
            : "border-b border-line bg-ink/70 backdrop-blur-md"
        }`}
      >
        <nav className="mx-auto grid max-w-[1600px] grid-cols-2 items-center px-5 py-4 sm:px-8 sm:py-5 md:grid-cols-[1fr_auto_1fr]">
          {/* Left: home monogram + availability */}
          <div className="flex items-center gap-3 justify-self-start">
            <button
              onClick={toTop}
              aria-label="Back to top"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-lime font-display text-sm font-bold text-[#08080a] transition-transform duration-700 hover:rotate-[360deg]"
            >
              SK
            </button>
            <span className="hidden items-center gap-2 rounded-full border border-line py-1.5 pl-2.5 pr-3.5 sm:inline-flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-paper-dim">
                Open to AI / ML roles
              </span>
            </span>
          </div>

          {/* Center: links */}
          <div className="hidden items-center gap-1 justify-self-center md:flex">
            {navLinks.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <button
                  key={link.href}
                  onClick={() => go(link.href)}
                  className="group relative px-4 py-2 text-sm text-paper-dim transition-colors hover:text-paper"
                >
                  <span
                    className={`mr-1.5 inline-block h-1 w-1 rounded-full align-middle transition-all duration-300 ${
                      isActive ? "bg-lime opacity-100" : "opacity-0"
                    }`}
                  />
                  <span className={isActive ? "text-paper" : ""}>
                    {link.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: résumé + mobile toggle */}
          <div className="flex items-center gap-3 justify-self-end">
            <a
              href={socials.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="group hidden items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm text-paper transition-colors hover:border-lime hover:text-lime sm:inline-flex"
            >
              Résumé
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={menuOpen ? closeMenu : openMenu}
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-paper md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink-soft px-6 pb-10 pt-28 md:hidden"
          >
            <ul className="flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.6 }}
                >
                  <button
                    onClick={() => go(link.href)}
                    className="font-display text-5xl font-bold tracking-tight text-paper"
                  >
                    <span className="mr-3 font-mono text-sm text-lime align-top">
                      0{i + 1}
                    </span>
                    {link.label}
                  </button>
                </motion.li>
              ))}
            </ul>

            <div className="flex flex-col gap-4 border-t border-line pt-6">
              <a
                href={socials.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-1.5 rounded-full bg-lime px-5 py-2.5 font-medium text-[#08080a]"
              >
                Download Résumé <ArrowUpRight size={16} />
              </a>
              <div className="flex gap-5 font-mono text-xs uppercase tracking-widest text-paper-dim">
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
                <a href={socials.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <a href={`mailto:${socials.email}`}>Email</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
