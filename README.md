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

Deploy on Vercel by importing this repo.

## Design tokens

Colors, type, radii, and shadows live in `app/globals.css` as CSS variables and Tailwind `@theme` tokens. Change them once to restyle the site.

## How to add a new case study

1. Add images/videos under `public/media/your-project/`.
2. Add `content/case-studies/your-slug.json`.
3. Import and register it in `content/case-studies/index.ts`.
4. That’s it — `/work/your-slug`, category indexes, and the timeline checkpoints update automatically from `sections[]`.

### Starter file (`content/case-studies/your-slug.json`)

```json
{
  "slug": "your-slug",
  "title": "[Project title]",
  "category": "digital",
  "summary": "[Your one-line summary here.]",
  "role": "[Your role]",
  "duration": "[Timeline / duration]",
  "team": "[Team composition]",
  "tools": ["[Tool 1]", "[Tool 2]"],
  "cover": {
    "src": "/media/your-project/cover.jpg",
    "alt": "[Cover image alt text]",
    "aspectRatio": "16 / 10"
  },
  "featured": true,
  "stats": [{ "value": "[Stat]", "label": "[Label]" }],
  "sections": [
    {
      "id": "overview",
      "title": "Overview",
      "blocks": [{ "type": "richText", "content": "[Your copy here.]" }]
    }
  ]
}
```

Register it in `content/case-studies/index.ts`:

```ts
import yourStudy from "./your-slug.json";

const caseStudies: CaseStudy[] = [
  // ...existing
  yourStudy as CaseStudy,
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
