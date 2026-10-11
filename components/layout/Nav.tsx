"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { MobileMenu } from "./MobileMenu";

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let framed = false;
    const onScroll = () => {
      if (framed) return;
      framed = true;
      requestAnimationFrame(() => {
        framed = false;
        setScrolled((prev) => {
          const next = window.scrollY > 8;
          return prev === next ? prev : next;
        });
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-border bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] backdrop-blur-md"
          : "border-transparent bg-bg",
      )}
    >
      <nav
        className="mx-auto flex h-16 w-full max-w-[var(--page-max)] items-center justify-between px-[var(--page-gutter)]"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="link-draw text-sm font-semibold tracking-tight text-text"
        >
          {site.name}
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {site.nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "link-draw text-sm font-medium",
                    active ? "text-plum" : "text-text-muted hover:text-text",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <MobileMenu />
      </nav>
    </header>
  );
}
