import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";

const socials = [
  { label: "Resume", href: site.resume.href },
  ...site.socials,
  site.photography,
];

const viewMore = [{ label: "Home", href: "/" }, ...site.nav];

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#f6f2f8]">
      <div className="mx-auto w-full max-w-[var(--page-max)] p-[var(--page-gutter)]">
        <div className="grid items-start gap-12 md:grid-cols-3 md:items-baseline md:gap-x-16 lg:gap-x-24">
          <div>
            <h2 className="m-0 text-h2 text-text">Thanks for visiting</h2>
            <div className="mt-6">
              <Button
                href="/contact"
                className="bg-[#f2a93b]! text-[#1a1a1a]! hover:bg-[#e09828]! focus-visible:outline-[#f2a93b]!"
              >
                Contact Me
              </Button>
            </div>
          </div>

          <div>
            <h2 className="m-0 text-h3 text-text">Socials</h2>
            <ul className="mt-6 flex flex-col gap-2">
              {socials.map((social) => (
                <li key={social.label}>
                  <FooterLink href={social.href}>{social.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="View more">
            <h2 className="m-0 text-h3 text-text">View more</h2>
            <ul className="mt-6 flex flex-col gap-2">
              {viewMore.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-6 border-t border-border pt-6 text-center text-sm text-text-muted">
          © 2026 {site.name}
        </p>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const className = "link-draw w-fit text-base text-text hover:text-plum";

  if (!href) {
    return <span className="text-base text-text">{children}</span>;
  }

  if (href.startsWith("mailto:") || href.startsWith("tel:")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  if (href.startsWith("http")) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
