# 2026-06-23 gtag typecheck fix

## What was done
- Confirmed `npx astro check` still failed on `src/pages/website-designer-auckland.astro` because `gtag` was referenced as an undeclared global.
- Updated the contact page to read GA4 tracking from a typed `window.gtag` reference before firing `form_submit` and `generate_lead`.
- Cleaned up the calculator page's inline tracking call to use `window.gtag` consistently.

## Key findings or decisions
- This was a TypeScript/Astro diagnostics issue, not evidence that the form submit itself was broken.
- The GA4 events are still fired when `window.gtag` exists, but the code no longer fails static checking when TypeScript cannot see the global.
- `npx astro check` now passes with 0 errors, 0 warnings, and 0 hints.
- `npm run build` passes.

## Open items / next steps
- Changes are local and not pushed in this session.
