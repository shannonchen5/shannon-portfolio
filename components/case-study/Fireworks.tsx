"use client";

import { useReducedMotion } from "motion/react";

const SRC = "/media/autumn-moon-festival/next-steps-fireworks.png";

const BURSTS = [
  { id: "left", origin: "27% 56%", mask: "ellipse 30% 40% at 27% 56%", motion: "firework-left" },
  { id: "center", origin: "56% 28%", mask: "ellipse 32% 30% at 56% 28%", motion: "firework-center" },
  { id: "right", origin: "80% 62%", mask: "ellipse 28% 36% at 80% 62%", motion: "firework-right" },
] as const;

export function Fireworks() {
  const reduced = useReducedMotion();

  return (
    <figure
      className="relative w-full overflow-hidden bg-black"
      style={{ aspectRatio: "1920 / 1080" }}
    >
      <style>{`
        .firework-left,
        .firework-center,
        .firework-right {
          animation-duration: 5.5s;
        }
        @keyframes firework-left {
          0% { opacity: 0; transform: scale(0.12); animation-timing-function: cubic-bezier(0.16, 0.72, 0.2, 1); }
          16.4% { opacity: 1; transform: scale(1); animation-timing-function: linear; }
          73.8% { opacity: 1; transform: scale(1); animation-timing-function: cubic-bezier(0.4, 0, 0.9, 0.2); }
          90.2%, 100% { opacity: 0; transform: scale(0.12); }
        }
        @keyframes firework-center {
          0%, 19.6% { opacity: 0; transform: scale(0.12); animation-timing-function: cubic-bezier(0.16, 0.72, 0.2, 1); }
          36% { opacity: 1; transform: scale(1); animation-timing-function: linear; }
          73.8% { opacity: 1; transform: scale(1); animation-timing-function: cubic-bezier(0.4, 0, 0.9, 0.2); }
          90.2%, 100% { opacity: 0; transform: scale(0.12); }
        }
        @keyframes firework-right {
          0%, 39.3% { opacity: 0; transform: scale(0.12); animation-timing-function: cubic-bezier(0.16, 0.72, 0.2, 1); }
          55.6% { opacity: 1; transform: scale(1); animation-timing-function: linear; }
          73.8% { opacity: 1; transform: scale(1); animation-timing-function: cubic-bezier(0.4, 0, 0.9, 0.2); }
          90.2%, 100% { opacity: 0; transform: scale(0.12); }
        }
      `}</style>
      <div
        className="absolute inset-y-0"
        style={{ left: "15.625%", width: "84.375%" }}
      >
        {reduced ? (
          <img
            src={SRC}
            alt="Three gold fireworks bursting on a black field"
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          BURSTS.map((burst) => (
            <div
              key={burst.id}
              aria-hidden
              className={`${burst.motion} absolute inset-0`}
              style={{
                transformOrigin: burst.origin,
                maskImage: `radial-gradient(${burst.mask}, #000 0%, #000 58%, transparent 100%)`,
                WebkitMaskImage: `radial-gradient(${burst.mask}, #000 0%, #000 58%, transparent 100%)`,
              }}
            >
              <img src={SRC} alt="" className="h-full w-full" />
            </div>
          ))
        )}
      </div>
      {reduced ? null : (
        <img src={SRC} alt="Three gold fireworks bursting on a black field" className="sr-only" />
      )}
    </figure>
  );
}
