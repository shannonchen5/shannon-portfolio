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
    <header className="relative isolate overflow-x-clip pt-16 sm:pt-20">
      <div className="relative mx-auto w-full max-w-[var(--page-max)] px-[var(--page-gutter)]">
        <div className="relative mx-auto w-fit max-w-full">
          <h1 className="relative text-hero text-plum">
            <span className="invisible block whitespace-nowrap" aria-hidden>
              Shannon Chen&apos;s
            </span>
            <span className="absolute left-0 top-0 whitespace-nowrap">
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
