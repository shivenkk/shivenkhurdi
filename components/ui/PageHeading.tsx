import Reveal from "@/components/text/Reveal";

export default function PageHeading({
  title,
  lines,
  eyebrow,
}: {
  title?: string;
  lines?: string[];
  eyebrow?: string;
}) {
  const parts = lines ?? [title ?? ""];
  return (
    <div className="pt-[110px] md:pt-[128px]">
      {eyebrow && <p className="hud-label mb-4">{eyebrow}</p>}
      <h1 className="font-sans text-[44px] font-semibold leading-[0.95] tracking-[-0.03em] text-fg md:text-[76px]">
        {parts.map((l, i) => (
          <Reveal key={l} text={l} by="chars" as="span" className="block" trigger="mount" delay={0.15 + i * 0.12} />
        ))}
      </h1>
    </div>
  );
}
