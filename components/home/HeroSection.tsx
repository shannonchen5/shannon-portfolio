"use client";

import Image from "next/image";
import { STrackOval } from "@/components/home/STrackOval";
import { Button } from "@/components/ui/Button";
import { site as siteDefaults } from "@/content/site";

type HeroSectionProps = {
  intro?: string;
};

export function HeroSection({
  intro = siteDefaults.hero.intro,
}: HeroSectionProps) {
  return (
    <header
      id="hero"
      className="relative isolate overflow-x-clip pb-16 pt-16 sm:pb-24 sm:pt-20"
    >
      {/* Hero group is centered; type, copy, and buttons stay left-aligned inside it. */}
      <div className="relative mx-auto w-full max-w-[var(--page-max)] px-[var(--page-gutter)]">
        {/* w-fit + mx-auto centers the block; right-0 keeps the portrait on the "s" */}
        <div className="relative mx-auto w-fit max-w-full">
          {/* Portrait stays inside the shell; right edge tracks the headline */}
          <div className="pointer-events-none absolute bottom-0 right-0 z-0 w-[min(46%,20rem)] max-w-full">
            <div
              className="relative aspect-[3/4] w-full overflow-hidden bg-surface shadow-[var(--shadow-warm)]"
              style={{
                borderRadius:
                  "50% 50% 12px 12px / 37.5% 37.5% 12px 12px",
              }}
            >
              <Image
                src="/media/headshot.png"
                alt="Shannon Chen"
                fill
                priority
                sizes="(max-width: 768px) 52vw, 320px"
                className="object-cover object-[center_18%]"
              />
            </div>
          </div>

          <h1 className="relative z-10 max-w-full text-hero text-plum">
            <span className="relative block overflow-visible whitespace-nowrap">
              <STrackOval />
              hannon Chen&apos;s
            </span>
            <span className="relative mt-[0.08em] block whitespace-nowrap">
              Portfolio
            </span>
          </h1>

          <div className="relative z-10 mt-8 max-w-full sm:mt-10 sm:max-w-md">
            <p className="text-body text-text-muted">{intro}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#work">See selected work</Button>
              <Button href="/contact" variant="secondary" showArrow={false}>
                Contact
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
