import type { CaseStudy, Category } from "./_schema";
import kitchensForGood from "./kitchens-for-good";
import currentCalendar from "./current-calendar-extension";
import autumnMoon from "./autumn-moon-festival";

const caseStudies: CaseStudy[] = [
  kitchensForGood,
  currentCalendar,
  autumnMoon,
];

export function getAllCaseStudies(): CaseStudy[] {
  return caseStudies;
}

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}

export function getCaseStudiesByCategory(category: Category): CaseStudy[] {
  return caseStudies.filter((study) => study.category === category);
}

export function getFeaturedCaseStudies(): CaseStudy[] {
  return caseStudies.filter((study) => study.featured);
}

export function getNextCaseStudy(slug: string): CaseStudy | undefined {
  const index = caseStudies.findIndex((study) => study.slug === slug);
  if (index === -1) return undefined;
  return caseStudies[(index + 1) % caseStudies.length];
}

export function getAllSlugs(): string[] {
  return caseStudies.map((study) => study.slug);
}

export type { CaseStudy, Category };
