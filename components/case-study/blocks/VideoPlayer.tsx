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
  objectPosition?: string;
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
  objectPosition,
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
        className="h-[calc(100%+2px)] w-full border-0 bg-transparent object-cover object-top outline-none"
        style={objectPosition ? { objectPosition } : undefined}
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
