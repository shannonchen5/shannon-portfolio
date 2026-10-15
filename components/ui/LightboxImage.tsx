"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/cn";
import { easeOut } from "@/lib/motion";

type LightboxImageProps = {
  src: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  sizes?: string;
};

export function LightboxImage({
  src,
  alt,
  aspectRatio = "16 / 9",
  className,
  sizes = "(max-width: 768px) 100vw, 960px",
}: LightboxImageProps) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <figure className={cn("group relative", className)}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="media-frame relative block w-full overflow-hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          style={{ aspectRatio }}
          aria-label={`View full size: ${alt}`}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain transition-transform duration-300 ease-out group-hover:scale-[1.02]"
            sizes={sizes}
            unoptimized={src.endsWith(".svg")}
          />
        </button>
        <figcaption className="mt-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="link-draw text-sm text-text-muted hover:text-text"
          >
            View full size
          </button>
        </figcaption>
      </figure>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[color-mix(in_srgb,var(--text)_72%,transparent)] p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2, ease: easeOut }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-surface"
              initial={reduced ? false : { opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: easeOut }}
              onClick={(event) => event.stopPropagation()}
            >
              <p id={titleId} className="sr-only">
                {alt}
              </p>
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  unoptimized={src.endsWith(".svg")}
                />
              </div>
              <button
                type="button"
                className="absolute right-4 top-4 rounded-full bg-bg px-4 py-2 text-sm font-semibold text-text shadow-[var(--shadow-warm)]"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
