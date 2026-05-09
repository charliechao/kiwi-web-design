/**
 * Build all 46 remaining Astro pages from fetched WP HTML files.
 * Outputs clean service/content pages with hero + prose content + FAQ accordion + CTA.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const summary = JSON.parse(fs.readFileSync(path.join(ROOT, 'page_summary.json'), 'utf8'));

// ─── Page definitions ───────────────────────────────────────────────────────
// template: 'service' | 'content' | 'thankyou' | 'contact'
const PAGES = [
  // Simple / policy pages
  { slug: 'thank-you',            eyebrow: '',                    template: 'thankyou'  },
  { slug: 'privacy-policy',       eyebrow: 'Legal',               template: 'content'   },
  // Platform / CMS service pages
  { slug: 'shopify-website-design-auckland',                   eyebrow: 'Platform Services',   template: 'service' },
  { slug: 'wordpress-website-design-auckland',                 eyebrow: 'Platform Services',   template: 'service' },
  { slug: 'woocommerce-website-design-auckland',               eyebrow: 'Platform Services',   template: 'service' },
  { slug: 'wordpress-seo-optimisation',                        eyebrow: 'WordPress Services',  template: 'service' },
  { slug: 'wordpress-ai-tools-integration-auckland',           eyebrow: 'WordPress Services',  template: 'service' },
  { slug: 'booking-appointment-websites-with-wordpress',       eyebrow: 'WordPress Services',  template: 'service' },
  { slug: 'membership-subscription-websites-with-wordpress-auckland', eyebrow: 'WordPress Services', template: 'service' },
  { slug: 'landing-pages-funnels-on-wordpress',                eyebrow: 'WordPress Services',  template: 'service' },
  { slug: 'wordpress-website-rebuilds-auckland',               eyebrow: 'WordPress Services',  template: 'service' },
  { slug: 'wordpress-maintenance-auckland',                    eyebrow: 'Website Care',        template: 'service' },
  // Hosting & support
  { slug: 'website-hosting-auckland',                          eyebrow: 'Website Services',    template: 'service' },
  { slug: 'website-copywriting-auckland',                      eyebrow: 'Website Services',    template: 'service' },
  { slug: 'website-branding',                                  eyebrow: 'Website Services',    template: 'service' },
  { slug: 'domain-management-auckland',                        eyebrow: 'Website Services',    template: 'service' },
  { slug: 'email-setup-business-email-hosting',                eyebrow: 'Website Services',    template: 'service' },
  { slug: 'website-training-and-handover',                     eyebrow: 'Website Services',    template: 'service' },
  // Security / maintenance
  { slug: 'website-security-for-auckland-small-businesses',    eyebrow: 'Website Care',        template: 'service' },
  { slug: 'malware-cleanup-for-auckland-small-business-websites', eyebrow: 'Website Care',     template: 'service' },
  { slug: 'website-backup-and-restoration-for-auckland-small-businesses', eyebrow: 'Website Care', template: 'service' },
  { slug: 'analytics-reporting-for-auckland-small-business-websites', eyebrow: 'Website Services', template: 'service' },
  { slug: 'ai-content-setup-for-websites',                     eyebrow: 'Website Services',    template: 'service' },
  { slug: 'wordpress-plugins-for-small-businesses-in-auckland', eyebrow: 'WordPress Resources', template: 'service' },
  { slug: 'wordpress-themes-for-auckland-small-businesses',    eyebrow: 'WordPress Resources', template: 'service' },
  // Business type pages
  { slug: 'small-business-web-design-auckland',                eyebrow: 'Web Design Auckland', template: 'service' },
  { slug: 'tradie-website-design-auckland',                    eyebrow: 'Tradie Web Design',   template: 'service' },
  { slug: 'ecommerce-website-auckland',                        eyebrow: 'eCommerce',           template: 'service' },
  // Industry pages
  { slug: 'industries-we-serve-in-auckland',                   eyebrow: 'Industries',          template: 'service' },
  { slug: 'how-kiwi-web-design-helps-auckand-lawyers',         eyebrow: 'Industry Solutions',  template: 'service' },
  { slug: 'how-kiwi-web-design-helps-auckland-healthcare',     eyebrow: 'Industry Solutions',  template: 'service' },
  { slug: 'how-kiwi-web-design-helps-auckland-restaurants',    eyebrow: 'Industry Solutions',  template: 'service' },
  { slug: 'how-kiwi-web-design-helps-auckland-beauty-industry', eyebrow: 'Industry Solutions', template: 'service' },
  // SEO & marketing
  { slug: 'local-seo-for-auckland-small-businesses',           eyebrow: 'Digital Marketing',   template: 'service' },
  { slug: 'seo-for-ecommerce',                                 eyebrow: 'Digital Marketing',   template: 'service' },
  { slug: 'ai-seo-for-auckland-small-businesses',              eyebrow: 'Digital Marketing',   template: 'service' },
  { slug: 'google-business-profile-guide-for-auckland-businesses', eyebrow: 'Digital Marketing', template: 'service' },
  // Company / info pages
  { slug: 'our-process',                                        eyebrow: 'How We Work',         template: 'service' },
  { slug: 'work-with-us',                                       eyebrow: 'Work with Us',        template: 'contact' },
  { slug: 'website-design-process-in-auckland',                eyebrow: 'Our Process',         template: 'service' },
  { slug: 'solutions-auckland-kiwi-web-design',                eyebrow: 'Our Solutions',       template: 'service' },
  { slug: 'testimonials-reviews',                              eyebrow: 'Client Reviews',      template: 'service' },
  { slug: 'monthly-subscription',                              eyebrow: 'Pricing',             template: 'service' },
  { slug: 'press-release-and-news',                            eyebrow: 'Press & News',        template: 'service' },
  { slug: 'faq',                                               eyebrow: 'Help & Support',      template: 'service' },
  { slug: '7-best-web-design-agencies-in-auckland-2026',       eyebrow: 'Industry Guide',      template: 'service' },
];

// ─── HTML helpers ────────────────────────────────────────────────────────────

function readHtml(slug) {
  const f = path.join(ROOT, `page_${slug}.html`);
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '';
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&hellip;/g, '...')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '-')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '-')
    .replace(/&#8216;/g, '\u2018')
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8220;/g, '\u201C')
    .replace(/&#8221;/g, '\u201D')
    .replace(/&nbsp;/g, '\u00A0');
}

function stripStyleScript(html) {
  return html
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '');
}

function cleanHtml(html) {
  html = stripStyleScript(html);

  // Strip Elementor wrapper divs/sections but keep their inner content
  html = html.replace(/<\/?(?:div|section|article|aside|header|footer|nav)(?:\s[^>]*)?>[ \t]*/gi, '');

  // Strip span wrappers but keep content
  html = html.replace(/<\/?span(?:\s[^>]*)?>[ \t]*/gi, '');

  // Normalize img: keep only src and alt (handle both attribute orders)
  html = html.replace(/<img\b([^>]*)>/gi, (_, attrs) => {
    const srcM = attrs.match(/\bsrc="([^"]*)"/);
    const altM = attrs.match(/\balt="([^"]*)"/);
    if (!srcM) return '';
    // Skip tiny thumbnails (WP generates -150x150 etc.)
    const src = srcM[1];
    if (/-\d+x\d+\.(jpg|jpeg|png|gif|webp)/i.test(src)) return '';
    const alt = altM ? altM[1] : '';
    return `<img src="${src}" alt="${alt}" loading="lazy">`;
  });

  // Normalize anchors: keep href, make internal links relative
  html = html.replace(/<a\b([^>]*)>/gi, (_, attrs) => {
    const hrefM = attrs.match(/\bhref="([^"]*)"/);
    if (!hrefM) return '<a>';
    let href = hrefM[1].replace('https://www.kiwiwebdesign.co.nz', '');
    return `<a href="${href}">`;
  });

  // Strip attributes from semantic elements (keep clean tags)
  html = html.replace(/<(h[1-6]|p|ul|ol|li|blockquote|table|thead|tbody|tr|td|th|figure|figcaption|strong|em|br|hr|details|summary)\s[^>]*/gi, '<$1');

  // Remove empty paragraphs & nbsp paragraphs
  html = html.replace(/<p>\s*(&nbsp;)?\s*<\/p>/gi, '');

  // Collapse excessive blank lines
  html = html.replace(/(\n\s*){3,}/g, '\n\n');
  html = html.replace(/[ \t]+/g, ' ');

  // Escape Astro template interpolation characters in HTML content
  html = html.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');

  return html.trim();
}

