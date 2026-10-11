import Image from "next/image";
import Link from "next/link";
import type { CaseStudy } from "@/content/case-studies/_schema";
import { BlockRenderer } from "./blocks/BlockRenderer";
import { CaseStudyBrand } from "./CaseStudyBrand";
import { ProgressTimeline } from "./ProgressTimeline";
import { Button } from "@/components/ui/Button";

type CaseStudyViewProps = {
  study: CaseStudy;
  next?: CaseStudy;
};

export function CaseStudyView({ study, next }: CaseStudyViewProps) {
  return (
    <article>
      {study.brand ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.setAttribute("data-brand",${JSON.stringify(study.brand)});`,
          }}
        />
      ) : null}
      <CaseStudyBrand brand={study.brand} />
      <header className="mx-auto max-w-6xl px-5 pb-10 pt-12 sm:px-8 sm:pt-16">
        <h1 className="text-h1 text-plum">{study.title}</h1>
        <p className="mt-4 max-w-2xl text-body text-text-muted">{study.summary}</p>

        <dl className="mt-10 grid gap-6 border-y border-border py-8 sm:grid-cols-2 lg:grid-cols-4">
          <Meta label="Role" value={study.role} />
          <Meta label="Timeline" value={study.duration} />
          <Meta label="Team" value={study.team} />
          <Meta label="Tools" value={study.tools.join(", ")} />
        </dl>

        <div
          className="media-frame relative mt-10 w-full"
          style={{ aspectRatio: study.cover.aspectRatio ?? "16 / 10" }}
        >
          <Image
            src={study.cover.src}
            alt={study.cover.alt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1120px"
            unoptimized={study.cover.src.endsWith(".svg")}
          />
        </div>

        {study.stats?.length ? (
          <dl className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {study.stats.map((stat) => (
              <div key={`${stat.label}-${stat.value}`}>
                <dt className="text-eyebrow text-text-muted">{stat.label}</dt>
                <dd className="mt-2 text-h2 text-plum">{stat.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </header>

      <ProgressTimeline sections={study.sections}>
        <div className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
          {study.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-36 border-b border-border py-16 last:border-b-0 sm:py-20"
            >
              <h2 className="text-h2 text-plum">{section.title}</h2>
              <div className="mt-10 space-y-10">
                {section.blocks.map((block, index) => (
                  <BlockRenderer
                    key={`${section.id}-${block.type}-${index}`}
                    block={block}
                  />
                ))}
              </div>
            </section>
          ))}

          {next ? (
            <footer
              data-brand={next.brand}
              className="mt-8 rounded-3xl border border-border bg-surface px-6 py-10 sm:px-10"
            >
              <p className="text-eyebrow text-text-muted">Next case study</p>
              <h2 className="mt-3 text-h2">
                <Link
                  href={`/work/${next.slug}`}
                  className="link-highlight link-highlight-lg text-plum"
                >
                  {next.title}
                </Link>
              </h2>
              <p className="mt-3 max-w-xl text-body text-text-muted">
                {next.summary}
              </p>
              <div className="mt-8">
                <Button href={`/work/${next.slug}`}>View case study</Button>
              </div>
            </footer>
          ) : null}

          <p className="mt-10 text-sm text-text-muted">
            <Link href={`/${study.category}`} className="link-draw">
              ← Back to {study.category} products
            </Link>
          </p>
        </div>
      </ProgressTimeline>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-eyebrow text-text-muted">{label}</dt>
      <dd className="mt-2 text-sm font-medium text-text">{value}</dd>
    </div>
  );
}
