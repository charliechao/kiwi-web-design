# Blog content programme: Phase 5 original evidence

## What was done

- Added `auckland-small-business-website-field-audit-2026.md` with a declared eight-domain sample, reproducible HTML rubric, aggregate findings, practical fixes, and limitations.
- Added `what-auckland-website-buyers-actually-ask.md` using six eligible first-contact projects received from 11 June to 26 August 2026. Only aggregate counts and paraphrased lessons were published in the draft.
- Replaced the generic platform article with four real KWD decisions covering WordPress, Trafft booking, an anonymised Shopify proposal, and KWD's Astro Ads landing page.
- Rebuilt `ai-first-web-design.md` as a transparent AI-assisted workflow and failure log, including the calculator payload repair walkthrough and an explicit statement that KWD has no controlled time-saved baseline.
- Rebuilt `seo-vs-google-ads-auckland-small-business.md` around exact Northshore Assembly Google Ads API periods and first-party KWD organic-search evidence.
- Expanded the existing Chinese startup guide with Charlie's documented founder perspective, the buyer-question sample, platform choices, and current NZBN, Privacy Commissioner and Commerce Commission sources.
- Added two original SVG data visuals, two dated public-page screenshots for the field audit, and updated `src/data/site-map.json`, the programme plan, and the private evidence library.

## Key findings and decisions

- Field audit: seven of eight linked live domains loaded over valid HTTPS; all seven accessible homepages had a title, mobile viewport and clear action; three had a meta description, three had exactly one H1, none exposed JSON-LD in downloaded HTML, and 62 of 133 images had non-empty alt text.
- Buyer sample: quote or scope appeared in three of six projects; search visibility, ongoing costs, ownership/access, booking/payment, and timing each appeared in two. Tracking and privacy appeared in none of the initial enquiries.
- Google Ads API recheck: rebuilt Search campaign, 24 June to 23 July 2026, recorded $337.36 spend, 72 clicks, 675 impressions and 12 primary tracked conversions. Prior Smart campaign, 1 March to 31 May 2026, recorded $1,222.50 spend, 669 clicks, 107,363 impressions and one primary tracked conversion.
- The Ads case uses `tracked enquiries`, not clients, and does not claim qualified leads, sales, revenue or campaign-only causation.
- Four established URLs were reused and only two new research URLs were created to reduce topic duplication.
- The protected calculator page and Markdown file were not edited.

## Validation

- `npx astro sync --force` passed and cleared the generated content store.
- `npm run build` passed and all six Phase 5 routes rendered.
- `npx astro check` passed with 0 errors, 0 warnings and 0 hints.
- `src/data/site-map.json` parsed successfully.
- Each Phase 5 route contains one H1 and one Article schema object.
- Twenty local references across the six sources resolved against the built routes or public assets.
- `git diff --check` passed apart from informational Windows line-ending notices.
- Protected calculator diff is empty.

## Open items / next steps

- Charlie approved Phase 5 and authorised Phase 6 on 26 August 2026.
- Phase 6 now owns the final release checks, commit, and push. Production verification remains with Charlie.
