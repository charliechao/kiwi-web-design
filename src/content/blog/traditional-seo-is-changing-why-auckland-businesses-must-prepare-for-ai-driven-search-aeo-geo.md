---
title: "Schema Markup for AI Search: How ChatGPT and Google AI Overviews Actually Read Your Website"
description: "Structured data is how AI systems understand your business well enough to cite it. Here's exactly which schema types matter and how they work, with a real example."
pubDate: 2026-02-25
lastModified: 2026-07-11
image: "/blog/ai-seo-auckland-small-business-owner.png"
---

If you've read our overview of [AI SEO for Auckland small businesses](/ai-seo-for-auckland-small-businesses/), you already know AI-driven search is real and already affecting who gets found. This post goes one level deeper into the part almost nobody explains clearly: **schema markup** — the actual mechanism that helps AI systems understand what your business is, without guessing.

## What Schema Markup Actually Is

Schema markup (also called structured data) is a standardised code format — usually JSON-LD — added to your website's pages that spells out facts about your business in a way machines can read directly, instead of inferring them from paragraphs of text.

Without schema, an AI system reading your homepage has to *guess*: is this a local business or a national one? Is that phone number current? Are those reviews real and how many are there? With schema, you tell it directly, in a structured format there's no ambiguity about.

Here's a simplified real example — the kind of thing that sits invisibly in a page's code:

```json
{
  "@type": "LocalBusiness",
  "name": "Kiwi Web Design",
  "telephone": "+64-21-039-6580",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Grey Lynn",
    "addressRegion": "Auckland",
    "addressCountry": "NZ"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0"
  }
}
```

That block does more for machine trust in five lines than a paragraph of marketing copy saying "we're a trusted local Auckland agency."

## The Schema Types That Actually Matter for AEO

Not every schema type is worth your time. For a small Auckland business, these are the ones that carry real weight:

| Schema Type | What It Tells AI Systems | Where to Use It |
|---|---|---|
| `Organization` / `LocalBusiness` | Who you are, where you're based, how to contact you | Homepage, every key page |
| `ProfessionalService` | Confirms you're a service business, not a product retailer | Homepage, service pages |
| `Review` / `AggregateRating` | Real, structured proof of reputation — not just a number in a headline | Homepage, testimonials page |
| `FAQPage` | Direct question-and-answer pairs AI systems can lift verbatim | Service pages with genuine FAQs |
| `Article` | Author, publish date, and topic for blog content — supports E-E-A-T | Every blog post |
| `BreadcrumbList` | How your pages relate to each other and your site structure | Every page |

The mistake we see most often isn't missing schema entirely — it's schema that doesn't match what's actually on the page. If your `Review` schema claims a rating your visible page doesn't back up, or your address in schema doesn't match your [Google Business Profile](/google-business-profile-guide-for-auckland-businesses/), that inconsistency undermines trust rather than building it. Structured data has to be accurate, not just present.

## How This Plays Out Differently Across AI Platforms

Not every AI system reads the web the same way. A few practical differences worth knowing:

- **Google AI Overviews and AI Mode** draw heavily on Google's existing index and crawl data — meaning your traditional SEO fundamentals (indexability, Core Web Vitals, clean crawlability) still gate whether you're eligible to be included at all. Schema helps once you're in the running.
- **ChatGPT's web search** and **Perplexity** tend to favour clearly structured, directly-answering content and can cite sources more explicitly by name — which is where `FAQPage` schema and direct, plainly-worded answers near the top of a page earn their keep.
- **Microsoft Copilot** (powered by Bing) leans on Bing's own index, which is smaller than Google's — meaning consistent basic signals (verified Bing Webmaster Tools listing, clean NAP data) matter more than they might for Google-only strategies.

The practical takeaway: no single platform-specific trick covers all of them. The fundamentals — accurate schema, clean crawlability, consistent business information — are what earns visibility across all of them at once.

## A Simple Way to Check Your Own Site

You don't need to be technical to spot the gaps. Pull up your homepage and ask:

- If I strip away the design, does the raw content clearly state what this business does and where it's based?
- Do the FAQs (if you have any) answer real questions directly, in plain language, near the top?
- Does every number you display — reviews, years in business, client count — match what's actually verifiable elsewhere?

If any of those feel shaky, that's the gap schema markup and content structure are meant to close.

## Where This Fits With Everything Else

Schema markup isn't a silver bullet on its own — it's one piece that works alongside the broader trust picture we cover in [E-E-A-T for AI search](/affordable-web-design-auckland/eeat-for-ai-search-auckland-small-business/) and the [AI SEO service overview](/ai-seo-for-auckland-small-businesses/). Structured data tells machines *what* you are; E-E-A-T and consistent signals tell them *whether to trust it*. You need both.

If you're not sure what's currently implemented on your own site — or whether it's accurate — that's a quick, concrete thing we can check as part of [technical SEO for Auckland businesses](/affordable-seo-auckland/).
