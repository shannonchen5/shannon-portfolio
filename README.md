# Shannon Chen — Portfolio

Running-themed UX/product design portfolio built with Next.js (App Router), TypeScript, Tailwind CSS, and Motion.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve production build
```

Deploy on Vercel by importing this repo (no special config required).

## Design tokens

Colors, type, radii, and shadows live in `app/globals.css` as CSS variables and Tailwind `@theme` tokens. Change them once to restyle the site.

## How to add a new case study

1. Add images/videos under `public/media/your-project/`.
2. Copy the starter below into `content/case-studies/your-slug.ts`.
3. Import and register it in `content/case-studies/index.ts`.
4. That’s it — `/work/your-slug`, category indexes, and the timeline checkpoints update automatically from `sections[]`.

### Starter file

```ts
import type { CaseStudy } from "./_schema";

const study: CaseStudy = {
  slug: "your-slug",
  title: "[Project title]",
  category: "digital", // or "physical"
  summary: "[Your one-line summary here.]",
  role: "[Your role]",
  duration: "[Timeline / duration]",
  team: "[Team composition]",
  tools: ["[Tool 1]", "[Tool 2]"],
  cover: {
    src: "/media/your-project/cover.jpg",
    alt: "[Cover image alt text]",
    aspectRatio: "16 / 10",
  },
  featured: true,
  stats: [
    { value: "[Stat]", label: "[Label]" },
  ],
  sections: [
    {
      id: "overview",
      title: "Overview",
      blocks: [
        { type: "richText", content: "[Your copy here.]" },
      ],
    },
    {
      id: "research",
      title: "Research",
      blocks: [
        { type: "richText", content: "[Your copy here.]" },
      ],
    },
    {
      id: "design",
      title: "Design",
      blocks: [
        {
          type: "image",
          src: "/media/your-project/screen.jpg",
          alt: "[Alt text]",
          aspectRatio: "16 / 9",
        },
      ],
    },
    {
      id: "results",
      title: "Results",
      blocks: [
        { type: "richText", content: "[Your copy here.]" },
      ],
    },
  ],
};

export default study;
```

Register it:

```ts
// content/case-studies/index.ts
import yourStudy from "./your-slug";

const caseStudies: CaseStudy[] = [
  // ...existing
  yourStudy,
];
```

### Supported block types

`richText` · `image` · `imageGallery` · `video` · `twoColumn` · `quote` · `stats` · `callout` · `comparison` · `custom`

## Project structure

- `app/` — routes (Home, Digital, Physical, Work, About, Contact)
- `components/` — UI, layout, hero tracks, case study template
- `content/` — typed site + case study data
- `public/media/` — images and screen recordings

## Placeholder policy

Copy, stats, and claims use obvious placeholders like `[Your copy here]` until you replace them with real content.
