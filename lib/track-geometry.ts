export type Point = { x: number; y: number };

/** Geometric centerline segments. */
export type TrackSegment =
  | { type: "move"; to: Point }
  | { type: "line"; to: Point }
  | {
      type: "arc";
      to: Point;
      radius: number;
      /** 1 = clockwise, 0 = counter-clockwise */
      sweep: 0 | 1;
      large?: 0 | 1;
    };

export type TrackDefinition = {
  id: string;
  name: string;
  segments: TrackSegment[];
  viewBox: string;
  /** Default stroke color for this design */
  color: string;
  closed?: boolean;
};

function dist(a: Point, b: Point) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function unitNormal(from: Point, to: Point): Point {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: -dy / len, y: dx / len };
}

/**
 * Offset a polyline+arc centerline into a parallel lane path.
 * Lanes are true offsets (arc radius ± offset), not stacked duplicates.
 */
function normalForMove(
  segments: TrackSegment[],
  index: number,
  cursor: Point,
): Point {
  const next = segments[index + 1];
  if (next && (next.type === "line" || next.type === "arc")) {
    return unitNormal(cursor, next.to);
  }
  return { x: 0, y: -1 };
}

export function buildLanePath(
  segments: TrackSegment[],
  offset: number,
): string {
  if (segments.length === 0) return "";

  const parts: string[] = [];
  let cursor: Point | null = null;

  for (let i = 0; i < segments.length; i += 1) {
    const seg = segments[i];

    if (seg.type === "move") {
      cursor = seg.to;
      const n = normalForMove(segments, i, cursor);
      parts.push(`M ${cursor.x + n.x * offset} ${cursor.y + n.y * offset}`);
      continue;
    }

    if (!cursor) continue;

    if (seg.type === "line") {
      const n = unitNormal(cursor, seg.to);
      const end = {
        x: seg.to.x + n.x * offset,
        y: seg.to.y + n.y * offset,
      };
      parts.push(`L ${end.x} ${end.y}`);
      cursor = seg.to;
      continue;
    }

    if (seg.type === "arc") {
      const large = seg.large ?? 0;
      const sweep = seg.sweep;
      const mid = {
        x: (cursor.x + seg.to.x) / 2,
        y: (cursor.y + seg.to.y) / 2,
      };
      const chord = dist(cursor, seg.to);
      const r = Math.max(seg.radius, chord / 2 + 0.001);
      const h = Math.sqrt(Math.max(0, r * r - (chord / 2) * (chord / 2)));
      const nx = (seg.to.y - cursor.y) / (chord || 1);
      const ny = (cursor.x - seg.to.x) / (chord || 1);
      const side = sweep === 1 ? 1 : -1;
      const cx = mid.x + nx * h * side;
      const cy = mid.y + ny * h * side;

      const signedOffset = sweep === 1 ? -offset : offset;
      const rOut = Math.max(1, r + signedOffset);

      const endAng = Math.atan2(seg.to.y - cy, seg.to.x - cx);
      const end = {
        x: cx + Math.cos(endAng) * rOut,
        y: cy + Math.sin(endAng) * rOut,
      };

      parts.push(`A ${rOut} ${rOut} 0 ${large} ${sweep} ${end.x} ${end.y}`);
      cursor = seg.to;
    }
  }

  return parts.join(" ");
}

export function laneOffsets(
  laneCount: number,
  laneWidth: number,
  laneGap: number,
) {
  const spacing = laneWidth + laneGap;
  const mid = (laneCount - 1) / 2;
  return Array.from({ length: laneCount }, (_, i) => (i - mid) * spacing);
}

export function buildAllLanePaths(
  segments: TrackSegment[],
  laneCount: number,
  laneWidth: number,
  laneGap: number,
) {
  return laneOffsets(laneCount, laneWidth, laneGap).map((offset) =>
    buildLanePath(segments, offset),
  );
}

export const TRACK_COLORS = {
  bg: "#FFFDFA",
  mustard: "#F2A93B",
  lavender: "#D5CBE0",
  lavenderLight: "#EDE6F3",
  plum: "#7B4A68",
  forest: "#2E3B2B",
  peach: "#FBE7D3",
} as const;

