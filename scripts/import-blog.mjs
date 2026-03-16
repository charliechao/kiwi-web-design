/**
 * import-blog.mjs
 * Fetches all posts from the WP REST API, converts HTML → Markdown,
 * and writes one .md file per post to src/content/blog/.
 * Run once: node scripts/import-blog.mjs
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'src', 'content', 'blog');

mkdirSync(OUT_DIR, { recursive: true });

// ─── HTML → Markdown conversion ────────────────────────────────────────────

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8216;/g, '\u2018')
    .replace(/&#8220;/g, '\u201C')
    .replace(/&#8221;/g, '\u201D')
    .replace(/&#8230;/g, '\u2026')
    .replace(/&#\d+;/g, '')
    .replace(/&[a-z]+;/g, '');
}

function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]*>/g, ''));
}

function htmlToMarkdown(html) {
  if (!html) return '';

  // 1. Remove style and script blocks entirely
  html = html.replace(/<style[\s\S]*?<\/style>/gi, '');
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '');

  // 2. Remove HTML comments
  html = html.replace(/<!--[\s\S]*?-->/g, '');

  // 3. Convert images
  html = html.replace(
    /<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*\/?>/gi,
    (_, src, alt) => `\n\n![${alt || ''}](${src})\n\n`
  );
  html = html.replace(/<img[^>]+src="([^"]+)"[^>]*\/?>/gi, (_, src) => `\n\n![](${src})\n\n`);

  // 4. Convert headings
  html = html.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, t) => `\n\n# ${stripTags(t).trim()}\n\n`);
  html = html.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `\n\n## ${stripTags(t).trim()}\n\n`);
  html = html.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `\n\n### ${stripTags(t).trim()}\n\n`);
  html = html.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, t) => `\n\n#### ${stripTags(t).trim()}\n\n`);
  html = html.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, (_, t) => `\n\n##### ${stripTags(t).trim()}\n\n`);

  // 5. Convert inline formatting (before stripping tags)
  html = html.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, (_, t) => `**${stripTags(t).trim()}**`);
  html = html.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, (_, t) => `**${stripTags(t).trim()}**`);
  html = html.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, (_, t) => `*${stripTags(t).trim()}*`);
  html = html.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, (_, t) => `*${stripTags(t).trim()}*`);

  // 6. Convert links
  html = html.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
    const t = stripTags(text).trim();
    if (!t) return '';
    // Only include links for non-Elementor URLs
    if (href.startsWith('#') || href.includes('elementor')) return t;
    return `[${t}](${href})`;
  });

  // 7. Convert list items
  html = html.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => `\n- ${stripTags(t).trim()}`);
  html = html.replace(/<\/[uo]l>/gi, '\n\n');

  // 8. Convert paragraphs
  html = html.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, t) => {
    const text = stripTags(t).trim();
    return text ? `\n\n${text}\n\n` : '';
  });

  // 9. Line breaks
  html = html.replace(/<br\s*\/?>/gi, '\n');

  // 10. Convert table cells as rough text
  html = html.replace(/<th[^>]*>([\s\S]*?)<\/th>/gi, (_, t) => `| ${stripTags(t).trim()} `);
  html = html.replace(/<td[^>]*>([\s\S]*?)<\/td>/gi, (_, t) => `| ${stripTags(t).trim()} `);
  html = html.replace(/<\/tr>/gi, '|\n');

  // 11. Strip remaining tags
  html = stripTags(html);

  // 12. Clean up whitespace
  html = html.replace(/\n{4,}/g, '\n\n\n');
  html = html.replace(/[ \t]+\n/g, '\n');
  html = html.replace(/\n[ \t]+/g, '\n');
  html = html.trim();

  return html;
}

// ─── Frontmatter escaping ───────────────────────────────────────────────────

function yamlStr(value) {
  if (!value) return '""';
  // If contains special chars, wrap in double quotes and escape internal quotes
  const needsQuotes = /[:#\[\]{}"',|>&*!?%@`\n]/.test(value);
  if (needsQuotes) {
    return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return value;
}

// ─── Safe filename from slug ────────────────────────────────────────────────

function safeSlug(slug) {
  // Decode URL-encoded slugs (e.g. Chinese characters)
  try {
    slug = decodeURIComponent(slug);
  } catch (e) { /* keep as-is */ }
  // Replace non-ASCII and unsafe filename chars with hyphen
  return slug
    .toLowerCase()
    .replace(/[^\w-]/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

// ─── Main fetch + write ─────────────────────────────────────────────────────

const BASE = 'https://www.kiwiwebdesign.co.nz/wp-json/wp/v2';

async function fetchAll() {
  let page = 1;
  const all = [];
  while (true) {
    const url = `${BASE}/posts?per_page=100&page=${page}&_embed=0&_fields=id,slug,title,date,content,excerpt,yoast_head_json`;
    const res = await fetch(url);
    if (!res.ok) break;
    const data = await res.json();
    if (!data.length) break;
    all.push(...data);
    if (data.length < 100) break;
    page++;
  }
  return all;
}

console.log('Fetching posts from WordPress REST API…');
const posts = await fetchAll();
console.log(`Found ${posts.length} posts`);

let written = 0;
let skipped = 0;

for (const post of posts) {
  const slug = safeSlug(post.slug);
  if (!slug) { skipped++; continue; }

  const yoast = post.yoast_head_json || {};
  const ogImages = yoast.og_image || [];
  const image = ogImages[0] ? ogImages[0].url : '';
  const rawDesc = yoast.og_description || yoast.description || stripTags(post.excerpt?.rendered || '');
  const description = rawDesc.replace(/\n/g, ' ').trim().slice(0, 200);
  const title = stripTags(post.title?.rendered || '').trim();
  const pubDate = post.date ? post.date.slice(0, 10) : '2025-01-01';

  const body = htmlToMarkdown(post.content?.rendered || '');

  const frontmatter = [
    '---',
    `title: ${yamlStr(title)}`,
    `description: ${yamlStr(description)}`,
    `pubDate: ${pubDate}`,
    image ? `image: ${yamlStr(image)}` : '',
    '---',
  ].filter(Boolean).join('\n');

  const md = `${frontmatter}\n\n${body}\n`;

  const filename = join(OUT_DIR, `${slug}.md`);
  writeFileSync(filename, md, 'utf8');
  written++;
  console.log(`  ✓ ${slug}.md`);
}

console.log(`\nDone. ${written} files written, ${skipped} skipped.`);
