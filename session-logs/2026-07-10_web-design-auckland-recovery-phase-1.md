# Web Design Auckland Recovery - Phase 1

## What was done

- Confirmed the homepage is the primary target for `web design Auckland` and `website design Auckland`.
- Reassigned broad web-design anchors to the homepage and affordability anchors to `/affordable-web-design-auckland/`.
- Narrowed the homepage service-card link text so `/small-business-website-design-auckland/` receives small-business intent instead of the broad Auckland term.
- Updated the internal SEO page map with distinct homepage, affordable, and small-business anchor guidance.
- Removed two overlapping, outdated blog routes:
  - `/affordable-web-design-auckland/affordable-auckland-web-design-small-business/`
  - `/affordable-web-design-auckland/affordable-web-design-agency-auckland/`
- Added one-hop 301 redirects from those routes and the older root-level agency URL to the relevant service hubs.
- Replaced unsupported homepage wording about `98% client satisfaction` and an unconfirmed review count with verifiable direct-service and Google-review wording.

## Key findings and decisions

- GSC showed the two consolidated articles had 13,803 impressions and 6 clicks combined, with average positions of 48.84 and 40.56.
- The small-business article now redirects to `/small-business-website-design-auckland/`.
- The affordable-agency article and its root-level legacy URL now redirect to `/affordable-web-design-auckland/`.
- The 5-star Google rating was previously confirmed, but the exact review count remains unconfirmed and should not be repeated as a verified figure until checked.

## Validation

- `src/data/site-map.json` parses successfully.
- `npm run build` passed.
- Retired routes are absent from generated HTML and the sitemap.
- Redirect rules are present in `dist/_redirects`.
- The known dynamic-route warning for the website cost calculator remains unchanged.

## Open items / next steps

- Audit and standardise review-count claims and `AggregateRating` counts sitewide after confirming the live Google Business Profile count.
- Continue the page-quality audit for low-click, overlapping service and blog routes.
- Build genuine external authority through reviews, NZ citations, client attribution links, and permission-based case studies.
- Begin GSC monitoring after deployment at 2-, 6-, and 12-week checkpoints.
