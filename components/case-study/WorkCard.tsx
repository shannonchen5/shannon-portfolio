"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { CaseStudy } from "@/content/case-studies/_schema";
import { PreviewMedia } from "@/components/case-study/PreviewMedia";
import { Button } from "@/components/ui/Button";
import { easeOut } from "@/lib/motion";

type WorkCardProps = {
  study: CaseStudy;
  index?: number;
  /** Pill CTA, no success metric, square media — the home case-study card. */
  layout?: "default" | "feature";
};

export function WorkCard({ study, index = 0, layout = "default" }: WorkCardProps) {
  const reduced = useReducedMotion();
  const keyStat = layout === "feature" ? undefined : study.stats?.[0];

  return (
    <motion.article
      data-brand={study.brand}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: easeOut }}
      className="group relative grid items-center gap-8 border-b border-border py-10 last:border-b-0 md:grid-cols-[1.15fr_0.85fr] md:gap-12 md:py-14"
    >
      <div>
        <p className="text-eyebrow text-plum">{study.category}</p>
        <h3 className="mt-4 text-h2">
          <Link
            href={`/work/${study.slug}`}
            className="link-highlight link-highlight-lg text-plum focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            {study.title}
          </Link>
        </h3>
        <p className="mt-4 max-w-xl text-body text-text-muted">{study.summary}</p>
        {keyStat ? (
          <p className="mt-4 text-sm font-semibold text-text">
            <span className="text-mark">
              {keyStat.value} {keyStat.label}
            </span>
          </p>
        ) : null}
        <div className="mt-6">
          {layout === "feature" ? (
            <Button href={`/work/${study.slug}`}>Read case study</Button>
          ) : (
            <Link
              href={`/work/${study.slug}`}
              className="link-draw text-sm font-semibold text-plum"
            >
              View case study
            </Link>
          )}
        </div>
      </div>

      <Link
        href={`/work/${study.slug}`}
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        tabIndex={-1}
        aria-hidden
      >
        <PreviewMedia
          study={study}
          aspectRatio={layout === "feature" ? "4 / 3" : "16 / 10"}
          square={layout === "feature"}
        />
      </Link>
    </motion.article>
  );
}
