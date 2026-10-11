"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { CaseStudySection } from "@/content/case-studies/_schema";
import { RunnerSprite } from "@/components/home/RunnerSprite";
import { cn } from "@/lib/cn";

type ProgressTimelineProps = {
  sections: CaseStudySection[];
  children: React.ReactNode;
};

function checkpointFromProgress(value: number, count: number) {
  if (count <= 0) return { idx: 0, x: 0.5 };
  const idx = Math.min(count - 1, Math.max(0, Math.floor(value * count)));
  // Center of equal-width column i → (i + 0.5) / n  (matches CSS grid arches)
  return { idx, x: (idx + 0.5) / count };
}

export function ProgressTimeline({ sections, children }: ProgressTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const checkpointTarget = useMotionValue(0);
  const runnerX = useSpring(checkpointTarget, {
    stiffness: reduced ? 500 : 140,
    damping: reduced ? 40 : 22,
    mass: 0.6,
  });

  useEffect(() => {
    const { idx, x } = checkpointFromProgress(
      scrollYProgress.get(),
      sections.length,
    );
    setActiveIndex(idx);
    checkpointTarget.set(x);
  }, [sections.length, scrollYProgress, checkpointTarget]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const { idx, x } = checkpointFromProgress(value, sections.length);
    setActiveIndex(idx);
    checkpointTarget.set(x);
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
          <div className="relative h-[4.25rem]">
            {/* Race track — runner runs along this, under the arches */}
            <div className="absolute inset-x-0 top-[2.35rem] h-[3px] rounded-full bg-[#1a1a1a]/35" />

            {/* Runner under arches (lower z) — centered on each equal grid column */}
            <RunnerOnTrack x={runnerX} reduced={!!reduced} />

            {/* Arches sit above the runner */}
            <ol
              className="relative z-20 grid h-full"
              style={{
                gridTemplateColumns: `repeat(${Math.max(sections.length, 1)}, minmax(0, 1fr))`,
              }}
            >
              {sections.map((section, index) => {
                const isActive = index === activeIndex;
                const isPassed = index < activeIndex;
                return (
                  <li
                    key={section.id}
                    className="relative flex justify-center"
                  >
                    <button
                      type="button"
                      onClick={() => scrollToSection(section.id)}
                      className="group flex min-h-11 w-full flex-col items-center gap-0.5"
                      aria-label={`Jump to ${section.title}`}
                      aria-current={isActive ? "true" : undefined}
                    >
                      <CheckpointArch active={isActive} passed={isPassed} />
                      <span
                        className={cn(
                          "hidden max-w-[4.75rem] truncate text-[10px] font-medium tracking-wide md:block",
                          isActive ? "text-text" : "text-text-muted",
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

          <p className="mt-0.5 text-sm font-medium text-text md:hidden">
            {labels[activeIndex]}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}

/** Mini race START arch with checkered leg bases — runner passes through the opening. */
function CheckpointArch({
  active,
  passed,
}: {
  active: boolean;
  passed: boolean;
}) {
  const checkId = `arch-check-${useId().replace(/:/g, "")}`;

  return (
    <span
      className={cn(
        "relative block h-11 w-10 shrink-0 transition-transform duration-200",
        active || passed ? "scale-110" : "scale-100 group-hover:scale-105",
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 40 44"
        className="h-full w-full overflow-visible"
        shapeRendering="geometricPrecision"
      >
        <defs>
          <pattern
            id={checkId}
            width="4"
            height="4"
            patternUnits="userSpaceOnUse"
          >
            <rect width="4" height="4" fill="#fff" />
            <rect width="2" height="2" fill="#1a1a1a" />
            <rect x="2" y="2" width="2" height="2" fill="#1a1a1a" />
          </pattern>
        </defs>

        {/* Arch body (hollow portal) */}
        <path
          fillRule="evenodd"
          d="M3 42 V18 L9 6 H31 L37 18 V42 H29 V20 L26 12 H14 L11 20 V42 H3 Z"
          fill="#ffffff"
          stroke="#1a1a1a"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Checkered bands at base of each pillar */}
        <rect
          x="3.75"
          y="32"
          width="7.5"
          height="10"
          fill={`url(#${checkId})`}
          stroke="#1a1a1a"
          strokeWidth="1"
        />
        <rect
          x="28.75"
          y="32"
          width="7.5"
          height="10"
          fill={`url(#${checkId})`}
          stroke="#1a1a1a"
          strokeWidth="1"
        />

        {/* Active marker on top beam */}
        {active ? (
          <rect x="14" y="7.5" width="12" height="2.5" rx="1" fill="#1a1a1a" />
        ) : null}
      </svg>
    </span>
  );
}

function RunnerOnTrack({
  x,
  reduced,
}: {
  x: MotionValue<number>;
  reduced: boolean;
}) {
  const left = useTransform(x, (v) => `${v * 100}%`);
  const bobY = useTransform(x, (v) => Math.sin(v * Math.PI * 12) * 1.5);

  return (
    <motion.span
      className="pointer-events-none absolute top-[1.15rem] z-10"
      style={{ left, y: reduced ? 0 : bobY }}
      aria-hidden
    >
      {/* -translate-x-1/2 centers the sprite on the column midpoint */}
      <span className="relative block -translate-x-1/2 drop-shadow-sm">
        <RunnerSprite color="#1a1a1a" className="mx-auto h-7 w-5" />
      </span>
    </motion.span>
  );
}
