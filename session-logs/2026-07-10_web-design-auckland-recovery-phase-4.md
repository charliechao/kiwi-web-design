# Web Design Auckland Recovery - Phase 4

## What was done

- Audited current public mentions and profiles for Kiwi Web Design, Ika Tech Limited, Charlie Chao, and named client work.
- Rebuilt `/press-release-and-news/` as a transparent register of verified external sources rather than a list of placeholder announcements.
- Removed three PRLog entries that linked only to the PRLog homepage and could not be verified as published articles.
- Added direct links to verified InfoNews and openPR publications.
- Added a public-profile register for LinkedIn, Sortlist, DesignRush, Techreviewer, Trustindex, and the Ika Tech Limited openPR publisher archive.
- Added `CollectionPage` and `ItemList` structured data to the external-source page.
- Aligned the homepage, English About page, Chinese About page, and Legal Information schema with:
  - Legal entity: Ika Tech Limited
  - Trading name: Kiwi Web Design
  - NZBN: 9429052816840
  - Founder: Charlie Chao
  - Auckland and New Zealand service areas
  - Verified public profiles in `sameAs`
- Removed the uncertain `foundingDate` value from About-page organisation schema.
- Removed high-visibility WordPress positioning from the homepage technology list, About page services, and `llms.txt`.
- Updated `llms.txt` with the legal identity, canonical SEO URL, New Zealand service area, press/profile page, and verified external profiles.
- Updated `src/data/site-map.json` to describe the revised external-evidence page accurately.

## Verified external evidence

- InfoNews: 2026 Auckland SEO agency guide release.
- openPR: 2026 Auckland web design agency guide release.
- openPR: Kiwiland Construction client website release, published under Ika Tech Limited (T/A Kiwi Web Design).
- LinkedIn: official Kiwi Web Design company profile.
- Sortlist: claimed Auckland agency profile and Kiwiland Construction portfolio entry.
- DesignRush: Kiwi Web Design agency profile and sourced client reviews.
- Techreviewer: Auckland company profile with named clients.
- Trustindex: attributable public client reviews.
- openPR: Ika Tech Limited (T/A Kiwi Web Design) publisher archive.

## External profile corrections still requiring owner access

- Sortlist currently presents platform-specific and team-size details that should be reviewed against the current service positioning.
- Techreviewer contains platform-controlled rating, turnaround, category, and company-size fields that should be checked for accuracy.
- LinkedIn, Sortlist, DesignRush, and Techreviewer should all use the same platform-neutral service description and legal/trading-name relationship where their editors allow it.
- New independent editorial mentions and client-site credits still require outreach or third-party approval; they cannot be created truthfully through repository changes alone.

## Validation

- `npm run build`: passed.
- Generated JSON-LD parsed successfully for the homepage, English About page, Chinese About page, Legal Information page, and Press/Public Profiles page.
- All nine verified external URLs are present in the generated Press/Public Profiles page.
- Placeholder PRLog entries and the unsupported 100-client milestone are absent.
- `llms.txt` uses the canonical `/affordable-seo-auckland/` URL and no longer contains a WordPress services section.
- Existing static/dynamic website-cost route warning remains unchanged.

## Next steps

- Update stale fields inside external directory accounts using the source-of-truth business details above.
- Seek new independent local-business, client, and industry mentions that link to the homepage or a relevant service/case-study page.
- Monitor GSC after deployment for changes in branded queries, homepage query ownership, and referring-page discovery.
