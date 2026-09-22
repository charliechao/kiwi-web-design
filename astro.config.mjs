import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const sitemapExcludedPaths = new Set([
  // GSC URL Inspection cleanup, 2026-06-23: keep the submitted sitemap focused
  // on pages Google currently treats as valuable, canonical, and index-worthy.
  //
  // /paid-ads/ was removed from this list on 2026-09-22. It is the Ads pillar
  // hub, indexable, linked sitewide from the nav, and already earning 453
  // impressions over 90 days (pos 1.0 for "meta ads management", 8.1 for
  // "google ads auckland"). Linking it from every page while withholding it
  // from the sitemap was contradictory.
  //
  // 2026-09-22, same pass: /website-branding/ (1,016 words),
  // /affordable-web-design-auckland/why-auckland-business-not-ranking-google/
  // (2,044 words) and /press-release-and-news/ (718 words) also removed. The
  // first two are linked from the web design and SEO hubs, so withholding them
  // from the sitemap worked against their own hubs. None is thin content.
  //
  // Genuinely thin, indexable, intentionally withheld:
  '/thank-you/',
  '/zh/paid-ads/',
  // noindex pages — the sitemap must agree with the robots meta tag.
  '/meta-ads/',
  '/zh/meta-ads/',
  // Google Ads landing pages — noindex, paid traffic only.
  '/web-design-auckland-lp/',
  '/web-design-auckland-lp/thank-you/',
  '/small-business-website-lp/',
  // Defensive exclusion for the utility page if it is ever prerendered.
  '/404/',
]);

const normalizeSitemapPath = (page) => {
  const pathname = new URL(page).pathname;
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
};

export default defineConfig({
  output: 'static',
  site: 'https://www.kiwiwebdesign.co.nz',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  adapter: cloudflare({
    imageService: 'compile', // use Sharp at build time for prerendered pages
  }),
  integrations: [
    sitemap({
      filter: (page) => !sitemapExcludedPaths.has(normalizeSitemapPath(page)),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  // image: Sharp is the default service for static output; no config needed.
  // To disable optimisation: service: { entrypoint: 'astro/assets/services/noop' }
});
