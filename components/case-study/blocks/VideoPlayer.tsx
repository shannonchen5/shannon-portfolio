"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type VideoPlayerProps = {
  mp4: string;
  webm?: string;
  poster: string;
  alt: string;
  aspectRatio?: string;
  fit?: "cover" | "contain";
  /** When false, the video has no border or background. Corners stay at 12px. */
  framed?: boolean;
  className?: string;
};

export function VideoPlayer({
  mp4,
  webm,
  poster,
  alt,
  aspectRatio = "16 / 9",
  fit = "cover",
  framed = true,
  className,
}: VideoPlayerProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion || !inView) {
      el.pause();
      return;
    }
    void el.play().catch(() => undefined);
  }, [inView]);

  return (
    <div
      className={cn(
        "media-round relative w-full border-0 shadow-none",
        framed && "bg-surface",
        className,
      )}
      style={{ aspectRatio }}
    >
      <video
        ref={ref}
        className={cn(
          "h-full w-full border-0 outline-none",
          fit === "contain" ? "object-contain" : "object-cover",
        )}
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        aria-label={alt}
      >
        {webm ? <source src={webm} type="video/webm" /> : null}
        <source src={mp4} type="video/mp4" />
      </video>
    </div>
  );
}
