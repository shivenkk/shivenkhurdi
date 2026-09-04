import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { projects } from "@/lib/data";
import PosterCanvas from "./PosterCanvas";

export default function WorkGrid() {
  return (
    <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2">
      {projects.map((p) => (
        <article key={p.id} className="group flex flex-col">
          <div className="relative overflow-hidden rounded-[3px] border border-rule">
            <PosterCanvas project={p} className="transition-transform duration-1000 ease-[var(--ease-expo)] group-hover:scale-[1.03]" />
          </div>
          <div className="hud mt-4 flex items-center justify-between gap-4 text-fg-faint">
            <span>{p.date}</span>
            <span className="truncate">[{p.tags.join(", ")}]</span>
          </div>
          <h2 className="mt-2 font-sans text-xl font-medium tracking-tight text-fg">{p.title}</h2>
          <p className="font-sans text-sm text-fg-dim">{p.subtitle}</p>
          <p className="mt-3 max-w-[62ch] font-sans text-[15px] leading-relaxed text-fg-dim">{p.description}</p>
          <ul className="mt-4 flex flex-col gap-2 border-t border-rule pt-3">
            {p.highlights.slice(0, 3).map((h) => (
              <li key={h} className="flex gap-3 font-sans text-[13.5px] leading-relaxed text-fg-dim">
                <span className="mt-[9px] size-1 shrink-0 rounded-full bg-fg-faint" aria-hidden />
                <span>{h}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            {p.links.code && (
              <a href={p.links.code} target="_blank" rel="noreferrer noopener" className="hud inline-flex items-center gap-1.5 text-fg hover:underline">
                Code <ArrowUpRight size={12} />
              </a>
            )}
            {p.links.paper && (
              <a href={p.links.paper} target="_blank" rel="noreferrer noopener" className="hud inline-flex items-center gap-1.5 text-fg hover:underline">
                Paper <ArrowUpRight size={12} />
              </a>
            )}
            {p.links.live && (
              <a href={p.links.live} target="_blank" rel="noreferrer noopener" className="hud inline-flex items-center gap-1.5 text-fg hover:underline">
                Live <ArrowUpRight size={12} />
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
