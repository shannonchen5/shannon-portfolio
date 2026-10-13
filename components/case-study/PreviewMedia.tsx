"use client";

import type { CaseStudy } from "@/content/case-studies/_schema";
import { ParallaxMedia } from "@/components/ui/ParallaxMedia";
import { VideoPlayer } from "@/components/case-study/blocks/VideoPlayer";

type PreviewMediaProps = {
  study: CaseStudy;
  aspectRatio?: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

/** Case-study preview: the hero recording when it exists, otherwise the cover. */
export function PreviewMedia({
  study,
  aspectRatio = "16 / 10",
  sizes,
  className,
  priority,
}: PreviewMediaProps) {
  const video = study.heroVideo;

  if (video) {
    return (
      <VideoPlayer
        mp4={video.mp4}
        webm={video.webm}
        poster={video.poster || study.cover.src}
        alt=""
        aspectRatio={video.aspectRatio ?? aspectRatio}
        className={className}
      />
    );
  }

  return (
    <ParallaxMedia
      src={study.cover.src}
      alt=""
      aspectRatio={study.cover.aspectRatio ?? aspectRatio}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}
