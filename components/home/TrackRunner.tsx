"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { RunnerSprite } from "./RunnerSprite";

export type TrackRunnerProps = {
  id: string;
  label: string;
  pathD: string;
  color?: string;
  /** Seconds for a full lap */
  speed?: number;
  viewBox?: string;
  className?: string;
  paused?: boolean;
};

type Point = { x: number; y: number };

function samplePath(
  path: SVGPathElement,
  t: number,
): { point: Point; angle: number } {
  const length = path.getTotalLength();
  const distance = ((t % 1) + 1) % 1 * length;
  const point = path.getPointAtLength(distance);
  const delta = 1;
  const ahead = path.getPointAtLength(Math.min(length, distance + delta));
  const angle =
    (Math.atan2(ahead.y - point.y, ahead.x - point.x) * 180) / Math.PI;
  return { point: { x: point.x, y: point.y }, angle };
}

export function TrackRunner({
  id,
  label,
  pathD,
  color = "#D4561C",
  speed = 2.8,
  viewBox = "0 0 400 160",
  className,
  paused = false,
}: TrackRunnerProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const reduced = useReducedMotion();
  const [running, setRunning] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const progress = useMotionValue(0);
  const idlePhase = useMotionValue(0);
  const lapStart = useRef<number | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  const scaleY = useTransform(idlePhase, (p) =>
    running || reduced ? 1 : 1 + Math.sin(p) * 0.04,
  );

  const updatePose = useCallback(
    (t: number) => {
      const path = pathRef.current;
      if (!path) return;
      const { point, angle } = samplePath(path, t);
      x.set(point.x);
      y.set(point.y);
      rotate.set(angle);
    },
    [rotate, x, y],
  );

  useEffect(() => {
    updatePose(0);
  }, [updatePose, pathD]);

  useAnimationFrame((time) => {
    if (paused || reduced) return;

    if (!running) {
      idlePhase.set(time / 280);
      return;
    }

    if (lapStart.current === null) {
      lapStart.current = time;
    }

    const elapsed = (time - lapStart.current) / 1000;
    const t = Math.min(1, elapsed / speed);
    progress.set(t);
    updatePose(t);

    if (t >= 1) {
      setRunning(false);
      lapStart.current = null;
      progress.set(0);
      updatePose(0);
      setCelebrating(true);
      window.setTimeout(() => setCelebrating(false), 700);
    }
  });

  const startLap = () => {
    if (running || reduced) return;
    setCelebrating(false);
    lapStart.current = null;
    setRunning(true);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      startLap();
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        id={id}
        aria-label={label}
        onClick={startLap}
        onKeyDown={onKeyDown}
        disabled={running}
        className="group relative block min-h-11 w-full rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-default"
      >
        <svg
          viewBox={viewBox}
          className="h-auto w-full overflow-visible"
          role="presentation"
        >
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="#E8DFCF"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="10 14"
            opacity="0.9"
          />

          <motion.g
            style={{
              x,
              y,
              rotate: reduced ? 0 : rotate,
              scaleY: reduced ? 1 : scaleY,
            }}
          >
            <g transform="translate(-20, -40)">
              <RunnerSprite color={color} />
            </g>
          </motion.g>
        </svg>

        {celebrating ? <ConfettiBurst /> : null}
      </button>
    </div>
  );
}

function ConfettiBurst() {
  const bits = [
    { x: -18, y: -28, rot: -20, color: "#D4561C" },
    { x: 8, y: -34, rot: 15, color: "#B84514" },
    { x: 20, y: -18, rot: 40, color: "#F8DFD0" },
    { x: -8, y: -12, rot: -35, color: "#D4561C" },
    { x: 14, y: -8, rot: 10, color: "#6B6257" },
  ];

  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
      {bits.map((bit, i) => (
        <motion.span
          key={i}
          className="absolute h-2 w-2 rounded-sm"
          style={{ backgroundColor: bit.color }}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
          animate={{
            opacity: 0,
            x: bit.x,
            y: bit.y,
            scale: 0.4,
            rotate: bit.rot,
          }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        />
      ))}
      <motion.span
        className="absolute"
        initial={{ scale: 0.8, y: 0 }}
        animate={{ scale: 1.15, y: -6 }}
        transition={{ type: "spring", stiffness: 380, damping: 12 }}
      />
    </span>
  );
}
