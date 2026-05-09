# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
