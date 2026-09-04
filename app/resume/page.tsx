import type { Metadata } from "next";
import { socials } from "@/lib/data";
import PageHeading from "@/components/ui/PageHeading";
import ArrowLink from "@/components/ui/ArrowLink";

export const metadata: Metadata = {
  title: "Résumé",
  description: "Shiven Khurdi's résumé.",
};

export default function ResumePage() {
  return (
    <div className="stage-grid min-h-[100dvh]">
      <div className="relative z-10 px-5 pb-16 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <PageHeading title="Résumé" />
          <div className="flex items-center gap-8 md:pb-3">
            <ArrowLink href={socials.resumeFile} label="Open PDF" external size="sm" />
            <a href={socials.resumeFile} download className="hud text-fg hover:underline">
              Download
            </a>
          </div>
        </div>
        <div className="mt-12 overflow-hidden rounded-[3px] border border-rule bg-[#1a1a20]">
          <object
            data={socials.resumeFile}
            type="application/pdf"
            className="h-[80vh] w-full"
            aria-label="Résumé PDF"
          >
            <div className="p-10">
              <p className="font-sans text-fg-dim">
                Your browser cannot display the PDF inline.{" "}
                <a href={socials.resumeFile} className="text-fg underline">
                  Open it directly
                </a>
                .
              </p>
            </div>
          </object>
        </div>
      </div>
    </div>
  );
}
