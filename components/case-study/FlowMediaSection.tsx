"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Block, StatItem } from "@/content/case-studies/_schema";
import { VideoPlayer } from "./blocks/VideoPlayer";

type FlowMediaSectionProps = {
  title: string;
  blocks: Block[];
};

type Group = {
  text: string;
  media?: Extract<Block, { type: "twoColumn" }>["media"];
};

function textGroups(blocks: Block[]): { stats?: StatItem[]; groups: Group[] } {
  const groups: Group[] = [];
  let stats: StatItem[] | undefined;
  for (const block of blocks) {
    if (block.type === "twoColumn") {
      if (!stats && block.stats?.length) stats = block.stats;
      groups.push({ text: block.text, media: block.media });
    } else if (block.type === "richText") {
      groups.push({ text: block.content });
    }
  }
  return { stats, groups };
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

/** Body copy stays on the paragraph rhythm; media is pinned beside it. */
export function FlowMediaSection({ title, blocks }: FlowMediaSectionProps) {
  const { stats, groups } = textGroups(blocks);
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
          {groups.map((group, index) => (
            <div
              key={`${group.text.slice(0, 24)}-${index}`}
              ref={(el) => {
                groupRefs.current[index] = el;
              }}
            >
              <Paragraphs content={group.text} />
              {group.media ? (
                <div className="mt-4 lg:hidden">
                  <GroupMedia media={group.media} />
                </div>
              ) : null}
            </div>
          ))}
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
