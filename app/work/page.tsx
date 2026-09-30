import type { Metadata } from "next";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { projects } from "@/lib/data";
import PageHeading from "@/components/ui/PageHeading";
import Footer from "@/components/ui/Footer";
import WorkGrid from "@/components/work/WorkGrid";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects: LLM pretraining, agent evaluation, routing, forecasting, and computer vision.",
};

export default function WorkPage() {
  return (
    <div className="stage-grid min-h-[100dvh]">
      <div className="relative z-10 px-5 md:px-10">
        <PageHeading title="Work" />

        <section className="mt-12 grid gap-4 border-t border-rule pt-6 md:mt-16 md:grid-cols-[180px_1fr] md:gap-10">
          <h2 className="hud-label pt-1">Research</h2>
          <div>
            <p className="max-w-[60ch] font-sans text-lg leading-snug text-fg md:text-xl">
              The AgentRelBench paper was accepted as a poster at the NeurIPS 2026 workshop “Who Verifies the
              Agents? Toward Reliable Agent Development” (Sydney, December 2026), and sqlpup is open source, with an
              official entry on the BIRD leaderboard. In both, the headline finding went against what I was hoping
              for, and the write-ups say so.
            </p>
            <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
              {projects
                .filter((p) => p.tags.includes("Research") && (p.links.paper || p.links.code))
                .slice(0, 2)
                .map((p) => (
                  <li key={p.id} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-sans text-[15px] font-medium text-fg">{p.title}</span>
                    <span className="hud text-fg-faint">{p.metric.value} {p.metric.label}</span>
                    {p.links.paper && (
                      <a href={p.links.paper} target="_blank" rel="noreferrer noopener" className="chip text-fg hover:border-fg">
                        arXiv <ArrowUpRight size={11} className="ml-1" />
                      </a>
                    )}
                    {p.links.code && (
                      <a href={p.links.code} target="_blank" rel="noreferrer noopener" className="chip text-fg hover:border-fg">
                        Code <ArrowUpRight size={11} className="ml-1" />
                      </a>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        </section>

        <div className="mt-16 md:mt-20">
          <WorkGrid />
        </div>
      </div>
      <div className="relative z-10 pb-6">
        <Footer />
      </div>
    </div>
  );
}
