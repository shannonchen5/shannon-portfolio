import fs from "node:fs";
import path from "node:path";
import type { CaseStudy, Category } from "./_schema";
import kitchensForGood from "./kitchens-for-good.json";
import currentCalendar from "./current-calendar-extension.json";
import autumnMoon from "./autumn-moon-festival.json";

const caseStudies: CaseStudy[] = [
  kitchensForGood as CaseStudy,
  currentCalendar as CaseStudy,
  autumnMoon as CaseStudy,
];

/** Drop a hero recording that is not actually in `public/`, so cards can trust the field. */
function withPlayableHero(study: CaseStudy): CaseStudy {
  const src = study.heroVideo?.mp4;
  if (!src?.startsWith("/media/") || src.includes("..")) {
    return study.heroVideo ? { ...study, heroVideo: undefined } : study;
  }
  const filePath = path.join(
    process.cwd(),
    "public",
    decodeURIComponent(src.replace(/^\/+/, "")),
  );
  if (!fs.existsSync(filePath)) return { ...study, heroVideo: undefined };
  return study;
}

export function getAllCaseStudies(): CaseStudy[] {
  return caseStudies.map(withPlayableHero);
}

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  const study = caseStudies.find((item) => item.slug === slug);
  return study ? withPlayableHero(study) : undefined;
}

export function getCaseStudiesByCategory(category: Category): CaseStudy[] {
  return caseStudies
    .filter((study) => study.category === category)
    .map(withPlayableHero);
}

export function getFeaturedCaseStudies(): CaseStudy[] {
  return caseStudies.filter((study) => study.featured).map(withPlayableHero);
}

export function getNextCaseStudy(slug: string): CaseStudy | undefined {
  const index = caseStudies.findIndex((study) => study.slug === slug);
  if (index === -1) return undefined;
  return withPlayableHero(caseStudies[(index + 1) % caseStudies.length]);
}

export function getAllSlugs(): string[] {
  return caseStudies.map((study) => study.slug);
}

export type { CaseStudy, Category };
