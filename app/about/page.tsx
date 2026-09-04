import type { Metadata } from "next";
import Image from "next/image";
import { affiliations, education, profile, socials, updates } from "@/lib/data";
import PageHeading from "@/components/ui/PageHeading";
import Footer from "@/components/ui/Footer";
import Reveal from "@/components/text/Reveal";
import TransitionLink from "@/components/ui/TransitionLink";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "About",
  description: profile.tagline,
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-rule pt-8 md:grid-cols-[180px_1fr] md:gap-10">
      <h2 className="hud-label pt-1">{label}</h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="stage-grid min-h-[100dvh]">
      <div className="relative z-10 px-5 md:px-10">
        <PageHeading title="About" />

        <div className="mt-16 flex flex-col gap-20 md:mt-24 md:gap-28">
          <Row label="Approach">
            <Reveal by="block" trigger="mount" delay={0.5}>
              <p className="max-w-[24ch] font-sans text-3xl font-medium leading-[1.08] tracking-tight text-fg md:text-5xl">
                {profile.vision.lines.join(" ")}{" "}
                <span className="text-fg-dim">{profile.vision.answer.join(" ")}</span>
              </p>
            </Reveal>
            <p className="hud mt-5 text-fg-dim">{profile.vision.english}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <TransitionLink href="/experience" className="pill">
                Experience &amp; education
                <ArrowUpRight size={12} />
              </TransitionLink>
              <TransitionLink href="/work" className="pill">
                Selected work
                <ArrowUpRight size={12} />
              </TransitionLink>
            </div>

            <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_440px] lg:gap-16">
              <div className="flex max-w-[70ch] flex-col gap-6">
                {profile.about.map((para) => (
                  <p key={para} className="font-sans text-[17px] leading-relaxed text-fg/90">
                    {para}
                  </p>
                ))}
                <div className="mt-2 flex flex-wrap gap-x-8 gap-y-2 hud">
                  <a href={socials.github} target="_blank" rel="noreferrer" className="text-fg hover:text-violet-soft">GitHub ↗</a>
                  <a href={socials.linkedin} target="_blank" rel="noreferrer" className="text-fg hover:text-violet-soft">LinkedIn ↗</a>
                  <a href={`mailto:${socials.email}`} className="text-fg hover:text-violet-soft">{socials.email}</a>
                </div>
              </div>
              <figure className="lg:sticky lg:top-28 lg:self-start">
                <div className="overflow-hidden rounded-[3px] border border-rule">
                  <Image
                    src="/shiven.jpg"
                    alt="Shiven Khurdi"
                    width={1040}
                    height={1075}
                    className="h-auto w-full object-cover grayscale-[0.2]"
                    priority
                  />
                </div>
                <figcaption className="hud mt-3 flex justify-between text-fg-faint">
                  <span>Boston, MA</span>
                  <span>{profile.role}</span>
                </figcaption>
              </figure>
            </div>
          </Row>

          <Row label="Profile">
            <dl className="grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Name", profile.name],
                ["Role", profile.status],
                ["Location", `${profile.location} · ${profile.locationNote}`],
                ["Education", education.map((e) => `${e.degree}, ${e.school}`).join(" / ")],
                ["Focus", "LLM systems, agents, evaluation, ML engineering"],
                ["Email", socials.email],
                ["Phone", socials.phone],
              ].map(([k, v]) => (
                <div key={k} className="border-t border-rule pt-3">
                  <dt className="hud text-fg-faint">{k}</dt>
                  <dd className="mt-1 font-sans text-[15px] text-fg">{v}</dd>
                </div>
              ))}
            </dl>
          </Row>

          <Row label="Affiliations">
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {affiliations.map((a) => (
                <li key={a.name} className="flex flex-col gap-2">
                  <div
                    className="grid aspect-square place-items-center rounded-[3px] border border-rule p-7"
                    style={{ background: a.plate === "dark" ? "#121217" : "#e9e9e6" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.logo} alt={a.name} loading="lazy" decoding="async" className="max-h-full max-w-full object-contain" />
                  </div>
                  <span className="hud text-fg-dim">
                    {a.name} <span className="text-fg-faint">· {a.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Row>

          <Row label="Updates">
            <ul className="flex flex-col">
              {updates.map((u) => (
                <li key={u.title} className="grid gap-1 border-t border-rule py-4 md:grid-cols-[200px_1fr] md:gap-10">
                  <span className="hud text-fg-dim">{u.date}</span>
                  {u.href ? (
                    <a href={u.href} target="_blank" rel="noreferrer noopener" className="font-sans text-[15px] text-fg hover:text-violet-soft">
                      {u.title}
                    </a>
                  ) : (
                    <span className="font-sans text-[15px] text-fg">{u.title}</span>
                  )}
                </li>
              ))}
            </ul>
          </Row>
        </div>
      </div>
      <div className="relative z-10 pb-6">
        <Footer />
      </div>
    </div>
  );
}
