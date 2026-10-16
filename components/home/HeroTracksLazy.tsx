"use client";

import dynamic from "next/dynamic";

const HeroSection = dynamic(
  () => import("@/components/home/HeroSection").then((mod) => mod.HeroSection),
  {
    ssr: false,
    loading: () => (
      <header className="pb-16 pt-10 sm:pb-24 sm:pt-14">
        <div className="@container mx-auto w-full max-w-[var(--page-max)] px-[var(--page-gutter)]">
          <h1 className="hero-name mx-auto w-fit max-w-full text-hero text-plum">
            <span className="block whitespace-nowrap">Shannon Chen</span>
          </h1>
        </div>
      </header>
    ),
  },
);

type HeroTracksLazyProps = {
  intro?: string;
};

export function HeroTracksLazy({ intro }: HeroTracksLazyProps) {
  return <HeroSection intro={intro} />;
}
