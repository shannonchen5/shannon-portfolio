import Link from "next/link";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex w-full max-w-[var(--page-max)] flex-col gap-8 px-[var(--page-gutter)] py-12 md:flex-row md:items-end md:justify-between">
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
