"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Block, StatItem } from "@/content/case-studies/_schema";
import { Fireworks } from "./Fireworks";
import { BlockRenderer, CaseStudyCopy, StatsList } from "./blocks/BlockRenderer";
import { VideoPlayer } from "./blocks/VideoPlayer";

type FlowMediaSectionProps = {
  title: string;
  blocks: Block[];
};

type ColumnMedia = Extract<Block, { type: "twoColumn" }>["media"];

type Group = {
  text: string;
  media?: ColumnMedia;
  stats?: StatItem[];
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

  const addGroup = (text: string, media?: ColumnMedia, stats?: StatItem[]) => {
    const group: Group = { text };
    if (media) group.media = media;
    if (stats?.length) group.stats = stats;
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
      addGroup(block.content, undefined, block.stats);
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

function GroupMedia({
  media,
  frameHeight,
}: {
  media: NonNullable<Group["media"]>;
  frameHeight?: number;
}) {
  if (media.kind === "image" && media.src.endsWith("next-steps-fireworks.png")) {
    return <Fireworks />;
  }

  if (media.kind === "image" && media.matchTextHeight && frameHeight) {
    return (
      <div className="media-round relative w-full max-w-full" style={{ height: frameHeight }}>
        <Image
          src={media.src}
          alt={media.alt}
          fill
          className="object-contain object-left-top"
          sizes="(max-width: 1024px) 100vw, 640px"
          unoptimized={media.src.endsWith(".svg")}
        />
      </div>
    );
  }

  if (media.kind === "image") {
    return (
      <div
        className="media-round relative w-full min-w-0 max-w-full"
        style={{
          aspectRatio: media.aspectRatio ?? "4 / 3",
          maxWidth: media.maxWidth ? `min(100%, ${media.maxWidth})` : undefined,
        }}
      >
        <Image
          src={media.src}
          alt={media.alt}
          fill
          className={
            media.fit === "cover" ? "object-cover" : "object-contain object-left-top"
          }
          style={media.objectPosition ? { objectPosition: media.objectPosition } : undefined}
          sizes="(max-width: 1024px) 100vw, 640px"
          unoptimized={media.src.endsWith(".svg")}
        />
      </div>
    );
  }
  const impactLaptop = media.mp4.includes("Hero%20%2B%20Impact");
  return (
    <div className="relative min-w-0 max-w-full">
      {impactLaptop ? <CheckPrototypeNote /> : null}
      <VideoPlayer
        mp4={media.mp4}
        webm={media.webm}
        poster={media.poster}
        alt={media.alt}
        aspectRatio={media.aspectRatio}
        fit={media.fit ?? "contain"}
        objectPosition={media.objectPosition}
      />
    </div>
  );
}

function CheckPrototypeNote() {
  return (
    <img
      src="/media/Helping%20Hands/Final%20Helping%20Hands%20Media/check%20prototype.png"
      alt="check prototype"
      width={460}
      height={158}
      className="pointer-events-none mb-3 h-auto w-[min(13rem,80%)] max-w-full lg:absolute lg:mb-0 lg:w-52 lg:max-w-none"
      style={{
        right: "calc(100% - 100% * 26 / 1300)",
        top: "calc(93% - 13rem * 40 / 460)",
      }}
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
  const [boxes, setBoxes] = useState<{ top: number; height?: number }[]>([]);
  const [columnHeight, setColumnHeight] = useState<number>();

  useLayoutEffect(() => {
    const root = columnRef.current;
    if (!root) return;

    const measure = () => {
      const nextBoxes: { top: number; height?: number }[] = [];
      let cursor = 0;
      let placedMedia = false;
      groups.forEach((group, index) => {
        const groupEl = groupRefs.current[index];
        const groupTop = groupEl ? groupEl.offsetTop - root.offsetTop : 0;
        const groupHeight = groupEl?.offsetHeight ?? 0;
        const matchText =
          group.media?.kind === "image" && group.media.matchTextHeight;
        if (!group.media) {
          nextBoxes.push({ top: groupTop });
          return;
        }
        // The first image or video lines up with the section header.
        const aligned = placedMedia ? groupTop : 0;
        if (matchText && groupHeight > 0) {
          const top = Math.max(aligned, cursor);
          const height = index === 0 ? groupTop + groupHeight : groupHeight;
          nextBoxes.push({ top, height });
          const media = mediaRefs.current[index];
          cursor = top + Math.max(height, media?.offsetHeight ?? 0) + 16;
          placedMedia = true;
          return;
        }
        const top = Math.max(aligned, cursor);
        nextBoxes.push({ top });
        const media = mediaRefs.current[index];
        cursor = top + (media?.offsetHeight ?? 0) + 16;
        placedMedia = true;
      });
      let floor = 0;
      nextBoxes.forEach((box, index) => {
        if (!groups[index]?.media) return;
        if (box.top < floor) box.top = floor;
        const media = mediaRefs.current[index];
        floor = box.top + (box.height ?? media?.offsetHeight ?? 0) + 16;
      });
      let height = root.offsetHeight;
      nextBoxes.forEach((box, index) => {
        const media = mediaRefs.current[index];
        if (!media && box.height == null) return;
        height = Math.max(height, box.top + (box.height ?? media?.offsetHeight ?? 0));
      });
      setBoxes((prev) =>
        prev.length === nextBoxes.length &&
        prev.every(
          (value, index) =>
            value.top === nextBoxes[index]?.top &&
            value.height === nextBoxes[index]?.height,
        )
          ? prev
          : nextBoxes,
      );
      setColumnHeight((prev) => (prev === height ? prev : height));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    mediaRefs.current.forEach((el) => {
      if (!el) return;
      observer.observe(el);
      el.querySelectorAll("img,video").forEach((child) => observer.observe(child));
    });
    return () => observer.disconnect();
  }, [groups.length]);

  return (
    <div className="grid min-w-0 items-start gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
      <div ref={columnRef} className="min-w-0">
        <h2 className="scroll-mt-[12rem] text-h2 text-plum md:scroll-mt-[11rem]">
          {title}
        </h2>
        {stats?.length ? (
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 sm:gap-x-8">
            {stats.map((item) => (
              <div key={`${item.label}-${item.value}`} className="min-w-0">
                <dt className="text-eyebrow text-text-muted">{item.label}</dt>
                <dd className="mt-2 break-words text-h2 text-plum">{item.value}</dd>
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
                {item.group.text ? <CaseStudyCopy content={item.group.text} /> : null}
                {item.group.stats?.length ? (
                  <div className="mt-6">
                    <StatsList items={item.group.stats} columns="column" />
                  </div>
                ) : null}
                {item.group.media ? (
                  <div className="mt-4 min-w-0 max-w-full lg:hidden">
                    <GroupMedia media={item.group.media} />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
      <div
        className="relative hidden min-w-0 lg:block"
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
              style={{ top: boxes[index]?.top ?? 0 }}
            >
              <GroupMedia media={group.media} frameHeight={boxes[index]?.height} />
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}
