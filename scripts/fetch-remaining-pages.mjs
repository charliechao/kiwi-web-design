/**
 * Fetch all remaining page HTML from WP REST API and save to page_*.html files.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const SLUGS = [
  'privacy-policy',
  'thank-you',
  'shopify-website-design-auckland',
  'wordpress-website-design-auckland',
  'woocommerce-website-design-auckland',
  'wordpress-seo-optimisation',
  'wordpress-ai-tools-integration-auckland',
  'booking-appointment-websites-with-wordpress',
  'membership-subscription-websites-with-wordpress-auckland',
  'landing-pages-funnels-on-wordpress',
  'wordpress-website-rebuilds-auckland',
  'wordpress-maintenance-auckland',
  'website-hosting-auckland',
  'website-copywriting-auckland',
  'website-branding',
  'domain-management-auckland',
  'email-setup-business-email-hosting',
  'website-training-and-handover',
  'website-security-for-auckland-small-businesses',
  'malware-cleanup-for-auckland-small-business-websites',
  'website-backup-and-restoration-for-auckland-small-businesses',
  'analytics-reporting-for-auckland-small-business-websites',
  'ai-content-setup-for-websites',
  'wordpress-plugins-for-small-businesses-in-auckland',
  'wordpress-themes-for-auckland-small-businesses',
  'small-business-web-design-auckland',
  'tradie-website-design-auckland',
  'ecommerce-website-auckland',
  'industries-we-serve-in-auckland',
  'how-kiwi-web-design-helps-auckand-lawyers',
  'how-kiwi-web-design-helps-auckland-healthcare',
  'how-kiwi-web-design-helps-auckland-restaurants',
  'how-kiwi-web-design-helps-auckland-beauty-industry',
  'local-seo-for-auckland-small-businesses',
  'seo-for-ecommerce',
  'ai-seo-for-auckland-small-businesses',
  'google-business-profile-guide-for-auckland-businesses',
  'our-process',
  'work-with-us',
  'website-design-process-in-auckland',
  'solutions-auckland-kiwi-web-design',
  'testimonials-reviews',
  'monthly-subscription',
  'press-release-and-news',
  'faq',
  '7-best-web-design-agencies-in-auckland-2026',
];

const API = 'https://www.kiwiwebdesign.co.nz/wp-json/wp/v2/pages';
const FIELDS = 'slug,title,yoast_head_json,content';

async function fetchPage(slug) {
  const url = `${API}?slug=${slug}&_fields=${FIELDS}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${slug}`);
  const json = await res.json();
  if (!json.length) return null;
  return json[0];
}

async function main() {
  // Process in batches of 6 to avoid hammering the server
  const batchSize = 6;
  const results = {};

  for (let i = 0; i < SLUGS.length; i += batchSize) {
    const batch = SLUGS.slice(i, i + batchSize);
    const settled = await Promise.allSettled(batch.map(fetchPage));
    settled.forEach((r, idx) => {
      const slug = batch[idx];
      if (r.status === 'fulfilled' && r.value) {
        results[slug] = r.value;
      } else {
        const err = r.status === 'rejected' ? r.reason.message : 'not found';
        console.warn(`  ✗ ${slug}: ${err}`);
        results[slug] = null;
      }
    });
    process.stdout.write(`Fetched batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(SLUGS.length / batchSize)}\n`);
  }

  // Write HTML files and a summary JSON
  const summary = {};
  for (const [slug, data] of Object.entries(results)) {
    if (!data) { summary[slug] = { found: false }; continue; }
    const html = data.content?.rendered || '';
    const outFile = path.join(ROOT, `page_${slug}.html`);
    fs.writeFileSync(outFile, html, 'utf8');
    summary[slug] = {
      found: true,
      title: data.title?.rendered || slug,
      description: data.yoast_head_json?.og_description || data.yoast_head_json?.description || '',
      image: data.yoast_head_json?.og_image?.[0]?.url || '',
      size: html.length,
    };
    console.log(`  ✓ ${slug} (${html.length} chars)`);
  }

  fs.writeFileSync(path.join(ROOT, 'page_summary.json'), JSON.stringify(summary, null, 2), 'utf8');
  console.log('\nDone. Summary written to page_summary.json');
}

main().catch(console.error);
