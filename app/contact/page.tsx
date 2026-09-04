import type { Metadata } from "next";
import { profile, socials } from "@/lib/data";
import PageHeading from "@/components/ui/PageHeading";
import ArrowLink from "@/components/ui/ArrowLink";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Shiven Khurdi, or grab the résumé.",
};

export default function ContactPage() {
  return (
    <div className="stage-grid min-h-[100dvh]">
      <div className="relative z-10 px-5 md:px-10">
        <PageHeading lines={["Contact /", "Résumé"]} />
        <div className="mt-16 grid gap-16 border-t border-rule pt-10 md:mt-24 md:grid-cols-[1fr_1fr] md:gap-20">
          <div className="max-w-[46ch]">
            <p className="font-sans text-2xl font-medium leading-snug tracking-tight text-fg md:text-3xl">
              For roles, collaborations, and anything else, email is fastest.
            </p>
            <p className="mt-5 font-sans text-[16px] leading-relaxed text-fg-dim">
              {profile.status}. Based in {profile.location}, {profile.locationNote.toLowerCase()}. I usually reply
              within a day.
            </p>
            <dl className="mt-10 grid gap-4">
              {[
                ["Phone", socials.phone, socials.phoneHref],
                ["Location", `${profile.location} · ${profile.locationNote}`, ""],
              ].map(([k, v, href]) => (
                <div key={k} className="grid grid-cols-[110px_1fr] border-t border-rule pt-3">
                  <dt className="hud text-fg-faint">{k}</dt>
                  <dd className="font-sans text-[15px] text-fg">
                    {href ? (
                      <a href={href} className="hover:text-violet-soft">{v}</a>
                    ) : (
                      v
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col gap-8">
            <ArrowLink href={`mailto:${socials.email}`} label="Email" sub={socials.email} external size="lg" />
            <ArrowLink href={socials.linkedin} label="LinkedIn" sub="linkedin.com/in/shivenkhurdi" external size="lg" />
            <ArrowLink href={socials.github} label="GitHub" sub="github.com/shivenkk" external size="lg" />
            <div className="mt-6">
              <p className="hud mb-6 text-fg-dim">The current résumé, as a PDF. Opens in a page with a download link.</p>
              <ArrowLink href={socials.resume} label="Résumé" sub="Shiven_CV.pdf" size="lg" />
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 pb-6 pt-24">
        <Footer />
      </div>
    </div>
  );
}
