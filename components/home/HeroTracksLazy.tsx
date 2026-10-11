"use client";

import dynamic from "next/dynamic";

const HeroSection = dynamic(
  () => import("@/components/home/HeroSection").then((mod) => mod.HeroSection),
  {
    ssr: false,
    loading: () => (
      <header className="px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-14">
        <div className="mx-auto max-w-[1100px]">
          <h1 className="text-hero text-plum">
            <span className="block whitespace-nowrap">Shannon Chen&apos;s</span>
            <span className="mt-[0.08em] block whitespace-nowrap">
              Design Portfolio
            </span>
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
