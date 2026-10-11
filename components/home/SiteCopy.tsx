"use client";

import { site as fallbackSite } from "@/content/site";

type SiteCopyProps = {
  children: (site: typeof fallbackSite) => React.ReactNode;
};

export function SiteCopy({ children }: SiteCopyProps) {
  return <>{children(fallbackSite)}</>;
}
