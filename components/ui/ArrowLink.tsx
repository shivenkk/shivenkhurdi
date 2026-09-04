import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import TransitionLink from "./TransitionLink";

export default function ArrowLink({
  href,
  label,
  sub,
  external,
  className = "",
  size = "md",
}: {
  href: string;
  label: string;
  sub?: string;
  external?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const inner = (
    <>
      <span className="flex flex-col">
        <span
          className={
            size === "lg"
              ? "font-sans text-2xl font-medium tracking-tight md:text-3xl"
              : size === "md"
                ? "font-sans text-base font-medium"
                : "hud text-fg"
          }
        >
          {label}
        </span>
        {sub && <span className="hud mt-0.5 text-fg-faint">{sub}</span>}
      </span>
      <span className="grid size-8 shrink-0 place-items-center rounded-full border border-rule transition-all duration-500 ease-[var(--ease-expo)] group-hover:border-fg group-hover:bg-fg group-hover:text-bg">
        <ArrowUpRight size={14} weight="regular" />
      </span>
    </>
  );
  const cls = `group inline-flex items-center gap-4 ${
    size === "lg" ? "w-full justify-between border-b border-rule pb-3" : ""
  } ${className}`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <TransitionLink href={href} className={cls}>
      {inner}
    </TransitionLink>
  );
}
