"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { CaseStudy } from "@/content/case-studies/_schema";
import { ParallaxMedia } from "@/components/ui/ParallaxMedia";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type StickyCaseStackProps = {
  studies: CaseStudy[];
  title: string;
};

function CaseStudiesHeading({ title }: { title: string }) {
  return (
    <div className="mx-auto w-full max-w-[var(--page-max)] px-[var(--page-gutter)]">
      <h2 className="text-h2 text-plum">{title}</h2>
    </div>
  );
}

export function StickyCaseStack({ studies, title }: StickyCaseStackProps) {
  const reduced = useReducedMotion();
  const lastCardRef = useRef<HTMLElement>(null);
  const [lastCardHeight, setLastCardHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const card = lastCardRef.current;
    if (!card || reduced) return;

    const measure = () => setLastCardHeight(card.getBoundingClientRect().height);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(card);
    return () => observer.disconnect();
  }, [reduced, studies]);

  if (studies.length === 0) return null;

  return (
    <div className="relative">
      {reduced ? (
        <div className="flex h-16 items-center border-t border-border bg-bg">
          <CaseStudiesHeading title={title} />
        </div>
      ) : (
        <>
          {/* Ends at the top of the last card, so the title unsticks once that card arrives. */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-40"
            style={{ bottom: lastCardHeight ?? "100svh" }}
          >
            <div className="pointer-events-auto sticky top-16 flex h-16 items-center border-t border-border bg-bg">
              <CaseStudiesHeading title={title} />
            </div>
          </div>
          <div className="h-16" aria-hidden />
        </>
      )}
      <section aria-label="Featured case studies" className="relative">
      {studies.map((study, index) => {
        const isLast = index === studies.length - 1;
        return (
          <article
            key={study.slug}
            ref={isLast ? lastCardRef : undefined}
            data-brand={study.brand}
            className={cn(
              "sticky top-32 flex min-h-[100svh] items-start bg-bg",
              index > 0 && "border-t border-border/60",
              reduced && "relative top-auto",
            )}
            style={
              reduced
                ? undefined
                : {
                    zIndex: index + 1,
                  }
            }
          >
            <div className="mx-auto grid w-full max-w-[var(--page-max)] items-center gap-10 px-[var(--page-gutter)] py-10 md:grid-cols-2 md:gap-14 md:py-14">
              {/* Text on left */}
              <div className="relative min-w-0 max-w-xl md:order-1">
                <h2 className="text-h1">
                  <Link
                    href={`/work/${study.slug}`}
                    className="link-highlight link-highlight-lg text-plum focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    {study.title}
                  </Link>
                </h2>
                <p className="mt-5 text-body text-text-muted">{study.summary}</p>
                <div className="mt-8">
                  <Button href={`/work/${study.slug}`}>Read case study</Button>
                </div>
              </div>

              {/* Image on right */}
              <div className="relative min-w-0 max-w-full md:order-2">
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
    </div>
  );
}
