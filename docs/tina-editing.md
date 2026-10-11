# Editing copy with TinaCMS

This portfolio uses [TinaCMS](https://tina.io) so you can edit site and case study copy in the browser and save changes back to GitHub.

## Local editing

1. From the project root:

   ```bash
   npm run dev
   ```

   This starts Tina’s local GraphQL server and Next.js together.

2. Open the admin UI: [http://localhost:3000/admin](http://localhost:3000/admin)  
   (or `/admin/index.html`)

3. Sign in (local mode) and open a collection:
   - **Site** — name, hero intro, about body, nav, contact email
   - **Case Studies** — titles, summaries, sections, and block copy

4. For **visual (click-the-page) editing**, open a case study from the Case Studies list (Tina routes to `/work/[slug]`). Edits in the sidebar update the page live. Save writes to the JSON files under `content/`.

## Content files

| What | File |
| --- | --- |
| Site-wide copy | `content/site.json` |
| Kitchens for Good | `content/case-studies/kitchens-for-good.json` |
| Current | `content/case-studies/current-calendar-extension.json` |
| Autumn Moon | `content/case-studies/autumn-moon-festival.json` |

You can still edit these JSON files directly in Cursor if you prefer.

## Tina Cloud + GitHub (production `/admin`)

Local `npm run dev` works without Tina Cloud. For a deployed site (e.g. Vercel) where `/admin` should log in and **commit to GitHub**:

1. Create a project at [https://app.tina.io](https://app.tina.io).
2. Connect the GitHub repo `shannonchen5/shannon-portfolio` and select the `master` branch.
3. Copy **Client ID** and **Token** from the Tina project.
4. Add env vars locally (`.env`) and on Vercel:

   ```
   NEXT_PUBLIC_TINA_CLIENT_ID=...
   TINA_TOKEN=...
   NEXT_PUBLIC_TINA_BRANCH=master
   ```

   See `.env.example`.

5. Redeploy. Production `npm run build` will use Tina Cloud when those vars are set.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Tina local GraphQL + `next dev` |
| `npm run build` | `tinacms build` (local or cloud) + `next build` |
| `npm run dev:next` | Next only (no Tina server / no visual edit hydration) |
