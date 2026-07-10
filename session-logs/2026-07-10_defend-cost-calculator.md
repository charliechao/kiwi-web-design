# 2026-07-10 - Defend and squeeze the website cost calculator page (addendum)

## What was done
- Reworked /affordable-web-design-auckland/website-cost-new-zealand-small-business/ (commit 0158d8f, pushed to main), the site's #1 organic asset (~60% of all organic clicks, 254 GA4 organic sessions/90d, 57 key events) which was slipping (pos 8->10, -1,256 impressions/month) against a SERP of static competitor price guides.
- Title/meta rewritten to lead with the calculator's real differentiator (instant/interactive/no email) instead of a generic "prices guide" framing indistinguishable from competitors.
- dateModified bumped 2026-03-19 -> 2026-07-10 (justified by real content edits: snippet rewrite, updated-line, breadcrumb fix), matching competitor pages that show 2026 dates.
- Breadcrumb schema aligned with the affordable-web-design-auckland hub rename (previous session): "Blog" -> "Affordable Web Design Auckland".
- Found this page only had 3 internal links total (2 buried in FAQ accordions, 1 chip on the Google Ads calculator page) despite being the top asset. Fixed:
  - Added to the sitewide footer Company column -> now linked from all 111 built pages.
  - Added a visible note under the homepage pricing/packages section.
  - Added to the contact page's "popular starting points" strip.
  - Added to eCommerce, Shopify, WooCommerce service pages (cost is a natural adjacent question there).
- Updated site-map.json entry (isHub: true, real importance noted, suggestedAnchorText).
- Discovered (not touched): src/content/blog/website-cost-new-zealand-small-business.md is a shadowed content-collection entry at the exact same URL as this static .astro page (explains the known "harmless" route-priority build warning). Its frontmatter (title/image) is still legitimately used as the teaser card on the blog hub listing — do NOT delete it, that would remove the hub's link to this page.

## Key findings or decisions
- Kept pricing figures in the calculator (base costs, add-ons) unchanged — those are a different, deliberately more granular estimate than the 3 fixed packages on /small-business-website-design-auckland/, not a bug.
- Verified via built HTML (title, meta, dateModified, breadcrumb, snippet text, and the calculator link's href on 111 pages) rather than the dev preview server, whose launch.json cwd points outside this worktree.

## Open items / next steps
- Watch GSC over the coming weeks for position/CTR movement on "website cost nz" / "website cost" queries.
- Remaining opportunity items from the 2026-07-10 analysis: affordable-SEO cluster (GBP reviews/map pack), AI SEO Auckland page push, zh expansion, homepage review-count mismatch (4.9/47 vs live 5.0/11).
