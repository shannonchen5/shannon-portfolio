"use client";

import { useEffect } from "react";
import type { CaseStudyBrand as BrandId } from "@/content/case-studies/_schema";

type CaseStudyBrandProps = {
  brand?: BrandId;
};

/** Applies a case-study brand to <html> so nav, body, and content share tokens. */
export function CaseStudyBrand({ brand }: CaseStudyBrandProps) {
  useEffect(() => {
    if (!brand) return;
    const root = document.documentElement;
    root.setAttribute("data-brand", brand);
    return () => {
      root.removeAttribute("data-brand");
    };
  }, [brand]);

  return null;
}
