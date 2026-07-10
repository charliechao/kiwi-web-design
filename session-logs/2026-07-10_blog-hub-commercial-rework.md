# 2026-07-10 - Blog hub reworked into hybrid commercial page

## What was done
- GSC+GA4 90-day analysis identified strongest pages and keyword opportunities (see memory: Organic Strength + Opportunity Analysis).
- Reworked /affordable-web-design-auckland/ (commit 4bc7892, pushed to main): was a plain blog index titled "Free web design resources", ranking pos 9-23 for ~2,300 impr/90d of "affordable web design/website auckland" queries with 0 clicks.
- Added PageHero (H1 "Affordable Web Design Auckland", pricing-led subtitle, dual CTA to quote + full packages page), StatsRow (from $1,290 / 2-3 wks / 50+ / 4.9★), retitled meta/title, updated JSON-LD from Blog to CollectionPage with accurate name/description. Blog post grid kept unchanged below a "Free Resources" section header.
- Updated site-map.json entry: isHub true, new suggestedAnchorText, hybrid description.
- Positioned deliberately distinct from /small-business-website-design-auckland/ (different query cluster - "affordable" vs "small business") to avoid re-creating a cannibalization problem.

## Key findings or decisions
- Rebased onto origin/main before push — another session had pushed 14 unrelated commits (new Google Ads landing page funnel, GA4 conversion tracking fixes). No file overlap, clean rebase.
- Verified via built HTML (title, meta, H1, 4 stats, both CTAs, canonical, schema type, 38 post cards intact) since local preview server config points outside this worktree.

## Open items / next steps
- Charlie wants to review other opportunity items next (affordable SEO cluster / map pack + reviews, blog hub→SEO defence, AI SEO page push, GBP review count mismatch on homepage, zh expansion).
- Watch GSC over coming weeks for this URL's position/CTR movement on "affordable web design auckland" cluster.
