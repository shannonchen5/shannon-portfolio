"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { TrackRunner } from "./TrackRunner";

const TRACKS = [
  {
    id: "runner-lane-1",
    label: "Runner on outer track — press to run a lap",
    pathD:
      "M40 120 C 80 40, 160 40, 200 80 C 240 120, 320 120, 360 50",
    color: "#D4561C",
    speed: 2.6,
  },
  {
    id: "runner-lane-2",
    label: "Runner on middle track — press to run a lap",
    pathD:
      "M28 130 C 90 55, 150 55, 200 95 C 250 135, 310 125, 372 60",
    color: "#B84514",
    speed: 3.0,
  },
  {
    id: "runner-lane-3",
    label: "Runner on inner track — press to run a lap",
    pathD:
      "M50 110 C 100 30, 170 35, 210 70 C 250 105, 300 110, 350 45",
    color: "#D4561C",
    speed: 2.4,
  },
] as const;

export function HeroTracks() {
  const reduced = useReducedMotion();
  const [inView, setInView] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const root = document.getElementById("hero-tracks");
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const visibleTracks = isMobile ? TRACKS.slice(0, 2) : TRACKS;
  const perspective = isMobile ? "600px" : "900px";
  const rotateX = isMobile ? "42deg" : "58deg";
  const rotateY = isMobile ? "-6deg" : "-12deg";

  return (
    <div
      id="hero-tracks"
      className="relative mx-auto w-full max-w-5xl"
      style={{ perspective }}
    >
      <div
        className="relative origin-bottom"
        style={{
          transform: `rotateX(${rotateX}) rotateY(${rotateY})`,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="absolute -top-8 left-[8%] right-[18%] z-10 md:-top-4 md:left-[12%] md:right-[22%]">
          <p className="text-eyebrow text-text-muted">Product designer</p>
          <h1 className="text-display text-text">
            Shannon
            <span className="text-plum"> Chen</span>
          </h1>
        </div>

        <div className="relative mt-16 space-y-1 pt-10 md:mt-20 md:space-y-2 md:pt-16">
          {visibleTracks.map((track, index) => (
            <div
              key={track.id}
              style={{
                transform: `translateZ(${(visibleTracks.length - index) * 12}px)`,
              }}
            >
              <TrackRunner
                id={track.id}
                label={track.label}
                pathD={track.pathD}
                color={track.color}
                speed={track.speed}
                paused={!inView || !!reduced}
              />
            </div>
          ))}
        </div>
      </div>

      {reduced ? (
        <p className="mt-4 text-sm text-text-muted">
          Motion reduced — runners stay at the start line.
        </p>
      ) : (
        <p className="mt-4 text-sm text-text-muted">
          Tap a runner to send them on a lap.
        </p>
      )}
    </div>
  );
}
