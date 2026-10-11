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
        "sticky top-0 z-50 border-b border-white/15 bg-[var(--nav)] text-white transition-[background-color,border-color] duration-300",
        scrolled && "shadow-[0_4px_24px_rgba(123,74,104,0.28)]",
      )}
    >
      <nav
        className="mx-auto flex h-16 w-full max-w-[var(--page-max)] items-center justify-between px-[var(--page-gutter)]"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="link-draw text-sm font-semibold tracking-tight text-white"
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
                    "link-draw text-sm font-medium text-white/80 hover:text-white",
                    active && "text-white",
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
