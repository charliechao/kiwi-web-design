/**
 * build-location-pages.mjs
 * Reads each loc_*.html file, extracts structured content,
 * and writes Astro page files for each Auckland area page.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PAGES = join(ROOT, 'src', 'pages');

// ─── Helpers ────────────────────────────────────────────────────────────────

function strip(html = '') {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"')
    .replace(/&#8217;/g, '\u2019').replace(/&#8216;/g, '\u2018')
    .replace(/&#8220;/g, '\u201C').replace(/&#8221;/g, '\u201D')
    .replace(/&#8230;/g, '\u2026').replace(/&mdash;/g, '\u2014')
    .replace(/&#\d+;/g, '').replace(/&[a-z]+;/g, '')
    .replace(/\s{2,}/g, ' ').trim();
}

// Extract all <p> paragraphs after a heading that matches a pattern
function parasAfterHeading(html, ...patterns) {
  for (const pattern of patterns) {
    const re = new RegExp(
      `<h[2-4][^>]*>[^<]*${pattern}[\\s\\S]{0,300}?<\\/h[2-4]>([\\s\\S]*?)(?=<h[2-4]|<section|class="elementor[^"]*e-con-boxed|$)`,
      'i'
    );
    const m = html.match(re);
    if (!m) continue;
    const paras = [...m[1].matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
      .map(p => strip(p[1])).filter(t => t.length > 20).slice(0, 3).join(' ');
    if (paras) return paras;
  }
  return '';
}

// Extract list items after a heading
function listAfterHeading(html, ...patterns) {
  for (const pattern of patterns) {
    const re = new RegExp(
      `<h[2-4][^>]*>[^<]*${pattern}[\\s\\S]{0,300}?<\\/h[2-4]>([\\s\\S]*?)(?=<h[2-4]|$)`,
      'i'
    );
    const m = html.match(re);
    if (!m) continue;
    const items = [...m[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map(p => strip(p[1])).filter(t => t.length > 5 && t.length < 200).slice(0, 8);
    if (items.length) return items;
  }
  return [];
}

// Extract all unique WP image URLs (full size only)
function wpImages(html) {
  const seen = new Set();
  const out = [];
  for (const m of html.matchAll(/https:\/\/www\.kiwiwebdesign\.co\.nz\/wp-content\/uploads\/[^\s"'<>)]+?(?:jpg|jpeg|png|webp)/gi)) {
    const url = m[0];
    if (/-(300|150)x/.test(url)) continue; // skip thumbnails
    if (seen.has(url)) continue;
    seen.add(url); out.push(url);
  }
  return out;
}

// Extract FAQ items from details/summary or accordion widgets
function extractFAQs(html) {
  const faqs = [];
  for (const m of html.matchAll(/<details[^>]*>[\s\S]*?<summary[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi)) {
    const q = strip(m[1]).trim();
    const a = strip(m[2]).trim();
    if (q && a && q.length > 5) faqs.push({ q, a: a.slice(0, 300) });
  }
  if (!faqs.length) {
    for (const m of html.matchAll(/e-n-accordion-item-title-text[^>]*>\s*([^<]+)\s*<[\s\S]*?role="region"[^>]*>([\s\S]*?)<\/div>\s*<\/details>/gi)) {
      const q = m[1].trim();
      const a = strip(m[2]).trim();
      if (q && a) faqs.push({ q, a: a.slice(0, 300) });
    }
  }
  return faqs.slice(0, 6);
}

// ─── Location page definitions ───────────────────────────────────────────────

const locations = [
  {
    slug: 'north-shore-website-design',
    file: 'loc_north-shore-website-design.html',
    title: 'North Shore Website Design',
    description: 'Need a website for your North Shore business? Kiwi Web Design builds fast, modern sites that rank and convert. Simple pricing from $1,290.',
    heroImg: 'https://www.kiwiwebdesign.co.nz/wp-content/uploads/2025/10/north-shore-website-design-auckland-kiwi-web-design.jpg',
    area: 'North Shore',
    suburbs: ['Takapuna', 'Devonport', 'Milford', 'Albany', 'Browns Bay', 'Glenfield', 'Northcote'],
  },
  {
    slug: 'west-auckland-web-design',
    file: 'loc_west-auckland-web-design.html',
    title: 'West Auckland Web Design',
    description: 'Looking for affordable web design in West Auckland? Kiwi Web Design builds professional, mobile-friendly websites for small businesses from $1,290.',
    heroImg: 'https://www.kiwiwebdesign.co.nz/wp-content/uploads/2025/10/West-Auckland.jpg',
    area: 'West Auckland',
    suburbs: ['Henderson', 'New Lynn', 'Avondale', 'Glen Eden', 'Swanson', 'Ranui', 'Massey'],
  },
  {
    slug: 'central-auckland-web-design',
    file: 'loc_central-auckland-web-design.html',
    title: 'Central Auckland Web Design',
    description: 'Affordable, high-performing websites for Central Auckland small businesses. Fast builds, SEO-ready, local support from Kiwi Web Design.',
    heroImg: 'https://www.kiwiwebdesign.co.nz/wp-content/uploads/2025/10/Auckland-CBD.jpg',
    area: 'Central Auckland',
    suburbs: ['Auckland CBD', 'Grey Lynn', 'Ponsonby', 'Parnell', 'Newmarket', 'Mt Eden', 'Remuera'],
  },
  {
    slug: 'east-auckland-web-design',
    file: 'loc_east-auckland-web-design.html',
    title: 'East Auckland Web Design',
    description: 'Professional, affordable web design for East Auckland businesses. Mobile-friendly sites with local SEO and fast turnaround from Kiwi Web Design.',
    heroImg: 'https://www.kiwiwebdesign.co.nz/wp-content/uploads/2025/10/Botany.jpg',
    area: 'East Auckland',
    suburbs: ['Botany', 'Howick', 'Pakuranga', 'Flat Bush', 'Bucklands Beach', 'Half Moon Bay', 'Dannemora'],
  },
  {
    slug: 'south-auckland-web-design',
    file: 'loc_south-auckland-web-design.html',
    title: 'South Auckland Web Design',
    description: 'Affordable South Auckland web design for small NZ businesses, fast, mobile-first, and SEO-ready by Kiwi Web Design.',
    heroImg: 'https://www.kiwiwebdesign.co.nz/wp-content/uploads/2025/10/rainbows-end-south-auckland.jpg',
    area: 'South Auckland',
    suburbs: ['Manukau', 'Papatoetoe', 'Manurewa', 'Otahuhu', 'Papakura', 'Takanini', 'Pukekohe'],
  },
];

// ─── Build each page ─────────────────────────────────────────────────────────

for (const loc of locations) {
  const html = readFileSync(join(ROOT, loc.file), 'utf8');

  // Extract section text
  const introText = parasAfterHeading(html, 'Web Design', 'Website', 'Auckland', 'Shore', 'West', 'East', 'South', 'Central');
  const whyText   = parasAfterHeading(html, 'Why', 'Choose', 'Local');
  const whatText  = parasAfterHeading(html, "What.{0,20}Included", 'Package', 'Included');
  const seoText   = parasAfterHeading(html, 'SEO', 'Search', 'Google');
  const included  = listAfterHeading(html, "What.{0,20}Included", 'Included', 'Package', 'Features');
  const faqs      = extractFAQs(html);
  const allImgs   = wpImages(html);
  // Use the hero image + up to 2 more gallery images
  const galleryImgs = allImgs.filter(u => u !== loc.heroImg).slice(0, 2);

  const canonicalURL = `https://www.kiwiwebdesign.co.nz/${loc.slug}/`;

  const defaultIncluded = [
    'Responsive WordPress website (mobile, tablet, desktop)',
    'SEO-ready structure to rank on Google',
    'Free in-person or online consultation',
    'Contact forms and click-to-call buttons',
    'Fast turnaround, most sites live in 2–3 weeks',
    'Transparent pricing from $1,290, no hidden fees',
  ];
  const inclItems = included.length >= 3 ? included : defaultIncluded;

  const defaultFAQs = [
    { q: `How much does web design in ${loc.area} cost?`, a: `Our websites for ${loc.area} small businesses start from $1,290. Every package includes a responsive WordPress site, basic SEO, and a free consultation.` },
    { q: 'How long does it take to build a website?', a: 'Most projects are completed in 2–3 weeks from the discovery call to go-live, depending on how quickly you can provide content.' },
    { q: 'Do you come to us for the consultation?', a: `Yes, we offer free in-person meetings anywhere in ${loc.area} and across Auckland, as well as online consultations.` },
    { q: 'Can you redesign an existing website?', a: 'Absolutely. We regularly migrate businesses from Wix, Squarespace, or old WordPress sites to a fast, modern build.' },
    { q: 'Do you offer ongoing support?', a: 'Yes. We have affordable monthly maintenance plans to keep your site secure, updated, and performing well.' },
  ];
  const faqItems = faqs.length >= 3 ? faqs : defaultFAQs;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": canonicalURL,
        "url": canonicalURL,
        "name": loc.title,
        "description": loc.description,
        "inLanguage": "en-NZ",
        "isPartOf": { "@id": "https://www.kiwiwebdesign.co.nz/#website" },
        "breadcrumb": { "@id": `${canonicalURL}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalURL}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.kiwiwebdesign.co.nz/" },
          { "@type": "ListItem", "position": 2, "name": loc.title },
        ],
      },
      {
        "@type": "LocalBusiness",
        "name": "Kiwi Web Design",
        "url": "https://www.kiwiwebdesign.co.nz/",
        "telephone": "+6421431337",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "147 Great North Road, Grey Lynn",
          "addressLocality": "Auckland",
          "postalCode": "1021",
          "addressCountry": "NZ",
        },
        "areaServed": loc.area,
      },
    ],
  };

  // Build frontmatter arrays as JS
  const inclJS  = inclItems.map(i => `  ${JSON.stringify(i)}`).join(',\n');
  const faqsJS  = faqItems.map(f => `  { q: ${JSON.stringify(f.q)}, a: ${JSON.stringify(f.a)} }`).join(',\n');
  const suburbsJS = loc.suburbs.map(s => `  ${JSON.stringify(s)}`).join(',\n');
  const schemaStr = JSON.stringify(schema);

  const page = `---
import Layout from '../layouts/Layout.astro';

const included = [
${inclJS}
];

const faqs = [
${faqsJS}
];

const suburbs = [
${suburbsJS}
];

const schema = ${schemaStr};
---

<Layout
  title=${JSON.stringify(loc.title)}
  description=${JSON.stringify(loc.description)}
  canonicalURL=${JSON.stringify(canonicalURL)}
  schema={schema}
>

  <!-- Hero -->
  <section class="loc-hero section-dark">
    <div class="container loc-hero-inner">
      <div class="loc-hero-text">
        <p class="loc-eyebrow">Auckland Web Design, ${loc.area}</p>
        <h1>${loc.title}</h1>
        <p class="loc-subhead">${loc.description}</p>
        <div class="loc-hero-btns">
          <a href="/website-designer-auckland/" class="btn-primary">Book a Free Consultation</a>
          <a href="/small-business-website-design-auckland/" class="btn-outline">View Packages</a>
        </div>
      </div>
      <div class="loc-hero-image">
        <img
          src=${JSON.stringify(loc.heroImg)}
          alt=${JSON.stringify(`${loc.area} web design by Kiwi Web Design Auckland`)}
          width="700"
          height="460"
          loading="eager"
        />
      </div>
    </div>
  </section>

  <!-- Intro + Why Us -->
  <section class="section">
    <div class="container loc-two-col">
      <div>
        <h2>Web Design for ${loc.area} Businesses</h2>
        ${introText ? `<p>${introText}</p>` : `<p>At Kiwi Web Design, we help small businesses in ${loc.area} build professional websites that attract local customers and generate real enquiries. Based in Grey Lynn, we work with businesses across all of Auckland, in-person or online.</p>`}
        ${whyText ? `<p>${whyText}</p>` : ''}
      </div>
      <div>
        <h2>What's Included</h2>
        <ul class="loc-included">
          {included.map((item) => <li>{item}</li>)}
        </ul>
        <a href="/website-designer-auckland/" class="btn-primary">Get a Free Quote</a>
      </div>
    </div>
  </section>

  <!-- Suburbs served -->
  <section class="section section-cream">
    <div class="container">
      <h2>Areas We Serve in ${loc.area}</h2>
      <p>We build websites for businesses across all of ${loc.area}, including:</p>
      <div class="loc-suburbs">
        {suburbs.map((s) => <span class="loc-suburb">{s}</span>)}
        <span class="loc-suburb">+ all surrounding areas</span>
      </div>
    </div>
  </section>

  ${seoText ? `<!-- SEO section -->
  <section class="section">
    <div class="container loc-narrow">
      <h2>Local SEO for ${loc.area}</h2>
      <p>${seoText}</p>
    </div>
  </section>` : ''}

  ${galleryImgs.length > 0 ? `<!-- Gallery -->
  <section class="section section-dark">
    <div class="container">
      <h2>Recent Work for Auckland Businesses</h2>
      <div class="loc-gallery">
        ${galleryImgs.map(src => `<img src="${src}" alt="Web design example, Kiwi Web Design Auckland" width="700" height="450" loading="lazy" />`).join('\n        ')}
      </div>
    </div>
  </section>` : ''}

  <!-- Trust strip -->
  <section class="section section-cream">
    <div class="container loc-trust-strip">
      <div class="loc-trust-card">
        <span class="loc-trust-num">$1,290</span>
        <span class="loc-trust-label">Packages from</span>
      </div>
      <div class="loc-trust-card">
        <span class="loc-trust-num">2–3 wks</span>
        <span class="loc-trust-label">Typical delivery</span>
      </div>
      <div class="loc-trust-card">
        <span class="loc-trust-num">Free</span>
        <span class="loc-trust-label">Consultation</span>
      </div>
      <div class="loc-trust-card">
        <span class="loc-trust-num">50+</span>
        <span class="loc-trust-label">Projects delivered</span>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="section">
    <div class="container loc-narrow">
      <h2>Frequently Asked Questions</h2>
      <div class="faq-list">
        {faqs.map(({ q, a }) => (
          <details class="faq-item">
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="section section-dark text-center">
    <div class="container loc-narrow">
      <h2>Ready for a website that works for your ${loc.area} business?</h2>
      <p>Book a free consultation with Kiwi Web Design, in person or online.</p>
      <a href="/website-designer-auckland/" class="btn-primary">Book a Free Consultation</a>
    </div>
  </section>

</Layout>

<style>
  /* Hero */
  .loc-hero { padding: 5rem 0; }
  .loc-hero-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
  }
  .loc-eyebrow {
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--kwd-yellow);
    margin-bottom: 0.75rem;
  }
  .loc-hero h1 { color: var(--kwd-white); margin-bottom: 1rem; }
  .loc-subhead { color: rgba(255,255,255,0.75); margin-bottom: 2rem; font-size: 1.05rem; }
  .loc-hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
  .btn-outline {
    display: inline-block;
    border: 2px solid rgba(255,255,255,0.35);
    color: var(--kwd-white);
    padding: 0.7rem 1.5rem;
    border-radius: 4px;
    font-weight: 600;
    font-size: 0.9rem;
    transition: border-color 0.2s, background 0.2s;
  }
  .btn-outline:hover { border-color: var(--kwd-yellow); background: rgba(255,255,255,0.05); }
  .loc-hero-image img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 10px;
    display: block;
  }

  /* Two-col */
  .loc-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: start;
  }
  .loc-two-col h2 { font-size: clamp(1.4rem, 2.5vw, 1.9rem); margin-bottom: 1rem; }
  .loc-two-col p { color: var(--kwd-brown); line-height: 1.8; margin-bottom: 1rem; }

  /* Included list */
  .loc-included {
    list-style: none;
    padding: 0;
    margin: 0 0 2rem;
    display: grid;
    gap: 0.6rem;
  }
  .loc-included li {
    padding-left: 1.5rem;
    position: relative;
    font-size: 0.95rem;
    color: var(--kwd-brown);
  }
  .loc-included li::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: var(--kwd-dark);
    font-weight: 700;
  }

  /* Suburbs */
  .loc-suburbs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-top: 1.5rem;
  }
  .loc-suburb {
    background: var(--kwd-white);
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 999px;
    padding: 0.35rem 0.9rem;
    font-size: 0.875rem;
    font-weight: 500;
  }

  /* Narrow */
  .loc-narrow { max-width: 820px; }
  .loc-narrow h2 { margin-bottom: 1.25rem; }
  .loc-narrow p { color: var(--kwd-brown); line-height: 1.8; }

  /* Gallery */
  .section-dark h2 { color: var(--kwd-white); }
  .loc-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.25rem;
    margin-top: 2rem;
  }
  .loc-gallery img {
    width: 100%;
    height: 260px;
    object-fit: cover;
    border-radius: 8px;
    display: block;
  }

  /* Trust strip */
  .loc-trust-strip {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    text-align: center;
  }
  .loc-trust-card {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .loc-trust-num {
    font-size: 2rem;
    font-weight: 800;
    font-family: var(--kwd-font-heading);
    color: var(--kwd-dark);
    line-height: 1;
  }
  .loc-trust-label { font-size: 0.82rem; color: var(--kwd-brown); text-transform: uppercase; letter-spacing: 0.06em; }

  /* FAQ */
  .faq-list { display: grid; gap: 0.75rem; margin-top: 2rem; }
  .faq-item {
    background: var(--kwd-white);
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 8px;
    overflow: hidden;
  }
  .faq-item summary {
    padding: 1rem 1.25rem;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.95rem;
    list-style: none;
    position: relative;
    padding-right: 2.5rem;
  }
  .faq-item summary::after {
    content: "+";
    position: absolute;
    right: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.2rem;
    font-weight: 400;
    color: var(--kwd-brown);
  }
  .faq-item[open] summary::after { content: "−"; }
  .faq-item p { padding: 0 1.25rem 1rem; margin: 0; font-size: 0.9rem; color: var(--kwd-brown); }

  /* CTA */
  .text-center { text-align: center; }
  .section-dark.text-center h2 { color: var(--kwd-white); }
  .section-dark.text-center p { color: rgba(255,255,255,0.75); margin-bottom: 2rem; max-width: 520px; margin-inline: auto; }

  /* Responsive */
  @media (max-width: 900px) {
    .loc-hero-inner { grid-template-columns: 1fr; }
    .loc-hero-image { display: none; }
    .loc-two-col { grid-template-columns: 1fr; }
    .loc-trust-strip { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 600px) {
    .loc-trust-strip { grid-template-columns: repeat(2, 1fr); }
    .loc-gallery { grid-template-columns: 1fr; }
  }
</style>
`;

  const outPath = join(PAGES, `${loc.slug}.astro`);
  writeFileSync(outPath, page, 'utf8');
  console.log(`✓ src/pages/${loc.slug}.astro`);
}

console.log('\nDone, 5 location pages written.');
