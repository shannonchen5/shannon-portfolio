"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { RunnerSprite } from "@/components/home/RunnerSprite";

type LaneRunnerProps = {
  pathD: string;
  label: string;
  color?: string;
  speed?: number;
  paused?: boolean;
  size?: number;
};

export function LaneRunner({
  pathD,
  label,
  color = "#7B4A68",
  speed = 2.8,
  paused = false,
  size = 20,
}: LaneRunnerProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const reduced = useReducedMotion();
  const [running, setRunning] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const lapStart = useRef<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  const bob = useMotionValue(1);
  const uid = useId();

  const place = useCallback(
    (t: number) => {
      const path = pathRef.current;
      if (!path) return;
      const length = path.getTotalLength();
      if (!length) return;
      const d = ((t % 1) + 1) % 1 * length;
      const p = path.getPointAtLength(d);
      const ahead = path.getPointAtLength(Math.min(length, d + 1.5));
      x.set(p.x);
      y.set(p.y);
      rotate.set((Math.atan2(ahead.y - p.y, ahead.x - p.x) * 180) / Math.PI);
    },
    [rotate, x, y],
  );

  useEffect(() => {
    const id = requestAnimationFrame(() => place(0));
    return () => cancelAnimationFrame(id);
  }, [pathD, place]);

  useAnimationFrame((time) => {
    if (paused || reduced) return;

    if (!running) {
      bob.set(1 + Math.sin(time / 300) * 0.045);
      return;
    }

    if (lapStart.current === null) lapStart.current = time;
    const t = Math.min(1, (time - lapStart.current) / 1000 / speed);
    place(t);
    bob.set(1);

    if (t >= 1) {
      setRunning(false);
      lapStart.current = null;
      place(0);
      setCelebrating(true);
      window.setTimeout(() => setCelebrating(false), 650);
    }
  });

  const start = () => {
    if (running || reduced) return;
    setCelebrating(false);
    lapStart.current = null;
    setRunning(true);
  };

  return (
    <g>
      <path
        ref={pathRef}
        id={`${uid}-path`}
        d={pathD}
        fill="none"
        stroke="transparent"
        strokeWidth={24}
        pointerEvents="none"
      />

      <motion.g style={{ x, y }}>
        <foreignObject x={-22} y={-22} width={44} height={44}>
          <button
            type="button"
            aria-label={label}
            disabled={running}
            onClick={start}
            className="h-11 w-11 cursor-pointer rounded-full bg-transparent disabled:cursor-default"
          />
        </foreignObject>

        <motion.g
          style={{ rotate: reduced ? 0 : rotate, scale: reduced ? 1 : bob }}
          className="pointer-events-none"
          aria-hidden
        >
          <g transform={`translate(${-size / 2}, ${-size * 0.9}) scale(${size / 48})`}>
            <RunnerSprite color={color} />
          </g>
          {celebrating
            ? [0, 1, 2, 3].map((i) => (
                <motion.circle
                  key={i}
                  r={2.2}
                  fill="#F2A93B"
                  initial={{ opacity: 1, cx: 0, cy: -2 }}
                  animate={{
                    opacity: 0,
                    cx: Math.cos((i / 4) * Math.PI * 2) * 16,
                    cy: Math.sin((i / 4) * Math.PI * 2) * 16 - 8,
                  }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                />
              ))
            : null}
        </motion.g>
      </motion.g>
    </g>
  );
}
