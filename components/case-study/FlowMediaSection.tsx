"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Block, StatItem } from "@/content/case-studies/_schema";
import { BlockRenderer } from "./blocks/BlockRenderer";
import { VideoPlayer } from "./blocks/VideoPlayer";

type FlowMediaSectionProps = {
  title: string;
  blocks: Block[];
};

type ColumnMedia = Extract<Block, { type: "twoColumn" }>["media"];

type Group = {
  text: string;
  media?: ColumnMedia;
};

type FlowItem =
  | { kind: "text"; group: Group }
  | { kind: "callout"; content: string }
  | { kind: "quote"; text: string; attribution?: string }
  | { kind: "extra"; block: Block };

function textGroups(blocks: Block[]): {
  stats?: StatItem[];
  groups: Group[];
  items: FlowItem[];
} {
  const groups: Group[] = [];
  const items: FlowItem[] = [];
  let stats: StatItem[] | undefined;

  const addGroup = (text: string, media?: ColumnMedia) => {
    const group: Group = { text };
    if (media) group.media = media;
    groups.push(group);
    items.push({ kind: "text", group });
  };

  const attachMedia = (media: ColumnMedia) => {
    const last = groups[groups.length - 1];
    if (last && !last.media) {
      last.media = media;
      return;
    }
    addGroup("", media);
  };

  for (const block of blocks) {
    if (block.type === "stats") {
      if (!stats) stats = block.items;
      continue;
    }
    if (block.type === "twoColumn") {
      if (!stats && block.stats?.length) stats = block.stats;
      addGroup(block.text, block.media);
      continue;
    }
    if (block.type === "richText") {
      addGroup(block.content);
      continue;
    }
    if (block.type === "image") {
      attachMedia({
        kind: "image",
        src: block.src,
        alt: block.alt,
        aspectRatio: block.aspectRatio,
      });
      continue;
    }
    if (block.type === "video") {
      attachMedia({
        kind: "video",
        mp4: block.mp4,
        webm: block.webm,
        poster: block.poster,
        alt: block.alt,
        aspectRatio: block.aspectRatio,
      });
      continue;
    }
    if (block.type === "callout") {
      items.push({ kind: "callout", content: block.content });
      continue;
    }
    if (block.type === "quote") {
      items.push({
        kind: "quote",
        text: block.text,
        attribution: block.attribution,
      });
      continue;
    }
    items.push({ kind: "extra", block });
  }

  // A section with a single loose image or video keeps that media beside the
  // heading, the same way a one-media Kitchens for Good section does.
  const withMedia = groups.filter((group) => group.media);
  if (
    withMedia.length === 1 &&
    groups[0] &&
    groups[0] !== withMedia[0] &&
    !groups[0].media
  ) {
    groups[0].media = withMedia[0].media;
    withMedia[0].media = undefined;
  }

  for (let index = groups.length - 1; index >= 0; index -= 1) {
    const group = groups[index];
    if (group.text || group.media) continue;
    groups.splice(index, 1);
    const itemIndex = items.findIndex(
      (item) => item.kind === "text" && item.group === group,
    );
    if (itemIndex !== -1) items.splice(itemIndex, 1);
  }

  return { stats, groups, items };
}

function Paragraphs({ content }: { content: string }) {
  return (
    <div className="flex flex-col gap-4">
      {content.split("\n\n").map((para) => (
        <p key={para.slice(0, 24)} className="text-body text-text-muted">
          {para}
        </p>
      ))}
    </div>
  );
}

function GroupMedia({
  media,
}: {
  media: NonNullable<Group["media"]>;
}) {
  if (media.kind === "image") {
    return (
      <div
        className="media-round relative w-full"
        style={{ aspectRatio: media.aspectRatio ?? "4 / 3" }}
      >
        <Image
          src={media.src}
          alt={media.alt}
          fill
          className="object-contain"
          sizes="(max-width: 1024px) 100vw, 640px"
          unoptimized={media.src.endsWith(".svg")}
        />
      </div>
    );
  }
  return (
    <VideoPlayer
      mp4={media.mp4}
      webm={media.webm}
      poster={media.poster}
      alt={media.alt}
      aspectRatio={media.aspectRatio}
      fit={media.fit ?? "contain"}
      objectPosition={media.objectPosition}
      framed={false}
    />
  );
}

