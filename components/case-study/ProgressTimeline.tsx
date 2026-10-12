"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CaseStudySection } from "@/content/case-studies/_schema";
import { RunnerSprite } from "@/components/home/RunnerSprite";
import { cn } from "@/lib/cn";

type ProgressTimelineProps = {
  sections: CaseStudySection[];
  children: React.ReactNode;
};

function checkpointCenter(index: number, count: number) {
  if (count <= 0) return 0.5;
  return (index + 0.5) / count;
}

/** Scroll position where a heading's top meets the top of the page. */
function headingArrival(heading: HTMLElement, topLine: number) {
  return heading.getBoundingClientRect().top + window.scrollY - topLine;
}

export function ProgressTimeline({ sections, children }: ProgressTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showBar, setShowBar] = useState(false);
  const runnerX = useMotionValue(checkpointCenter(0, sections.length));
  const userScrolled = useRef(false);
  const holdUntil = useRef(0);

  useLayoutEffect(() => {
    if (window.location.hash) return;
    const previous = history.scrollRestoration;
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    holdUntil.current = performance.now() + 500;
    return () => {
      history.scrollRestoration = previous;
    };
  }, []);

  useEffect(() => {
    if (window.location.hash) return;
    const mark = () => {
      userScrolled.current = true;
    };
    window.addEventListener("wheel", mark, { passive: true });
    window.addEventListener("touchmove", mark, { passive: true });
    window.addEventListener("keydown", mark);
    return () => {
      window.removeEventListener("wheel", mark);
      window.removeEventListener("touchmove", mark);
      window.removeEventListener("keydown", mark);
    };
  }, []);

  useEffect(() => {
    const count = sections.length;
    if (count === 0) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const bar = barRef.current;
      const stickyTop = bar ? Number.parseFloat(getComputedStyle(bar).top) : 0;
      const topLine =
        bar && Number.isFinite(stickyTop) ? stickyTop + bar.offsetHeight : 0;
      const headings = sections.map((section) => {
        const root = document.getElementById(section.id);
        return root?.querySelector("h2") ?? root;
      });
      const arrivals = headings.map((heading) => {
        if (!(heading instanceof HTMLElement)) return 0;
        const margin =
          Number.parseFloat(getComputedStyle(heading).scrollMarginTop) || 0;
        return headingArrival(heading, Math.max(topLine, margin));
      });
      const scrollY = window.scrollY;
      const hash = window.location.hash !== "";
      const holding = !hash && !userScrolled.current && performance.now() < holdUntil.current;
      if (holding && scrollY !== 0) window.scrollTo(0, 0);
      const y = holding ? 0 : scrollY;
      const show = !holding && y > 0;
      setShowBar((current) => (current === show ? current : show));

      let arrived = 0;
      while (arrived < count - 1 && y >= arrivals[arrived + 1]) {
        arrived += 1;
      }

      const atFirst = y <= arrivals[0];
      const atLast = y >= arrivals[count - 1];
      let nextIndex = arrived;
      let x = checkpointCenter(arrived, count);

      if (atFirst) {
        nextIndex = 0;
        x = checkpointCenter(0, count);
      } else if (!atLast && !reduced) {
        const segmentStart = Math.max(arrivals[arrived], 0);
        const span = arrivals[arrived + 1] - segmentStart;
        const t = span > 0 ? (y - segmentStart) / span : 1;
        const from = checkpointCenter(arrived, count);
        const to = checkpointCenter(arrived + 1, count);
        x = from + (to - from) * Math.min(1, Math.max(0, t));
      }

      setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
      runnerX.set(x);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced, runnerX, sections]);

  const labels = useMemo(() => sections.map((s) => s.title), [sections]);

  const scrollToSection = (id: string) => {
    userScrolled.current = true;
    const el = document.getElementById(id);
    const heading = el?.querySelector("h2") ?? el;
    if (!heading) return;
    heading.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        ref={barRef}
        inert={showBar ? undefined : true}
        className={cn(
          "sticky top-16 z-30 border-b border-border bg-[color-mix(in_srgb,var(--bg)_94%,transparent)] backdrop-blur-md transition-[opacity,transform] duration-200 motion-reduce:transition-none",
          showBar
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-full opacity-0",
        )}
      >
        <div className="mx-auto w-full max-w-[var(--page-max)] px-[var(--page-gutter)] py-3">
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

/** Same stride spacing as the oval: one leg swap about every 15px of travel. */
const STRIDE_PX = 15;

function RunnerOnTrack({
  x,
  reduced,
}: {
  x: MotionValue<number>;
  reduced: boolean;
}) {
  const left = useTransform(x, (v) => `${v * 100}%`);
  const [frame, setFrame] = useState<0 | 1>(0);
  const rootRef = useRef<HTMLSpanElement>(null);
  const traveled = useRef(0);
  const lastX = useRef<number | null>(null);
  const settleTimer = useRef<number | null>(null);

  useMotionValueEvent(x, "change", (value) => {
    if (reduced) return;
    const width = rootRef.current?.offsetParent
      ? (rootRef.current.offsetParent as HTMLElement).clientWidth
      : 0;
    if (lastX.current === null || width <= 0) {
      lastX.current = value;
      return;
    }

    traveled.current += Math.abs(value - lastX.current) * width;
    lastX.current = value;
    const next = (Math.floor(traveled.current / STRIDE_PX) % 2) as 0 | 1;
    setFrame((current) => (current === next ? current : next));

    if (settleTimer.current !== null) window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => setFrame(0), 90);
  });

  useEffect(() => {
    return () => {
      if (settleTimer.current !== null) window.clearTimeout(settleTimer.current);
    };
  }, []);

  return (
    <motion.span
      ref={rootRef}
      className="pointer-events-none absolute z-10"
      style={{ left, top: "calc(2.35rem + 2px)" }}
      aria-hidden
    >
      <span className="block -translate-x-1/2 -translate-y-full">
        <RunnerSprite
          color="#1a1a1a"
          view="side"
          frame={reduced ? 0 : frame}
          className="h-8 w-8"
        />
      </span>
    </motion.span>
  );
}
