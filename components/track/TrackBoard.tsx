"use client";

import { useMemo } from "react";
import { InterlaceCrossing } from "@/components/track/InterlaceCrossing";
import { LaneRunner } from "@/components/track/LaneRunner";
import {
  OVAL_LOOP,
  TRACK_COLORS,
  TRACK_HORIZONTAL,
  TRACK_VERTICAL,
  buildAllLanePaths,
  type TrackSegment,
} from "@/lib/track-geometry";

const LANE_W = 8;
const LANE_G = 8;
const CELL = LANE_W + LANE_G;

type TrackBoardProps = {
  className?: string;
  runners?: boolean;
  paused?: boolean;
  reducedMotion?: boolean;
  showVertical?: boolean;
  showHorizontal?: boolean;
  showOval?: boolean;
  showWeave?: boolean;
};

/**
 * Live vector composition matching design/tracks/04-oval-around-the-two.svg
 * Mustard oval loops around the lavender + plum pair.
 */
export function TrackBoard({
  className,
  runners = false,
  paused = false,
  reducedMotion = false,
  showVertical = true,
  showHorizontal = true,
  showOval = true,
  showWeave = true,
}: TrackBoardProps) {
  const ovalLanes = useMemo(
    () => buildAllLanePaths(OVAL_LOOP.segments, 3, LANE_W, LANE_G),
    [],
  );

  return (
    <svg
      viewBox={OVAL_LOOP.viewBox}
      className={className}
      role="img"
      aria-label="Three-lane oval track looping around two crossing tracks"
    >
      {showVertical ? (
        <InlineLanes segments={TRACK_VERTICAL.segments} color={TRACK_COLORS.lavender} />
      ) : null}
      {showHorizontal ? (
        <InlineLanes
          segments={TRACK_HORIZONTAL.segments}
          color={TRACK_COLORS.plum}
        />
      ) : null}

      {showWeave ? (
        <InterlaceCrossing
          x={240 - (CELL * 3) / 2}
          y={140 - (CELL * 3) / 2}
          cell={CELL}
          color={TRACK_COLORS.forest}
        />
      ) : null}

      {showOval ? (
        <InlineLanes segments={OVAL_LOOP.segments} color={TRACK_COLORS.mustard} />
      ) : null}

      {runners && showOval
        ? ovalLanes.map((d, i) => (
            <LaneRunner
              key={i}
              pathD={d}
              label={`Runner in lane ${i + 1} — press to run a lap`}
              color={TRACK_COLORS.plum}
              speed={3 + i * 0.2}
              paused={paused || reducedMotion}
              size={18}
            />
          ))
        : null}
    </svg>
  );
}

function InlineLanes({
  segments,
  color,
}: {
  segments: TrackSegment[];
  color: string;
}) {
  const paths = useMemo(
    () => buildAllLanePaths(segments, 3, LANE_W, LANE_G),
    [segments],
  );

  return (
    <g fill="none">
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke={color}
          strokeWidth={LANE_W}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}
