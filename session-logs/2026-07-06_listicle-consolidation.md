# 2026-07-06 - June 2026 spam update check + listicle consolidation

## What was done
- Investigated the Google June 2026 spam update (rolled out Jun 24-26) against daily GSC data. Verdict: **no penalty** — no step-change on rollout dates, avg position flat (30.0 → 29.7), impressions dip within normal volatility.
- Flagged risk: near-duplicate self-ranking "best/top agencies" listicles. Consolidated 5 pages → 2:
  - Deleted blog posts: `top-7-web-design-agencies-in-auckland-2025-guide`, `top-auckland-web-design-agencies-2025`, `best-seo-company-auckland-small-businesses`
  - Kept `/7-best-web-design-agencies-in-auckland-2026/` (web design intent) and blog `top-5-seo-agencies-in-auckland-2026` (SEO intent)
- Added `public/_redirects` with path-based 301s from the 3 deleted URLs to the survivors (path redirects work on CF Pages; only hostname-based ones don't).
- Removed the 3 entries from `src/data/site-map.json`.
- De-risked the survivors: removed "Independent review" claims (page copy, meta description, JSON-LD), added visible publisher disclosure boxes on both pages. Blog disclosure also states TopRated NZ is a KWD project.
- Updated `.claude/launch.json` cwd (absolute path not allowed; removed).

## Key findings or decisions
- Site was NOT hit by the June 2026 spam update; GA4 30-day dip predates it.
- Transparent first-party comparison pages kept; deceptive "independent" framing removed sitewide on those pages.
- Charlie still to check GSC UI → Security & Manual Actions manually.

## Open items / next steps
- Changes NOT yet committed/pushed (awaiting Charlie's go-ahead).
- After deploy: spot-check the three 301s in production, and watch GSC for the old URLs dropping out.
