# 2026-07-08 - Ahrefs site audit error fixes

## What was done
- Reviewed Ahrefs crawl (Jul 7) — 27 issues; confirmed prior fixes registered (broken links -29, 404s -7).
- Fixed and pushed (commit 93f345c → main):
  - 13 broken wp-content image URLs replaced with local originals from src/assets/case-studies + general (6 case-study pages, 4 blog posts). All originals existed locally — no substitutes needed.
  - 2 remaining /seo-auckland/ raw-HTML anchors (markdown-syntax sed had missed them).
  - http:// links → https; bare "www.kiwiwebdesign.co.nz" text in 2 posts was GFM-autolinking to http:// — now explicit https markdown links.
  - 6 dead external links replaced with live URLs (verified 200): Google Ads Help Centre, Keyword Planner marketing page, google.com/business, support.google.com/business root; dead webscape citation removed.
  - De-orphaned 6 pages via contextual rps-links: topline + dryice case studies (from tradie page), florist case study + website-branding (from small-business page), email-setup (from hosting), press-release-and-news (from about-us).
  - Oversized images: 3 case studies now use existing .webp (was 0.9-2.4MB png/jpg); 2 blog PNGs converted to webp (1731KB→54KB, 1494KB→109KB), originals deleted.

## Key findings or decisions
- "Missing alt text" on homepage = FALSE POSITIVE (carousel clone slides, aria-hidden, empty alt is correct a11y) — intentionally not changed.
- Sitemap exclusions (June 23 decision incl. /meta-ads/, /paid-ads/) left unchanged per Charlie's explicit instruction, despite recommendation to re-include money pages.
- 403 external links (openai.com, chatgpt.com, aucklandchamber, internetnz, designrush) are bot-blocking, not broken — no action.
- /thank-you/ remains technically orphaned (form destination, excluded from sitemap) — fine.

## Open items / next steps
- Next Ahrefs crawl should show Error count near zero; verify next report.
- Still open from prior session: 2 crawled-not-indexed pages need content refresh; title/meta length trims; GBP review-count mismatch (4.9/47 on homepage vs 5.0/11 live).