function extractH1(rawHtml) {
  const m = rawHtml.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  if (!m) return '';
  return decodeEntities(m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
}

/**
 * Extract FAQ items and return them plus the body HTML without the FAQ section.
 */
function extractFAQs(html) {
  const faqHeadingRx = /<h[23]\b[^>]*>[\s\S]*?(?:FAQ|Frequently Asked|common questions|FAQs)[\s\S]*?<\/h[23]>/i;
  const matchH = faqHeadingRx.exec(html);
  if (!matchH) return { faqs: [], bodyHtml: html };

  const faqStart = matchH.index;
  const faqSection = html.slice(faqStart + matchH[0].length);
  const beforeFaq = html.slice(0, faqStart);

  const faqs = [];
  const qRx = /<h3\b[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h[23]\b|$)/gi;
  let m;
  while ((m = qRx.exec(faqSection)) !== null) {
    const question = decodeEntities(m[1].replace(/<[^>]+>/g, '').trim());
    const answer = m[2].trim();
    if (question.length > 4 && answer) {
      faqs.push({ q: question, a: answer });
    }
  }

  return { faqs, bodyHtml: beforeFaq };
}

// Remove the H1 from body (we render it in the hero instead)
function stripH1(html) {
  return html.replace(/<h1\b[\s\S]*?<\/h1>/i, '').trim();
}

// ─── Schema builder ───────────────────────────────────────────────────────────

function buildSchema(slug, title, description, heroImage) {
  const base = 'https://www.kiwiwebdesign.co.nz';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${base}/${slug}/`,
        'url': `${base}/${slug}/`,
        'name': title,
        'description': description,
        'inLanguage': 'en-NZ',
        'isPartOf': { '@id': `${base}/#website` },
        'breadcrumb': { '@id': `${base}/${slug}/#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${base}/${slug}/#breadcrumb`,
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${base}/` },
          { '@type': 'ListItem', 'position': 2, 'name': title },
        ],
      },
      {
        '@type': 'Organization',
        '@id': `${base}/#organization`,
        'name': 'Kiwi Web Design',
        'url': base,
        'logo': {
          '@type': 'ImageObject',
          'url': `${base}/wp-content/uploads/2025/04/android-chrome-512x512-1.png`,
        },
      },
    ],
  };
}

