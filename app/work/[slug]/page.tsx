import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllSlugs,
  getCaseStudyBySlug,
  getNextCaseStudy,
} from "@/content/case-studies";
import { CaseStudyClient } from "./CaseStudyClient";

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
  const fallbackStudy = getCaseStudyBySlug(slug);
  if (!fallbackStudy) notFound();

  const next = getNextCaseStudy(slug);

  return (
    <CaseStudyClient
      slug={slug}
      fallbackStudy={fallbackStudy}
      next={next}
    />
  );
}
