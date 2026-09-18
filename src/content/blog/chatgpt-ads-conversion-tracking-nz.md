---
title: "ChatGPT Ads Conversion Tracking: Inside KWD's Enquiry Setup"
description: "A source-based walkthrough of KWD's lead IDs, session attribution and successful-form events, plus a checklist for validating ChatGPT Ads conversions."
pubDate: 2026-09-19
lastModified: 2026-09-19
image: "/blog/Auckland.jpg"
articleSection: "ChatGPT Ads"
keywords: ["ChatGPT Ads conversion tracking", "OpenAI Ads pixel", "ChatGPT Ads GA4"]
---

<div class="kwd-snippet">

**A successful enquiry, a dispatched pixel event and an attributed ChatGPT Ads conversion are not the same thing.** KWD's website assigns a lead ID, records session-source details and dispatches a lead event after the contact form reports success. This walkthrough documents that implementation, then identifies what still needs to be checked in the browser, platform and lead records.

</div>

*Evidence: KWD website source reviewed on 19 September 2026, specifically the shared lead-attribution script and contact-page submission handler. This is an implementation walkthrough, not a campaign case study or evidence of attributed sales.*

## The actual path through our contact form

Our shared tracking script records the first observed landing path and referrer for the browser session, along with supported campaign parameters. It stores that attribution in session storage. Before submission, it creates a lead ID and attaches tracking fields to the form.

The contact page sends the form to its form-processing service. In the branch where the service returns a successful result, it calls the shared lead-tracking function. This distinction matters: opening the page, clicking Submit or receiving a failed response should not be treated as a successful enquiry.

The shared function then dispatches separate events to GA4 and the OpenAI pixel. The OpenAI call in our implementation is:

```javascript
window.oaiq?.(
  'measure',
  'lead_created',
  { type: 'customer_action' },
  { event_id: context.lead_id }
);
```

This extract contains no account identifier or client details. It shows the event boundary and shared lead ID, not a complete pixel installation. The optional call also means the enquiry flow can continue when the pixel is unavailable; successful form delivery does not prove an advertising event reached OpenAI.

## What our implementation records, and its limits

| Record | What it tells us |
| --- | --- |
| Landing path and initial referrer | The first observed entry information retained for that browser session. |
| UTM campaign parameters | Labels present on that session's entry URL, when supplied. |
| Lead ID | An identifier generated for the submission, also used as the pixel event ID. |
| GA4 client and session IDs | Analytics identifiers when available; not guaranteed on every browser. |
| Successful form response | The form service reported success; it does not establish lead quality or a sale. |

This is session-level attribution, not an account-wide identity system. It does not join devices or promise to recover every visit. If a visitor arrives untagged and later follows another link in the same session, our stored first-session attribution can remain unchanged. That is a reason to document the implementation, rather than label every source field as a definitive last-click record.

The script sends GA4 `form_submit` and `generate_lead` events. Those two event names must not be counted as two different enquiries. Our phone-click event is also separate: clicking a telephone link does not establish that a call connected or produced a customer.

## Where OpenAI conversion attribution fits

OpenAI's [conversion measurement guidance](https://help.openai.com/en/articles/20001409-conversion-measurement) describes pixel and server-side measurement, click matching and attribution windows. Its `oppref` click reference can be captured by the pixel. Our custom form-source script does not separately store that reference, so we do not claim to have it in our enquiry records.

If browser and server tracking are used for the same event, they need a consistent event ID for deduplication. This walkthrough does **not** establish that KWD has deployed the Conversions API. Adding a server route later would require its own validation and privacy review.

An event reaching the platform is only one step. Its event type must match the intended campaign conversion and its attribution must satisfy the platform's rules. That is why a form success count, GA4 count and Ads Manager count can differ without any one number being a complete sales ledger.

## Our validation checklist for a real campaign

1. **Confirm the event definition.** Decide whether the conversion is an accepted enquiry, completed booking or purchase. Do not reuse a generic button click as proof of all three.
2. **Run an authorised, labelled test.** Use a controlled browser session and a working destination. Avoid accidentally entering a real sales pipeline with an unlabelled test lead.
3. **Check the failed path too.** A rejected or unsuccessful submission must not create the success event. A retry should not silently produce duplicate business records.
4. **Compare the records.** Verify the form response, received enquiry, lead ID and intended analytics events. Then inspect platform event receipt separately.
5. **Check campaign attribution.** Confirm the selected event and attribution settings. A direct test can validate event receipt without proving a paid click was credited.
6. **Reconcile later outcomes.** Record whether the enquiry was suitable, contacted and converted to business. Keep test and spam records out of commercial totals.

Privacy choices and blocked scripts can affect measurement. Keep contact details and free-text form messages out of advertising event payloads unless a specifically supported, appropriately governed integration requires them. Preserve a usable enquiry path even when analytics fails.

## What this evidence does not establish

Reading source confirms intended behaviour, not successful execution in every visitor's browser. It does not prove current event receipt, attributed campaign conversions, inbox delivery or sales uplift. Those require the separate checks above. We have not used private enquiry contents or invented campaign performance to fill those gaps.

For planning, pair this walkthrough with our [NZ launch guide](/affordable-web-design-auckland/chatgpt-ads-new-zealand-guide/) and [readiness checklist](/chatgpt-ads-readiness-check/). Our [ChatGPT Ads management service](/chatgpt-ads/) includes agreeing what to measure before judging whether a test deserves to continue.
