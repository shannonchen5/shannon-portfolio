"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { useCallback, useRef } from "react";
import { cn } from "@/lib/cn";

type ParallaxMediaProps = {
  src: string;
  alt: string;
  aspectRatio?: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

export function ParallaxMedia({
  src,
  alt,
  aspectRatio = "16 / 10",
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
  priority,
}: ParallaxMediaProps) {
  const reduced = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  const onMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (reduced || !frameRef.current || !imgRef.current) return;
      const rect = frameRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      imgRef.current.style.transform = `scale(1.06) translate(${x * 10}px, ${y * 8}px)`;
    },
    [reduced],
  );

  const onLeave = useCallback(() => {
    if (!imgRef.current) return;
    imgRef.current.style.transform = "scale(1) translate(0, 0)";
  }, []);

  return (
    <div
      ref={frameRef}
      className={cn("media-round relative w-full overflow-hidden border-0", className)}
      style={{ aspectRatio }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        ref={imgRef}
        className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
          sizes={sizes}
          unoptimized={src.endsWith(".svg")}
        />
      </div>
    </div>
  );
}
