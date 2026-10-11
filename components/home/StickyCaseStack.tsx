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
        const imageLeft = index % 2 === 0;
        const blobs = [
          "bg-peach",
          "bg-lavender-light",
          "bg-[color-mix(in_srgb,var(--accent)_22%,var(--bg))]",
        ];

        return (
          <article
            key={study.slug}
            className={cn(
              "sticky top-0 flex min-h-[100svh] items-center border-t border-border/60 bg-bg",
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
              <div
                className={cn(
                  "relative",
                  imageLeft ? "md:order-1" : "md:order-2",
                )}
              >
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute left-1/2 top-1/2 h-[min(70%,28rem)] w-[min(90%,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 blur-0",
                    blobs[index % blobs.length],
                  )}
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

              <div
                className={cn(
                  "relative max-w-xl",
                  imageLeft ? "md:order-2" : "md:order-1",
                )}
              >
                <p className="text-eyebrow text-text-muted">
                  {study.category} · 0{index + 1}
                </p>
                <h2 className="mt-5 text-h1">
                  <Link
                    href={`/work/${study.slug}`}
                    className="link-highlight link-highlight-lg text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    {study.title}
                  </Link>
                </h2>
                <p className="mt-5 text-body text-text-muted">{study.summary}</p>
                <p className="mt-8">
                  <Link
                    href={`/work/${study.slug}`}
                    className="inline-flex items-center gap-3 text-eyebrow tracking-[0.12em] text-text transition-transform duration-[120ms] ease-out hover:translate-x-1"
                  >
                    Read case study
                    <span aria-hidden>→</span>
                  </Link>
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
