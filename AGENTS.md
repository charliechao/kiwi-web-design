# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server at http://localhost:4321
npm run build      # Build to ./dist (static output)
npm run preview    # Preview built output locally
npx astro check    # TypeScript + Astro type checking (0 errors expected)
```

## Architecture

**Stack:** Astro 5 · Tailwind CSS v4 · Cloudflare Pages · TypeScript strict
**Output:** Fully static (`output: 'static'`), pre-rendered at build time. No SSR.
**Deploy:** Cloudflare Pages via `pages_build_output_dir = "./dist"` in `wrangler.toml`.

### Routing
File-based in `src/pages/`. Trailing slashes enforced (`trailingSlash: 'always'`). Most pages are standalone `.astro` files (not using a shared page template), each page manually imports and composes components.

### Layout System
`src/layouts/Layout.astro` is the single HTML shell. It accepts `title`, `description`, `canonicalURL`, and an optional `schema` prop (injected as JSON-LD `<script type="application/ld+json">`). All pages wrap content in `<Layout>`.

### Shared Components
All in `src/components/`. Key ones:
- **`PageHero.astro`**, hero section with optional split (image right) or centered layout. Props: `eyebrow`, `title`, `subtitle`, `badgeText`, `ctaPrimary`, `ctaSecondary`, `imgSrc`, `centered`. When `imgSrc` is omitted the layout defaults to left-aligned; pass `centered={true}` for centred.
- **`Icon.astro`**, maps emoji strings and named Lucide icon keys to inline SVGs. Use `<Icon name="🌐" />` or `<Icon name="Globe" />`. Add new icons by extending the `icons` map in that file.
- **`ServiceGrid.astro`**, grid of feature/service cards; expects an array of `{ icon, title, description }` objects. Renders icons via `Icon.astro`.
- **`CTABanner.astro`, `FAQAccordion.astro`, `ProcessSteps.astro`, `SectionHeader.astro`, `StatsRow.astro`, `TestimonialGrid.astro`**, self-contained section blocks used across pages.

### Styling
Tailwind v4 loaded via `@tailwindcss/vite`. Brand tokens defined in `src/styles/global.css` under `@theme` (Tailwind v4) and `:root` (legacy CSS variables for Header/Footer):
- `--kwd-yellow: #fbe8a6` / `--color-kwd-yellow`
- `--kwd-dark: #2c2927` / `--color-kwd-dark`
- `--kwd-cream: #f2f1e5` / `--color-kwd-cream`
- Fonts: `DM Serif Display` (headings) · `Poppins` (body)

Most component-level styles are scoped `<style>` blocks inside each `.astro` file.

### Images & Video
Optimised images: import via `astro:assets` and use `<Image>` component, Sharp runs at build time.
Static/unoptimised assets (videos, SVGs, favicons): place in `public/` (copied verbatim) or reference CDN URLs directly.
`src/assets/general/` contains the bulk of page images and `Auckland_Video.mp4`.

### SEO / Sitemap
`@astrojs/sitemap` auto-generates sitemap from all static pages. `site` is set to `https://www.kiwiwebdesign.co.nz` in `astro.config.mjs`. JSON-LD schema is injected per-page via the `schema` prop on `<Layout>`.

## Key Constraints
- No React/Vue/Svelte, vanilla Astro components only. Use `<script is:inline>` for third-party CDN libraries (e.g. Vanta.js, Three.js) that need browser globals.
- Cloudflare adapter is present but only for image processing at build time, there are no Cloudflare Workers/KV/D1 bindings in use.
- `lucide-astro` is installed for icon use but icons are currently rendered via the custom `Icon.astro` mapper, not imported directly from `lucide-astro`.

<!-- SHARED_BRAIN:START -->
## Shared brain connection (managed)

This project uses the shared AI brain and external-tools hub at:

`C:\Users\charl\OneDrive\Desktop\AI Tools`

Project ID: `kiwi_web_design_site`

This block is used by both Codex and Claude Code. Keep project-specific instructions outside the managed markers.

### At the start of a task

1. Read `C:\Users\charl\OneDrive\Desktop\AI Tools\AGENTS.md` and `C:\Users\charl\OneDrive\Desktop\AI Tools\brain\GOVERNANCE.md`.
2. Load the project-safe context:

   ```powershell
   python "C:\Users\charl\OneDrive\Desktop\AI Tools\scripts\brain.py" context --project kiwi_web_design_site
   ```

3. Treat approved knowledge as guidance, candidate knowledge as unapproved suggestions, and current project files/API/runtime state as the source of truth for facts that may have changed.
4. For external tools, use the tool profile named in the project context, if one is registered. Never copy credentials into this repository or print secret values.

### Automatic learning loop

At the end of every meaningful task:

1. Decide whether the work produced a durable preference, guardrail, decision, lesson, playbook, warning, or reusable fact. Skip routine outcomes, raw logs, one-off content, secrets, personal data, and easily rediscovered details.
2. Search existing approved and candidate knowledge before adding anything:

   ```powershell
   python "C:\Users\charl\OneDrive\Desktop\AI Tools\scripts\brain.py" search "<short lesson query>" --project kiwi_web_design_site --include-candidates
   ```

3. If the learning is genuinely new, add one concise evidence-backed candidate. Use project scope by default:

   ```powershell
   python "C:\Users\charl\OneDrive\Desktop\AI Tools\scripts\brain.py" add-candidate --title "<durable title>" --summary "<what was learned and when it applies>" --type lesson --scope-level project --project kiwi_web_design_site --source "<evidence path or URL>"
   ```

4. Use business or global scope only when the lesson is reusable across those boundaries and contains no client-specific facts. Never put one client's IDs, performance, contacts, content, or confidential data into another project's context.
5. Candidates may be shared immediately as clearly labelled suggestions, but they are not authoritative. Promote only after independent verification:

   ```powershell
   python "C:\Users\charl\OneDrive\Desktop\AI Tools\scripts\brain.py" promote <candidate-id> --evidence-note "<how it was independently verified>"
   ```

6. Run `python "C:\Users\charl\OneDrive\Desktop\AI Tools\scripts\brain.py" validate` after a brain change.

The user's standing authorization covers these concise candidate updates in the shared brain, including after a review-only task. It does not authorize edits to the reviewed project, external mutations, deployment, sending, spending, or candidate promotion.
<!-- SHARED_BRAIN:END -->