// ─── Page generators ──────────────────────────────────────────────────────────

const SHARED_STYLE = `
<style>
  /* ── hero ── */
  .hero { background: var(--kwd-dark); color: var(--kwd-white); padding: 4rem 0 3rem; }
  .hero-inner { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; display: flex; gap: 3rem; align-items: center; }
  .hero-text { flex: 1; min-width: 0; }
  .eyebrow { font-size: .75rem; letter-spacing: .12em; text-transform: uppercase; color: var(--kwd-yellow); font-weight: 700; margin: 0 0 .6rem; }
  .hero-text h1 { font-family: var(--kwd-font-heading); font-size: clamp(1.8rem, 4vw, 2.8rem); margin: 0 0 1rem; line-height: 1.2; }
  .hero-sub { font-size: 1.05rem; opacity: .85; max-width: 580px; margin: 0 0 2rem; line-height: 1.65; }
  .hero-btns { display: flex; flex-wrap: wrap; gap: .75rem; }
  .btn-primary { background: var(--kwd-yellow); color: var(--kwd-dark); padding: .75rem 1.75rem; border-radius: 6px; font-weight: 700; text-decoration: none; display: inline-block; font-size: .95rem; }
  .btn-outline { border: 2px solid rgba(255,255,255,.6); color: var(--kwd-white); padding: .75rem 1.75rem; border-radius: 6px; font-weight: 700; text-decoration: none; display: inline-block; font-size: .95rem; }
  .hero-img { flex: 0 0 42%; }
  .hero-img img { width: 100%; border-radius: 10px; object-fit: cover; max-height: 380px; display: block; }
  /* ── prose content ── */
  .page-content { padding: 3.5rem 0; }
  .prose { max-width: 900px; margin: 0 auto; padding: 0 1.5rem; }
  .prose h1 { font-family: var(--kwd-font-heading); font-size: 2rem; margin: 0 0 1rem; color: var(--kwd-dark); }
  .prose h2 { font-family: var(--kwd-font-heading); font-size: 1.6rem; margin: 2.5rem 0 .75rem; color: var(--kwd-dark); border-bottom: 2px solid var(--kwd-yellow); padding-bottom: .3rem; }
  .prose h3 { font-family: var(--kwd-font-heading); font-size: 1.2rem; margin: 1.75rem 0 .5rem; color: var(--kwd-dark); }
  .prose h4 { font-size: 1rem; font-weight: 700; margin: 1.25rem 0 .4rem; color: #222; }
  .prose h5, .prose h6 { font-size: .95rem; font-weight: 700; margin: 1rem 0 .35rem; color: #333; }
  .prose p { margin: 0 0 1rem; line-height: 1.75; color: #333; }
  .prose ul { padding-left: 1.4rem; margin: 0 0 1rem; list-style: disc; }
  .prose ol { padding-left: 1.4rem; margin: 0 0 1rem; }
  .prose li { margin-bottom: .4rem; line-height: 1.65; color: #333; }
  .prose img { max-width: 100%; height: auto; border-radius: 8px; margin: 1.75rem 0; display: block; }
  .prose blockquote { border-left: 4px solid var(--kwd-yellow); padding: .75rem 1.25rem; margin: 1.75rem 0; background: #f8f6f0; font-style: italic; color: #444; border-radius: 0 6px 6px 0; }
  .prose a { color: var(--kwd-dark); text-decoration: underline; font-weight: 600; }
  .prose a:hover { color: var(--kwd-brown); }
  .prose strong { color: var(--kwd-dark); }
  .prose table { width: 100%; border-collapse: collapse; margin: 1.75rem 0; font-size: .9rem; overflow-x: auto; display: block; }
  .prose th, .prose td { padding: .65rem 1rem; border: 1px solid #ddd; text-align: left; white-space: nowrap; }
  .prose th { background: var(--kwd-dark); color: var(--kwd-white); }
  .prose tr:nth-child(even) td { background: #fafafa; }
  /* ── faq ── */
  .faq-section { background: var(--kwd-cream); padding: 4rem 0; }
  .faq-inner { max-width: 860px; margin: 0 auto; padding: 0 1.5rem; }
  .faq-inner > h2 { font-family: var(--kwd-font-heading); font-size: 1.8rem; margin: 0 0 2rem; color: var(--kwd-dark); }
  .faq-item { border-bottom: 1px solid #d8d0c0; }
  .faq-item summary { cursor: pointer; padding: 1.1rem 0; font-weight: 600; font-size: 1rem; list-style: none; display: flex; justify-content: space-between; align-items: center; color: var(--kwd-dark); }
  .faq-item summary::-webkit-details-marker { display: none; }
  .faq-item summary::after { content: '+'; font-size: 1.4rem; color: var(--kwd-yellow); flex-shrink: 0; margin-left: .75rem; }
  .faq-item[open] summary::after { content: '−'; }
  .faq-answer { padding: .25rem 0 1.25rem; line-height: 1.7; color: #444; }
  .faq-answer p { margin: 0 0 .6rem; }
  .faq-answer ul, .faq-answer ol { padding-left: 1.3rem; margin: 0 0 .6rem; }
  /* ── cta ── */
  .cta-strip { background: var(--kwd-dark); color: var(--kwd-white); text-align: center; padding: 4rem 1.5rem; }
  .cta-strip h2 { font-family: var(--kwd-font-heading); font-size: 2rem; margin: 0 0 .75rem; }
  .cta-strip p { opacity: .85; margin: 0 0 2rem; font-size: 1.05rem; }
  .cta-btns { display: flex; flex-wrap: wrap; gap: .75rem; justify-content: center; }
  /* ── contact form ── */
  .contact-section { padding: 4rem 0; background: var(--kwd-cream); }
  .contact-inner { max-width: 720px; margin: 0 auto; padding: 0 1.5rem; }
  .contact-inner h2 { font-family: var(--kwd-font-heading); font-size: 1.8rem; margin: 0 0 .5rem; color: var(--kwd-dark); }
  .contact-inner > p { margin: 0 0 2rem; color: #555; line-height: 1.65; }
  .contact-form { display: grid; gap: 1.25rem; }
  .form-group { display: flex; flex-direction: column; gap: .4rem; }
  .form-group label { font-weight: 600; font-size: .9rem; color: var(--kwd-dark); }
  .form-group input, .form-group textarea, .form-group select { padding: .7rem 1rem; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem; font-family: inherit; background: #fff; transition: border-color .2s; }
  .form-group input:focus, .form-group textarea:focus { outline: none; border-color: var(--kwd-yellow); }
  .form-group textarea { resize: vertical; min-height: 130px; }
  .form-submit { margin-top: .5rem; }
  /* ── responsive ── */
  @media (max-width: 768px) {
    .hero-inner { flex-direction: column; }
    .hero-img { display: none; }
    .hero-text h1 { font-size: 1.75rem; }
  }
</style>`;

