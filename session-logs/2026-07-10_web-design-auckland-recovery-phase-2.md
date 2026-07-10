# Web Design Auckland Recovery - Phase 2

## What was done

- Removed unconfirmed `AggregateRating` review counts from English and Chinese structured data across the site.
- Standardised visible trust wording around the confirmed 5-star Google rating without claiming an unverified number of reviews.
- Rebuilt `/testimonials-reviews/` around the four known client reviews already used on the homepage.
- Removed twelve unsupported detailed testimonials and their performance claims from the testimonials page.
- Replaced the unsupported testimonial trio on the English and Chinese AI SEO pages with known client feedback.
- Consolidated `/solutions-auckland-kiwi-web-design/` into the homepage.
- Consolidated `/our-process/` into `/website-design-process-in-auckland/`.
- Updated footer, CTA, contact-page, work-with-us, `llms.txt`, and internal SEO-map links to point directly to the retained destinations.
- Added one-hop 301 redirects for both retired routes, with and without trailing slashes.

## Key findings and decisions

- The solutions page had 1,062 GSC impressions, zero clicks, and an average position of 43.44 while duplicating the homepage's website + SEO + Ads positioning.
- The two process pages competed for substantially the same intent. The keyword-specific six-step process page was retained as the clearer long-term destination.
- Review count values of 37, 47, and 50 were inconsistent. The rating is retained as 5 stars, but no exact review count is claimed until it is verified.
- `50+ projects/businesses helped` remains separate from Google review wording where it appears as a business-history claim.

## Validation

- `npm run build` passed.
- All generated JSON-LD blocks parse successfully.
- No `AggregateRating`, unsupported testimonial trio, or retired-route HTML remains in generated output.
- Retired routes are absent from generated sitemaps.
- Redirects are present in `dist/_redirects`.
- The homepage now includes the `#services` target used by updated service-overview links.
- The known website-cost-calculator dynamic-route warning remains unchanged.

## Open items / next steps

- Verify every published case study and quantified result against a real client/project source before using it as homepage or service-page proof.
- Continue the GSC-led quality audit of low-click location, WordPress, support, and blog pages.
- Build off-site authority through real reviews, consistent NZ citations, client attribution links, and permission-based case studies.
- Start 2-, 6-, and 12-week GSC monitoring after deployment.
