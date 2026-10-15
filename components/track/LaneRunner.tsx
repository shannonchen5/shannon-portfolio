"use client";

import {
  motion,
  useAnimationFrame,
  useReducedMotion,
} from "motion/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { RunnerGlyph, poseFromHeading } from "@/components/home/RunnerSprite";

type LaneRunnerProps = {
  pathD: string;
  label: string;
  color?: string;
  speed?: number;
  paused?: boolean;
  /** Sprite height in track units. Feet stay on the path. */
  size?: number;
  /** Bump to send her around the lap (a click on the track). */
  lapSignal?: number;
  /** When false, the lane path is not its own click target. */
  interactive?: boolean;
};

export function LaneRunner({
  pathD,
  label,
  color = "#1a1a1a",
  speed = 2.8,
  paused = false,
  size = 20,
  lapSignal = 0,
  interactive = true,
}: LaneRunnerProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const rootRef = useRef<SVGGElement>(null);
  const poseRef = useRef<SVGGElement>(null);
  const reduced = useReducedMotion();
  const [running, setRunning] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const lapStart = useRef<number | null>(null);
  const runningRef = useRef(false);
  const uid = useId();

  const place = useCallback(
    (t: number) => {
      const path = pathRef.current;
      if (!path) return;
      const length = path.getTotalLength();
      if (!length) return;
      const d = ((t % 1) + 1) % 1 * length;
      const p = path.getPointAtLength(d);
      const ahead = path.getPointAtLength((d + 8) % length);
      const angle = Math.atan2(ahead.y - p.y, ahead.x - p.x);

      const pose = poseFromHeading(angle);
      const gait =
        runningRef.current && t > 0 && t < 1 ? Math.floor(d / 18) % 4 : 0;
      const nextFrame = pose.view === "side" ? gait : gait % 2;
      rootRef.current?.setAttribute("transform", `translate(${p.x} ${p.y})`);
      const node = poseRef.current;
      if (!node) return;
      node.setAttribute("transform", `rotate(${pose.lean}) scale(${size / 72})`);
      node.dataset.view = pose.view;
      Array.from(node.children).forEach((child) => {
        if (!(child instanceof SVGGElement)) return;
        const show =
          child.dataset.pose === pose.view &&
          Number(child.dataset.frame) === nextFrame;
        child.setAttribute("display", show ? "inline" : "none");
      });
    },
    [size],
  );

  useEffect(() => {
    const id = requestAnimationFrame(() => place(0));
    return () => cancelAnimationFrame(id);
  }, [pathD, place]);

  useAnimationFrame((time) => {
    if (paused || reduced) return;

    if (!running) return;

    if (lapStart.current === null) lapStart.current = time;
    const t = Math.min(1, (time - lapStart.current) / 1000 / speed);
    place(t);

    if (t >= 1) {
      runningRef.current = false;
      setRunning(false);
      lapStart.current = null;
      place(0);
      setCelebrating(true);
      window.setTimeout(() => setCelebrating(false), 650);
    }
  });

  const start = () => {
    if (runningRef.current || reduced) return;
    setCelebrating(false);
    lapStart.current = null;
    runningRef.current = true;
    setRunning(true);
  };

  const startRef = useRef(start);
  startRef.current = start;

  useEffect(() => {
    if (!lapSignal) return;
    startRef.current();
  }, [lapSignal]);

  return (
    <g>
      <path
        ref={pathRef}
        id={`${uid}-path`}
        d={pathD}
        fill="none"
        stroke="transparent"
        strokeWidth={interactive ? 18 : 0}
        pointerEvents={interactive ? "stroke" : "none"}
        className={interactive ? "cursor-pointer" : undefined}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-label={interactive ? label : undefined}
        onClick={interactive ? start : undefined}
        onKeyDown={
          interactive
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  start();
                }
              }
            : undefined
        }
      />

      <g ref={rootRef} className="pointer-events-none">
        <g
          ref={poseRef}
          aria-hidden
          data-view="side"
          transform={`rotate(0) scale(${size / 72})`}
        >
          {(["side", "front", "back"] as const).map((pose) =>
            (pose === "side" ? [0, 1, 2, 3] : [0, 1]).map((step) => (
              <g
                key={`${pose}-${step}`}
                data-pose={pose}
                data-frame={step}
                display={pose === "side" && step === 0 ? "inline" : "none"}
              >
                <RunnerGlyph
                  color={color}
                  view={pose}
                  frame={step as 0 | 1 | 2 | 3}
                />
              </g>
            )),
          )}
        </g>
        {celebrating
          ? [0, 1, 2, 3].map((i) => (
              <motion.circle
                key={i}
                r={3}
                fill="#F2A93B"
                initial={{ opacity: 1, cx: 0, cy: -6 }}
                animate={{
                  opacity: 0,
                  cx: Math.cos((i / 4) * Math.PI * 2) * 14,
                  cy: Math.sin((i / 4) * Math.PI * 2) * 14 - 10,
                }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              />
            ))
          : null}
      </g>
    </g>
  );
}
