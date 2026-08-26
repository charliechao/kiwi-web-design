# Blog content programme: Phase 6 release

## What was done

- Rebuilt the complete approved Phase 1-5 content programme after a forced Astro content sync.
- Audited all 19 changed or new article routes for canonical URL, title, description, language, H1 count, Article schema, and generated internal references.
- Verified all 12 slash/no-slash Cloudflare 301 rules, direct redirect targets, retired-route removal, blog-hub references, and sitemap inclusion.
- Removed stale sitemap exclusions for the rebuilt platform-decision and SEO-versus-Ads articles.
- Added the original Phase 5 research and evidence-led articles to `public/llms.txt` and corrected its old broken contact link.
- Confirmed the protected website-cost calculator Astro page and Markdown hub entry have no Git diff.

## Key findings or decisions

- The generated audit covered 19 articles, 838 local references, 12 redirects, 43 KWD links in `llms.txt`, and 35 blog source files.
- The Chinese founder guide renders with `lang="zh-Hans"`; the other 18 changed articles render with `lang="en-NZ"`.
- Every changed or new article renders one H1 and exactly one Article schema object.
- Private evidence remains Git-ignored and is not part of the deployment.
- The known calculator route-precedence warning remains expected because the protected static calculator page intentionally outranks its Markdown hub entry.

## Open items / next steps

- Monitor GSC page/query data and GA4 landing engagement at 7, 28, and 56 days rather than reacting to short-term volatility.
- Charlie will manually verify production. No post-push live-site check is planned.
