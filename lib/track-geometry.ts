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
  /**
   * Prebuilt lane paths. Used when the centerline is a smooth squiggle and
   * the lanes are a constant-distance offset, so they stay parallel.
   */
  lanePaths?: readonly string[];
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

function squiggleCenterline(count = 280): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < count; i += 1) {
    const theta = (i / count) * Math.PI * 2;
    // Four lobes, plus a slower swell, so the loop changes direction more often.
    const wave =
      1 +
      0.17 * Math.sin(4 * theta + 0.35) +
      0.055 * Math.sin(2 * theta + 1.1);
    points.push({
      x: 240 + 146 * wave * Math.cos(theta),
      y: 140 + 84 * wave * Math.sin(theta),
    });
  }
  return points;
}

/** Offset a closed polyline by a constant distance so lanes stay parallel. */
function offsetClosedPath(points: Point[], offset: number): string {
  const count = points.length;
  const fmt = (value: number) => Math.round(value * 100) / 100;
  const shifted = points.map((point, index) => {
    const prev = points[(index - 1 + count) % count];
    const next = points[(index + 1) % count];
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const length = Math.hypot(dx, dy) || 1;
    return {
      x: point.x + (-dy / length) * offset,
      y: point.y + (dx / length) * offset,
    };
  });
  return `M ${fmt(shifted[0].x)} ${fmt(shifted[0].y)} ${shifted
    .slice(1)
    .map((point) => `L ${fmt(point.x)} ${fmt(point.y)}`)
    .join(" ")} Z`;
}

/**
 * Wavy closed loop with a single sharp point. Shifted so the hole's center
 * sits at the viewBox center, which is what gets pinned to a photo corner.
 */
function cornerSquiggle(): Point[] {
  const count = 220;
  const spikeAt = -0.85;
  const half = 0.55;
  const points: Point[] = [];
  for (let index = 0; index < count; index += 1) {
    const theta = (index / count) * Math.PI * 2;
    let delta = theta - spikeAt;
    while (delta > Math.PI) delta -= Math.PI * 2;
    while (delta < -Math.PI) delta += Math.PI * 2;
    let radius =
      1 +
      0.22 * Math.sin(2 * theta + 0.4) +
      0.1 * Math.sin(3 * theta + 1.2);
    const u = Math.abs(delta) / half;
    if (u < 1) radius += 0.42 * (1 - u) ** 2;
    points.push({
      x: radius * Math.cos(theta),
      y: radius * Math.sin(theta) * 0.8,
    });
  }

  let area = 0;
  let cx = 0;
  let cy = 0;
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    const cross = current.x * next.y - next.x * current.y;
    area += cross;
    cx += (current.x + next.x) * cross;
    cy += (current.y + next.y) * cross;
  }
  area /= 2;
  cx /= 6 * area;
  cy /= 6 * area;
  for (const point of points) {
    point.x -= cx;
    point.y -= cy;
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const point of points) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }
  const scale = Math.min(400 / (maxX - minX), 210 / (maxY - minY));
  return points.map((point) => ({
    x: 240 + point.x * scale,
    y: 140 + point.y * scale,
  }));
}

const CORNER_SQUIGGLE_POINTS = cornerSquiggle();

const SQUIGGLE_POINTS = squiggleCenterline();

/**
 * Closed squiggle in the oval's viewBox. Lanes are a fixed offset of one
 * centerline, so the gap between them never changes.
 */
export const SQUIGGLE_LOOP: TrackDefinition = {
  id: "squiggle-loop",
  name: "Squiggle Loop",
  color: TRACK_COLORS.mustard,
  closed: true,
  viewBox: "0 0 480 280",
  segments: [
    { type: "move", to: SQUIGGLE_POINTS[0] },
    ...SQUIGGLE_POINTS.slice(1).map(
      (to): TrackSegment => ({ type: "line", to }),
    ),
    { type: "line", to: SQUIGGLE_POINTS[0] },
  ],
  lanePaths: laneOffsets(3, 7, 7).map((offset) =>
    offsetClosedPath(SQUIGGLE_POINTS, offset),
  ),
};

export const CORNER_SQUIGGLE: TrackDefinition = {
  id: "corner-squiggle",
  name: "Corner Squiggle",
  color: TRACK_COLORS.mustard,
  closed: true,
  viewBox: "0 0 480 280",
  segments: [
    { type: "move", to: CORNER_SQUIGGLE_POINTS[0] },
    ...CORNER_SQUIGGLE_POINTS.slice(1).map(
      (to): TrackSegment => ({ type: "line", to }),
    ),
    { type: "line", to: CORNER_SQUIGGLE_POINTS[0] },
  ],
  lanePaths: laneOffsets(3, 7, 7).map((offset) =>
    offsetClosedPath(CORNER_SQUIGGLE_POINTS, offset),
  ),
};

/** All authored track designs (for export / gallery). */
export const TRACK_DESIGNS = [
  OVAL_LOOP,
  SQUIGGLE_LOOP,
  CORNER_SQUIGGLE,
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
