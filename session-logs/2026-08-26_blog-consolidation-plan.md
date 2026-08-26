# Blog Consolidation Plan

## What was done

- Refreshed the authenticated KWD GA4 and Search Console exports through 26 August 2026.
- Reviewed private enquiry themes, verified public case studies, Git history, and prior project evidence to reduce the need for Charlie interviews.
- Created `reports/2026-08-26-blog-consolidation-and-redraft-plan.md` with phased consolidation, accuracy, evidence, rewrite, and validation work.
- Updated the earlier blog audit to mark the website-cost calculator route and both supporting source files as protected.
- Made no website-content changes and did not deploy.

## Key findings or decisions

- The website-cost calculator is the protected control: 359 GSC clicks, 44,972 impressions, average position 10.4, and 680 GA4 landing sessions in the current 16-month export.
- The shadowed Markdown cost entry is intentional because it supplies the blog-hub card; do not delete or alter it.
- First consolidation survivors are selected from query/page evidence: `from-local-to-legendary...`, `10-essential-features...`, and `how-to-choose-the-best-web-design-agency...`.
- Facebook-versus-website and business-without-a-website articles retain distinct intent and should stay separate.
- Existing private evidence can support most rewrites; ask Charlie only for publication permission, conflicting facts, or personal founder perspective.

## Open items / next steps

- Phase 1 was implemented locally after approval. Three survivor articles were rewritten with answer-first guidance, verified KWD case evidence, official NZ/Google references, and preserved publication dates with a 26 August 2026 modified date.
- Five overlapping or mismatched posts were retired. Ten slash/no-slash 301 rules point them directly to the three survivor articles or the established small-business web-design service page.
- `src/data/site-map.json` was cleaned, generated sitemap output contains only the survivor URLs, and the blog collection no longer builds the retired posts.
- Added `public/downloads/web-design-agency-brief-checklist.txt` as a practical asset for the agency-selection article.
- Local verification passed: `npm run build`, `npx astro check` (0 errors, warnings, or hints), JSON parsing, generated-route checks, and internal-link resolution.
- Both protected calculator source files remain unchanged and have an empty diff.
- Charlie approved Phase 1 and authorised Phase 2.
- Phase 2 was implemented locally: schema/AI search, E-E-A-T, WordPress, SEO-agency comparison, and Chinese entrepreneur articles were rebuilt around primary sources, transparent limitations, and KWD experience.
- The content schema now retains `lang`, `articleSection`, and `keywords`. Rendered checks confirm `lang="zh-Hans"` and Article metadata reach the output.
- The thin `auckland-web-design-ai-seo-shift` article was merged into the stronger schema survivor and redirected with slash/no-slash 301 rules.
- Local checks passed: `astro sync`, production build, `astro check` with zero diagnostics, JSON, rendered metadata, sitemap, redirects, and protected calculator diffs.
- Await Charlie's approval before beginning Phase 3. No commit, push, or deployment has been performed for Phases 1 or 2.
- Charlie approved Phase 2 and authorised Phase 3.
- Created a Git-ignored `.private-evidence/` library with a claim register, source index, anonymised buyer-question corpus, and evidence reuse map.
- Seeded nine public case-study records, the approved Northshore Ads result, KWD analytics/search exports, production lead-tracking evidence, and Git/session workflow examples.
- A read-only Gmail review produced 21 unique enquiry/quote threads from 42 matching messages. Only aggregate, provisional themes were retained; personal data and verbatim messages were not stored.
- Added permission and confidence states, publication limitations, a manual-coding requirement for future buyer-question statistics, and a hold on the unverified national-first scaffolding-calculator claim.
- Phase 3 is awaiting Charlie's approval before Phase 4. No commit, push, or deployment has been performed for Phases 1, 2, or 3.
