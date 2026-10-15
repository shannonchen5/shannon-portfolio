import type { Metadata } from "next";
import { StickyCaseStack } from "@/components/home/StickyCaseStack";
import { HeroTitle } from "@/components/ui/HeroTitle";
import { getFeaturedCaseStudies } from "@/content/case-studies";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Selected product design case studies.",
};

export default function CaseStudiesPage() {
  const studies = getFeaturedCaseStudies();

  return (
    <>
      <HeroTitle>Case Studies</HeroTitle>
      <StickyCaseStack studies={studies} />
    </>
  );
}
