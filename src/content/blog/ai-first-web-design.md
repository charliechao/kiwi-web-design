---
title: "AI-Assisted Web Design Build Log: What KWD Automates and Reviews"
description: "A transparent Kiwi Web Design build log showing where AI helps, where human review remains essential, which defects escaped first drafts, and why time-saving claims need a baseline."
pubDate: 2025-08-08
lastModified: 2026-08-26
image: "/blog/ChatGPT-Image-Aug-8-2025-09_44_05-AM-1.png"
articleSection: "AI Web Design"
keywords:
  - AI assisted web design NZ
  - AI web design workflow
  - human review AI website
  - Kiwi Web Design build process
---

![AI-assisted web design workflow at Kiwi Web Design](/blog/ChatGPT-Image-Aug-8-2025-09_44_05-AM-1.png)

<div class="kwd-snippet">

**What AI changes:** it can accelerate inventory, drafting, code search, repetitive edits and test preparation. It does not approve a client's claims, choose the business strategy, confirm legal accuracy, judge whether a lead is qualified or replace local build checks and human review.

</div>

I completed a design bootcamp at Yoobee in 2015 and began freelancing when hand-written HTML, CSS and JavaScript were still the normal starting point. WordPress later made content management and common business features faster. AI is another change in tooling, but it is not a reason to lower the standard of evidence.

This is a real build log from Charlie Chao and Kiwi Web Design. It records what we use AI-assisted coding and research for, what remains a human decision, and several defects that show why generated work cannot be accepted on confidence alone.

## The current KWD workflow

| Stage | AI-assisted work | Human responsibility | Evidence kept |
|---|---|---|---|
| Discovery | Search project history, group requirements, identify gaps | Confirm the commercial goal and what the client actually approved | Written scope and decisions |
| Information architecture | Compare services, intents and existing pages | Choose the customer paths and remove unsupported assumptions | Page inventory and internal-link map |
| Content | Draft structures, tables and alternative wording | Supply experience, approve claims, verify sources and tone | Source links and claim register |
| Development | Locate code, implement repetitive patterns, suggest fixes | Select architecture, protect existing behaviour and review diffs | Git history |
| QA | Generate checklists and inspect built output | Run builds, test forms, review mobile and accessibility behaviour | Build, typecheck and targeted test results |
| Deployment | Prepare a scoped commit summary | Decide what is authorised to publish | Commit and deployment record |

AI is most useful where the work is inspectable. A code diff, source link, route list or test result can be checked. It is least trustworthy when asked to fill a missing business fact with plausible prose.

## Walkthrough: fixing a calculator enquiry that omitted the scope

On 23 June 2026, a real submission from KWD's website cost calculator arrived with only the estimate, name and contact number. The calculator interface itself worked, but the email did not include the choices the buyer had made.

The repair process was:

1. Inspect the form markup and the JavaScript that calculated the estimate.
2. Confirm which named fields were actually being sent to Web3Forms.
3. Add hidden fields for site type, page count, product count, add-ons, hosting or care, GST choice, calculation breakdown and total.
4. Update those fields from the same state used to display the estimate.
5. Build locally and inspect the submitted `FormData` in a browser test.
6. Keep the visible calculator interface and content unchanged.

The useful AI contribution was tracing state through a long page and implementing the repetitive payload mapping. The approval decision remained human: preserve a high-performing page's visible behaviour while fixing only the missing submission context.

The incident also changed the checklist. We no longer treat "the success message appeared" as sufficient evidence. A lead form needs separate checks for payload, delivery, attribution and analytics.

## Defects that passed an earlier draft

The following are from KWD's own repository history, not hypothetical warnings.

| Defect | Why it mattered | How it was caught |
|---|---|---|
| Calculator email omitted selected options | The enquiry was not useful enough to quote accurately | Review of an actual delivered notification |
| Analytics loaded after page code checked for `gtag` | Conversion tracking could miss events | Code review and targeted event testing |
| Form field naming triggered Web3Forms filtering | Legitimate landing-page submissions could be treated as spam | End-to-end form delivery test |
| Landing-page form name changed on the thank-you route | Attribution data became inconsistent | Comparison of form and thank-you event payloads |
| Self-serving review schema appeared on a service page | It conflicted with Google's review-snippet rules | Search Console investigation and schema review |
| Unsupported result claims spread through repeated copy | The pages sounded confident without proof | Sitewide claim inventory and source checking |
| Broken links, duplicate H1s and weak titles accumulated | Crawl and page hierarchy quality drifted | Site audit followed by a scoped correction commit |

None of these failures means AI assistance is unusable. They show that speed moves the bottleneck to review. More output is only valuable when the team can test and reject it.

## Did AI save time?

We did **not** run a controlled manual-versus-assisted build, so we do not publish a percentage or number of hours saved. A stopwatch without a comparable baseline would turn an impression into a metric.

What we can verify is the type of work compressed: searching across many files, building inventories, applying consistent field mappings, checking internal routes and drafting alternative structures. The time is then reinvested in source review, testing and client decisions.

For future measurement, the honest method is to record:

- task start and finish time;
- number of files and routes in scope;
- review and rework time;
- defects found before and after deployment;
- whether the same person performs the manual control;
- the quality standard both versions must meet.

Until that comparison exists, "faster" is a workflow observation, not a quantified result.

## Where human review is non-negotiable

### Client facts and permission

AI cannot decide that a private sales figure, customer name or internal email is approved for publication. KWD keeps private evidence separate and publishes only the approved aggregate or case wording.

### Legal, tax, health and financial claims

These need current primary sources and, where appropriate, a qualified professional. A fluent paragraph is not a source.

### Visual and interaction quality

Build success does not prove that text fits, forms are usable, images load or the mobile experience makes sense. Those require rendered review and interaction tests.

### Causal marketing claims

Traffic, tracked enquiries, qualified leads and sales are different outcomes. AI frequently collapses them into a stronger success story unless the evidence boundary is written explicitly.

## The KWD release gate

Before website work is accepted, we aim to confirm:

- the requested scope is visible in the diff;
- unrelated client or user work remains intact;
- source-backed claims are linked or recorded;
- private data has not entered public files;
- `npm run build` passes;
- Astro and TypeScript diagnostics pass;
- internal routes and assets resolve;
- forms receive the intended fields;
- structured data matches visible content;
- the approved files, and only those files, are ready to publish.

AI-assisted work should make that gate easier to satisfy, not easier to skip.

For the customer-facing version of this approach, see [six AI workflows KWD has tested or delivered](/affordable-web-design-auckland/ai-small-businesses-auckland-web-design/). To discuss an AI-assisted website with clear human accountability, [contact Kiwi Web Design](/contact/).
