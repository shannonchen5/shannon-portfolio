import type { Metadata } from "next";
import { EmptyState } from "@/components/case-study/EmptyState";
import { WorkCard } from "@/components/case-study/WorkCard";
import { FadeIn } from "@/components/ui/FadeIn";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { getCaseStudiesByCategory } from "@/content/case-studies";

export const metadata: Metadata = {
  title: "Physical Products",
  description: "Physical product design case studies.",
};

export default function PhysicalPage() {
  const studies = getCaseStudiesByCategory("physical");

  return (
    <Section>
      <FadeIn>
        <PageHeader
          eyebrow="Work"
          title="Physical Products"
          description="[Your copy here — intro to physical product work.]"
          trackColor="plum"
        />
      </FadeIn>

      <div className="mt-10">
        {studies.length === 0 ? (
          <EmptyState category="physical" />
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