/**
 * Closed stadium / racetrack oval — primary design file.
 * Three-lane centerline; use offsets for parallel lanes.
 * Oriented like a running track (long sides + semicircle caps).
 */
export const OVAL_LOOP: TrackDefinition = {
  id: "oval-loop",
  name: "Oval Loop",
  color: TRACK_COLORS.mustard,
  closed: true,
  viewBox: "0 0 480 280",
  segments: [
    { type: "move", to: { x: 120, y: 56 } },
    { type: "line", to: { x: 360, y: 56 } },
    {
      type: "arc",
      to: { x: 360, y: 224 },
      radius: 84,
      sweep: 1,
    },
    { type: "line", to: { x: 120, y: 224 } },
    {
      type: "arc",
      to: { x: 120, y: 56 },
      radius: 84,
      sweep: 1,
    },
  ],
};

/**
 * Track A — vertical through the oval interior (one of "the 2").
 * Placement decided later; geometry is fixed as a design asset.
 */
export const TRACK_VERTICAL: TrackDefinition = {
  id: "track-vertical",
  name: "Vertical Sweep",
  color: TRACK_COLORS.lavender,
  viewBox: "0 0 480 280",
  segments: [
    { type: "move", to: { x: 240, y: -20 } },
    { type: "line", to: { x: 240, y: 300 } },
  ],
};

/**
 * Track B — horizontal through the oval interior (the other of "the 2").
 */
export const TRACK_HORIZONTAL: TrackDefinition = {
  id: "track-horizontal",
  name: "Horizontal Sweep",
  color: TRACK_COLORS.plum,
  viewBox: "0 0 480 280",
  segments: [
    { type: "move", to: { x: -20, y: 140 } },
    { type: "line", to: { x: 500, y: 140 } },
  ],
};

/** Short decorative corner for page headers. */
export const CORNER_SWEEP: TrackDefinition = {
  id: "corner-sweep",
  name: "Corner Sweep",
  color: TRACK_COLORS.mustard,
  viewBox: "0 0 120 80",
  segments: [
    { type: "move", to: { x: 8, y: 8 } },
    { type: "line", to: { x: 48, y: 8 } },
    {
      type: "arc",
      to: { x: 88, y: 48 },
      radius: 40,
      sweep: 1,
    },
    { type: "line", to: { x: 112, y: 72 } },
  ],
};

/** Straight timeline lane. */
export const TIMELINE_TRACK: TrackDefinition = {
  id: "timeline",
  name: "Timeline",
  color: TRACK_COLORS.mustard,
  viewBox: "0 0 400 24",
  segments: [
    { type: "move", to: { x: 8, y: 12 } },
    { type: "line", to: { x: 392, y: 12 } },
  ],
};

/** Footer sweep. */
export const FOOTER_SWEEP: TrackDefinition = {
  id: "footer-sweep",
  name: "Footer Sweep",
  color: TRACK_COLORS.mustard,
  viewBox: "0 0 400 80",
  segments: [
    { type: "move", to: { x: -10, y: 60 } },
    { type: "line", to: { x: 80, y: 40 } },
    {
      type: "arc",
      to: { x: 200, y: 40 },
      radius: 60,
      sweep: 0,
    },
    { type: "line", to: { x: 420, y: 20 } },
  ],
};

/** All authored track designs (for export / gallery). */
export const TRACK_DESIGNS = [
  OVAL_LOOP,
  TRACK_VERTICAL,
  TRACK_HORIZONTAL,
  CORNER_SWEEP,
  TIMELINE_TRACK,
  FOOTER_SWEEP,
] as const;

/** @deprecated — use OVAL_LOOP */
export const HERO_MUSTARD_TRACK = OVAL_LOOP;
/** @deprecated */
export const HERO_SUPPORT_TRACK = TRACK_VERTICAL;
/** @deprecated */
export const HERO_GHOST_TRACK = TRACK_HORIZONTAL;
