"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Action } from "./action";

export namespace Link {
  export type Props = Omit<Action.Props, "is"> & {
    href: string;
    variant?: Action.Props["variant"];
    size?: Action.Props["size"];
    children: ReactNode;
    [key: string]: unknown;
  };
}

export function Link({
  variant = "text",
  size = "md",
  ...props
}: Link.Props): React.ReactNode {
  return <Action {...props} is={NextLink} variant={variant} size={size} />;
}

export function ActiveLink({
  href,
  is,
  ...props
}: Link.Props): React.ReactNode {
  let pathname = usePathname();
  let isActive = pathname === href;

  if (isActive) {
    return <span {...props} />;
  }

  return <Link href={href} is={is} {...props} />;
}
