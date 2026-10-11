import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllSlugs,
  getCaseStudyBySlug,
  getNextCaseStudy,
} from "@/content/case-studies";
import { CaseStudyView } from "@/components/case-study/CaseStudyView";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) return { title: "Case study" };
  return {
    title: study.title,
    description: study.summary,
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) notFound();

  return <CaseStudyView study={study} next={getNextCaseStudy(slug)} />;
}
