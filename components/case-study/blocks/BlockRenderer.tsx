import Image from "next/image";
import type { Block } from "@/content/case-studies/_schema";
import { LightboxImage } from "@/components/ui/LightboxImage";
import { VideoPlayer } from "./VideoPlayer";

function Paragraphs({ content }: { content: string }) {
  return (
    <div className="space-y-4">
      {content.split("\n\n").map((para) => (
        <p key={para.slice(0, 24)} className="text-body text-text-muted">
          {para}
        </p>
      ))}
    </div>
  );
}

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "richText":
      return <Paragraphs content={block.content} />;

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
        <div className="grid items-center gap-8 md:grid-cols-2">
          <Paragraphs content={block.text} />
          {block.media.kind === "image" ? (
            <div
              className="media-frame relative w-full"
              style={{ aspectRatio: block.media.aspectRatio ?? "1 / 1" }}
            >
              <Image
                src={block.media.src}
                alt={block.media.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 480px"
                unoptimized={block.media.src.endsWith(".svg")}
              />
            </div>
          ) : (
            <VideoPlayer
              mp4={block.media.mp4}
              webm={block.media.webm}
              poster={block.media.poster}
              alt={block.media.alt}
              aspectRatio={block.media.aspectRatio}
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
      return (
        <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {block.items.map((item) => (
            <div key={`${item.label}-${item.value}`}>
              <dt className="text-eyebrow text-text-muted">{item.label}</dt>
              <dd className="mt-2 text-h2 text-plum">{item.value}</dd>
            </div>
          ))}
        </dl>
      );

    case "callout":
      return (
        <aside className="rounded-2xl border border-border bg-accent-tint/60 px-6 py-5 text-body text-text">
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
