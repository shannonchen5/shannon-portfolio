"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  buildAllLanePaths,
  type TrackSegment,
} from "@/lib/track-geometry";
import { cn } from "@/lib/cn";

export type TrackProps = {
  segments: TrackSegment[];
  viewBox: string;
  lanes?: number;
  laneWidth?: number;
  laneGap?: number;
  color?: string;
  opacity?: number;
  rotation?: number;
  className?: string;
  /** Ghost peach decorative variant */
  ghost?: boolean;
  /** Draw-on entrance via stroke-dashoffset */
  draw?: boolean;
  drawDuration?: number;
  /** Pause draw / ignore when offscreen */
  paused?: boolean;
  /** Expose lane path elements via callback for runners */
  onLanePathsReady?: (paths: SVGPathElement[]) => void;
  ariaHidden?: boolean;
  style?: React.CSSProperties;
};

export function Track({
  segments,
  viewBox,
  lanes = 3,
  laneWidth = 4,
  laneGap = 4,
  color = "#F2A93B",
  opacity = 1,
  rotation = 0,
  className,
  ghost = false,
  draw = false,
  drawDuration = 1.2,
  paused = false,
  onLanePathsReady,
  ariaHidden = true,
  style,
}: TrackProps) {
  const reduced = useReducedMotion();
  const uid = useId();
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [drawn, setDrawn] = useState(!draw || !!reduced);
  const [inView, setInView] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  const stroke = ghost ? "#FBE7D3" : color;
  const strokeOpacity = ghost ? Math.min(opacity, 0.55) : opacity;

  const lanePaths = useMemo(
    () => buildAllLanePaths(segments, lanes, laneWidth, laneGap),
    [segments, lanes, laneWidth, laneGap],
  );

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const nodes = pathRefs.current.filter(Boolean) as SVGPathElement[];
    onLanePathsReady?.(nodes);
  }, [lanePaths, onLanePathsReady]);

  useEffect(() => {
    if (!draw || reduced || paused || !inView) {
      if (reduced || !draw) setDrawn(true);
      return;
    }

    const nodes = pathRefs.current.filter(Boolean) as SVGPathElement[];
    nodes.forEach((node) => {
      const length = node.getTotalLength();
      node.style.strokeDasharray = `${length}`;
      node.style.strokeDashoffset = `${length}`;
      node.getBoundingClientRect();
      node.style.transition = `stroke-dashoffset ${drawDuration}s ease-out`;
      node.style.strokeDashoffset = "0";
    });
    setDrawn(true);
  }, [draw, drawDuration, reduced, paused, inView, lanePaths]);

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      className={cn("overflow-visible", className)}
      style={{
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
        ...style,
      }}
      fill="none"
      aria-hidden={ariaHidden}
      data-track-drawn={drawn}
      data-track-id={uid}
    >
      {lanePaths.map((d, i) => (
        <path
          key={`${uid}-lane-${i}`}
          ref={(el) => {
            pathRefs.current[i] = el;
          }}
          d={d}
          stroke={stroke}
          strokeOpacity={strokeOpacity}
          strokeWidth={laneWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

/** Export lane centerline path strings for a definition. */
export function getTrackLanePathStrings(
  segments: TrackSegment[],
  lanes = 3,
  laneWidth = 4,
  laneGap = 4,
) {
  return buildAllLanePaths(segments, lanes, laneWidth, laneGap);
}
