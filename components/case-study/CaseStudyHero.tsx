"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

/**
 * Lets the bottom meta row travel up one third of the screen, then the
 * writeup sheet sticks the hero and covers that row.
 */
export function CaseStudyHero({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const desktop = window.matchMedia("(min-width: 64rem)");

    const update = () => {
      if (!desktop.matches) {
        el.style.top = "";
        return;
      }

      const nav = document.querySelector("body > header");
      const navOffset = nav instanceof HTMLElement ? nav.offsetHeight : 64;
      const vh = window.innerHeight;
      const lift = vh / 3;
      // Pin under the nav, or high enough that a tall hero's bottom can
      // enter the screen — then let it rise another third before it sticks.
      const revealTop = vh - el.offsetHeight;
      el.style.top = `${Math.min(navOffset, revealTop) - lift}px`;
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    desktop.addEventListener("change", update);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      desktop.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <header
      ref={ref}
      className="relative z-0 mx-auto flex w-full max-w-[var(--page-max)] flex-col justify-start px-[var(--page-gutter)] pb-8 pt-6 sm:pt-8 lg:sticky lg:top-16 lg:min-h-[calc(100dvh-4rem)] lg:pb-10 lg:pt-8"
    >
      {children}
    </header>
  );
}
