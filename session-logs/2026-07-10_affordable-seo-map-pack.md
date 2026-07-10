# 2026-07-10 - Affordable SEO / map-pack cluster (addendum)

## What was done
- Reworked /affordable-seo-auckland/ (commit 286072f, pushed to main). This page ranks pos 3-8 for ~1,300 impr/90d of "affordable seo auckland" queries with 0 clicks. Live SERP check (browser) showed why: 4 ad blocks + map pack + a Reddit thread sit above organic — ranking higher won't help, only trust/differentiation signals in the 2 organic slots will.
- Trimmed title 69->50 chars, meta description ~175->138 chars (both Ahrefs-flagged as too long from the original site audit).
- Added a verifiable "Read our reviews" link (google.com/maps/place/Kiwi+Web+Design, same target as /testimonials-reviews/) next to the 4.9-star stat — makes the trust claim checkable instead of just text.
- Added structured Review markup (schema.org) for the 2 testimonials already visibly displayed (Zane Barrett, Jack) — accurate since they match on-page content; did NOT touch the separate aggregateRating ratingCount (still 50, unresolved, see below).
- Added GeoCoordinates (147 Great North Rd, Grey Lynn: -36.8626341, 174.7488012, via Nominatim lookup) to the LocalBusiness schema.
- Linked to /google-business-profile-guide-for-auckland-businesses/ (was missing despite the page's Local SEO service explicitly covering GBP) and to /testimonials-reviews/ from the reviews section.

## Key findings or decisions
- Deliberately did NOT touch the aggregateRating "4.9/50" figure sitewide — still unresolved whether 50 is accurate (live GBP shows 5.0/11). This is now blocking further local-trust work; asked Charlie directly (see chat).
- Deliberately did NOT start any Google Ads campaign work for these money queries — that's a different project (KWD_Google_Ads_Campaign) and a real-budget decision, out of scope for a website-repo session without explicit confirmation.
- GBP review-count growth (asking real clients) is a business/outreach action, not something executable from this codebase.

## Open items / next steps
- Awaiting Charlie's answer on the true review count (affects whether/how to correct the aggregateRating claim across many pages).
- Awaiting Charlie's decision on whether to pursue a Google Ads defense for "affordable seo auckland" / "affordable seo" queries.
- Remaining opportunity items from 2026-07-10 analysis: AI SEO Auckland page push, zh expansion.

---

# Addendum: sitewide rating correction (commit bf640ca)

- Charlie confirmed: change 4.9 star to 5 star sitewide (review count question left unanswered/unresolved). Google Ads defense for this cluster: not now.
- Replaced all 75 instances of "4.9" star rating across 33 files (schema ratingValue, visible "4.9★" stats, "4.9/5" text, EN + ZH pages) with "5". Used a Node script with 3 precise regex patterns (ratingValue quoted string, "4.9★", "4.9/5") to avoid false-positive matches on unrelated numbers (SVG path coords, geo longitudes like 174.9184 which contain the substring "4.9" coincidentally).
- Did NOT touch the review count ("50+"/ratingCount "50") anywhere — that's still open, Charlie didn't address it in his answer.
- Homepage schema has no aggregateRating node at all (never did), so nothing to change there — confirmed via grep, not an oversight.
- Verified: 0 remaining "4.9" rating instances in dist/, spot-checked EN + ZH pages render "5★"/"5/5"/ratingValue:"5" correctly.
