import Link from "next/link";
import { Track } from "@/components/track/Track";
import { site } from "@/content/site";
import { FOOTER_SWEEP } from "@/lib/track-geometry";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-surface">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 opacity-80"
      >
        <Track
          segments={FOOTER_SWEEP.segments}
          viewBox={FOOTER_SWEEP.viewBox}
          color="#F2A93B"
          opacity={0.55}
          laneWidth={2.5}
          laneGap={2.5}
          className="h-full w-full"
        />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-lg font-semibold tracking-tight text-text">
            {site.name}
          </p>
          <p className="mt-2 max-w-sm text-sm text-text-muted">
            [Your tagline here.]
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="link-draw text-text-muted hover:text-text"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2 text-sm text-text-muted">
          {site.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="link-draw hover:text-text"
              {...(social.href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {social.label}
            </a>
          ))}
          <p className="mt-2">© 2026 {site.name}</p>
        </div>
      </div>
    </footer>
  );
}
