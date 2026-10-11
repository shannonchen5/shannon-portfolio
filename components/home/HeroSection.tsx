"use client";

import { useReducedMotion } from "motion/react";
import { STrackOval } from "@/components/home/STrackOval";
import { Button } from "@/components/ui/Button";
import { site as siteDefaults } from "@/content/site";

type HeroSectionProps = {
  intro?: string;
};

export function HeroSection({
  intro = siteDefaults.hero.intro,
}: HeroSectionProps) {
  const reduced = useReducedMotion();

  return (
    <header
      id="hero"
      className="relative isolate overflow-visible px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-20"
    >
      <div className="mx-auto max-w-[1100px]">
        <h1 className="text-hero overflow-visible text-plum">
          <span className="relative block overflow-visible whitespace-nowrap">
            <STrackOval />
            hannon Chen&apos;s
          </span>
          <span className="relative mt-[0.08em] block whitespace-nowrap">
            Design Portfolio
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-body text-text-muted sm:mt-10">
          {intro}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="#work">See selected work</Button>
          <Button href="/contact" variant="secondary" showArrow={false}>
            Contact
          </Button>
        </div>

        <p className="mt-5 text-sm text-text-muted">
          {reduced
            ? "Motion reduced — runners stay at the start line."
            : "Tap a runner on the track around the S to send them on a lap."}
        </p>
      </div>
    </header>
  );
}
