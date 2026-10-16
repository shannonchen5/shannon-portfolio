"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { CaseStudy } from "@/content/case-studies/_schema";
import { PreviewMedia } from "@/components/case-study/PreviewMedia";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type StickyCaseStackProps = {
  studies: CaseStudy[];
  /** Sticky section label. Omit it when the page hero already names the section. */
  title?: string;
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
  const headerRef = useRef<HTMLDivElement>(null);
  const lastCardRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [lastCardHeight, setLastCardHeight] = useState<number | null>(null);
  const [reachedHeader, setReachedHeader] = useState<boolean[]>([]);

  useLayoutEffect(() => {
    const card = lastCardRef.current;
    if (!card || reduced) return;

    const measure = () => setLastCardHeight(card.getBoundingClientRect().height);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(card);
    return () => observer.disconnect();
  }, [reduced, studies]);

  useLayoutEffect(() => {
    if (reduced) return;

    let frame = 0;
    const measure = () => {
      const headerBottom =
        headerRef.current?.getBoundingClientRect().bottom ?? 64;
      const next = studies.map((_, index) => {
        if (index === 0) return false;
        const top = cardRefs.current[index]?.getBoundingClientRect().top;
        if (top == null) return false;
        return top <= headerBottom + 1;
      });
      setReachedHeader((prev) =>
        prev.length === next.length && prev.every((value, index) => value === next[index])
          ? prev
          : next,
      );
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced, studies]);

  if (studies.length === 0) return null;

  return (
    <div className="relative">
      {title ? (
        reduced ? (
          <div className="flex h-16 items-center border-t border-border bg-bg">
            <CaseStudiesHeading title={title} />
          </div>
        ) : (
          <>
            {/* Ends with the last study, so the title holds while that study is seated, then leaves with it. */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-40"
              style={{ bottom: lastCardHeight ?? "100svh" }}
            >
              <div
                ref={headerRef}
                className="pointer-events-auto sticky top-16 flex h-16 items-center border-t border-border bg-bg"
              >
                <CaseStudiesHeading title={title} />
              </div>
            </div>
            <div className="h-16" aria-hidden />
          </>
        )
      ) : null}
      <section aria-label="Featured case studies" className="relative">
      {studies.map((study, index) => {
        const isLast = index === studies.length - 1;
        return (
          <article
            key={study.slug}
            ref={(node) => {
              cardRefs.current[index] = node;
              if (isLast) lastCardRef.current = node;
            }}
            data-brand={study.brand}
            className={cn(
              "flex items-start bg-bg",
              reduced
                ? "relative top-auto"
                : "relative md:sticky md:min-h-[100svh]",
              !reduced && (title ? "md:top-32" : "md:top-16"),
              index > 0 &&
                (reduced || !reachedHeader[index]) &&
                "border-t border-border/60",
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
                  <PreviewMedia
                    study={study}
                    aspectRatio="4 / 3"
                    className="relative shadow-[var(--shadow-warm)]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </Link>
              </div>
            </div>
          </article>
        );
      })}
      {/* Keeps the last study seated under the header, then the whole stack can leave. */}
      {reduced ? null : <div aria-hidden className="hidden h-[36vh] md:block" />}
    </section>
    </div>
  );
}