// ── Thank-you page ────────────────────────────────────────────────────────────
function genThankyou(slug, info) {
  const schema = buildSchema(slug, info.title, info.description, info.image);
  return `---
import Layout from '../layouts/Layout.astro';
const schema = ${JSON.stringify(schema, null, 2)};
---
<Layout title="${esc(info.title)}" description="${esc(info.description)}" schema={schema}>
  <section style="background:var(--kwd-dark);color:var(--kwd-white);text-align:center;padding:6rem 1.5rem 5rem;">
    <div style="max-width:600px;margin:0 auto;">
      <p style="font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;color:var(--kwd-yellow);font-weight:700;margin:0 0 1rem;">Thank You</p>
      <h1 style="font-family:var(--kwd-font-heading);font-size:clamp(2rem,5vw,3rem);margin:0 0 1rem;">Thanks for reaching out!</h1>
      <p style="font-size:1.1rem;opacity:.85;margin:0 0 2.5rem;line-height:1.65;">We'll get back to you within 24 hours. In the meantime, feel free to explore our work.</p>
      <a href="/" style="background:var(--kwd-yellow);color:var(--kwd-dark);padding:.75rem 2rem;border-radius:6px;font-weight:700;text-decoration:none;display:inline-block;">Back to Home</a>
    </div>
  </section>
</Layout>
`;
}

