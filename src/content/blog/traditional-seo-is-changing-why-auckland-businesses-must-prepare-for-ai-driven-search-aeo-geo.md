---
title: "Schema Markup and AI Search: What It Does and Does Not Do"
description: "A practical guide to what schema markup can help with, what it cannot guarantee, and how Auckland businesses should implement it for Google and AI search."
pubDate: 2026-02-25
lastModified: 2026-08-26
image: "/blog/AI-SEO-Auckland.jpg"
articleSection: "AI Search"
keywords:
  - schema markup AI search
  - structured data Auckland
  - AI SEO Auckland
  - Google rich results
---

Schema markup helps search engines identify facts and relationships on a webpage. It can support search features such as rich results, but it does **not** guarantee rankings, rich results, or a citation in an AI-generated answer.

That distinction matters. Businesses are increasingly being sold "AI schema" as if adding a block of JSON-LD will make ChatGPT or Google AI Overviews recommend them. Google says the opposite: there is no special schema or additional technical requirement for appearing in its AI search features. The same foundations still apply: useful content, crawlable pages, accurate information, and compliance with Search policies.

## The short answer

| Schema can help with | Schema cannot guarantee |
|---|---|
| Label the organisation, service, article, product, or breadcrumb shown on a page | A higher organic ranking |
| Give Google machine-readable details that agree with the visible page | A rich result |
| Make a page eligible for certain supported search features | Inclusion in an AI Overview |
| Reduce ambiguity around names, addresses, prices, authors, and relationships | A citation from ChatGPT, Perplexity, or another AI tool |
| Support a consistent technical description of the business | Trust when the underlying page or business information is weak |

Schema is supporting evidence. It is not a substitute for the page itself.

## What Google actually says about schema and AI search

Google's [guidance for AI features in Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) says that structured data is not required for generative AI features and that no special optimisation is needed beyond normal SEO best practices.

Google's [structured data introduction](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) explains the narrower benefit: structured data helps Google understand page content and can make a page eligible for rich results. Eligibility is not a promise that a rich result will appear.

This means an Auckland service business should treat schema as one part of a wider search foundation:

1. Publish a useful page that answers the customer's question.
2. Make the page crawlable and internally linked.
3. Keep the visible business information accurate.
4. Add only the structured data that describes that visible content.
5. Validate and monitor the result.

## Which schema types are useful for a small business?

The correct type depends on what is genuinely on the page. More schema is not automatically better.

### Organization or LocalBusiness

Use `Organization` to describe the business entity. A suitable `LocalBusiness` subtype can be useful when the business has a real local operation and the subtype accurately fits.

Typical properties include the business name, website, logo, telephone number, address, and relevant profile links. These details should agree with the website and other official business profiles.

### Service

`Service` can describe a real service offered on a service page, including the provider and service area. It should not be used to manufacture claims that the visitor cannot see on the page.

### Article

`Article` or a more specific subtype can identify a blog post, its headline, publication date, modification date, image, and author or publisher. A real byline and a useful author page are stronger trust signals than an anonymous article with technically perfect markup.

### BreadcrumbList

`BreadcrumbList` describes a page's position within the site. It is particularly useful on websites with service categories, location pages, or a substantial article library.

### Product and Offer

Use `Product` and `Offer` only when the page genuinely presents a product or applicable offer. Prices, availability, currency, and other commercial details need to match what a customer can see.

### Review and AggregateRating

Review markup deserves extra care. The reviews and ratings must be genuine, visible, relevant to the marked-up item, and compliant with Google's [structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies). Do not copy a rating into schema while showing different or outdated information on the page. Do not mark up testimonials as a shortcut to stars in search.

### FAQPage

FAQ content can still be helpful when it answers real customer questions. However, adding `FAQPage` markup does not create a special AI-search advantage, and Google's visible FAQ rich-result eligibility is limited. Write the questions for people first and use the markup only when the page and Google's current documentation support it.

## Problems we commonly find in small-business websites

In Kiwi Web Design audits, the issue is rarely "no schema at all." More often, it is schema that has drifted away from reality. Common examples include:

- duplicate organisation blocks inserted by a theme and an SEO plugin
- an old address or phone number left in JSON-LD after the page was updated
- a rating or review count that no longer matches the visible source
- service markup that describes services not shown on the page
- a generic schema template copied across unrelated pages
- valid code attached to thin, outdated, or contradictory content

These are practice-based observations, not proof that one schema error caused a particular ranking change. They do show why validation alone is not enough. A testing tool can confirm syntax; it cannot confirm that a business claim is true.

## A reliable implementation workflow

### 1. Start with the visible page

Identify the primary subject and make sure the page explains it clearly. If the business name, author, service, price, or review is not visible and supportable, fix the content before writing schema.

### 2. Check the current Google documentation

Use Google's documentation for the intended search feature and the relevant Schema.org vocabulary. Requirements and search-result eligibility can change, so an old plugin tutorial is not enough.

### 3. Add focused JSON-LD

Google recommends JSON-LD for most implementations. Keep the markup focused on the page rather than filling every possible property. Reuse stable organisation details carefully and generate page-specific details from the actual content.

### 4. Test the code

Use Google's Rich Results Test for supported rich-result types and a schema validator for general vocabulary checks. Fix errors, then examine warnings in context rather than adding irrelevant data simply to make them disappear.

### 5. Inspect the published URL

After deployment, use URL Inspection in Google Search Console to confirm Google can access and render the page. Search Console enhancement reports can reveal issues across groups of pages.

### 6. Recheck after website changes

Changing a business address, product price, review display, author name, plugin, or page template can make previously correct markup stale. Include schema in routine content and website maintenance.

## Where AI-search optimisation fits

AI-assisted search does not replace SEO. A page still needs to be discoverable, accessible, understandable, and useful. Direct answers, descriptive headings, first-hand evidence, clear authorship, accurate sources, and sensible internal links can make content easier for both people and machines to interpret.

No honest provider can promise that a particular AI system will cite a page. The platforms choose sources using systems that website owners do not control, and those systems change. The practical goal is to publish material worth retrieving and make its meaning easy to verify.

For a local business, that usually means:

- answer the customer's real decision questions, not just a target keyword
- show who created the content and why they are qualified to discuss it
- include first-hand examples, limitations, and dates where they matter
- keep contact, service-area, and commercial information consistent
- support factual claims with primary sources
- use schema to describe those facts accurately
- track impressions, clicks, leads, and assisted discovery without claiming certainty about an AI citation

## What to do next

If your website already has schema, audit accuracy before adding more. Compare every important property with the visible page, remove duplicates, and test the final output. If your site has none, begin with the business entity and the page types that have a clear purpose.

Kiwi Web Design can review the content, technical implementation, and search visibility together through our [SEO service for Auckland businesses](/affordable-seo-auckland/) and [AI SEO service](/ai-seo-for-auckland-small-businesses/). The aim is not to install a magic tag. It is to give search systems and customers a clear, consistent, supportable account of your business.
