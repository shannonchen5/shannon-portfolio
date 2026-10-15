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
      className="relative isolate overflow-x-clip pb-16 pt-16 sm:pb-20 sm:pt-16"
    >
      {/* Hero group is centered; type, copy, and buttons stay left-aligned inside it. */}
      <div className="@container relative mx-auto w-full max-w-[var(--page-max)] px-[var(--page-gutter)]">
        {/* w-fit centers the block so the portrait's right edge tracks the headline. */}
        <div className="relative mx-auto w-fit max-w-full text-hero [--hero-gap:clamp(1.25rem,2.4cqi,2rem)] [--hero-photo:min(28cqi,16rem)]">
          <h1 className="max-w-full text-plum">
            <span className="relative block overflow-visible whitespace-nowrap">
              <STrackOval />
              annon Chen&apos;s
            </span>
            <span className="relative mt-[0.08em] block whitespace-nowrap">
              Portfolio
            </span>
          </h1>

          {/*
            One gap under the title, between the intro and the buttons, and
            beside the portrait. Wide screens lift the arch up beside
            “Portfolio”; narrower screens stack it under the buttons.
          */}
          <div className="mt-[var(--hero-gap)] @min-[48rem]:grid @min-[48rem]:grid-cols-[minmax(0,1fr)_var(--hero-photo)] @min-[48rem]:items-start @min-[48rem]:gap-x-[var(--hero-gap)]">
            <div className="min-w-0 font-normal tracking-normal">
              <p className="text-body text-text-muted">{intro}</p>
              <div className="mt-[var(--hero-gap)] flex flex-wrap gap-3">
                <Button href="#work">See selected work</Button>
                <Button href="/contact" variant="secondary" showArrow={false}>
                  Contact
                </Button>
              </div>
            </div>

            <div className="pointer-events-none mt-[var(--hero-gap)] ml-auto w-[min(14rem,68%)] @min-[48rem]:mt-[calc(-1*(1lh+var(--hero-gap)))] @min-[48rem]:ml-0 @min-[48rem]:w-full">
              <div
                className="relative aspect-[3/4] w-full overflow-hidden bg-surface shadow-[var(--shadow-warm)]"
                style={{ borderRadius: "var(--radius-arch)" }}
              >
                <Image
                  src="/media/headshot.png"
                  alt="Shannon Chen"
                  fill
                  priority
                  sizes="(max-width: 768px) 68vw, 256px"
                  className="object-cover object-[center_18%]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
