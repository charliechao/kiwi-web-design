# Blog content programme: Phase 4 rewrites

## What was done

- Rewrote `website-redesign-vs-starting-from-scratch.md` around a five-part KWD audit decision tree and two public project examples.
- Lightly corrected `more-than-half-of-nz-businesses-still-lack-a-website-as-consumer-expectations-rise.md` against the exact InternetNZ research page and report.
- Rebuilt `facebook-page-for-sme.md` against current Meta material and added two optimised screenshots of KWD's public Facebook Page.
- Rewrote `how-seo-helps-small-new-zealand-businesses-grow.md` around an inspectable SEO lead system and realistic Google evaluation windows.
- Reframed `how-to-make-your-website-look-professional-without-spending-a-fortune.md` as an honest project-scope teardown.
- Replaced predictions in `ai-small-businesses-auckland-web-design.md` with six workflows KWD has tested or delivered, plus NZ government privacy and human-review guidance.
- Updated `src/data/site-map.json` and the phase plan to reflect the revised titles and status.

## Key findings and decisions

- InternetNZ reports that 53% of surveyed businesses have a website and 47% do not. The article title was corrected from "More Than Half" to "Nearly Half" while retaining the existing URL.
- The reported online-sales perception gap is 52% of consumers versus 35% of businesses, not 25% of businesses.
- The statistics article's embedded JSON-LD was removed because the shared blog template already generates Article schema.
- Project examples describe delivered scope only. No unmeasured ranking, revenue, booking, or lead outcomes were added.
- The protected website-cost calculator page and Markdown file were not changed.

## Validation

- `npx astro sync --force` passed.
- `npm run build` passed and all six Phase 4 routes rendered.
- `npx astro check` passed with 0 errors, 0 warnings, and 0 hints.
- Generated internal route and asset check passed with 0 broken references.
- The statistics route contains one Article type and one JSON-LD script.
- `git diff --check` passed apart from informational Windows line-ending notices.
- Protected calculator diff is empty.

## Open items / next steps

- Await Charlie's approval of Phase 4 before starting Phase 5.
- No commit, push, or production verification has been performed.
