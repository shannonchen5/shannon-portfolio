import { site as siteDefaults } from "@/content/site";

type HeroTitleProps = {
  children: string;
};

/**
 * Page title in the homepage hero’s size and position.
 * An invisible copy of the hero’s first line and intro sets the box,
 * so the visible title shares that left edge at every width.
 */
export function HeroTitle({ children }: HeroTitleProps) {
  return (
    <header className="relative isolate overflow-visible pt-16 sm:pt-20">
      <div className="@container relative mx-auto w-full max-w-[var(--page-max)] px-[var(--page-gutter)]">
        <div className="relative mx-auto w-fit max-w-full">
          <h1
            className="grid text-hero text-plum"
            style={{ lineHeight: 1.25 }}
          >
            <span
              className="invisible col-start-1 row-start-1 whitespace-nowrap"
              aria-hidden
            >
              Shannon Chen
            </span>
            <span className="col-start-1 row-start-1 whitespace-nowrap pb-[0.06em]">
              {children}
            </span>
          </h1>
          <div aria-hidden className="h-0 max-w-full overflow-hidden sm:max-w-md">
            <p className="invisible text-body">{siteDefaults.hero.intro}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
