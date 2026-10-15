/** Physical studies live at /work/[slug]; the nav should still mark Physical Design. */
export const physicalCaseStudySlugs = new Set([
  "helping-hands",
  "cutlery-caddy",
]);

export function isNavItemActive(pathname: string, href: string): boolean {
  const slug = pathname.match(/^\/work\/([^/]+)/)?.[1];
  if (slug && physicalCaseStudySlugs.has(slug)) {
    return href === "/physical";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