function Callout({ content }: { content: string }) {
  return (
    <aside className="case-callout rounded-2xl border border-border bg-accent-tint/60 px-6 py-5 text-body text-text">
      <div className="flex flex-col gap-4">
        {content.split("\n\n").map((part) => (
          <p key={part.slice(0, 24)}>{part}</p>
        ))}
      </div>
    </aside>
  );
}

function Quote({ text, attribution }: { text: string; attribution?: string }) {
  return (
    <blockquote className="rounded-2xl border border-border bg-surface px-6 py-8 sm:px-10">
      <p className="text-h3 text-text">&ldquo;{text}&rdquo;</p>
      {attribution ? (
        <footer className="mt-4 text-sm text-text-muted">— {attribution}</footer>
      ) : null}
    </blockquote>
  );
}

/** Body copy stays on the paragraph rhythm; media is pinned beside it. */
export function FlowMediaSection({ title, blocks }: FlowMediaSectionProps) {
  const { stats, groups, items } = textGroups(blocks);
  const columnRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [tops, setTops] = useState<number[]>([]);
  const [columnHeight, setColumnHeight] = useState<number>();

  useLayoutEffect(() => {
    const root = columnRef.current;
    if (!root) return;

    const measure = () => {
      const nextTops: number[] = [];
      let cursor = 0;
      groups.forEach((_, index) => {
        const aligned =
          index === 0
            ? 0
            : (groupRefs.current[index]?.offsetTop ?? root.offsetTop) -
              root.offsetTop;
        const media = mediaRefs.current[index];
        if (!media) {
          nextTops.push(aligned);
          return;
        }
        const top = Math.max(aligned, cursor);
        nextTops.push(top);
        cursor = top + media.offsetHeight + 16;
      });
      let height = root.offsetHeight;
      nextTops.forEach((top, index) => {
        const media = mediaRefs.current[index];
        if (!media) return;
        height = Math.max(height, top + media.offsetHeight);
      });
      setTops((prev) =>
        prev.length === nextTops.length &&
        prev.every((value, index) => value === nextTops[index])
          ? prev
          : nextTops,
      );
      setColumnHeight((prev) => (prev === height ? prev : height));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    mediaRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [groups.length]);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
      <div ref={columnRef}>
        <h2 className="scroll-mt-[12rem] text-h2 text-plum md:scroll-mt-[11rem]">
          {title}
        </h2>
        {stats?.length ? (
          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6">
            {stats.map((item) => (
              <div key={`${item.label}-${item.value}`}>
                <dt className="text-eyebrow text-text-muted">{item.label}</dt>
                <dd className="mt-2 text-h2 text-plum">{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <div className={stats?.length ? "mt-4 flex flex-col gap-4" : "mt-10 flex flex-col gap-4"}>
          {items.map((item, index) => {
            if (item.kind === "callout") {
              return <Callout key={`callout-${index}`} content={item.content} />;
            }
            if (item.kind === "quote") {
              return (
                <Quote
                  key={`quote-${index}`}
                  text={item.text}
                  attribution={item.attribution}
                />
              );
            }
            if (item.kind === "extra") {
              return (
                <BlockRenderer key={`extra-${index}`} block={item.block} />
              );
            }
            const groupIndex = groups.indexOf(item.group);
            return (
              <div
                key={`text-${groupIndex}`}
                ref={(el) => {
                  groupRefs.current[groupIndex] = el;
                }}
              >
                {item.group.text ? <Paragraphs content={item.group.text} /> : null}
                {item.group.media ? (
                  <div className="mt-4 lg:hidden">
                    <GroupMedia media={item.group.media} />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
      <div
        className="relative hidden lg:block"
        style={columnHeight ? { height: columnHeight } : undefined}
      >
        {groups.map((group, index) =>
          group.media ? (
            <div
              key={`${group.text.slice(0, 12)}-media-${index}`}
              ref={(el) => {
                mediaRefs.current[index] = el;
              }}
              className="absolute inset-x-0"
              style={{ top: tops[index] ?? 0 }}
            >
              <GroupMedia media={group.media} />
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}
