/**
 * Download all WordPress media to src/assets/, organised by category.
 * Also creates src/assets/url-mapping.json mapping every WP URL → local path.
 *
 * Categories:
 *   brand/        – logo, favicon, icon variants
 *   case-studies/ – images used on case study pages
 *   blog/         – blog post featured images
 *   services/     – service page hero / feature images
 *   general/      – everything else
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// ── Known blog-post image filenames (from src/content/blog/*.md frontmatter) ──
const BLOG_FILENAMES = new Set([
  'pexels-photo-1714341-1714341-scaled.jpg',
  'Auckland.jpg',
  'ujfa-790x550-1.webp',
  'Blue-and-White-minimalist-Instagram-Post.png',
  '5-Reasons-Every-Small-Business-in-Auckland-Should-Have-a-Website-in-2025.jpg',
  'Instagram-Post-Kiwi-Web-Design.png',
  'Facebook-Post-Your-competitors-have-a-website.jpg',
  'ChatGPT-Image-Aug-8-2025-09_44_05-AM-1.png',
  'pexels-photo-6153354-6153354-scaled.jpg',
  'website-pricing-2026-ai-web-design.png',
  'ChatGPT-Image-Jun-24-2025-11_54_50-AM-1.png',
  'SEO.jpg',
  'ChatGPT-Image-Jun-30-2025-03_02_03-PM-1.png',
  'best-seo-company-auckland-small-businesses.png',
  'choosing-website-platform-auckland-featured.jpg',
  'ChatGPT-Image-Jul-2-2025-12_14_23-PM-1.png',
  'pexels-photo-1267348-1267348-scaled-1.jpg',
  'pexels-photo-4348404-4348404-scaled.jpg',
  'website-helps-small-businesses-auckland.jpg',
  'FB-Post.jpg',
  'pexels-photo-6155000-6155000-scaled.jpg',
  'pexels-photo-375889-375889-scaled.jpg',
  'professional-website-design-on-a-budget-kiwi-web-design-auckland.jpg',
  'how-to-turn-your-website-into-a-24-7-salesperson-kiwi-web-design.jpg',
  'Facebook-Post-Support-Local-Auckland-Business.jpg',
  'nz-business-website-statistics-2025-internetnz-report.png',
  'seo-for-trades-auckland-job-enquiry.png',
  'auckland-small-business-website.jpg',
  'ChatGPT-Image-Oct-3-2025-03_06_40-PM.png',
  'ChatGPT-Image-Aug-19-2025-11_59_18-AM.png',
  '600-21B675F7-8EB5-45A5-99242870729DC26D.png',
  'ai-seo-auckland-small-business-owner.png',
  'ChatGPT-Image-Jul-10-2025-10_12_32-AM.png',
  'website-redesign-vs-starting-from-scratch-kiwi-web-design.jpg',
  'website-redesign-vs-rebuild-auckland-small-business.png',
  'ChatGPT-Image-Jul-25-2025-03_34_18-PM-1.png',
]);

// ── Keyword lists for categorisation ─────────────────────────────────────────

const BRAND_PATTERNS = [
  'android-chrome', 'apple-touch-icon', 'favicon', 'mstile', '-logo',
  'logo-', 'site-icon', 'browserconfig', 'safari-pinned-tab',
];

const CASE_STUDY_PATTERNS = [
  'beauty-touch', 'beautytouch', 'scaffolding', 'barrett',
  'topline-services', 'topline', 'melanoma', 'inspector-guys', 'inspector_guys',
  'fl-legal', 'fllegal', 'la-veranda', 'laveranda', 'dryice', 'dry-ice',
  'kiwiland', 'florist', 'auckland-florist', 'legal-website-auckland',
  'pexels-cottonbro',                    // used on 7-best-agencies page but also as CS hero
];

const SERVICE_PATTERNS = [
  'wordpress-website', 'wordpress-seo', 'wordpress-maintenance', 'wordpress-ai',
  'wordpress-website-rebuilds', 'wordpress-plugins', 'wordpress-theme',
  'shopify-website', 'woocommerce-website',
  'website-hosting', 'website-security', 'website-backup', 'website-branding',
  'website-copywriting', 'website-training', 'website-design-process',
  'domain-management', 'email-setup', 'email-hosting',
  'malware-cleanup', 'analytics-reporting',
  'ai-content-setup', 'ai-integration', 'ai-seo',
  'google-business-profile', 'google-business',
  'landing-pages-wordpress', 'membership-website', 'booking-appointment',
  'ecommerce-website', 'small-business-web-design', 'tradie-website',
  'web-design-process', 'our-process-web', 'local-seo', 'seo-for-ecommerce',
  'work-with-us', 'press-and-news', 'kiwi-web-design-press',
  'kiwi-web-design-testimonials', 'testimonials',
  'Website-Hosting', 'WordPress-SEO', 'AI-Integration',
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function categorise(item) {
  const url = item.source_url || '';
  const fname = path.basename(url).toLowerCase();
  const slug = (item.slug || '').toLowerCase();
  const alt = (item.alt_text || '').toLowerCase();

  // Brand: logo / favicon / icon variants
  if (BRAND_PATTERNS.some(p => fname.includes(p.toLowerCase()))) return 'brand';
  if (/^(icon|apple|android|favicon|mstile|browserconfig|safari)/.test(fname)) return 'brand';
  // WP generates icon-NxN files
  if (/^icon-\d+x\d+\.(png|jpg|ico)$/.test(fname)) return 'brand';

  // Blog: filename matches known blog featured image
  // Try both exact filename and case-insensitive
  const fnameLower = fname;
  for (const bf of BLOG_FILENAMES) {
    if (bf.toLowerCase() === fnameLower) return 'blog';
  }

  // Case studies
  if (CASE_STUDY_PATTERNS.some(p => fname.includes(p.toLowerCase())
    || slug.includes(p.toLowerCase())
    || alt.includes(p.toLowerCase()))) return 'case-studies';

  // Services
  if (SERVICE_PATTERNS.some(p => fname.includes(p.toLowerCase())
    || slug.includes(p.toLowerCase()))) return 'services';

  return 'general';
}

// Strip WP size suffix: image-640x480.jpg → image.jpg (for lookup)
function stripSizeSuffix(fname) {
  return fname.replace(/-\d+x\d+(\.[a-z0-9]+)$/i, '$1');
}

// ── WP REST API fetch ─────────────────────────────────────────────────────────

const API_BASE = 'https://www.kiwiwebdesign.co.nz/wp-json/wp/v2';
const FIELDS = 'id,slug,title,alt_text,source_url,media_type,mime_type,media_details';

async function fetchAllMedia() {
  const all = [];
  let page = 1;
  while (true) {
    const url = `${API_BASE}/media?per_page=100&page=${page}&_fields=${FIELDS}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'KWD-MediaDownloader/1.0' } });
    if (!res.ok) break;
    const items = await res.json();
    if (!items.length) break;
    all.push(...items);
    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1');
    if (page >= totalPages) break;
    page++;
  }
  return all;
}

// ── Download ──────────────────────────────────────────────────────────────────

async function downloadFile(srcUrl, destPath, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(srcUrl, {
        headers: { 'User-Agent': 'KWD-MediaDownloader/1.0' },
        signal: AbortSignal.timeout(30000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(destPath, buf);
      return true;
    } catch (e) {
      if (attempt === retries) throw e;
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // Create category directories
  const DIRS = ['brand', 'case-studies', 'blog', 'services', 'general'];
  for (const d of DIRS) {
    fs.mkdirSync(path.join(ROOT, 'src/assets', d), { recursive: true });
  }

  console.log('Fetching media list from WP REST API…');
  const allMedia = await fetchAllMedia();
  const images = allMedia.filter(m => m.media_type === 'image' && m.source_url);
  console.log(`Total media: ${allMedia.length}  |  Images: ${images.length}\n`);

  const mapping = {};           // WP URL → local relative path
  const usedFilenames = {};     // category → Set of filenames (collision detection)
  for (const d of DIRS) usedFilenames[d] = new Set();

  const stats = { brand: 0, 'case-studies': 0, blog: 0, services: 0, general: 0, skipped: 0, failed: 0 };

  // Process in batches of 6
  const BATCH = 6;
  for (let i = 0; i < images.length; i += BATCH) {
    const batch = images.slice(i, i + BATCH);
    await Promise.allSettled(batch.map(async (item) => {
      const category = categorise(item);
      const origUrl = item.source_url;
      let fname = path.basename(origUrl.split('?')[0]);  // strip query strings

      // Skip non-image extensions (svg, gif, webp are fine; skip pdf etc.)
      const ext = path.extname(fname).toLowerCase();
      if (['.pdf', '.zip', '.doc', '.docx', '.mp4', '.mov'].includes(ext)) {
        stats.skipped++;
        return;
      }

      // Collision detection: add -ID suffix if filename already used in this category
      if (usedFilenames[category].has(fname.toLowerCase())) {
        fname = `${path.basename(fname, ext)}-${item.id}${ext}`;
      }
      usedFilenames[category].add(fname.toLowerCase());

      const destPath = path.join(ROOT, 'src/assets', category, fname);
      const localPath = `src/assets/${category}/${fname}`;

      try {
        await downloadFile(origUrl, destPath);

        // Add mapping for the original URL
        mapping[origUrl] = localPath;

        // Also add mappings for all WP-generated size variants in media_details.sizes
        const sizes = item.media_details?.sizes || {};
        for (const sizeData of Object.values(sizes)) {
          if (sizeData.source_url && sizeData.source_url !== origUrl) {
            mapping[sizeData.source_url] = localPath;
          }
        }

        stats[category]++;
        process.stdout.write(`  ✓ [${category.padEnd(12)}] ${fname}\n`);
      } catch (e) {
        stats.failed++;
        process.stdout.write(`  ✗ FAILED: ${fname}, ${e.message}\n`);
        mapping[origUrl] = null;  // note failure
      }
    }));
  }

  // ── Write mapping file ────────────────────────────────────────────────────
  const mappingPath = path.join(ROOT, 'src/assets/url-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), 'utf8');

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n── Download complete ──────────────────────────────────');
  console.log(`  brand:         ${stats['brand']}`);
  console.log(`  case-studies:  ${stats['case-studies']}`);
  console.log(`  blog:          ${stats['blog']}`);
  console.log(`  services:      ${stats['services']}`);
  console.log(`  general:       ${stats['general']}`);
  console.log(`  skipped:       ${stats['skipped']}`);
  console.log(`  failed:        ${stats['failed']}`);
  console.log(`  mapping URLs:  ${Object.keys(mapping).length}`);
  console.log(`\nMapping saved → src/assets/url-mapping.json`);
}

main().catch(console.error);
