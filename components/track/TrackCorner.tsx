import { Track } from "@/components/track/Track";
import { CORNER_SWEEP } from "@/lib/track-geometry";
import { cn } from "@/lib/cn";

const PAGE_COLORS = {
  mustard: "#F2A93B",
  lavender: "#D5CBE0",
  plum: "#7B4A68",
  peach: "#FBE7D3",
} as const;

type TrackCornerProps = {
  color?: keyof typeof PAGE_COLORS;
  className?: string;
  ghost?: boolean;
};

export function TrackCorner({
  color = "mustard",
  className,
  ghost = false,
}: TrackCornerProps) {
  return (
    <Track
      segments={CORNER_SWEEP.segments}
      viewBox={CORNER_SWEEP.viewBox}
      color={PAGE_COLORS[color]}
      ghost={ghost}
      laneWidth={3}
      laneGap={3}
      className={cn("h-16 w-28 sm:h-20 sm:w-36", className)}
      ariaHidden
    />
  );
}
