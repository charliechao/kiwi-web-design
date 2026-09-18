import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { parse } from 'parse5';

const origin = 'https://www.kiwiwebdesign.co.nz';
const blogPrefix = '/affordable-web-design-auckland/';
const routes = [
  '/chatgpt-ads/',
  '/chatgpt-ads-readiness-check/',
  ...['chatgpt-ads-new-zealand-guide', 'chatgpt-ads-vs-google-search-ads-nz', 'chatgpt-ads-conversion-tracking-nz', 'chatgpt-ads-context-hints-nz-examples'].map((slug) => `${blogPrefix}${slug}/`),
];
const attr = (node, name) => node.attrs?.find((entry) => entry.name === name)?.value;
const text = (node) => node.nodeName === '#text' ? node.value : (node.childNodes || []).map(text).join('');
const flatten = (node) => [node, ...(node.childNodes || []).flatMap(flatten)];
const page = (route) => {
  const html = readFileSync(join('dist', route, 'index.html'), 'utf8');
  return { html, nodes: flatten(parse(html)) };
};

for (const route of routes) {
  test(`${route} has crawlable content, metadata, valid schema and local destinations`, () => {
    const { nodes } = page(route);
    assert.equal(nodes.filter((node) => node.tagName === 'h1').length, 1);
    const canonical = nodes.filter((node) => node.tagName === 'link' && attr(node, 'rel') === 'canonical');
    assert.equal(canonical.length, 1);
    assert.equal(attr(canonical[0], 'href'), origin + route);
    assert.ok(text(nodes.find((node) => node.tagName === 'title')).length > 20);
    assert.ok(nodes.some((node) => node.tagName === 'meta' && attr(node, 'name') === 'description' && attr(node, 'content')?.length > 40));
    assert.ok(!nodes.some((node) => node.tagName === 'meta' && attr(node, 'name') === 'robots' && /noindex/i.test(attr(node, 'content'))));
    const graphs = nodes.filter((node) => node.tagName === 'script' && attr(node, 'type') === 'application/ld+json')
      .flatMap((node) => { const schema = JSON.parse(text(node)); return schema['@graph'] || [schema]; });
    assert.ok(graphs.some((item) => item['@type'] === 'WebPage'));
    assert.ok(graphs.some((item) => item['@type'] === 'BreadcrumbList'));
    if (route.startsWith(blogPrefix)) {
      assert.ok(graphs.some((item) => item['@type'] === 'Article' && item.author?.name && item.dateModified));
      const article = nodes.find((node) => node.tagName === 'article');
      assert.ok(text(article).split(/\s+/).length > 550);
      assert.ok(!/(?:NZ\$|\$)\s*\d/.test(text(article)), 'No public monetary prices in the new article');
    }
    for (const node of nodes) {
      const href = node.tagName === 'a' ? attr(node, 'href') : node.tagName === 'img' ? attr(node, 'src') : null;
      if (!href?.startsWith('/') || href.startsWith('//')) continue;
      const pathname = decodeURIComponent(href.split(/[?#]/)[0]);
      const target = join('dist', pathname, pathname.endsWith('/') ? 'index.html' : '');
      assert.ok(existsSync(target), `${route}: missing destination ${href}`);
    }
  });
}

test('hub links to every supporting route and discovery files include all of them', () => {
  const hub = page('/chatgpt-ads/');
  const links = hub.nodes.filter((node) => node.tagName === 'a').map((node) => attr(node, 'href'));
  const sitemap = readFileSync('dist/sitemap-0.xml', 'utf8');
  const llms = readFileSync('public/llms.txt', 'utf8');
  const map = JSON.parse(readFileSync('src/data/site-map.json', 'utf8'));
  for (const route of routes) {
    if (route !== '/chatgpt-ads/') assert.ok(links.includes(route));
    assert.ok(sitemap.includes(origin + route));
    assert.ok(llms.includes(origin + route));
    assert.ok([...map.pages, ...map.blogPosts].some((entry) => entry.url === route));
  }
  assert.equal(map._meta.totalPages, map.pages.length);
  assert.equal(map._meta.totalBlogPosts, map.blogPosts.length);
});

test('readiness controls and recommendations are present without executing JavaScript', () => {
  const { nodes } = page('/chatgpt-ads-readiness-check/');
  const selects = nodes.filter((node) => node.tagName === 'select');
  assert.equal(selects.length, 6);
  assert.equal(new Set(selects.map((node) => attr(node, 'id'))).size, 6);
  for (const select of selects) {
    assert.ok(nodes.some((node) => node.tagName === 'label' && attr(node, 'for') === attr(select, 'id')));
    assert.equal(flatten(select).filter((node) => node.tagName === 'option').length, 3);
  }
  assert.equal(nodes.filter((node) => node.tagName === 'fieldset').length, 6);
  assert.ok(nodes.some((node) => node.tagName === 'noscript'));
  assert.ok(nodes.some((node) => attr(node, 'aria-live') === 'polite'));
  const ids = nodes.map((node) => attr(node, 'id')).filter(Boolean);
  assert.equal(new Set(ids).size, ids.length, 'IDs must not be duplicated');
});

test('service FAQ structured answers match visible answers', () => {
  const { nodes } = page('/chatgpt-ads/');
  const graph = nodes.filter((node) => node.tagName === 'script' && attr(node, 'type') === 'application/ld+json')
    .flatMap((node) => { const data = JSON.parse(text(node)); return data['@graph'] || []; });
  const faq = graph.find((item) => item['@type'] === 'FAQPage');
  const visible = nodes.filter((node) => node.tagName === 'details').map(text);
  assert.ok(faq.mainEntity.length > 0);
  for (const question of faq.mainEntity) assert.ok(visible.some((entry) => entry.includes(question.name) && entry.includes(question.acceptedAnswer.text)));
});

test('protected calculator source remains byte-for-byte unchanged', () => {
  const source = readFileSync('src/pages/affordable-web-design-auckland/website-cost-new-zealand-small-business.astro');
  assert.equal(createHash('sha256').update(source).digest('hex').toUpperCase(), 'C51D0E025C2F9DCEC5BBDCDF7EF0937BCD4E9EA50FA89D7B4AC4993C76E38973');
});

test('protected calculator output matches the pre-release build', () => {
  const html = readFileSync('dist/affordable-web-design-auckland/website-cost-new-zealand-small-business/index.html');
  assert.equal(createHash('sha256').update(html).digest('hex').toUpperCase(), '96B16A81B40453B32FC8117E757ABD3735F99D276FCA049B32BE1C32F4B2C2F3');
});
