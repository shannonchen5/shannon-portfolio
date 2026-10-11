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
      className="relative isolate overflow-visible px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-20"
    >
      <div className="relative mx-auto max-w-6xl">
        <div className="relative w-fit max-w-full">
          {/* Portrait behind type — arch top, soft matching bottom radii, right-aligned with the "s" in "Chen's" */}
          <div className="pointer-events-none absolute bottom-0 right-0 z-0 w-[min(52%,16.5rem)] sm:w-[19rem] md:w-[20rem]">
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

          <h1 className="relative z-10 text-hero overflow-visible text-plum">
            <span className="relative block overflow-visible whitespace-nowrap">
              <STrackOval />
              hannon Chen&apos;s
            </span>
            <span className="relative mt-[0.08em] block whitespace-nowrap">
              Portfolio
            </span>
          </h1>

          <div className="relative z-10 mt-8 max-w-[min(100%,26rem)] pr-[min(54%,17.5rem)] sm:mt-10 sm:max-w-[min(48%,30rem)] sm:pr-0 md:max-w-[min(46%,34rem)]">
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
