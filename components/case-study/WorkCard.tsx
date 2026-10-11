"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { CaseStudy } from "@/content/case-studies/_schema";
import { TrackCorner } from "@/components/track/TrackCorner";
import { ParallaxMedia } from "@/components/ui/ParallaxMedia";
import { easeOut } from "@/lib/motion";

type WorkCardProps = {
  study: CaseStudy;
  index?: number;
};

export function WorkCard({ study, index = 0 }: WorkCardProps) {
  const reduced = useReducedMotion();
  const keyStat = study.stats?.[0];

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: easeOut }}
      className="group relative grid items-center gap-8 border-b border-border py-10 last:border-b-0 md:grid-cols-[1.15fr_0.85fr] md:gap-12 md:py-14"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-1 top-6 opacity-0 transition-opacity duration-300 group-hover:opacity-70"
      >
        <TrackCorner ghost className="h-12 w-20" />
      </div>

      <div>
        <p className="text-eyebrow text-text-muted">{study.category}</p>
        <h3 className="mt-4 text-h2">
          <Link
            href={`/work/${study.slug}`}
            className="link-highlight link-highlight-lg text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
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
        <p className="mt-6">
          <Link
            href={`/work/${study.slug}`}
            className="link-draw text-sm font-semibold text-text"
          >
            View case study
          </Link>
        </p>
      </div>

      <Link
        href={`/work/${study.slug}`}
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        tabIndex={-1}
        aria-hidden
      >
        <ParallaxMedia
          src={study.cover.src}
          alt=""
          aspectRatio={study.cover.aspectRatio ?? "16 / 10"}
        />
      </Link>
    </motion.article>
  );
}
