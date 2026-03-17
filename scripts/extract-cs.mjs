import { readFileSync } from 'fs';

const files = [
  'cs_custom-florist-website-design-auckland.html',
  'cs_kiwiland-construction-website.html',
  'cs_topline-services-cleaning-website.html',
  'cs_melanoma-specialists-website.html',
  'cs_inspector-guys-building-inspections-website.html',
  'cs_fl-legal-website.html',
  'cs_la-veranda-restaurant-website.html',
  'cs_dryice-blasting-services-website.html',
  'cs_beauty-touch-case-study.html',
  'cs_case-study-scaffolding.html',
];

for (const f of files) {
  const html = readFileSync(f, 'utf8');
  const slug = f.replace('cs_','').replace('.html','');

  // headings
  const heads = [...html.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)]
    .map(m => m[1].replace(/<[^>]*>/g,'').trim()).filter(Boolean).slice(0,12);

  // data-target stats (animated counters)
  const stats = [...html.matchAll(/data-target="([^"]+)"/g)].map(m => m[1]);

  // inline stat patterns like "+46%" or "125%"
  const inlineStats = [...new Set([...html.matchAll(/(\+?\d+[\.,]?\d*\s*[%x×k]|\$[\d,]+k?)/gi)].map(m=>m[1]))].slice(0,10);

  // wp-content images only
  const imgs = [...new Set([...html.matchAll(/https:\/\/www\.kiwiwebdesign\.co\.nz\/wp-content\/uploads\/[^\s"'<>)]+/gi)].map(m=>m[0]))].slice(0,8);

  // paragraphs with testimonial-like content
  const blockquotes = [...html.matchAll(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi)]
    .map(m => m[1].replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim()).slice(0,2);

  // kwd-quote or testimonial divs
  const quotes = [...html.matchAll(/class="[^"]*(?:quote|testimonial|review)[^"]*"[^>]*>([\s\S]*?)<\/div>/gi)]
    .map(m => m[1].replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().slice(0,200)).slice(0,2);

  console.log('=== ' + slug);
  console.log('H2/H3:', heads.join(' | '));
  console.log('data-target stats:', stats.join(', '));
  console.log('inline stats:', inlineStats.join(', '));
  console.log('images:', imgs.map(i => '  ' + i).join('\n'));
  console.log('blockquotes:', blockquotes.map(b => b.slice(0,150)).join('\n'));
  console.log('quote divs:', quotes.join('\n'));
  console.log('');
}
