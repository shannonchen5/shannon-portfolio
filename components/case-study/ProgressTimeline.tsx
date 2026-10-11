"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useMemo, useRef, useState } from "react";
import type { CaseStudySection } from "@/content/case-studies/_schema";
import { cn } from "@/lib/cn";

type ProgressTimelineProps = {
  sections: CaseStudySection[];
  children: React.ReactNode;
};

export function ProgressTimeline({ sections, children }: ProgressTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [passed, setPassed] = useState<boolean[]>(() =>
    sections.map(() => false),
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const runnerX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const idx = Math.min(
      sections.length - 1,
      Math.max(0, Math.floor(value * sections.length)),
    );
    setActiveIndex(idx);
    setPassed((prev) => {
      const next = prev.map((was, i) => was || i <= idx);
      if (next.every((v, i) => v === prev[i])) return prev;
      return next;
    });
  });

  const labels = useMemo(() => sections.map((s) => s.title), [sections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="sticky top-16 z-30 border-b border-border bg-[color-mix(in_srgb,var(--bg)_94%,transparent)] backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-5 py-3 sm:px-8">
          <div className="relative h-12">
            <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-border" />
            <motion.div
              className="absolute left-0 top-1/2 h-1 origin-left -translate-y-1/2 rounded-full bg-accent"
              style={{ scaleX: runnerX }}
            />
            <RunnerFollow x={runnerX} reduced={!!reduced} />

            <ol className="relative z-10 flex h-full items-center justify-between">
              {sections.map((section, index) => {
                const isActive = index === activeIndex;
                const isPassed = passed[index];
                return (
                  <li key={section.id} className="relative flex justify-center">
                    <button
                      type="button"
                      onClick={() => scrollToSection(section.id)}
                      className="group flex min-h-11 min-w-11 flex-col items-center justify-center gap-1"
                      aria-label={`Jump to ${section.title}`}
                      aria-current={isActive ? "true" : undefined}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors duration-200",
                          isPassed || isActive
                            ? "border-accent bg-accent text-text-on-accent"
                            : "border-border bg-surface text-text-muted group-hover:border-plum group-hover:text-plum",
                        )}
                      >
                        {isPassed ? (
                          <Checkmark animate={!reduced} />
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span
                        className={cn(
                          "hidden max-w-20 truncate text-[10px] font-medium tracking-wide md:block",
                          isActive ? "text-plum" : "text-text-muted",
                        )}
                      >
                        {section.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <p className="mt-1 text-sm font-medium text-text md:hidden">
            {labels[activeIndex]}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}

function RunnerFollow({
  x,
  reduced,
}: {
  x: MotionValue<number>;
  reduced: boolean;
}) {
  const left = useTransform(x, (v) => `${v * 100}%`);

  if (reduced) {
    return null;
  }

  return (
    <motion.span
      className="pointer-events-none absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
      style={{ left }}
      aria-hidden
    >
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" fill="#F2A93B" />
        <circle cx="15" cy="16" r="2" fill="#4A3548" />
        <circle cx="25" cy="16" r="2" fill="#4A3548" />
        <path
          d="M14 24c2 2 10 2 12 0"
          stroke="#4A3548"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </motion.span>
  );
}

function Checkmark({ animate }: { animate: boolean }) {
  return (
    <motion.svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      initial={animate ? { scale: 0.6, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      aria-hidden
    >
      <path
        d="M3 7.5l2.5 2.5L11 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}
