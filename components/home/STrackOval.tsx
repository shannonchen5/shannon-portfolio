"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
 * Mustard oval around the S and h.
 * The track sits behind the S and in front of the h.
 */
export function STrackOval({ runners = true }: STrackOvalProps) {
  const reduced = useReducedMotion();
  const [inView, setInView] = useState(true);
  const [lap, setLap] = useState(0);
  const rootRef = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  const lanes = useMemo(
    () => buildAllLanePaths(OVAL_LOOP.segments, 3, LANE_W, LANE_G),
    [],
  );

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
    if (reduced !== false || !inView || started.current) return;
    started.current = true;
    setLap(1);
  }, [reduced, inView]);

  // Shifted left of the S so the oval clears the “a” and enters the margin.
  const frameBox: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: "1.7em",
    height: "1.7em",
    transform: "translate(calc(-50% + 0.05em), -50%)",
  };
  const tilt: React.CSSProperties = {
    width: "100%",
    height: "100%",
    transform: "rotate(-28deg)",
    transformOrigin: "center center",
  };
  const lane = lanes[1] ?? lanes[0];
  // Rest on the top-right of the tilted oval.
  const rest = 0.26;

  return (
    <span ref={rootRef} className="relative inline-block align-baseline">
      <span className="relative inline-block">
        <span aria-hidden className="pointer-events-none z-0" style={frameBox}>
          <span className="block" style={tilt}>
            <svg viewBox={OVAL_LOOP.viewBox} className="h-full w-full overflow-visible">
              <OvalLanes paths={lanes} draw={!reduced} paused={!inView} />
              {runners ? (
                <LaneRunner
                  pathD={lane}
                  label="Runner on the track"
                  color="#1a1a1a"
                  speed={2.8}
                  paused={!inView || !!reduced}
                  size={78}
                  lapSignal={lap}
                  interactive={false}
                  rest={rest}
                />
              ) : null}
            </svg>
          </span>
        </span>

        <span className="relative z-10">S</span>

        <span className="z-20" style={frameBox}>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ clipPath: "inset(0 0 0 65%)" }}
          >
            <span className="block h-full w-full" style={tilt}>
              <svg viewBox={OVAL_LOOP.viewBox} className="h-full w-full overflow-visible">
                <OvalLanes paths={lanes} draw={!reduced} paused={!inView} />
                {runners ? (
                  <LaneRunner
                    pathD={lane}
                    label="Runner on the track"
                    color="#1a1a1a"
                    speed={2.8}
                    paused={!inView || !!reduced}
                    size={78}
                    lapSignal={lap}
                    interactive={false}
                    rest={rest}
                  />
                ) : null}
              </svg>
            </span>
          </span>
          {runners ? (
            <span className="absolute inset-0" style={tilt}>
              <svg viewBox={OVAL_LOOP.viewBox} className="h-full w-full overflow-visible">
                <path
                  d={lane}
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
              </svg>
            </span>
          ) : null}
        </span>
      </span>
      <span className="relative z-10">h</span>
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
