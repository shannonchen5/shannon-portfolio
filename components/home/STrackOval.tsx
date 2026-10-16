"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { LaneRunner } from "@/components/track/LaneRunner";
import {
  OVAL_LOOP,
  TRACK_COLORS,
  buildAllLanePaths,
  type TrackDefinition,
} from "@/lib/track-geometry";

const LANE_W = 7;
const LANE_G = 7;

type STrackOvalProps = {
  runners?: boolean;
  /** Letters stay on for the hero. The about photos use the track alone. */
  letters?: boolean;
  /** Closed loop. Defaults to the hero oval. */
  track?: TrackDefinition;
  /** Where the runner rests, as a fraction of the lap. */
  rest?: number;
  /** Standing pose. Used only while she is still. */
  restPose?: { lean: number; view?: "side" | "front" | "back" };
};

/**
 * Mustard oval around the S and h.
 * The track paints in front of the h and behind the S.
 */
export function STrackOval({
  runners = true,
  letters = true,
  track = OVAL_LOOP,
  rest = 0.26,
  restPose,
}: STrackOvalProps) {
  const reduced = useReducedMotion();
  const [inView, setInView] = useState(true);
  const [lap, setLap] = useState(0);
  const [fit, setFit] = useState(1);
  const rootRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<HTMLSpanElement>(null);
  const fitRef = useRef(1);
  const started = useRef(false);

  const lanes = useMemo(
    () =>
      track.lanePaths
        ? [...track.lanePaths]
        : buildAllLanePaths(track.segments, 3, LANE_W, LANE_G),
    [track],
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

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !letters) return;

    const measure = () => {
      const frame = frameRef.current;
      if (!frame) return;
      const pad = 2;
      let minL = Infinity;
      root.querySelectorAll("path").forEach((node) => {
        const stroke = getComputedStyle(node).stroke;
        if (!stroke || stroke === "none" || stroke === "transparent") return;
        const box = node.getBoundingClientRect();
        if (!box.width && !box.height) return;
        minL = Math.min(minL, box.left);
      });
      if (!Number.isFinite(minL)) return;

      const bounds = frame.getBoundingClientRect();
      const center = bounds.left + bounds.width / 2;
      const current = fitRef.current;
      const naturalLeft = center + (minL - center) / current;
      const next =
        naturalLeft >= pad ? 1 : (pad - center) / (naturalLeft - center);
      if (!Number.isFinite(next) || next <= 0) return;
      if (Math.abs(next - current) < 0.01) return;
      fitRef.current = next;
      setFit(next);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [lanes, letters]);

  // Same placement as before: centered on the S and shifted right.
  // fit scales around that center so the oval does not run off the left edge.
  const frameBox: React.CSSProperties = letters
    ? {
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "1.7em",
        height: "1.7em",
        transformOrigin: "center center",
        transform: `translate(calc(-50% + 0.16em), calc(-50% - 0.08em)) scale(${fit})`,
      }
    : {
        position: "absolute",
        inset: 0,
      };
  const tilt: React.CSSProperties = {
    width: "100%",
    height: "100%",
    transform: "rotate(-28deg)",
    transformOrigin: "center center",
  };
  const lane = lanes[1] ?? lanes[0];

  return (
    <span
      ref={rootRef}
      className={
        letters
          ? "relative isolate inline-block align-baseline"
          : "relative block h-full w-full"
      }
    >
      <span className={letters ? "relative inline-block" : "relative block h-full w-full"}>
        <span
          ref={frameRef}
          aria-hidden
          className="pointer-events-none z-10"
          style={frameBox}
        >
          <span className="block" style={tilt}>
            <svg viewBox={track.viewBox} className="h-full w-full overflow-visible">
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
                  restPose={restPose}
                />
              ) : null}
            </svg>
          </span>
        </span>

        {letters ? <span className="relative z-20">S</span> : null}

        {runners ? (
          <span className="z-30" style={frameBox}>
            <span className="absolute inset-0" style={tilt}>
              <svg viewBox={track.viewBox} className="h-full w-full overflow-visible">
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
          </span>
        ) : null}
      </span>
      {letters ? <span className="relative z-0">h</span> : null}
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
