import type { CSSProperties } from "react";

export function NablaMark({
  className,
  style,
  title = "nabla mark",
}: {
  className?: string;
  style?: CSSProperties;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 86"
      className={className}
      style={style}
      role={title ? "img" : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M0 0h100L50 86 0 0Zm25.5 14L50 56.4 74.5 14h-49Z"
      />
    </svg>
  );
}

export default function Wordmark({
  className = "",
  size = "1em",
}: {
  className?: string;
  size?: string;
}) {
  return (
    <span
      className={`inline-flex items-baseline font-display font-extrabold uppercase leading-none tracking-[-0.02em] ${className}`}
      style={{ fontSize: size }}
      aria-label="Shiven"
    >
      <span aria-hidden>SHI</span>
      <NablaMark
        className="mx-[0.03em] inline-block h-[0.74em] w-auto translate-y-[0.02em]"
        title=""
      />
      <span aria-hidden>EN</span>
    </span>
  );
}
