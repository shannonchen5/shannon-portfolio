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
  className?: string;
};

export function VideoPlayer({
  mp4,
  webm,
  poster,
  alt,
  aspectRatio = "16 / 9",
  objectPosition,
  className,
}: VideoPlayerProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [shown, setShown] = useState(false);

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

  const reveal = (el: HTMLVideoElement) => {
    if (typeof el.requestVideoFrameCallback === "function") {
      el.requestVideoFrameCallback(() => setShown(true));
      return;
    }
    setShown(true);
  };

  return (
    <div
      className={cn(
        "media-round relative w-full border-0 bg-transparent shadow-none",
        className,
      )}
      style={{
        aspectRatio,
        backgroundImage: poster ? `url("${encodeURI(poster)}")` : undefined,
        backgroundRepeat: "no-repeat",
        backgroundPosition: objectPosition ?? "center top",
        backgroundSize: "cover",
      }}
    >
      <video
        ref={ref}
        className={cn(
          "absolute inset-0 h-full w-full border-0 bg-transparent object-cover object-top outline-none",
          shown ? "opacity-100" : "opacity-0",
        )}
        style={objectPosition ? { objectPosition } : undefined}
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        aria-label={alt}
        onPlaying={(event) => reveal(event.currentTarget)}
      >
        {webm ? <source src={webm} type="video/webm" /> : null}
        <source src={mp4} type="video/mp4" />
      </video>
    </div>
  );
}
