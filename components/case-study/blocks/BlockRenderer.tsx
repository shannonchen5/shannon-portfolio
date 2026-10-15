import type { ReactNode } from "react";
import Image from "next/image";
import type { Block, StatItem } from "@/content/case-studies/_schema";
import { LightboxImage } from "@/components/ui/LightboxImage";
import { VideoPlayer } from "./VideoPlayer";

export function CaseStudyCopy({ content }: { content: string }) {
  return (
    <div className="flex flex-col gap-4">
      {content.split("\n\n").map((para, index) => {
        const lines = para
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        const isList =
          lines.length > 0 &&
          lines.every((line) => line.startsWith("- ") || line.startsWith("• "));
        if (isList) {
          return (
            <ul
              key={`list-${index}`}
              className="list-disc space-y-2 pl-5 text-body text-text-muted"
            >
              {lines.map((line) => (
                <li key={line}>{line.replace(/^(- |• )/, "")}</li>
              ))}
            </ul>
          );
        }
        const isLabel = /^(Step \d+|Round \d+):/.test(para);
        return (
          <p
            key={`p-${index}`}
            className={
              isLabel
                ? "text-body font-bold! text-text"
                : "text-body text-text-muted"
            }
          >
            {para}
          </p>
        );
      })}
    </div>
  );
}

export function StatsList({
  items,
  columns,
}: {
  items: StatItem[];
  columns: "page" | "column";
}) {
  return (
    <dl
      className={
        columns === "page"
          ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          : "grid grid-cols-2 gap-x-8 gap-y-6"
      }
    >
      {items.map((item) => (
        <div key={`${item.label}-${item.value}`}>
          <dt className="text-eyebrow text-text-muted">{item.label}</dt>
          <dd className="mt-2 text-h2 text-plum">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function BlockRenderer({
  block,
  heading,
}: {
  block: Block;
  /** Rendered in the text column so media can center against the whole section. */
  heading?: ReactNode;
}) {
  switch (block.type) {
    case "richText":
      return (
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <CaseStudyCopy content={block.content} />
        </div>
      );

    case "image":
      return (
        <LightboxImage
          src={block.src}
          alt={block.alt}
          aspectRatio={block.aspectRatio ?? "16 / 9"}
          sizes="(max-width: 768px) 100vw, 960px"
        />
      );

    case "imageGallery":
      return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {block.images.map((image) => (
            <LightboxImage
              key={`${image.src}-${image.alt}`}
              src={image.src}
              alt={image.alt}
              aspectRatio={image.aspectRatio ?? "1 / 1"}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ))}
        </div>
      );

    case "video":
      return (
        <VideoPlayer
          mp4={block.mp4}
          webm={block.webm}
          poster={block.poster}
          alt={block.alt}
          aspectRatio={block.aspectRatio}
        />
      );

    case "twoColumn":
      return (
        <div
          className={`grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16 ${
            block.align === "start" ? "items-start" : "items-center"
          }`}
        >
          <div>
            {heading}
            {block.stats?.length ? (
              <div className={heading ? "mt-10" : undefined}>
                <StatsList items={block.stats} columns="column" />
              </div>
            ) : null}
            <div
              className={
                block.stats?.length
                  ? "mt-4"
                  : heading
                    ? block.align === "start" && block.media.kind !== "image"
                      ? "mt-10"
                      : "mt-6"
                    : undefined
              }
            >
              <CaseStudyCopy content={block.text} />
            </div>
          </div>
          {block.media.kind === "image" ? (
            block.media.matchTextHeight ? (
              <div className="w-full lg:h-0 lg:min-h-full">
                <Image
                  src={block.media.src}
                  alt={block.media.alt}
                  width={Number((block.media.aspectRatio ?? "4 / 3").split("/")[0]) || 4}
                  height={Number((block.media.aspectRatio ?? "4 / 3").split("/")[1]) || 3}
                  className="media-round h-auto w-full object-contain object-left-top lg:h-full lg:w-auto lg:max-w-full"
                  sizes="(max-width: 1024px) 100vw, 640px"
                  unoptimized={block.media.src.endsWith(".svg")}
                />
              </div>
            ) : (
              <div
                className="media-round relative w-full"
                style={{ aspectRatio: block.media.aspectRatio ?? "4 / 3" }}
              >
                <Image
                  src={block.media.src}
                  alt={block.media.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 640px"
                  unoptimized={block.media.src.endsWith(".svg")}
                />
              </div>
            )
          ) : (
            <VideoPlayer
              mp4={block.media.mp4}
              webm={block.media.webm}
              poster={block.media.poster}
              alt={block.media.alt}
              aspectRatio={block.media.aspectRatio}
              fit={block.media.fit ?? "contain"}
              objectPosition={block.media.objectPosition}
            />
          )}
        </div>
      );

    case "quote":
      return (
        <blockquote className="rounded-2xl border border-border bg-surface px-6 py-8 sm:px-10">
          <p className="text-h3 text-text">&ldquo;{block.text}&rdquo;</p>
          {block.attribution ? (
            <footer className="mt-4 text-sm text-text-muted">
              — {block.attribution}
            </footer>
          ) : null}
        </blockquote>
      );

    case "stats":
      return <StatsList items={block.items} columns="page" />;

    case "callout":
      return (
        <aside className="case-callout rounded-2xl border border-border bg-accent-tint/60 px-6 py-5 text-body text-text">
          {block.content}
        </aside>
      );

    case "comparison":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          {[block.before, block.after].map((side) => (
            <figure key={side.alt} className="space-y-3">
              <div
                className="media-frame relative w-full"
                style={{ aspectRatio: "1 / 1" }}
              >
                <Image
                  src={side.src}
                  alt={side.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 480px"
                  unoptimized={side.src.endsWith(".svg")}
                />
              </div>
              {side.label ? (
                <figcaption className="text-eyebrow text-text-muted">
                  {side.label}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      );

    case "custom":
      return (
        <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-8 text-sm text-text-muted">
          Custom component placeholder: <code>{block.component}</code>
        </div>
      );

    default:
      return null;
  }
}
