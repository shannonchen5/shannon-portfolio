import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { site as siteFallback } from "@/content/site";
import { AboutPageContent } from "./AboutPageContent";

export const metadata: Metadata = {
  title: "About",
  description: siteFallback.about.body,
};

export default function AboutPage() {
  return (
    <Section>
      <AboutPageContent />
    </Section>
  );
}
