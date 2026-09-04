"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { navigateWithTransition } from "./PageTransition";

type Props = ComponentProps<typeof Link>;

export default function TransitionLink({ href, onClick, ...rest }: Props) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    const url = typeof href === "string" ? href : href.pathname ?? "";
    const internal = url.startsWith("/") && !url.startsWith("//");
    if (
      !internal ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0
    )
      return;
    e.preventDefault();
    navigateWithTransition(url);
  };
  return <Link href={href} onClick={handle} {...rest} />;
}
