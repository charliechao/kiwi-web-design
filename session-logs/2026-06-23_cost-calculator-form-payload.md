# 2026-06-23 Cost calculator form payload

## What was done
- Updated the website cost calculator contact form to submit the full calculator context through hidden Web3Forms fields.
- Kept the visible UI and page content unchanged.
- Ran local build and browser-based payload checks.

## Key findings or decisions
- The previous form only sent `calculator_estimate`, `name`, and `contact`, which explains why the email notification lacked the selected calculator details.
- The updated payload now includes site type, page count, product count, selected add-ons, hosting/care, GST choice, calculator breakdown, and calculator total.
- `npm run build` passed.
- `npx astro check` still fails only on the pre-existing unrelated `gtag` error in `src/pages/website-designer-auckland.astro`.

## Open items / next steps
- Production was not verified after the code change, per the workspace deployment preference.
- The existing `gtag` type error can be fixed separately if wanted.
