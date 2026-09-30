import type { Metadata } from "next";
import { education, experience, profile, skills, socials } from "@/lib/data";
import PageHeading from "@/components/ui/PageHeading";
import Footer from "@/components/ui/Footer";
import ArrowLink from "@/components/ui/ArrowLink";

export const metadata: Metadata = {
  title: "Experience",
  description: "Roles, education, and toolkit of Shiven Khurdi.",
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-rule pt-8 md:grid-cols-[180px_1fr] md:gap-10">
      <h2 className="hud-label pt-1">{label}</h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export default function ExperiencePage() {
  return (
    <div className="stage-grid min-h-[100dvh]">
      <div className="relative z-10 px-5 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <PageHeading title="Experience" />
          <div className="md:pb-3">
            <ArrowLink href={socials.resume} label="Résumé PDF" size="sm" />
          </div>
        </div>

        <section className="mt-12 grid gap-4 border-t border-rule pt-6 md:mt-16 md:grid-cols-[180px_1fr] md:gap-10">
          <h2 className="hud-label pt-1">Snapshot</h2>
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Now", `${experience[0].role}, ${experience[0].short}`],
              ["Studying", `${education[0].degree}, ${education[0].school} · ${education[0].gpa}`],
              ["Research", "Accepted poster, NeurIPS 2026 workshop · BIRD leaderboard entry"],
              ["Location", `${profile.location} · ${profile.locationNote}`],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="hud text-fg-faint">{k}</dt>
                <dd className="mt-1 font-sans text-[15px] leading-snug text-fg">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-16 flex flex-col gap-20 md:mt-20 md:gap-28">
          <nav className="flex flex-wrap gap-x-6 gap-y-2 hud" aria-label="Roles">
            {experience.map((x) => (
              <a key={x.id} href={`#${x.id}`} className="text-fg-dim hover:text-fg">
                {x.short} <span className="text-fg-faint">· {x.period}</span>
              </a>
            ))}
            <a href="#education" className="text-fg-dim hover:text-fg">
              Education
            </a>
            <a href="#toolkit" className="text-fg-dim hover:text-fg">
              Toolkit
            </a>
          </nav>

          <Row label="Roles">
            <ol className="flex flex-col">
              {experience.map((x) => (
                <li
                  key={x.id}
                  id={x.id}
                  className="grid scroll-mt-28 gap-4 border-t border-rule py-8 first:border-t-0 first:pt-0 md:grid-cols-[220px_1fr] md:gap-10"
                >
                  <div className="flex flex-col gap-3">
                    <div className="hud text-fg-dim">
                      {x.period}
                      <br />
                      <span className="text-fg-faint">{x.location}</span>
                    </div>
                    <div
                      className="grid aspect-[16/10] w-[150px] place-items-center rounded-[3px] border border-rule p-4"
                      style={{ background: x.plate === "dark" ? "#121217" : "#e9e9e6" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={x.logo} alt={x.company} loading="lazy" decoding="async" className="max-h-full max-w-full object-contain" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-sans text-2xl font-medium tracking-tight text-fg">
                      {x.company}
                      {x.current && <span className="hud ml-3 align-middle text-violet-soft">● current</span>}
                    </h2>
                    <p className="mt-1 font-sans text-base text-fg-dim">
                      {x.role}
                      {x.context ? ` · ${x.context}` : ""}
                    </p>
                    <p className="mt-4 max-w-[62ch] font-sans text-[17px] leading-relaxed text-fg">
                      {x.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {x.stats.map((st) => (
                        <span key={st} className="chip">
                          {st}
                        </span>
                      ))}
                    </div>
                    <ul className="mt-6 grid gap-4 lg:grid-cols-2">
                      {x.points.map((pt) => (
                        <li key={pt} className="border-t border-rule pt-3 font-sans text-[15px] leading-relaxed text-fg/85">
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </Row>

          <div id="education" className="scroll-mt-28">
            <Row label="Education">
              <ol className="grid gap-6 md:grid-cols-2">
                {education.map((e) => (
                  <li key={e.school} className="flex flex-col gap-3 rounded-[3px] border border-rule p-6">
                    <div className="flex items-center gap-4">
                      <div className="grid size-14 shrink-0 place-items-center rounded-[3px] bg-[#e9e9e6] p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={e.logo} alt={e.school} loading="lazy" decoding="async" className="max-h-full max-w-full object-contain" />
                      </div>
                      <div>
                        <h2 className="font-sans text-xl font-medium tracking-tight text-fg">{e.degree}</h2>
                        <p className="font-sans text-[15px] text-fg-dim">{e.school}</p>
                      </div>
                    </div>
                    <p className="hud text-fg-dim">
                      {e.period} · {e.location} · {e.gpa}
                    </p>
                    <div className="flex flex-wrap gap-2 border-t border-rule pt-3">
                      {e.coursework.map((c) => (
                        <span key={c} className="chip">
                          {c}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ol>
            </Row>
          </div>

          <div id="toolkit" className="scroll-mt-28">
            <Row label="Toolkit">
              <div className="grid gap-6 md:grid-cols-2">
                {skills.map((g) => (
                  <div key={g.group} className="border-t border-rule pt-4">
                    <p className="font-sans text-base font-medium text-fg">{g.group}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {g.items.map((s) => (
                        <span key={s} className="chip">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Row>
          </div>
        </div>
      </div>
      <div className="relative z-10 pb-6">
        <Footer />
      </div>
    </div>
  );
}
