# 2026-07-10 - /zh/ expansion

## What was done
- Investigated the actual /zh/ funnel via GSC + GA4 before building anything (commit c9af4f5, pushed to main):
  - GSC: only ONE real organic query cluster with volume — "网站开发 奥克兰" (89 impr/90d, pos 4.9), driving the /zh/ homepage almost entirely. All other zh interior pages get 11-44 impressions each with ZERO clicks. Zero Chinese-character queries land on English pages (no unserved keyword demand hiding elsewhere).
  - GA4: /zh/ landing pages get 55 Direct sessions (vs 23 Organic Search) — mostly people landing directly on specific interior pages (website-designer, about-us, google-ads, seo-auckland, local-seo, meta-ads, paid-ads, small-business) with 0 key events each, consistent with WeChat/word-of-mouth link sharing rather than search. Referral sources include bbs.skykiwi.com (Chinese NZ forum), baidu, chatgpt.com, perplexity.
  - This CONTRADICTS the original assumption that broad zh SEO expansion (more keyword-targeted pages) was the opportunity — organic Chinese search demand for this business is narrow, not broad.
- Given the Direct/shared-link-dominant traffic pattern, built the highest-conviction asset instead: a full Chinese translation of the site's #1 organic + conversion page, the cost calculator, at /zh/website-cost-new-zealand-small-business/ — identical pricing logic/numbers, translated labels/FAQ/content, own schema, lang="zh-Hans".
- Added reciprocal hreflang alternates (neither direction existed before on this specific page).
- Linked from: header nav (new dropdown item under 网页设计), footer (sitewide), zh homepage (FAQ + related strip), zh small-business page (pricing note + related strip), zh contact page (popular services strip).

## Key findings or decisions
- Did NOT build additional zh SEO pages targeting more keyword clusters — data doesn't support that being the opportunity right now. If zh expansion continues, prioritize by referral/direct-traffic fit (shareable tools, WeChat/community-friendly content) over keyword-volume guessing.
- Confirmed a real, low-effort follow-up if Charlie wants it: the zh contact page's WeChat QR + form both work correctly (spot-checked), so the zero-conversion pattern on shared interior pages is most likely small-sample noise (3-8 sessions each over 90 days), not a broken funnel — didn't chase this further given the sample sizes involved.

## Open items / next steps
- This closes out the full opportunity list from the 2026-07-10 GSC/GA4 analysis (cost calculator defense, affordable-SEO/map-pack, AI SEO push, zh expansion all done).
- Still open from earlier sessions: 2 crawled-not-indexed English pages needing content refresh; review COUNT (50+ vs real 11) still unresolved; GSC Security & Manual Actions manual check by Charlie.