// ── Plain content page (privacy policy etc.) ──────────────────────────────────
function genContent(slug, info, bodyHtml) {
  const schema = buildSchema(slug, info.title, info.description, info.image);
  return `---
import Layout from '../layouts/Layout.astro';
const schema = ${JSON.stringify(schema, null, 2)};
---
<Layout title="${esc(info.title)}" description="${esc(info.description)}" schema={schema}>
  <section style="background:var(--kwd-dark);color:var(--kwd-white);padding:3rem 0 2.5rem;">
    <div style="max-width:900px;margin:0 auto;padding:0 1.5rem;">
      <h1 style="font-family:var(--kwd-font-heading);font-size:clamp(1.8rem,4vw,2.6rem);margin:0;">${esc(info.title)}</h1>
    </div>
  </section>
  <section class="page-content">
    <div class="prose">
${bodyHtml}
    </div>
  </section>
</Layout>
${SHARED_STYLE}
`;
}

// ── Standard service / content page ──────────────────────────────────────────
function genService(slug, info, eyebrow, h1Text, bodyHtml, faqs) {
  const schema = buildSchema(slug, info.title, info.description, info.image);
  const heroImg = info.image || '';
  const desc = info.description || '';

  const faqSection = faqs.length ? `
  <section class="faq-section">
    <div class="faq-inner">
      <h2>Frequently Asked Questions</h2>
${faqs.map(({ q, a }) => `      <details class="faq-item">
        <summary>${esc(q)}</summary>
        <div class="faq-answer">${a}</div>
      </details>`).join('\n')}
    </div>
  </section>` : '';

  return `---
import Layout from '../layouts/Layout.astro';
const schema = ${JSON.stringify(schema, null, 2)};
---
<Layout title="${esc(info.title)}" description="${esc(desc)}" schema={schema}>
  <section class="hero">
    <div class="hero-inner">
      <div class="hero-text">
        ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
        <h1>${esc(h1Text || info.title)}</h1>
        <p class="hero-sub">${esc(desc)}</p>
        <div class="hero-btns">
          <a href="/website-designer-auckland/#contact" class="btn-primary">Book Free Consultation</a>
          <a href="/small-business-website-design-auckland/#packages" class="btn-outline">View Packages</a>
        </div>
      </div>
      ${heroImg ? `<div class="hero-img">
        <img src="${heroImg}" alt="${esc(h1Text || info.title)}" loading="lazy" />
      </div>` : ''}
    </div>
  </section>

  <section class="page-content">
    <div class="prose">
${bodyHtml}
    </div>
  </section>
${faqSection}
  <section class="cta-strip">
    <h2>Ready to grow your business online?</h2>
    <p>Let's build something that works for you. Free consultation, no obligation.</p>
    <div class="cta-btns">
      <a href="/website-designer-auckland/#contact" class="btn-primary">Book Free Consultation</a>
      <a href="/small-business-website-design-auckland/#packages" class="btn-outline">View Our Packages</a>
    </div>
  </section>
</Layout>
${SHARED_STYLE}
`;
}

