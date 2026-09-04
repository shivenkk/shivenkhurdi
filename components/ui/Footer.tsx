import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { navLinks, socials } from "@/lib/data";
import TransitionLink from "./TransitionLink";
import Wordmark from "./Wordmark";

const year = new Date().getFullYear();

export default function Footer({ wordmark = true }: { wordmark?: boolean }) {
  return (
    <footer className="relative overflow-hidden px-5 pt-24 md:px-10">
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="grid grid-cols-3 gap-x-10 gap-y-2 hud [&_a]:inline-block [&_a]:py-1">
          <ul className="flex flex-col gap-2">
            <li>
              <TransitionLink href="/" className="hover:text-fg">Home</TransitionLink>
            </li>
            {navLinks.map((l) => (
              <li key={l.href}>
                <TransitionLink href={l.href} className="hover:text-fg">
                  {l.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-2">
            <li>
              <TransitionLink href={socials.resume} className="hover:text-fg">Résumé</TransitionLink>
            </li>
            <li>
              <a href={socials.github} target="_blank" rel="noreferrer" className="hover:text-fg">GitHub</a>
            </li>
            <li>
              <a href={socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-fg">LinkedIn</a>
            </li>
          </ul>
          <ul className="flex flex-col gap-2 text-fg-faint">
            <li>Boston, MA</li>
            <li>Open to relocate</li>
            <li>
              <a href={`mailto:${socials.email}`} className="hover:text-fg">{socials.email}</a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-start gap-4 md:items-end">
          <div className="flex items-center gap-8">
            <a
              href={`mailto:${socials.email}`}
              className="group hud inline-flex items-center gap-3 text-fg"
            >
              Contact
              <span className="grid size-7 place-items-center rounded-full border border-rule transition-colors group-hover:bg-fg group-hover:text-bg">
                <ArrowUpRight size={12} />
              </span>
            </a>
            <TransitionLink
              href={socials.resume}
              className="group hud inline-flex items-center gap-3 text-fg"
            >
              Résumé
              <span className="grid size-7 place-items-center rounded-full border border-rule transition-colors group-hover:bg-fg group-hover:text-bg">
                <ArrowUpRight size={12} />
              </span>
            </TransitionLink>
          </div>
          <p className="font-sans text-sm text-fg-dim">
            ©{year} Shiven Khurdi
          </p>
        </div>
      </div>

      {wordmark && (
        <div
          className="pointer-events-none mt-10 flex justify-center text-fg"
          aria-hidden
        >
          <div className="translate-y-[22%]">
            <Wordmark size="clamp(96px, 22vw, 360px)" className="opacity-[0.55]" />
          </div>
        </div>
      )}
    </footer>
  );
}
