import React from "react";
import Link from "next/link";

export const ButtonLink = ({ className, href, as, children }: any) => (
  <Link href={href} as={as} prefetch>
    <a className={className}>{children}</a>
  </Link>
);
