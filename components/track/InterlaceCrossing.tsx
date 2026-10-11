type InterlaceCrossingProps = {
  /** Top-left of the 3x3 weave grid in SVG user units */
  x: number;
  y: number;
  /** Size of one lane cell (≈ laneWidth + laneGap) */
  cell: number;
  /** Blend color for the weave squares */
  color: string;
  opacity?: number;
};

/**
 * Checker weave squares where two 3-lane tracks cross.
 * Alternating cells create the over/under interlacing look from the poster.
 */
export function InterlaceCrossing({
  x,
  y,
  cell,
  color,
  opacity = 1,
}: InterlaceCrossingProps) {
  const squares: React.ReactNode[] = [];
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const on = (row + col) % 2 === 0;
      if (!on) continue;
      squares.push(
        <rect
          key={`${row}-${col}`}
          x={x + col * cell}
          y={y + row * cell}
          width={cell}
          height={cell}
          fill={color}
          opacity={opacity}
        />,
      );
    }
  }
  return <g aria-hidden>{squares}</g>;
}
