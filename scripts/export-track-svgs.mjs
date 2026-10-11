/**
 * Generates real SVG design files from track geometry.
 * Run: node scripts/export-track-svgs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "design", "tracks");

const COLORS = {
  bg: "#FFFDFA",
  mustard: "#F2A93B",
  lavender: "#D5CBE0",
  lavenderLight: "#EDE6F3",
  plum: "#7B4A68",
  forest: "#2E3B2B",
  peach: "#FBE7D3",
};

const LANE_W = 10;
const LANE_G = 10;

function dist(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function unitNormal(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: -dy / len, y: dx / len };
}

function normalForMove(segments, index, cursor) {
  const next = segments[index + 1];
  if (next && (next.type === "line" || next.type === "arc")) {
    return unitNormal(cursor, next.to);
  }
  return { x: 0, y: -1 };
}

function buildLanePath(segments, offset) {
  const parts = [];
  let cursor = null;

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
      const startAng = Math.atan2(cursor.y - cy, cursor.x - cx);
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

function laneOffsets(count, width, gap) {
  const spacing = width + gap;
  const mid = (count - 1) / 2;
  return Array.from({ length: count }, (_, i) => (i - mid) * spacing);
}

function lanes(segments, count = 3) {
  return laneOffsets(count, LANE_W, LANE_G).map((o) =>
    buildLanePath(segments, o),
  );
}

function trackGroup(paths, color, id) {
  const body = paths
    .map(
      (d, i) =>
        `    <path id="${id}-lane-${i + 1}" d="${d}" fill="none" stroke="${color}" stroke-width="${LANE_W}" stroke-linecap="round" stroke-linejoin="round"/>`,
    )
    .join("\n");
  return `  <g id="${id}" data-track="${id}">\n${body}\n  </g>`;
}

function weaveSquares(x, y, cell, color) {
  const rects = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if ((r + c) % 2 !== 0) continue;
      rects.push(
        `    <rect x="${x + c * cell}" y="${y + r * cell}" width="${cell}" height="${cell}" fill="${color}"/>`,
      );
    }
  }
  return `  <g id="interlace" aria-hidden="true">\n${rects.join("\n")}\n  </g>`;
}

function svgDoc(viewBox, content, title) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="960" height="560" role="img" aria-labelledby="title desc">
  <title id="title">${title}</title>
  <desc id="desc">Vector track design for Shannon Chen portfolio. Three parallel lanes with rounded caps. Colors: mustard, lavender, plum, forest green on warm white.</desc>
  <rect width="100%" height="100%" fill="${COLORS.bg}"/>
${content}
</svg>
`;
}

// --- Designs ---

const oval = [
  { type: "move", to: { x: 120, y: 56 } },
  { type: "line", to: { x: 360, y: 56 } },
  { type: "arc", to: { x: 360, y: 224 }, radius: 84, sweep: 1 },
  { type: "line", to: { x: 120, y: 224 } },
  { type: "arc", to: { x: 120, y: 56 }, radius: 84, sweep: 1 },
];

const vertical = [
  { type: "move", to: { x: 240, y: -20 } },
  { type: "line", to: { x: 240, y: 300 } },
];

const horizontal = [
  { type: "move", to: { x: -20, y: 140 } },
  { type: "line", to: { x: 500, y: 140 } },
];

const cell = LANE_W + LANE_G;

fs.mkdirSync(outDir, { recursive: true });

// 1) Oval alone
fs.writeFileSync(
  path.join(outDir, "01-oval-loop.svg"),
  svgDoc(
    "0 0 480 280",
    trackGroup(lanes(oval), COLORS.mustard, "oval-loop"),
    "Oval Loop — mustard three-lane stadium track",
  ),
);

// 2) Vertical alone
fs.writeFileSync(
  path.join(outDir, "02-vertical.svg"),
  svgDoc(
    "0 0 480 280",
    trackGroup(lanes(vertical), COLORS.lavender, "track-vertical"),
    "Vertical Sweep — lavender three-lane track",
  ),
);

// 3) Horizontal alone
fs.writeFileSync(
  path.join(outDir, "03-horizontal.svg"),
  svgDoc(
    "0 0 480 280",
    trackGroup(lanes(horizontal), COLORS.plum, "track-horizontal"),
    "Horizontal Sweep — plum three-lane track",
  ),
);

// 4) Composition: oval loops around the 2 (vertical + horizontal)
const composition = [
  trackGroup(lanes(vertical), COLORS.lavender, "track-vertical"),
  trackGroup(lanes(horizontal), COLORS.plum, "track-horizontal"),
  weaveSquares(240 - (cell * 3) / 2, 140 - (cell * 3) / 2, cell, COLORS.forest),
  trackGroup(lanes(oval), COLORS.mustard, "oval-loop"),
].join("\n");

fs.writeFileSync(
  path.join(outDir, "04-oval-around-the-two.svg"),
  svgDoc(
    "0 0 480 280",
    composition,
    "Oval Loop around the two — mustard oval encircling lavender + plum tracks with forest weave at their crossing",
  ),
);

// 5) Ghost peach oval (decorative)
fs.writeFileSync(
  path.join(outDir, "05-oval-ghost.svg"),
  svgDoc(
    "0 0 480 280",
    trackGroup(lanes(oval), COLORS.peach, "oval-ghost"),
    "Oval Loop ghost — peach tint decorative variant",
  ),
);

console.log(`Wrote track design files to ${outDir}`);
for (const f of fs.readdirSync(outDir)) {
  console.log(`  - ${f}`);
}
