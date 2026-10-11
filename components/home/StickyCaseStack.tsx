"use client";

import Link from "next/link";
import { useReducedMotion } from "motion/react";
import type { CaseStudy } from "@/content/case-studies/_schema";
import { ParallaxMedia } from "@/components/ui/ParallaxMedia";
import { cn } from "@/lib/cn";

type StickyCaseStackProps = {
  studies: CaseStudy[];
};

export function StickyCaseStack({ studies }: StickyCaseStackProps) {
  const reduced = useReducedMotion();

  if (studies.length === 0) return null;

  return (
    <section aria-label="Featured case studies" className="relative">
      {studies.map((study, index) => {
        return (
          <article
            key={study.slug}
            data-brand={study.brand}
            className={cn(
              "sticky top-0 flex min-h-[100svh] items-center bg-bg",
              index > 0 && "border-t border-border/60",
              reduced && "relative",
            )}
            style={
              reduced
                ? undefined
                : {
                    zIndex: index + 1,
                  }
            }
          >
            <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-24 sm:px-8 md:grid-cols-2 md:gap-14 md:py-28">
              {/* Text on left */}
              <div className="relative max-w-xl md:order-1">
                <h2 className="text-h1">
                  <Link
                    href={`/work/${study.slug}`}
                    className="link-highlight link-highlight-lg text-plum focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    {study.title}
                  </Link>
                </h2>
                <p className="mt-5 text-body text-text-muted">{study.summary}</p>
                <p className="mt-8">
                  <Link
                    href={`/work/${study.slug}`}
                    className="link-draw inline-flex items-center gap-3 text-eyebrow tracking-[0.12em] text-plum transition-transform duration-[120ms] ease-out hover:translate-x-1"
                  >
                    Read case study
                    <span aria-hidden>→</span>
                  </Link>
                </p>
              </div>

              {/* Image on right */}
              <div className="relative md:order-2">
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[min(70%,28rem)] w-[min(90%,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color-mix(in_srgb,var(--accent)_24%,var(--bg))] opacity-85 blur-0"
                  style={{ filter: "blur(2px)" }}
                />
                <Link
                  href={`/work/${study.slug}`}
                  className="relative block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  tabIndex={-1}
                  aria-hidden
                >
                  <ParallaxMedia
                    src={study.cover.src}
                    alt=""
                    aspectRatio={study.cover.aspectRatio ?? "4 / 3"}
                    className="relative shadow-[var(--shadow-warm)]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
