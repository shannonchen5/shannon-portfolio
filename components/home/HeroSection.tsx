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
      <div className="@container relative mx-auto w-full max-w-[var(--page-max)] px-[var(--page-gutter)]">
        <div className="relative w-full max-w-full text-hero [--hero-gap:clamp(1.25rem,2.4cqi,2rem)] [--hero-photo:min(28cqi,16rem)] @min-[40rem]:mx-auto @min-[40rem]:w-fit">
          <h1 className="hero-name max-w-full text-plum">
            <span className="relative block overflow-visible whitespace-nowrap">
              <STrackOval />
              <span className="relative">
                an
                <img
                  src="/media/Home/tap.png?v=2"
                  alt=""
                  width={368}
                  height={139}
                  aria-hidden
                  draggable={false}
                  className="pointer-events-none absolute left-[-0.16em] z-10 h-auto w-[1.35em] max-w-none"
                  style={{ bottom: "calc(1.02em + 8px)" }}
                />
              </span>
              non Chen
            </span>
          </h1>

          <div className="mt-[var(--hero-gap)] flex w-0 min-w-full flex-col @min-[40rem]:grid @min-[40rem]:grid-cols-[minmax(0,1fr)_var(--hero-photo)] @min-[40rem]:items-start @min-[40rem]:gap-x-[var(--hero-gap)]">
            <div className="order-2 mt-[var(--hero-gap)] min-w-0 font-normal tracking-normal @min-[40rem]:order-none @min-[40rem]:mt-0">
              <p className="text-body text-text-muted">{intro}</p>
              <div className="mt-[var(--hero-gap)] flex flex-wrap gap-3">
                <Button href="#work">See selected work</Button>
                <Button href="/contact" variant="secondary" showArrow={false}>
                  Contact
                </Button>
              </div>
            </div>

            <div className="order-1 w-full @min-[40rem]:order-none">
              <div
                className="relative aspect-[3/4] w-full overflow-hidden bg-surface shadow-[var(--shadow-warm)]"
                style={{ borderRadius: "var(--radius-arch)" }}
              >
                <Image
                  src="/media/headshot.png"
                  alt="Shannon Chen"
                  fill
                  priority
                  sizes="(max-width: 640px) 90vw, 256px"
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
