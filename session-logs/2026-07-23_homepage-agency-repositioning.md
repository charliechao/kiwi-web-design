# 2026-07-23 — Homepage repositioning: web design studio → digital marketing agency

## What was done
- Rebuilt `src/pages/index.astro` around Charlie's new positioning: lead generation systems (website + SEO + Google Ads) for Auckland/NZ service businesses. Commit `3a65c01`, pushed to main → Cloudflare Pages.
- Kept "web design Auckland" keyword equity (title, H1, eyebrow) — full keyword pivot deferred until service pages carry their own rankings.
- New structure: hero (dual CTA "Get a Free Growth Plan" / "See Client Results") → NEW Lead Generation System diagram (Convert → Compound → Accelerate) → services with role tags → merged About (Why-Us checklist + YouTube link) → Client Results (portfolio + Northshore Assembly Ads callout) → Google reviews carousel (ported from ads LP) → rewritten growth-engagement process → agency-intent FAQs → CTA.
- Cut: tech-stack section, standalone video section, intro section, TestimonialGrid.
- Floating Google 5-star badge added (desktop only). Header CTA label: "Get a Quote" → "Free Growth Plan" (EN, sitewide).
- Earlier same session: polish pass on /affordable-seo-auckland/ (commits `0866a3d`, `05263a9`) — ban violations, WCAG contrast, em dashes, hero cert-badge sizing (new `imgNatural` prop on PageHero).

## Key findings / decisions
- **Northshore Assembly Google Ads result verified via API** (account 7947925774): rebuilt Search campaign = 12 conversions/30d at $28.11/lead on ~$340/mo; prior Smart campaign burned $1,200+ Mar–May with ~1 tracked conversion. Approved for public use, phrased as "tracked enquiries" not "clients".
- Review carousel + Google badge from the ads LP confirmed as homepage trust assets (Charlie asked; recommended yes; done).
- Verified in dev preview: all sections render, no console errors, badge asset 200, no horizontal overflow, dead sections gone.

## Open items / next steps
- Dead CSS from cut homepage sections (hp-video-*, tech-*, hp-adv-*, hp-proof-*) still in index.astro `<style>` — cleanup candidate.
- Mobile breakpoints mirror the LP's proven ones but were not visually verified (browser pane not displayed) — worth a quick phone check on live.
- `/affordable-seo-auckland/` has uncommitted changes from another session (review-snippet structured data) — that session owns them.
- Consider whether other high-traffic pages (about, service pages) should pick up the "Free Growth Plan" CTA language for consistency.
