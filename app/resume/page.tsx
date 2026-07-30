import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Download, FileText } from "lucide-react";

import { profile, socials } from "@/lib/data";

const FILE = socials.resumeFile;
const DOWNLOAD_NAME = "Shiven-Khurdi-Resume.pdf";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé of ${profile.name} — ${profile.role} based in ${profile.location}. Read it inline or download the PDF.`,
  alternates: { canonical: "/resume" },
  openGraph: {
    type: "profile",
    url: "/resume",
    title: `Résumé · ${profile.name}`,
    description: `Résumé of ${profile.name} — ${profile.role}.`,
  },
};

const GHOST_BUTTON =
  "inline-flex items-center gap-1.5 rounded-full border border-line bg-ink/70 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-paper backdrop-blur transition-colors hover:border-lime hover:text-lime";

const SOLID_BUTTON =
  "inline-flex items-center gap-1.5 rounded-full bg-lime px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:bg-lime-soft";

/**
 * Shown by the browser whenever it refuses to render the PDF inline — the
 * exact case that made a direct link to /Shiven_CV.pdf look like a dead page.
 */
function ViewerFallback() {
  return (
    <div className="flex h-full w-full min-w-0 flex-1 flex-col items-center justify-center gap-6 px-5 py-14 text-center sm:px-6 sm:py-16">
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-line text-lime">
        <FileText size={22} />
      </span>

      <div className="w-full min-w-0">
        <h2 className="text-balance font-display text-lg font-semibold text-paper sm:text-2xl">
          Your browser won&apos;t display PDFs inline
        </h2>
        <p className="mx-auto mt-3 max-w-md text-pretty text-sm leading-relaxed text-paper-dim">
          That&apos;s a browser setting, not a broken file. Open the résumé in a
          new tab or download it — both work everywhere.
        </p>
      </div>

      <div className="flex w-full min-w-0 flex-col items-stretch gap-2.5 sm:w-auto sm:flex-row sm:items-center sm:justify-center">
        <a
          href={FILE}
          download={DOWNLOAD_NAME}
          className={`${SOLID_BUTTON} justify-center`}
        >
          Download PDF <Download size={14} />
        </a>
        <a
          href={FILE}
          target="_blank"
          rel="noopener noreferrer"
          className={`${GHOST_BUTTON} justify-center`}
        >
          Open in new tab <ArrowUpRight size={14} />
        </a>
      </div>
    </div>
  );
}

export default function ResumePage() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-x-clip bg-ink md:h-[100dvh] md:overflow-hidden">
      {/* w-[70vh] would be ~650px on a tall phone, so cap it against the
          viewport width; overflow-x-clip above is the backstop. */}
      <div
        className="glow left-1/2 top-[-20%] h-[40vh] w-[min(70vh,90vw)] -translate-x-1/2 opacity-40 sm:h-[50vh]"
        style={{ background: "rgba(198,255,58,0.12)" }}
        aria-hidden
      />

      <header className="relative z-10 shrink-0 border-b border-line px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <Link
              href="/"
              className="group inline-flex shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-wider text-paper-dim transition-colors hover:text-lime"
            >
              <ArrowLeft
                size={14}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
              Back
            </Link>

            <span className="h-8 w-px shrink-0 bg-line" />

            <div className="min-w-0 leading-tight">
              <div className="eyebrow">Résumé</div>
              <div className="truncate font-display text-lg font-bold tracking-tight text-paper">
                {profile.name}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:ml-auto">
            <a
              href={FILE}
              target="_blank"
              rel="noopener noreferrer"
              className={GHOST_BUTTON}
            >
              Open PDF <ArrowUpRight size={14} />
            </a>
            <a href={FILE} download={DOWNLOAD_NAME} className={SOLID_BUTTON}>
              Download <Download size={14} />
            </a>
          </div>
        </div>
      </header>

      <div
        className="relative z-10 flex min-h-0 flex-1 flex-col px-5 py-5 sm:px-8 sm:py-6"
        data-lenis-prevent
      >
        <div className="mx-auto flex w-full min-h-0 max-w-[1200px] flex-1 flex-col overflow-hidden rounded-xl border border-line bg-surface/40">
          {/*
            <object> rather than <iframe>: globals.css disables pointer events
            on every iframe while Lenis is active, which would freeze the PDF
            viewer. Its children render only when the embed fails.
          */}
          <object
            data={`${FILE}#view=FitH`}
            type="application/pdf"
            aria-label={`Résumé of ${profile.name}`}
            className="hidden h-full w-full md:block"
          >
            <ViewerFallback />
          </object>

          {/*
            Mobile browsers largely refuse to render embedded PDFs (iOS Safari
            shows page one, unscrollable), so skip the embed and offer the two
            actions that always work.
          */}
          <div className="flex flex-1 flex-col md:hidden">
            <ViewerFallback />
          </div>
        </div>
      </div>
    </div>
  );
}
