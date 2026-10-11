export type RunnerView = "side" | "front" | "back";

type RunnerArtProps = {
  color?: string;
  frame?: 0 | 1;
  flip?: boolean;
  view?: RunnerView;
};

type RunnerSpriteProps = RunnerArtProps & {
  className?: string;
};

const PAPER = "#FFFDFA";

/**
 * Heading is atan2(dy, dx) in screen space (0 = right, clockwise positive).
 * Rotation by that angle plants her feet and points her body out from a
 * clockwise oval. The view swaps as she turns the ends.
 */
export function poseFromHeading(radians: number): {
  view: RunnerView;
  lean: number;
} {
  const lean = (radians * 180) / Math.PI;
  const sin = Math.sin(radians);
  const view: RunnerView = sin > 0.45 ? "front" : sin < -0.45 ? "back" : "side";
  return { view, lean };
}

export function RunnerSprite({
  color = "#1a1a1a",
  className,
  frame = 0,
  flip = false,
  view = "side",
}: RunnerSpriteProps) {
  return (
    <svg viewBox="-42 -70 84 76" className={className} aria-hidden>
      <RunnerGlyph color={color} frame={frame} flip={flip} view={view} />
    </svg>
  );
}

/** Feet sit on the local origin so a parent can pin that point to a track. */
export function RunnerGlyph({
  color = "#1a1a1a",
  frame = 0,
  flip = false,
  view = "side",
}: RunnerArtProps) {
  return (
    <g transform={flip ? "scale(-1 1)" : undefined}>
      {view === "front" ? (
        <FrontDoodle color={color} frame={frame} />
      ) : view === "back" ? (
        <BackDoodle color={color} frame={frame} />
      ) : (
        <SideDoodle color={color} frame={frame} />
      )}
    </g>
  );
}

function ink(color: string, width = 6) {
  return {
    fill: "none" as const,
    stroke: color,
    strokeWidth: width,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

function SideDoodle({ color, frame }: { color: string; frame: 0 | 1 }) {
  const line = ink(color);
  const thin = ink(color, 2.3);
  const frontPlanted = frame === 0;

  return (
    <g>
      <path d="M24 -42 l7 -5 M26 -35 l8 -1 M24 -28 l7 5" {...thin} />
      <path d="M-24 -4 l-7 2 M-22 2 l-8 1" {...thin} />

      {frontPlanted ? (
        <>
          <path d="M-1 -26 C -10 -20 -18 -14 -20 -7" {...line} />
          <path d="M-20 -7 l-4 1" {...line} />
          <path d="M1 -26 C 8 -18 6 -10 1 -2" {...line} />
          <path d="M1 -2 l5 0" {...line} />
        </>
      ) : (
        <>
          <path d="M-1 -26 C -8 -16 -5 -8 -1 -2" {...line} />
          <path d="M-1 -2 l-5 0" {...line} />
          <path d="M1 -26 C 10 -18 18 -12 20 -5" {...line} />
          <path d="M20 -5 l4 -1" {...line} />
        </>
      )}

      <path d="M-7 -28 h14" {...ink(color, 6.5)} />
      <path d="M0 -30 C 3 -38 8 -42 10 -46" {...line} />
      <path d="M6 -42 C 14 -40 18 -34 15 -27" {...line} />
      <path d="M3 -40 C -6 -38 -12 -32 -9 -25" {...line} />

      <circle
        cx="12"
        cy="-52"
        r="8.4"
        fill={PAPER}
        stroke={color}
        strokeWidth="3.6"
      />
      <path
        d="M6 -56c-2 -10 -12 -10 -12 -2c-5 -2 -6 5 -2 6c-4 3 -2 8 3 7"
        fill={color}
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M-8 -64 l-5 -3" {...thin} />
      <circle cx="14.2" cy="-53.2" r="0.95" fill={color} stroke="none" />
      <circle cx="17.4" cy="-52.6" r="0.95" fill={color} stroke="none" />
      <path d="M14.4 -48.6 q 2.3 2.1 4.6 0.2" {...ink(color, 1.35)} />
    </g>
  );
}

function FrontDoodle({ color, frame }: { color: string; frame: 0 | 1 }) {
  const line = ink(color);
  const lead = frame === 0;

  return (
    <g>
      {lead ? (
        <>
          <path d="M-2 -26 C -8 -18 -8 -10 -5 -2" {...line} />
          <path d="M-5 -2 l-4 0" {...line} />
          <path d="M2 -26 C 6 -16 5 -8 2 -2" {...line} />
          <path d="M2 -2 l4 0" {...line} />
        </>
      ) : (
        <>
          <path d="M-2 -26 C -6 -16 -5 -8 -2 -2" {...line} />
          <path d="M-2 -2 l-4 0" {...line} />
          <path d="M2 -26 C 8 -18 8 -10 5 -2" {...line} />
          <path d="M5 -2 l4 0" {...line} />
        </>
      )}

      <path d="M-8 -28 h16" {...ink(color, 6.5)} />
      <path d="M0 -30 V -44" {...line} />
      <path d="M0 -40 C -8 -38 -14 -32 -12 -24" {...line} />
      <path d="M0 -40 C 8 -36 12 -30 8 -23" {...line} />

      <circle
        cx="0"
        cy="-52"
        r="8.4"
        fill={PAPER}
        stroke={color}
        strokeWidth="3.6"
      />
      <path
        d="M-6 -56c0 -9 12 -9 12 0c4 -1 6 5 2 7"
        fill={color}
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="-2.4" cy="-52.4" r="0.95" fill={color} stroke="none" />
      <circle cx="2.6" cy="-52.4" r="0.95" fill={color} stroke="none" />
      <path d="M-2.2 -48 q 2.4 2.2 4.8 0" {...ink(color, 1.35)} />
    </g>
  );
}

function BackDoodle({ color, frame }: { color: string; frame: 0 | 1 }) {
  const line = ink(color);
  const lead = frame === 0;

  return (
    <g>
      {lead ? (
        <>
          <path d="M-2 -26 C -9 -18 -8 -10 -4 -2" {...line} />
          <path d="M-4 -2 l-4 0" {...line} />
          <path d="M2 -26 C 7 -16 6 -8 3 -2" {...line} />
          <path d="M3 -2 l4 0" {...line} />
        </>
      ) : (
        <>
          <path d="M-2 -26 C -7 -16 -6 -8 -3 -2" {...line} />
          <path d="M-3 -2 l-4 0" {...line} />
          <path d="M2 -26 C 9 -18 8 -10 4 -2" {...line} />
          <path d="M4 -2 l4 0" {...line} />
        </>
      )}

      <path d="M-8 -28 h16" {...ink(color, 6.5)} />
      <path d="M0 -30 V -44" {...line} />
      <path d="M-1 -40 C -10 -36 -14 -30 -11 -23" {...line} />
      <path d="M1 -40 C 10 -36 14 -30 11 -23" {...line} />

      <circle
        cx="0"
        cy="-52"
        r="8.4"
        fill={PAPER}
        stroke={color}
        strokeWidth="3.6"
      />
      <path
        d="M-7 -54c-1 -11 15 -11 14 0c5 0 6 7 1 8c-2 6 -12 6 -15 0c-4 1 -6 -5 0 -8z"
        fill={color}
      />
      <path d="M8 -62c6 -2 10 2 8 6" {...ink(color, 3.2)} />
    </g>
  );
}
