---
title: "Auckland Small-Business Website Audit: 8 Live Sites Checked"
description: "An original August 2026 field audit of eight live Auckland small-business websites, with a reproducible rubric, issue frequencies, limitations, and practical fixes."
pubDate: 2026-08-26
lastModified: 2026-08-26
image: "/blog/auckland-website-audit-2026.svg"
articleSection: "Website Research"
keywords:
  - Auckland small business website audit
  - website audit Auckland
  - small business website checklist NZ
---

![Results from the August 2026 Auckland small-business website field audit](/blog/auckland-website-audit-2026.svg)

<div class="kwd-snippet">

**Headline finding:** all seven homepages that could be loaded securely had a page title, mobile viewport and clear next action. Only three had a meta description, only three had exactly one H1, and none exposed JSON-LD in the downloaded HTML. One further domain could not be audited because its TLS certificate had expired.

</div>

This is a small, declared field audit conducted by Kiwi Web Design on **26 August 2026**. It is useful as a diagnostic snapshot, not as an estimate of every Auckland business website.

## What was sampled

The sample was fixed before checking the pages: **all eight live client domains linked from Kiwi Web Design's public case studies on the audit date**. An archived restaurant project with no current live domain was excluded.

This selection has an obvious bias. KWD worked on these sites, and owners or other providers may have changed them after handover. The sample is therefore better at showing what can drift on real small-business websites than at comparing agencies or estimating the whole market.

## The reproducible audit method

Each homepage was requested once with a desktop browser user agent. We recorded the final URL and checked the returned HTML for:

1. A successful secure response over HTTPS.
2. A non-empty `<title>` element.
3. A meta description.
4. A mobile viewport declaration.
5. Exactly one `<h1>`.
6. JSON-LD structured data.
7. A form in the HTML.
8. A visible-link phrase containing quote, book, contact, enquire or call.
9. Non-empty `alt` text on images.

These are presence checks, not quality scores. For example, detecting a meta description does not prove that it is persuasive, and detecting a form does not prove that email delivery or analytics tracking works.

## Results

| Check | Result | What it means |
|---|---:|---|
| Valid secure page response | 7 of 8 | One domain failed certificate validation |
| Page title present | 7 of 7 accessible pages | Basic search-result context was available |
| Mobile viewport present | 7 of 7 | Pages declared responsive viewport behaviour |
| Clear action phrase present | 7 of 7 | Every accessible homepage offered an obvious next step |
| Form present in HTML | 6 of 7 | Most had an on-page enquiry route |
| Meta description present | 3 of 7 | Four left Google to create a search snippet from page content |
| Exactly one H1 | 3 of 7 | One page had five H1s and three had none in returned HTML |
| JSON-LD detected | 0 of 7 | No homepage exposed JSON-LD to this HTML check |
| Images with non-empty alt text | 62 of 133 | Fewer than half of the images had descriptive alt text |

## Two examples of a clear next action

Every accessible homepage gave visitors an obvious action. These two dated screenshots show different approaches in the sample: a service business prioritising phone calls and a treatment business prioritising service discovery and booking.

![Barrett Access Scaffolding homepage with visible phone call actions, captured 26 August 2026](/blog/auckland-website-audit-action-example-scaffolding-2026.png)

*Barrett Access Scaffolding homepage, captured 26 August 2026. The desktop header and hero both present a call action.*

![Beauty Touch homepage with visible Book Now and Discover Services actions, captured 26 August 2026](/blog/auckland-website-audit-action-example-booking-2026.png)

*Beauty Touch homepage, captured 26 August 2026. Booking and service-discovery actions are visible in the first viewport.*

The screenshots demonstrate action visibility only. They do not establish conversion rate, lead quality or sales.

## What deserves attention first

### 1. Repair the expired certificate before doing SEO work

A certificate failure can stop cautious users and automated systems before they reach the page. Hosting and certificate renewal should be monitored as an operational dependency, not treated as a one-off launch task.

### 2. Give every homepage one clear H1

An H1 is not a magic ranking factor, but it gives visitors, assistive technology and search systems a clear page topic. Zero H1s makes that hierarchy less explicit; five competing H1s can make the intended main topic harder to identify.

### 3. Write the search snippet deliberately

A meta description does not directly secure a ranking, but a specific description can explain the service, location and next step in search results. Four of seven accessible pages were leaving that choice entirely to Google's snippet generation.

### 4. Treat image alternatives as content, not housekeeping

Only **46.6%** of the 133 images had non-empty alt text. Decorative images may correctly use empty alternatives, so 100% is not automatically the goal. The practical review is to identify which images communicate a service, person, project or instruction and make sure the same information is available in text.

### 5. Add structured data only when the visible page supports it

None of the accessible homepages exposed JSON-LD in the downloaded HTML. Appropriate `Organization`, `LocalBusiness`, `Service` or breadcrumb markup may help systems understand a page, but markup must match visible, verifiable content. It should not contain invented reviews, ratings or results. See our [structured-data and technical SEO service](/technical-seo-auckland/).

## What this audit did not test

The audit did not measure Core Web Vitals, keyboard navigation, colour contrast, form delivery, analytics accuracy, index coverage, rankings, lead quality or revenue. It also did not execute JavaScript before checking the markup, so client-rendered elements may not be represented.

The findings were captured at one point in time. Websites, plugins, certificates and content change. Re-running the same script later may produce different results.

## A practical quarterly check

For a small service business, a useful quarterly routine is:

- Load the site on mobile and desktop over HTTPS.
- Submit every important form and confirm delivery.
- Check the homepage title, description and H1.
- Review image alternatives for meaningful images.
- Validate structured data against visible content.
- Confirm domain, hosting, analytics and Search Console access.
- Record the date, result and person responsible for each check.

For a broader framework, use our [technical SEO Auckland checklist](/technical-seo-auckland/) and [small-business website design guide](/small-business-website-design-auckland/). If you need an evidence-based review of your own site, [contact Kiwi Web Design](/contact/) and we will separate confirmed faults from optional improvements.

## Data note

Audit date: 26 August 2026. Sample frame: eight current live domains linked from KWD case studies. Seven pages returned HTML over a valid HTTPS connection; one failed certificate validation. Counts are raw presence checks performed by one reviewer and should not be generalised beyond this sample.
