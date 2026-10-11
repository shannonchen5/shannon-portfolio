import type { Metadata } from "next";
import { EmptyState } from "@/components/case-study/EmptyState";
import { WorkCard } from "@/components/case-study/WorkCard";
import { FadeIn } from "@/components/ui/FadeIn";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { getCaseStudiesByCategory } from "@/content/case-studies";

export const metadata: Metadata = {
  title: "Digital Products",
  description: "Digital product design case studies.",
};

export default function DigitalPage() {
  const studies = getCaseStudiesByCategory("digital");

  return (
    <Section>
      <FadeIn>
        <PageHeader
          eyebrow="Work"
          title="Digital Products"
          description="[Your copy here — intro to digital product work.]"
        />
      </FadeIn>

      <div className="mt-10">
        {studies.length === 0 ? (
          <EmptyState category="digital" />
        ) : (
          <div>
            {studies.map((study, index) => (
              <WorkCard key={study.slug} study={study} index={index} />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
