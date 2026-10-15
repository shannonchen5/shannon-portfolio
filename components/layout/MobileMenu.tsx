"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { isNavItemActive } from "@/lib/nav-active";
import { easeOut } from "@/lib/motion";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const menuId = useId();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sr-only">{open ? "Close" : "Menu"}</span>
        <span aria-hidden className="relative block h-3.5 w-4">
          <span
            className={cn(
              "absolute left-0 top-0 h-0.5 w-full rounded-full bg-current transition-transform duration-200",
              open && "translate-y-1.5 rotate-45",
            )}
          />
          <span
            className={cn(
              "absolute left-0 top-1.5 h-0.5 w-full rounded-full bg-current transition-opacity duration-200",
              open && "opacity-0",
            )}
          />
          <span
            className={cn(
              "absolute left-0 top-3 h-0.5 w-full rounded-full bg-current transition-transform duration-200",
              open && "-translate-y-1.5 -rotate-45",
            )}
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            key={pathname}
            className="fixed inset-x-0 top-16 bottom-0 z-40 bg-bg px-[var(--page-gutter)] py-8"
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: easeOut }}
          >
            <ul className="flex flex-col gap-2">
              {site.nav.map((item) => {
                const active = isNavItemActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block rounded-2xl px-4 py-3 text-2xl font-semibold tracking-tight transition-colors",
                        active
                          ? "bg-accent-tint text-plum"
                          : "text-text hover:bg-surface",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
