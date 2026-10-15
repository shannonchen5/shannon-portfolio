import type { Metadata } from "next";
import { StickyCaseStack } from "@/components/home/StickyCaseStack";
import { HeroTitle } from "@/components/ui/HeroTitle";
import { getCaseStudiesByCategory } from "@/content/case-studies";

export const metadata: Metadata = {
  title: "Physical Design",
  description: "Physical product design case studies.",
};

export default function PhysicalPage() {
  const studies = getCaseStudiesByCategory("physical");

  return (
    <>
      <HeroTitle>Physical Design</HeroTitle>
      <StickyCaseStack studies={studies} />
    </>
  );
}
