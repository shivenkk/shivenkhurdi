"use client";

import { ArrowUpRight, ArrowUp } from "lucide-react";
import { RevealHeading, Reveal } from "@/components/anim";
import Magnetic from "@/components/Magnetic";
import { profile, socials } from "@/lib/data";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";

export default function Contact() {
  const { scrollTo } = useSmoothScroll();

  const links = [
    { label: "LinkedIn", href: socials.linkedin },
    { label: "GitHub", href: socials.github },
    { label: "Email", href: `mailto:${socials.email}` },
    { label: "Résumé", href: socials.resume },
  ];

  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t border-line px-5 pb-10 pt-24 sm:px-8 sm:pt-36"
    >
      <div
        className="glow bottom-[-30%] left-1/2 h-[60vh] w-[80vh] -translate-x-1/2 opacity-40"
        style={{ background: "rgba(198,255,58,0.14)" }}
      />

      <div className="relative z-10 mx-auto max-w-[1600px]">
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-xs text-lime">(06)</span>
          <span className="h-px w-12 bg-line sm:w-24" />
          <span className="eyebrow">Let&apos;s talk</span>
        </div>

        <RevealHeading
          text="Let's build something that ships."
          as="h2"
          className="max-w-5xl font-display text-[clamp(2.6rem,8vw,7rem)] font-bold leading-[0.92] tracking-tight text-paper"
        />

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-xl text-lg text-paper-dim">
            Open to AI / ML engineering roles, research collaborations, and
            ambitious projects. The fastest way to reach me is email.
          </p>
        </Reveal>

        {/* Big email link */}
        <Reveal delay={0.15}>
          <div className="mt-12">
            <Magnetic strength={0.25}>
              <a
                href={`mailto:${socials.email}`}
                data-cursor="hover"
                className="group inline-flex flex-wrap items-center gap-3 font-display text-[clamp(1.6rem,5vw,3.5rem)] font-semibold tracking-tight text-paper transition-colors hover:text-lime"
              >
                {socials.email}
                <span className="grid h-12 w-12 place-items-center rounded-full border border-line transition-colors duration-300 group-hover:border-lime sm:h-16 sm:w-16">
                  <ArrowUpRight
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    size={26}
                  />
                </span>
              </a>
            </Magnetic>
          </div>
        </Reveal>

        {/* Link row */}
        <Reveal delay={0.2}>
          <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-8">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="link-line font-mono text-sm uppercase tracking-wider text-paper-dim transition-colors hover:text-paper"
              >
                {l.label}
              </a>
            ))}
          </div>
        </Reveal>

        {/* Bottom bar */}
        <div className="mt-24 flex flex-col items-start justify-between gap-6 sm:mt-32 sm:flex-row sm:items-end">
          <div>
            <div
              className="font-display font-bold uppercase leading-none tracking-tight text-paper/10"
              style={{ fontSize: "clamp(3rem, 14vw, 13rem)" }}
              aria-hidden
            >
              {profile.lastName}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 font-mono text-xs text-paper-faint sm:flex-row sm:items-center">
          <span>
            © {new Date().getFullYear()} {profile.name} · {profile.location}
          </span>
          <span className="hidden sm:inline">
            Designed &amp; built with Next.js · GSAP · Lenis
          </span>
          <Magnetic strength={0.4}>
            <button
              onClick={() => scrollTo(0)}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 uppercase tracking-wider text-paper transition-colors hover:border-lime hover:text-lime"
            >
              Back to top <ArrowUp size={14} />
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
