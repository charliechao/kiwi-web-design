/**
 * build-case-studies.mjs
 * Reads each cs_*.html file, extracts structured content, writes Astro page files.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ─── HTML helpers ───────────────────────────────────────────────────────────

function stripTags(html = '') {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#8217;/g, '\u2019')
    .replace(/&#8216;/g, '\u2018').replace(/&#8220;/g, '\u201C').replace(/&#8221;/g, '\u201D')
    .replace(/&#8230;/g, '\u2026').replace(/&ldquo;/g, '\u201C').replace(/&rdquo;/g, '\u201D')
    .replace(/&mdash;/g, '\u2014').replace(/&#\d+;/g, '').replace(/&[a-z]+;/g, '')
    .replace(/\s{2,}/g, ' ').trim();
}

function extractText(html, startPattern, endPattern) {
  const startIdx = html.search(startPattern);
  if (startIdx === -1) return '';
  const chunk = html.slice(startIdx);
  const endIdx = endPattern ? chunk.search(endPattern) : chunk.length;
  return stripTags(chunk.slice(0, endIdx > 0 ? endIdx : chunk.length)).slice(0, 600);
}

function extractParagraphsAfterH(html, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/&/g, '&amp;');
  const re = new RegExp(`<h[23][^>]*>[^<]*${escaped}[\\s\\S]{0,200}?<\\/h[23]>([\\s\\S]*?)(?=<h[23]|<section|<div class="elementor-element[^"]*e-con-boxed|$)`, 'i');
  const m = html.match(re);
  if (!m) return '';
  // Extract all <p> content
  const paras = [...m[1].matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map(p => stripTags(p[1])).filter(t => t.length > 20).slice(0, 3);
  return paras.join(' ');
}

function extractListItems(html, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/&/g, '&amp;');
  const re = new RegExp(`<h[23][^>]*>[^<]*${escaped}[\\s\\S]{0,200}?<\\/h[23]>([\\s\\S]*?)(?=<h[23]|$)`, 'i');
  const m = html.match(re);
  if (!m) return [];
  return [...m[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map(p => stripTags(p[1])).filter(t => t.length > 5).slice(0, 8);
}

function extractFirstImage(html) {
  const m = html.match(/https:\/\/www\.kiwiwebdesign\.co\.nz\/wp-content\/uploads\/[^\s"'<>)]+(?:jpg|jpeg|png|webp)/i);
  return m ? m[0] : '';
}

function extractAllImages(html) {
  const seen = new Set();
  const all = [];
  for (const m of html.matchAll(/https:\/\/www\.kiwiwebdesign\.co\.nz\/wp-content\/uploads\/[^\s"'<>)]+?(?:jpg|jpeg|png|webp)/gi)) {
    const url = m[0];
    // Skip thumbnails (300x, -150x, srcset variants)
    if (/-(300|150|768|1024)x/.test(url)) continue;
    if (seen.has(url)) continue;
    seen.add(url);
    all.push(url);
  }
  return all.slice(0, 6);
}

function extractBlockquote(html) {
  const bq = html.match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/i);
  if (bq) return stripTags(bq[1]);
  // Try kwd-quote or similar
  const q = html.match(/class="[^"]*quote[^"]*"[^>]*>([\s\S]*?)<\/\w+>/i);
  return q ? stripTags(q[1]).slice(0, 300) : '';
}

function extractFAQs(html) {
  const faqs = [];
  // Try details/summary pattern
  for (const m of html.matchAll(/<details[^>]*>[\s\S]*?<summary[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi)) {
    const q = stripTags(m[1]).trim();
    const a = stripTags(m[2]).trim();
    if (q && a && q.length > 5) faqs.push({ q, a: a.slice(0, 300) });
  }
  // If none, try n-accordion pattern
  if (!faqs.length) {
    for (const m of html.matchAll(/e-n-accordion-item-title-text[^>]*>([^<]+)<[\s\S]*?role="region"[^>]*>([\s\S]*?)<\/div>\s*<\/details>/gi)) {
      const q = m[1].trim();
      const a = stripTags(m[2]).trim();
      if (q && a) faqs.push({ q, a: a.slice(0, 300) });
    }
  }
  return faqs.slice(0, 6);
}

function extractStatCards(html) {
  // data-target animated counters
  const stats = [];
  for (const m of html.matchAll(/data-target="([^"]+)"[\s\S]{0,500}?(?:<span[^>]*class="[^"]*(?:label|desc)[^"]*"[^>]*>([\s\S]*?)<\/span>|<p[^>]*>([\s\S]*?)<\/p>)/gi)) {
    const num = m[1];
    const label = stripTags(m[2] || m[3] || '').trim();
    if (num && label) stats.push({ num, label });
  }
  // Try inline stat blocks: look for bold numbers followed by descriptive text
  if (stats.length === 0) {
    for (const m of html.matchAll(/<strong[^>]*>(\+?\d+[\.,]?\d*\s*[%xk]?)<\/strong>\s*(?:<br\s*\/?>)?\s*([\s\S]*?)(?=<strong|<h[23]|$)/gi)) {
      const num = stripTags(m[1]).trim();
      const label = stripTags(m[2]).trim().slice(0, 80);
      if (num && label.length > 3) stats.push({ num, label });
    }
  }
  return stats.slice(0, 4);
}

// ─── Case study definitions ──────────────────────────────────────────────────

const caseStudies = [
  {
    slug: 'custom-florist-website-design-auckland',
    file: 'cs_custom-florist-website-design-auckland.html',
    title: 'Case Study 1: Custom Florist Website Design Auckland',
    metaTitle: 'Florist Website Design Auckland – Kiwi Web Design Case Study',
    description: 'See how Kiwi Web Design helped an Auckland florist grow sales with a custom website featuring smart delivery scheduling, SEO, and WooCommerce.',
    client: 'Auckland Florist',
    industry: 'Retail — Floral & Gift',
    heroImg: 'https://www.kiwiwebdesign.co.nz/wp-content/uploads/2025/10/florist-website-design-auckland-kiwiwebdesign.jpg',
    stats: [
      { num: '45%', label: 'Increase in online orders' },
      { num: '100%', label: 'Mobile-optimised checkout' },
      { num: '3 weeks', label: 'From brief to launch' },
    ],
  },
  {
    slug: 'kiwiland-construction-website',
    file: 'cs_kiwiland-construction-website.html',
    title: 'Case Study 2: Kiwiland Construction Website',
    metaTitle: 'Kiwiland Construction Website Design – Kiwi Web Design Case Study',
    description: 'Kiwiland Construction Case Study – how Kiwi Web Design rebuilt a construction company website to attract more Auckland clients and generate enquiries.',
    client: 'Kiwiland Construction',
    industry: 'Construction & Building',
    heroImg: 'https://www.kiwiwebdesign.co.nz/wp-content/uploads/2025/07/Kiwiland-e1753410581810.jpg',
    stats: [
      { num: '+220%', label: 'Increase in enquiries' },
      { num: '+55%', label: 'Organic traffic growth' },
      { num: '3 weeks', label: 'Full project delivery' },
    ],
  },
  {
    slug: 'topline-services-cleaning-website',
    file: 'cs_topline-services-cleaning-website.html',
    title: 'Case Study 3: Topline Services Cleaning Website',
    metaTitle: 'Topline Services Cleaning Website – Kiwi Web Design Case Study',
    description: 'How Kiwi Web Design helped Topline Services, an Auckland cleaning company, get more mobile enquiries with a fast, easy-to-book website.',
    client: 'Topline Services',
    industry: 'Commercial & Residential Cleaning',
    heroImg: 'https://www.kiwiwebdesign.co.nz/wp-content/uploads/2025/06/Auckland_Cleaner-e1750284778292.jpg',
    stats: [
      { num: '2x', label: 'More mobile enquiries' },
      { num: '4x', label: 'Increase in calls' },
      { num: '85%', label: 'Client satisfaction' },
    ],
  },
  {
    slug: 'melanoma-specialists-website',
    file: 'cs_melanoma-specialists-website.html',
    title: 'Case Study 4: Melanoma Specialists Website',
    metaTitle: 'Melanoma Specialists Website Design Auckland – Kiwi Web Design Case Study',
    description: 'How Kiwi Web Design helped a specialist healthcare provider build trust and attract new patients with a professional, SEO-optimised website.',
    client: 'Auckland Melanoma Specialists',
    industry: 'Healthcare — Dermatology',
    heroImg: 'https://www.kiwiwebdesign.co.nz/wp-content/uploads/2025/07/Specialist-e1753415885359.jpg',
    stats: [
      { num: '4x', label: 'Increase in patient enquiries' },
      { num: '6x', label: 'Organic visibility growth' },
      { num: '85%', label: 'Improved trust signals' },
    ],
  },
  {
    slug: 'inspector-guys-building-inspections-website',
    file: 'cs_inspector-guys-building-inspections-website.html',
    title: 'Case Study 5: Inspector Guys Building Inspections Website',
    metaTitle: 'Inspector Guys Website Design Auckland – Kiwi Web Design Case Study',
    description: 'How Kiwi Web Design transformed a home inspection company\'s website to generate more bookings and build customer trust across Auckland.',
    client: 'Inspector Guys Building Inspections',
    industry: 'Building Inspections',
    heroImg: 'https://www.kiwiwebdesign.co.nz/wp-content/uploads/2025/06/Auckland_Building_Inspector-e1750284793590.jpg',
    stats: [
      { num: '3x', label: 'More booking enquiries' },
      { num: '92%', label: 'Mobile-ready score' },
      { num: '6x', label: 'Organic traffic increase' },
    ],
  },
  {
    slug: 'fl-legal-website',
    file: 'cs_fl-legal-website.html',
    title: 'Case Study 6: FL Legal Website',
    metaTitle: 'FL Legal Website Design Auckland – Kiwi Web Design Case Study',
    description: 'How Kiwi Web Design transformed FL Legal\'s outdated site into a fast, lead-ready legal website with clear navigation, modern design, and better client conversions.',
    client: 'FL Legal',
    industry: 'Legal Services',
    heroImg: 'https://www.kiwiwebdesign.co.nz/wp-content/uploads/2025/10/legal-website-auckland-1.jpg',
    stats: [
      { num: '5x', label: 'Faster page load speed' },
      { num: '3x', label: 'More consultation requests' },
      { num: '6x', label: 'Organic search visibility' },
    ],
  },
  {
    slug: 'la-veranda-restaurant-website',
    file: 'cs_la-veranda-restaurant-website.html',
    title: 'Case Study 7: La Veranda Restaurant Website',
    metaTitle: 'La Veranda Restaurant Website Design – Kiwi Web Design Case Study',
    description: 'We rebuilt La Veranda\'s website into a fast, elegant experience matching their hospitality brand — clear menus, mobile-first, and booking pathways that convert.',
    client: 'La Veranda',
    industry: 'Hospitality — Restaurant & Events',
    heroImg: 'https://www.kiwiwebdesign.co.nz/wp-content/uploads/2025/07/Lavaranda-e1753415431519.jpg',
    stats: [
      { num: '5x', label: 'Faster page speed' },
      { num: '3x', label: 'More reservation enquiries' },
      { num: '6x', label: 'Organic visibility growth' },
    ],
  },
  {
    slug: 'dryice-blasting-services-website',
    file: 'cs_dryice-blasting-services-website.html',
    title: 'Case Study 8: Dryice Blasting Services Website',
    metaTitle: 'Dryice Blasting Services Website Redesign – Kiwi Web Design Case Study',
    description: 'Dryice Blasting Services website redesign driving faster Auckland leads with clarified user journeys, high-speed UX, and a 46% uplift in quote requests.',
    client: 'Dryice Blasting Services',
    industry: 'Industrial Cleaning & Restoration',
    heroImg: 'https://www.kiwiwebdesign.co.nz/wp-content/uploads/2025/11/dryice-blasting-auckland.jpg',
    stats: [
      { num: '+46%', label: 'Uplift in quote requests' },
      { num: '+38%', label: 'Faster page-load on mobile' },
      { num: '+32%', label: 'Increase in CTA clicks' },
      { num: '$86k', label: 'Revenue in first quarter' },
    ],
  },
  {
    slug: 'beauty-touch-case-study',
    file: 'cs_beauty-touch-case-study.html',
    title: 'Case Study: Beauty Touch Auckland',
    metaTitle: 'Beauty Touch Case Study – Kiwi Web Design Auckland',
    description: 'See how Kiwi Web Design helped Beauty Touch go from zero online presence to a fully booked premium beauty salon with a conversion-focused website in 3 weeks.',
    client: 'Your Beauty Touch',
    industry: 'Beauty & Wellness — Advanced Treatments',
    heroImg: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80',
    stats: [
      { num: '3 weeks', label: 'Zero to live website' },
      { num: '24/7', label: 'Online booking enabled' },
      { num: '6', label: 'Services showcased' },
    ],
  },
  {
    slug: 'case-study-scaffolding',
    file: 'cs_case-study-scaffolding.html',
    title: 'Case Study: Barrett Access Scaffolding',
    metaTitle: 'Barrett Access Scaffolding Website – Kiwi Web Design Case Study',
    description: 'How Kiwi Web Design built a new website for Barrett Access Scaffolding to attract Auckland homeowners and tradies, achieving +125% quote requests in 3 months.',
    client: 'Barrett Access Scaffolding',
    industry: 'Scaffolding & Access Solutions',
    heroImg: 'https://www.kiwiwebdesign.co.nz/wp-content/uploads/2025/08/30317.jpg',
    stats: [
      { num: '+125%', label: 'Increase in quote requests' },
      { num: '-34%', label: 'Reduction in bounce rate' },
      { num: '3.8x', label: 'More qualified leads' },
      { num: '8 weeks', label: 'Full project sprint' },
    ],
  },
];

// ─── Page template builder ───────────────────────────────────────────────────

function buildPage(cs, html) {
  const images = extractAllImages(html);
  const testimonial = extractBlockquote(html);
  const faqs = extractFAQs(html);

  // Extract section text
  const aboutText = extractParagraphsAfterH(html, 'About') ||
    extractParagraphsAfterH(html, 'Client') || '';
  const challengeText = extractParagraphsAfterH(html, 'Challenge') || '';
  const solutionText = extractParagraphsAfterH(html, 'Solution') ||
    extractParagraphsAfterH(html, 'Customisation') || '';
  const resultsText = extractParagraphsAfterH(html, 'Results') ||
    extractParagraphsAfterH(html, 'uplift') || '';

  // Gallery images (deduplicated wp-content images)
  const galleryImgs = images.slice(0, 4);

  const canonicalURL = `https://www.kiwiwebdesign.co.nz/${cs.slug}/`;

  // Build FAQ items JS
  const faqItems = faqs.length > 0
    ? faqs
    : [
        { q: 'How long does the project take?', a: 'Most projects are completed in 2–3 weeks from the discovery call to launch.' },
        { q: 'Do you offer ongoing support?', a: 'Yes — we offer affordable monthly maintenance plans to keep your site secure and up to date.' },
        { q: 'Can you redesign my existing website?', a: 'Absolutely. We frequently migrate Auckland businesses from Wix or Squarespace to WordPress.' },
      ];

  const statsJS = cs.stats.map(s => `  { num: ${JSON.stringify(s.num)}, label: ${JSON.stringify(s.label)} }`).join(',\n');
  const faqsJS = faqItems.map(f => `  { q: ${JSON.stringify(f.q)}, a: ${JSON.stringify(f.a)} }`).join(',\n');
  const galleryJS = galleryImgs.length
    ? galleryImgs.map(u => `  ${JSON.stringify(u)}`).join(',\n')
    : '';

  const schemaStr = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": canonicalURL,
        "url": canonicalURL,
        "name": cs.metaTitle,
        "description": cs.description,
        "inLanguage": "en-NZ",
        "isPartOf": { "@id": "https://www.kiwiwebdesign.co.nz/#website" },
        "breadcrumb": { "@id": `${canonicalURL}#breadcrumb` }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalURL}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.kiwiwebdesign.co.nz/" },
          { "@type": "ListItem", "position": 2, "name": "Case Studies", "item": "https://www.kiwiwebdesign.co.nz/blog/" },
          { "@type": "ListItem", "position": 3, "name": cs.client }
        ]
      },
      {
        "@type": "Organization",
        "@id": "https://www.kiwiwebdesign.co.nz/#organization",
        "name": "Kiwi Web Design",
        "url": "https://www.kiwiwebdesign.co.nz/"
      }
    ]
  });

  return `---
import Layout from '../layouts/Layout.astro';

const stats = [
${statsJS}
];

const faqs = [
${faqsJS}
];
${galleryJS ? `\nconst gallery = [\n${galleryJS}\n];` : '\nconst gallery: string[] = [];'}

const schema = ${schemaStr};
---

<Layout
  title=${JSON.stringify(cs.metaTitle)}
  description=${JSON.stringify(cs.description)}
  canonicalURL=${JSON.stringify(canonicalURL)}
  schema={schema}
>

  <!-- Hero -->
  <section class="cs-hero section-dark">
    <div class="container cs-hero-inner">
      <div class="cs-hero-text">
        <p class="cs-eyebrow">Case Study — ${cs.industry}</p>
        <h1>${cs.title.replace(/Case Study \d+:\s*|Case Study:\s*/i, '')}</h1>
        <p class="cs-hero-desc">${cs.description}</p>
        <div class="cs-hero-stats">
          {stats.map(({ num, label }) => (
            <div class="cs-stat">
              <span class="cs-stat-num">{num}</span>
              <span class="cs-stat-label">{label}</span>
            </div>
          ))}
        </div>
        <a href="/website-designer-auckland/" class="btn-primary">Get a Free Consultation</a>
      </div>
      <div class="cs-hero-image">
        <img
          src=${JSON.stringify(cs.heroImg)}
          alt=${JSON.stringify(`${cs.client} website by Kiwi Web Design Auckland`)}
          width="700"
          height="500"
          loading="eager"
        />
      </div>
    </div>
  </section>

  <!-- About + Challenge -->
  <section class="section">
    <div class="container cs-two-col">
      ${aboutText ? `<div class="cs-about">
        <h2>About the Client</h2>
        <p class="cs-client-tag">${cs.client} — ${cs.industry}</p>
        <p>${aboutText}</p>
      </div>` : `<div class="cs-about">
        <h2>About the Client</h2>
        <p class="cs-client-tag">${cs.client} — ${cs.industry}</p>
      </div>`}
      ${challengeText ? `<div class="cs-challenge">
        <h2>The Challenge</h2>
        <p>${challengeText}</p>
      </div>` : ''}
    </div>
  </section>

  <!-- Our Solution -->
  ${solutionText ? `<section class="section section-cream">
    <div class="container cs-narrow">
      <h2>Our Solution</h2>
      <p>${solutionText}</p>
    </div>
  </section>` : ''}

  <!-- Results stats -->
  <section class="section section-dark">
    <div class="container">
      <h2>Results</h2>
      ${resultsText ? `<p class="cs-results-intro">${resultsText}</p>` : ''}
      <div class="cs-stats-grid">
        {stats.map(({ num, label }) => (
          <div class="cs-result-card">
            <span class="cs-result-num">{num}</span>
            <span class="cs-result-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>

  <!-- Gallery -->
  {gallery.length > 0 && (
    <section class="section section-cream">
      <div class="container">
        <h2>Project Gallery</h2>
        <div class="cs-gallery">
          {gallery.map((src) => (
            <img
              src={src}
              alt=${JSON.stringify(`${cs.client} website screenshot`)}
              width="700"
              height="450"
              loading="lazy"
              class="cs-gallery-img"
            />
          ))}
        </div>
      </div>
    </section>
  )}

  <!-- Testimonial -->
  ${testimonial ? `<section class="section">
    <div class="container cs-narrow">
      <blockquote class="cs-quote">
        <p>${testimonial}</p>
        <cite>— ${cs.client}</cite>
      </blockquote>
    </div>
  </section>` : ''}

  <!-- FAQ -->
  {faqs.length > 0 && (
    <section class="section section-cream">
      <div class="container cs-narrow">
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
  )}

  <!-- CTA -->
  <section class="section section-dark text-center">
    <div class="container cs-narrow">
      <h2>Ready for your own success story?</h2>
      <p>Book a free consultation with Kiwi Web Design and let's talk about growing your Auckland business online.</p>
      <a href="/website-designer-auckland/" class="btn-primary">Book a Free Consultation</a>
    </div>
  </section>

</Layout>

<style>
  /* Hero */
  .cs-hero { padding: 5rem 0; }
  .cs-hero-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
  }
  .cs-eyebrow {
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--kwd-yellow);
    margin-bottom: 0.75rem;
  }
  .cs-hero h1 { color: var(--kwd-white); font-size: clamp(2rem, 4vw, 3.2rem); margin-bottom: 1rem; }
  .cs-hero-desc { color: rgba(255,255,255,0.75); margin-bottom: 2rem; font-size: 1.05rem; }
  .cs-hero-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  .cs-stat { display: flex; flex-direction: column; }
  .cs-stat-num { font-size: 1.6rem; font-weight: 800; color: var(--kwd-yellow); font-family: var(--kwd-font-heading); line-height: 1; }
  .cs-stat-label { font-size: 0.78rem; color: rgba(255,255,255,0.65); margin-top: 0.2rem; }
  .cs-hero-image img {
    width: 100%;
    height: 420px;
    object-fit: cover;
    border-radius: 10px;
    display: block;
  }

  /* Two-col layout */
  .cs-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }
  .cs-two-col h2 { font-size: clamp(1.4rem, 2.5vw, 1.9rem); margin-bottom: 0.75rem; }
  .cs-client-tag {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--kwd-brown);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 0.75rem;
  }

  /* Narrow container for content sections */
  .cs-narrow { max-width: 820px; }
  .cs-narrow h2 { margin-bottom: 1rem; }

  /* Results */
  .cs-results-intro { color: rgba(255,255,255,0.75); margin-bottom: 2.5rem; max-width: 700px; }
  .cs-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }
  .cs-result-card {
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.13);
    border-radius: 10px;
    padding: 1.75rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .cs-result-num { font-size: 2.2rem; font-weight: 800; color: var(--kwd-yellow); font-family: var(--kwd-font-heading); line-height: 1; }
  .cs-result-label { font-size: 0.875rem; color: rgba(255,255,255,0.7); }

  /* Gallery */
  .cs-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.25rem;
    margin-top: 2rem;
  }
  .cs-gallery-img {
    width: 100%;
    height: 260px;
    object-fit: cover;
    border-radius: 8px;
    display: block;
    border: 1px solid rgba(0,0,0,0.08);
  }

  /* Testimonial */
  .cs-quote {
    background: var(--kwd-cream);
    border-left: 5px solid var(--kwd-yellow);
    border-radius: 0 10px 10px 0;
    padding: 2rem 2.5rem;
    margin: 0;
  }
  .cs-quote p {
    font-size: 1.1rem;
    font-style: italic;
    line-height: 1.7;
    color: var(--kwd-dark);
    margin: 0 0 1rem;
  }
  .cs-quote cite { font-size: 0.875rem; font-weight: 600; color: var(--kwd-brown); font-style: normal; }

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
  .section-dark.text-center p { color: rgba(255,255,255,0.75); margin-bottom: 2rem; max-width: 560px; margin-inline: auto; }

  /* Responsive */
  @media (max-width: 900px) {
    .cs-hero-inner { grid-template-columns: 1fr; }
    .cs-hero-image { display: none; }
    .cs-two-col { grid-template-columns: 1fr; }
    .cs-stats-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 600px) {
    .cs-gallery { grid-template-columns: 1fr; }
    .cs-stats-grid { grid-template-columns: 1fr 1fr; }
  }
</style>
`;
}

// ─── Write all pages ─────────────────────────────────────────────────────────

const pagesDir = join(ROOT, 'src', 'pages');
mkdirSync(pagesDir, { recursive: true });

for (const cs of caseStudies) {
  const htmlPath = join(ROOT, cs.file);
  const html = readFileSync(htmlPath, 'utf8');
  const page = buildPage(cs, html);
  const outPath = join(pagesDir, `${cs.slug}.astro`);
  writeFileSync(outPath, page, 'utf8');
  console.log(`✓ src/pages/${cs.slug}.astro`);
}

console.log('\nDone — 10 case study pages written.');
