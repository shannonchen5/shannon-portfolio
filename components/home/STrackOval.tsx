"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { LaneRunner } from "@/components/track/LaneRunner";
import {
  OVAL_LOOP,
  TRACK_COLORS,
  buildAllLanePaths,
} from "@/lib/track-geometry";

const LANE_W = 7;
const LANE_G = 7;

type STrackOvalProps = {
  runners?: boolean;
};

/**
 * Mustard oval track wrapped around the capital S at a mild tilt.
 * Back half renders behind the letter; front half renders in front.
 */
export function STrackOval({ runners = true }: STrackOvalProps) {
  const reduced = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const [inView, setInView] = useState(true);
  const [showRunners, setShowRunners] = useState(!!reduced);
  const [lap, setLap] = useState(0);
  const rootRef = useRef<HTMLSpanElement>(null);

  const lanes = useMemo(
    () => buildAllLanePaths(OVAL_LOOP.segments, 3, LANE_W, LANE_G),
    [],
  );

  const behindClip = `${uid}-behind`;
  const frontClip = `${uid}-front`;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) {
      setShowRunners(true);
      return;
    }
    const t = window.setTimeout(() => setShowRunners(true), 900);
    return () => window.clearTimeout(t);
  }, [reduced]);

  const frameStyle: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: "1.7em",
    height: "1.7em",
    transform: "translate(calc(-50% + 0.42em), -50%) rotate(-28deg)",
    transformOrigin: "center center",
  };

  return (
    <span ref={rootRef} className="relative inline-block align-baseline">
      {/* BACK — behind the S */}
      <span aria-hidden className="pointer-events-none z-0" style={frameStyle}>
        <svg
          viewBox={OVAL_LOOP.viewBox}
          className="h-full w-full overflow-visible"
        >
          <defs>
            <clipPath id={behindClip}>
              <rect x="0" y="0" width="480" height="148" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${behindClip})`}>
            <OvalLanes paths={lanes} draw={!reduced} paused={!inView} />
          </g>
        </svg>
      </span>

      <span className="relative z-10">S</span>

      {/* FRONT — in front of the S */}
      <span className="z-20" style={frameStyle}>
        <svg
          viewBox={OVAL_LOOP.viewBox}
          className="pointer-events-none h-full w-full overflow-visible"
        >
          <defs>
            <clipPath id={frontClip}>
              <rect x="0" y="132" width="480" height="148" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${frontClip})`}>
            <OvalLanes paths={lanes} draw={!reduced} paused={!inView} />
          </g>
          {runners && showRunners ? (
            <path
              d={lanes[1] ?? lanes[0]}
              fill="none"
              stroke="transparent"
              strokeWidth={46}
              className="cursor-pointer"
              style={{
                pointerEvents: reduced ? "none" : "stroke",
                outline: "none",
              }}
              role="button"
              tabIndex={reduced ? -1 : 0}
              aria-label="Run a lap around the track"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                if (reduced) return;
                setLap((n) => n + 1);
              }}
              onKeyDown={(event) => {
                if (reduced) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setLap((n) => n + 1);
                }
              }}
            />
          ) : null}
          {runners && showRunners ? (
            <LaneRunner
              pathD={lanes[1] ?? lanes[0]}
              label="Runner on the track"
              color="#1a1a1a"
              speed={2.8}
              paused={!inView || !!reduced}
              size={78}
              lapSignal={lap}
              interactive={false}
            />
          ) : null}
        </svg>
      </span>
    </span>
  );
}

function OvalLanes({
  paths,
  draw,
  paused,
}: {
  paths: string[];
  draw?: boolean;
  paused?: boolean;
}) {
  const reduced = useReducedMotion();
  const refs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    if (!draw || reduced || paused) return;
    refs.current.forEach((node) => {
      if (!node) return;
      const length = node.getTotalLength();
      node.style.strokeDasharray = `${length}`;
      node.style.strokeDashoffset = `${length}`;
      node.getBoundingClientRect();
      node.style.transition = "stroke-dashoffset 1.1s ease-out";
      node.style.strokeDashoffset = "0";
    });
  }, [draw, paused, reduced, paths]);

  return (
    <g fill="none">
      {paths.map((d, i) => (
        <path
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          d={d}
          stroke={TRACK_COLORS.mustard}
          strokeWidth={LANE_W}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}
