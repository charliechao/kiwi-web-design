# Web Design Auckland Recovery - Phase 3

## What was done

- Audited all published client case studies for verifiable project identity, public website evidence, quantified performance claims, and testimonial attribution.
- Retained nine named client projects and rewrote their headlines, metadata, schema descriptions, overview cards, result sections, and proof strips around factual project scope rather than unsupported percentages.
- Added direct live-site links for Beauty Touch, Barrett Access Scaffolding, Dryice Blasting Services, FL Legal, Inspector Guys, Kiwiland Construction, NZMU, and Topline Services.
- Kept La Veranda as an archived former-client project and disclosed that its former domain no longer hosts the shown website.
- Removed anonymous or unverified testimonials from the case-study pages.
- Retired the constructed florist case study and added a 301 redirect to `/ecommerce-website-auckland/`.
- Removed repeated unsupported result claims from internal anchors, `llms.txt`, AI SEO pages, Chinese SEO pages, the Chinese homepage, website-cost examples, and several blog examples.
- Reframed budget examples as illustrative scopes rather than published client results.
- Removed the unsupported Google Business Profile `5x views` claim.

## Key findings and decisions

- A genuine client project does not automatically verify a claimed traffic, lead, revenue, or ranking increase. Numeric results should only be published when source data and the reporting period can be retained internally.
- Public project evidence is now the client identity, project assets, concrete deliverables, and live-site link. Unsupported performance figures are no longer used as proof.
- `src/data/site-map.json` now records 101 total pages after retiring the florist route.

## Validation

- `npm run build`: passed.
- All nine retained case-study routes were generated.
- All nine generated case-study JSON-LD blocks parsed successfully.
- Retired URLs are absent from generated sitemaps.
- The florist page is absent from `dist`, and both trailing-slash variants redirect to `/ecommerce-website-auckland/`.
- Site-wide scan found no remaining unsupported percentage or multiplier result claims in `src/pages`, `src/content`, or `public/llms.txt`.
- Existing warnings remain for duplicate Astro content IDs and the known static/dynamic website-cost route conflict.

## Open items / next steps

- Build off-site authority and corroborating project mentions for the web-design topic cluster.
- Monitor Google Search Console after deployment to confirm homepage query ownership and watch retired URLs leave reporting over time.
- Do not publish new numeric case-study results without retaining the supporting analytics/export and measurement window.
