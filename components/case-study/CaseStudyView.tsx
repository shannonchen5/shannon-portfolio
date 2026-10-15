import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import type { CaseStudy, CaseStudySection, HeroVideo } from "@/content/case-studies/_schema";
import { BlockRenderer } from "./blocks/BlockRenderer";
import { VideoPlayer } from "./blocks/VideoPlayer";
import { CaseStudyBrand } from "./CaseStudyBrand";
import { FlowMediaSection } from "./FlowMediaSection";
import { ProgressTimeline } from "./ProgressTimeline";
import { Button } from "@/components/ui/Button";

type CaseStudyViewProps = {
  study: CaseStudy;
  next?: CaseStudy;
};

export function CaseStudyView({ study, next }: CaseStudyViewProps) {
  const overview =
    study.sections.find((section) => section.id === "overview") ??
    study.sections[0];
  const following = overview
    ? study.sections.filter((section) => section.id !== overview.id)
    : [];

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
      <header className="relative z-0 mx-auto flex w-full max-w-[var(--page-max)] flex-col justify-start px-[var(--page-gutter)] pb-8 pt-6 sm:pt-8 lg:sticky lg:top-16 lg:min-h-[calc(100dvh-4rem)] lg:pb-10 lg:pt-8">
        <div className="grid w-full min-w-0 items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-x-16 xl:gap-x-20">
          <div className="@container min-w-0">
            <h1
              className="link-highlight link-highlight-lg pb-[0.08em] text-case-hero text-plum"
              style={{ fontSize: "clamp(1.85rem, 11cqi, 5.25rem)" }}
            >
              {study.title}
            </h1>
            <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-8 min-[420px]:grid-cols-2 sm:mt-12 sm:gap-x-16 sm:gap-y-10">
              <Meta label="Role" value={study.role} />
              <Meta label="Timeline" value={study.duration} />
              <Meta label="Team" value={study.team} />
              <Meta label="Tools" value={study.tools.join(", ")} />
            </dl>
          </div>
          <div className="flex w-full min-w-0 flex-col items-center">
            <div className="w-full">
              <HeroMedia study={study} />
            </div>
            {study.liveUrl ? (
              <div className="relative mt-6 flex w-full max-w-full flex-col items-center sm:w-fit sm:items-start">
                {study.slug === "helping-hands" ? <LoadNote /> : null}
                <Button href={study.liveUrl} external className="max-w-full">
                  {study.liveLabel ?? "See the live website"}
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* Opaque sheet scrolls up over the stuck hero; the timeline pins under the nav. */}
      <div className="relative z-10 bg-bg">
      <ProgressTimeline key={study.slug} sections={study.sections}>
        <div className="mx-auto w-full max-w-[var(--page-max)] px-[var(--page-gutter)] pb-24">
          {overview ? (
            <section
              id={overview.id}
              className="border-b border-border pb-16 pt-10 sm:pb-20 sm:pt-12"
            >
              <SectionBody section={overview} />
            </section>
          ) : null}

          {following.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="border-b border-border py-16 last:border-b-0 sm:py-20"
            >
              <SectionBody section={section} />
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
            <Link href="/work" className="link-draw">
              ← Back to case studies
            </Link>
          </p>
        </div>
      </ProgressTimeline>
      </div>
    </article>
  );
}

function SectionBody({ section }: { section: CaseStudySection }) {
  const only = section.blocks.length === 1 ? section.blocks[0] : undefined;
  const pinned =
    only?.type === "twoColumn" &&
    (only.align === "start" || only.centerMedia === true);

  if (pinned && only.type === "twoColumn") {
    return (
      <BlockRenderer
        block={only}
        heading={
          <h2 className="scroll-mt-[12rem] text-h2 text-plum md:scroll-mt-[11rem]">
            {section.title}
          </h2>
        }
      />
    );
  }

  return <FlowMediaSection title={section.title} blocks={section.blocks} />;
}

function LoadNote() {
  return (
    <img
      src="/media/helping-hands/takes%20a%20minute%20to%20load.png?v=2"
      alt="takes a minute to load"
      width={330}
      height={134}
      className="pointer-events-none mb-3 h-auto w-[min(12rem,100%)] max-w-full sm:absolute sm:mb-0 sm:w-48 sm:max-w-none"
      style={{
        top: "0",
        right: "calc(100% - 12rem * 10 / 330 + 0.35rem)",
      }}
    />
  );
}

function HeroMedia({ study }: { study: CaseStudy }) {
  const video = resolveHeroVideo(study.heroVideo);

  if (video) {
    return (
      <VideoPlayer
        mp4={video.mp4}
        webm={video.webm}
        poster={video.poster || study.cover.src}
        alt={video.alt}
        aspectRatio={video.aspectRatio ?? "16 / 9"}
        fit="contain"
        className="min-w-0"
      />
    );
  }

  return (
    <div
      className="media-frame relative min-w-0 w-full max-w-full"
      style={{ aspectRatio: study.cover.aspectRatio ?? "16 / 10" }}
    >
      <Image
        src={study.cover.src}
        alt={study.cover.alt}
        fill
        priority
        className="object-contain"
        sizes="(max-width: 1024px) 100vw, 50vw"
        unoptimized={study.cover.src.endsWith(".svg")}
      />
    </div>
  );
}

/** Play the hero recording only after the file is actually in `public/`. */
function resolveHeroVideo(video: HeroVideo | undefined): HeroVideo | undefined {
  const src = video?.mp4;
  if (!src?.startsWith("/media/") || src.includes("..")) return undefined;
  const filePath = path.join(
    process.cwd(),
    "public",
    decodeURIComponent(src.replace(/^\/+/, "")),
  );
  if (!fs.existsSync(filePath)) return undefined;
  return video;
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-eyebrow text-text-muted">{label}</dt>
      <dd className="mt-2 text-base font-medium leading-snug break-words text-text">
        {value}
      </dd>
    </div>
  );
}