// ── Contact / work-with-us page ───────────────────────────────────────────────
function genContact(slug, info, eyebrow, h1Text, bodyHtml, faqs) {
  const schema = buildSchema(slug, info.title, info.description, info.image);
  const heroImg = info.image || '';
  const desc = info.description || '';

  const faqSection = faqs.length ? `
  <section class="faq-section">
    <div class="faq-inner">
      <h2>Common Questions</h2>
${faqs.map(({ q, a }) => `      <details class="faq-item">
        <summary>${esc(q)}</summary>
        <div class="faq-answer">${a}</div>
      </details>`).join('\n')}
    </div>
  </section>` : '';

  return `---
import Layout from '../layouts/Layout.astro';
const schema = ${JSON.stringify(schema, null, 2)};
---
<Layout title="${esc(info.title)}" description="${esc(desc)}" schema={schema}>
  <section class="hero">
    <div class="hero-inner">
      <div class="hero-text">
        ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
        <h1>${esc(h1Text || info.title)}</h1>
        <p class="hero-sub">${esc(desc)}</p>
        <div class="hero-btns">
          <a href="#contact-form" class="btn-primary">Send Introduction</a>
          <a href="/about-us/" class="btn-outline">About Us</a>
        </div>
      </div>
      ${heroImg ? `<div class="hero-img">
        <img src="${heroImg}" alt="${esc(h1Text || info.title)}" loading="lazy" />
      </div>` : ''}
    </div>
  </section>

  <section class="page-content">
    <div class="prose">
${bodyHtml}
    </div>
  </section>
${faqSection}
  <section class="contact-section" id="contact-form">
    <div class="contact-inner">
      <h2>Get in touch with us</h2>
      <p>Send us a short introduction and we'll get back to you within 24 hours.</p>
      <form action="/api/contact" method="POST" class="contact-form">
        <div class="form-group">
          <label for="name">Your name <span style="color:red">*</span></label>
          <input type="text" id="name" name="name" required placeholder="Jane Smith" autocomplete="name" />
        </div>
        <div class="form-group">
          <label for="email">Email address <span style="color:red">*</span></label>
          <input type="email" id="email" name="email" required placeholder="jane@example.com" autocomplete="email" />
        </div>
        <div class="form-group">
          <label for="role">Your role / skills</label>
          <input type="text" id="role" name="role" placeholder="e.g. WordPress Developer, SEO Specialist, Designer" />
        </div>
        <div class="form-group">
          <label for="portfolio">Portfolio or LinkedIn URL</label>
          <input type="url" id="portfolio" name="portfolio" placeholder="https://yourwebsite.com" />
        </div>
        <div class="form-group">
          <label for="message">Tell us about yourself <span style="color:red">*</span></label>
          <textarea id="message" name="message" required placeholder="Share your background, favourite types of projects, availability, and how you prefer to work..."></textarea>
        </div>
        <div class="form-submit">
          <button type="submit" class="btn-primary">Send Introduction</button>
        </div>
      </form>
    </div>
  </section>
</Layout>
${SHARED_STYLE}
`;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function esc(str) {
  return (str || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&hellip;/g, '...')
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8216;/g, '\u2018')
    .replace(/&#8211;/g, '\u2013')
    .replace(/&#8220;/g, '\u201C')
    .replace(/&#8221;/g, '\u201D')
    .replace(/&nbsp;/g, ' ')
    .replace(/"/g, '&quot;');  // safe for HTML attributes
}

// ── Main ──────────────────────────────────────────────────────────────────────
let count = 0;
for (const page of PAGES) {
  const info = summary[page.slug];
  if (!info?.found) {
    console.warn(`  ✗ ${page.slug}: not in summary`);
    continue;
  }

  const rawHtml = readHtml(page.slug);
  let astroContent;

  if (page.template === 'thankyou') {
    astroContent = genThankyou(page.slug, info);

  } else if (page.template === 'content') {
    const cleaned = cleanHtml(rawHtml);
    const bodyHtml = stripH1(cleaned);
    astroContent = genContent(page.slug, info, bodyHtml);

  } else if (page.template === 'service' || page.template === 'contact') {
    const cleaned = cleanHtml(rawHtml);
    const h1 = extractH1(rawHtml);
    const withoutH1 = stripH1(cleaned);
    const { faqs, bodyHtml } = extractFAQs(withoutH1);

    if (page.template === 'service') {
      astroContent = genService(page.slug, info, page.eyebrow, h1, bodyHtml, faqs);
    } else {
      astroContent = genContact(page.slug, info, page.eyebrow, h1, bodyHtml, faqs);
    }
  }

  const outFile = path.join(ROOT, `src/pages/${page.slug}.astro`);
  fs.writeFileSync(outFile, astroContent, 'utf8');
  count++;
  console.log(`  ✓ ${page.slug}`);
}

console.log(`\nDone, ${count} pages written.`);
