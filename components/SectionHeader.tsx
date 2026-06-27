import { RevealHeading } from "@/components/anim";

export default function SectionHeader({
  index,
  title,
  kicker,
  className,
}: {
  index: string;
  title: string;
  kicker?: string;
  className?: string;
}) {
  return (
    <div className={`mb-12 sm:mb-20 ${className ?? ""}`}>
      <div className="mb-6 flex items-center gap-4">
        <span className="font-mono text-xs text-lime">({index})</span>
        <span className="h-px w-12 bg-line sm:w-24" />
        {kicker && <span className="eyebrow">{kicker}</span>}
      </div>
      <RevealHeading
        text={title}
        as="h2"
        className="font-display text-[clamp(2.6rem,7vw,6rem)] font-bold leading-[0.9] tracking-tight text-paper"
      />
    </div>
  );
}
