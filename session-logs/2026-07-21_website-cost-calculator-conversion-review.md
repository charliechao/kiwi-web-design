# Website Cost Calculator Conversion Review

## What was done

- Reviewed the live website-cost calculator page on desktop and an emulated Pixel 7 viewport.
- Inspected the Astro source, calculator logic, Web3Forms handoff, and GA4 event implementation.
- Compared the page journey with the latest available NZ organic lead-gap report for 20 June to 19 July 2026.

## Key findings or decisions

- The page satisfies price-research intent before visitors reach the calculator by showing the main price ranges and a detailed table first.
- The mobile journey is long: visitors must scroll through several screens of content, then a tall calculator, before reaching the quote form.
- The result handoff is weak. `Send My Details` does not explain the benefit or what Charlie will provide next.
- The combined `Phone or email` field uses telephone autofill, which is unclear for visitors who prefer email.
- Project proof, delivery reassurance, and service differentiation appear too far below the conversion point.
- GA4 enhanced measurement counts calculator interaction as `form_start`, so the current funnel cannot distinguish calculator use from genuine quote-form intent.
- The latest report showed 86 NZ organic sessions and one accepted submission, at most a 1.2% session conversion rate. Only one calculator landing user reached the separate quote page.
- Preserve the ungated estimate. Add a higher-value optional next step rather than requiring contact details before showing the result.

## Open items / next steps

- Implemented a first conversion batch on the website-cost calculator page:
  - Added mobile progressive disclosure for optional add-ons, hosting, and GST controls while keeping them visible on desktop.
  - Replaced the plain total with a personalised result panel showing estimated investment, recommended project fit, explanatory copy, and fixed-scope assurances.
  - Reworked the contact form to use labelled name and email fields, an optional phone field, and the CTA `Get My Fixed-Price Scope`.
  - Added the recommended project fit to the Web3Forms submission payload and updated validation and success messaging.
- `npm run build` passed. The existing route-priority warning for the calculator's static route versus `[slug]` remains; Astro uses the dedicated static route.
- Consider a second batch with an emailed estimate/brief, separate calculator and quote-funnel events, a short nurture sequence, and retargeting after the core funnel is measurable.
