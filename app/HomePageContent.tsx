"use client";

import Link from "next/link";
import { StickyCaseStack } from "@/components/home/StickyCaseStack";
import { HeroTracksLazy } from "@/components/home/HeroTracksLazy";
import { SiteCopy } from "@/components/home/SiteCopy";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { Section } from "@/components/ui/Section";
import type { CaseStudy } from "@/content/case-studies/_schema";

type HomePageContentProps = {
  featured: CaseStudy[];
};

export function HomePageContent({ featured }: HomePageContentProps) {
  return (
    <SiteCopy>
      {(site) => (
        <>
          <HeroTracksLazy intro={site.hero.intro} />

          <div id="work" className="relative scroll-mt-16">
            <div className="border-t border-border bg-bg px-5 py-10 sm:px-8">
              <div className="mx-auto max-w-6xl">
                <p className="text-eyebrow text-text-muted">Selected work</p>
                <h2 className="mt-3 text-h2 text-plum">
                  <span className="text-mark">Case Studies</span>
                </h2>
              </div>
            </div>
            <StickyCaseStack studies={featured} />
            <div className="relative z-[20] border-t border-border bg-bg px-5 py-12 sm:px-8">
              <div className="mx-auto flex max-w-6xl flex-wrap gap-8">
                <Link
                  href="/digital"
                  className="link-highlight text-base font-semibold text-text"
                >
                  All digital work
                </Link>
                <Link
                  href="/physical"
                  className="link-highlight text-base font-semibold text-text"
                >
                  All physical work
                </Link>
              </div>
            </div>
          </div>

          <Section className="relative z-[20] border-t border-border bg-surface">
            <FadeIn className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-end">
              <div>
                <p className="text-eyebrow text-text-muted">About</p>
                <h2 className="mt-3 text-h2 text-text">
                  A designer who{" "}
                  <span className="text-mark">keeps moving</span>
                </h2>
                <p className="mt-4 text-body text-text-muted">{site.about.body}</p>
                <p className="mt-4 text-body text-text-muted">
                  {site.about.extended}
                </p>
                <div className="mt-8">
                  <Button href="/about" variant="secondary" showArrow>
                    More about me
                  </Button>
                </div>
              </div>
              <div className="rounded-3xl border border-border bg-peach/70 p-8">
                <p className="text-eyebrow text-plum">Let&apos;s talk</p>
                <p className="mt-3 text-h3 text-text">
                  [Your contact CTA copy here.]
                </p>
                <div className="mt-6">
                  <Button href="/contact">Contact</Button>
                </div>
              </div>
            </FadeIn>
          </Section>
        </>
      )}
    </SiteCopy>
  );
}
