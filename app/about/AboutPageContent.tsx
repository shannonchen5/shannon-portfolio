"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { site as siteDefaults } from "@/content/site";
import { cn } from "@/lib/cn";

const stories = [
  {
    text: "Hello! I’m Shannon, a product designer and student at UC San Diego studying Cognitive Science with a specialization in Design and Interaction and a minor in Computer Science. I design digital and physical products that help people overcome barriers and help businesses grow, pairing every design decision with the impact it will have and the metric that proves it.",
    src: "/media/about/Headshot.jpg",
    alt: "Shannon Chen smiling in a striped shirt against a pale curtain",
    width: 3265,
    height: 4898,
    side: "right",
    angle: 2.5,
  },
  {
    text: "You’ve met little runners throughout my portfolio because running taught me to work harder than my competition, to put in extra time outside of practice, and to slowly chip away at a goal I set for myself months in advance. After completing two half-marathons and one full marathon, I know what it takes to commit to a goal for the long haul. In design, that looks like going the extra mile in research, iterating past “good enough,” and being a team player who relies on the people around me, supports them in return, and grows together with them.",
    src: "/media/about/Run.jpg",
    alt: "Shannon Chen taking a selfie while running on a path at dusk",
    width: 3024,
    height: 4032,
    side: "left",
    angle: -2.5,
  },
  {
    text: "Additionally, I’m a photographer, which has trained my eye to read different subjects in different environments and to make decisions on the spot to get the best result. That instinct carries into my design work: I observe closely, adapt quickly to the people and context in front of me, and stay decisive when a project is moving fast.",
    src: "/media/about/Photography.jpg",
    alt: "Shannon Chen smiling behind a camera",
    width: 4000,
    height: 6000,
    side: "right",
    angle: 2,
  },
] as const;

function StoryPhoto({
  story,
  className,
}: {
  story: (typeof stories)[number];
  className?: string;
}) {
  return (
    <div
      className={cn(
        className,
        "w-[min(13rem,70%)] md:w-full",
        story.side === "right" ? "ml-auto" : "mr-auto",
      )}
    >
      <div
        className="rounded-[var(--radius-media)] shadow-[var(--shadow-warm)]"
        style={{ transform: `rotate(${story.angle}deg)` }}
      >
        <div className="media-round relative w-full">
          <Image
            src={story.src}
            alt={story.alt}
            width={story.width}
            height={story.height}
            className="h-auto w-full"
            sizes="(max-width: 768px) 70vw, 208px"
          />
        </div>
      </div>
    </div>
  );
}

export function AboutPageContent() {
  return (
    <>
      <header className="relative isolate overflow-x-clip pt-16 sm:pt-20">
        <div className="relative mx-auto w-full max-w-[var(--page-max)] px-[var(--page-gutter)]">
          <div className="relative mx-auto w-fit max-w-full">
            <h1 className="relative text-hero text-plum">
              {/* Same width as the home hero’s first line, so this title shares its left edge. */}
              <span className="invisible block whitespace-nowrap" aria-hidden>
                Shannon Chen&apos;s
              </span>
              <span className="absolute left-0 top-0 whitespace-nowrap">
                About Me
              </span>
            </h1>
            {/* Matches the hero intro’s width so the title block lines up on small screens. */}
            <div aria-hidden className="h-0 max-w-full overflow-hidden sm:max-w-md">
              <p className="invisible text-body">{siteDefaults.hero.intro}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="pb-16 pt-14 sm:pb-24">
        <div className="mx-auto w-full max-w-[var(--page-max)] px-[var(--page-gutter)]">
          <FadeIn className="mx-auto w-full max-w-4xl text-left">
            <div className="flex flex-col gap-16 sm:gap-20">
              {stories.map((story) => (
                <article
                  key={story.src}
                  className={cn(
                    "grid items-center gap-6 md:gap-x-6",
                    story.side === "right"
                      ? "md:grid-cols-[minmax(0,1fr)_13rem]"
                      : "md:grid-cols-[13rem_minmax(0,1fr)]",
                  )}
                >
                  {story.side === "left" ? (
                    <StoryPhoto story={story} className="order-2 md:order-1" />
                  ) : null}
                  <p
                    className={cn(
                      "text-left text-body text-text-muted",
                      story.side === "left" && "order-1 md:order-2",
                    )}
                  >
                    {story.text}
                  </p>
                  {story.side === "right" ? <StoryPhoto story={story} /> : null}
                </article>
              ))}
            </div>

            <div className="mt-14 flex flex-wrap gap-3">
              <Button href="/contact">Contact Me</Button>
              <Button href="/#work" variant="secondary">
                View Case Studies
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </>
  );
}
