import type { Block, CaseStudy, CaseStudyBrand, Category } from "@/content/case-studies/_schema";

/** Map Tina case study document → portfolio CaseStudy shape. */
export function mapTinaCaseStudy(doc: Record<string, unknown>): CaseStudy {
  const cover = (doc.cover ?? {}) as Record<string, unknown>;
  const sections = Array.isArray(doc.sections) ? doc.sections : [];

  return {
    slug: String(doc.slug ?? ""),
    title: String(doc.title ?? ""),
    category: (doc.category as Category) ?? "digital",
    summary: String(doc.summary ?? ""),
    role: String(doc.role ?? ""),
    duration: String(doc.duration ?? ""),
    team: String(doc.team ?? ""),
    tools: Array.isArray(doc.tools)
      ? doc.tools.filter((t): t is string => typeof t === "string")
      : [],
    cover: {
      src: String(cover.src ?? ""),
      alt: String(cover.alt ?? ""),
      aspectRatio: cover.aspectRatio
        ? String(cover.aspectRatio)
        : undefined,
    },
    featured: Boolean(doc.featured),
    brand: doc.brand ? (doc.brand as CaseStudyBrand) : undefined,
    stats: Array.isArray(doc.stats)
      ? doc.stats
          .filter(Boolean)
          .map((s) => {
            const item = s as Record<string, unknown>;
            return {
              value: String(item.value ?? ""),
              label: String(item.label ?? ""),
            };
          })
      : undefined,
    sections: sections.filter(Boolean).map((section) => {
      const s = section as Record<string, unknown>;
      const blocks = Array.isArray(s.blocks) ? s.blocks : [];
      return {
        id: String(s.id ?? ""),
        title: String(s.title ?? ""),
        blocks: blocks.filter(Boolean).map((block) => {
          const b = block as Record<string, unknown>;
          return normalizeBlock(b);
        }),
      };
    }),
  };
}

function normalizeBlock(b: Record<string, unknown>): Block {
  const type = String(b.type ?? "richText");

  switch (type) {
    case "richText":
    case "callout":
      return { type, content: String(b.content ?? "") };
    case "quote":
      return {
        type: "quote",
        text: String(b.text ?? ""),
        attribution: b.attribution ? String(b.attribution) : undefined,
      };
    case "image":
      return {
        type: "image",
        src: String(b.src ?? ""),
        alt: String(b.alt ?? ""),
        aspectRatio: b.aspectRatio ? String(b.aspectRatio) : undefined,
      };
    case "stats":
      return {
        type: "stats",
        items: Array.isArray(b.items)
          ? b.items.filter(Boolean).map((item) => {
              const s = item as Record<string, unknown>;
              return {
                value: String(s.value ?? ""),
                label: String(s.label ?? ""),
              };
            })
          : [],
      };
    default:
      return { type: "richText", content: String(b.content ?? "") };
  }
}
