"use client";

import { StickyCaseStack } from "@/components/home/StickyCaseStack";
import { HeroTracksLazy } from "@/components/home/HeroTracksLazy";
import { SiteCopy } from "@/components/home/SiteCopy";
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
            <StickyCaseStack studies={featured} title="Case Studies" />
          </div>
        </>
      )}
    </SiteCopy>
  );
}
