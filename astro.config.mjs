import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const sitemapExcludedPaths = new Set([
  // GSC URL Inspection cleanup, 2026-06-23: keep the submitted sitemap focused
  // on pages Google currently treats as valuable, canonical, and index-worthy.
  '/affordable-web-design-auckland/affordable-web-design-auckland-2025-why-small-business-needs-website/',
  '/affordable-web-design-auckland/auckland-web-design-ai-seo-shift/',
  '/affordable-web-design-auckland/best-seo-company-auckland-small-businesses/',
  '/affordable-web-design-auckland/choosing-a-website-platform-a-practical-guide-for-small-businesses-in-auckland/',
  '/affordable-web-design-auckland/seo-vs-google-ads-auckland-small-business/',
  '/affordable-web-design-auckland/why-auckland-business-not-ranking-google/',
  '/custom-florist-website-design-auckland/',
  '/malware-cleanup-for-auckland-small-business-websites/',
  '/meta-ads/',
  '/paid-ads/',
  '/press-release-and-news/',
  '/thank-you/',
  '/website-branding/',
  '/zh/meta-ads/',
  '/zh/paid-ads/',
  // Google Ads landing pages — noindex, paid traffic only.
  '/web-design-auckland-lp/',
  '/web-design-auckland-lp/thank-you/',
  // Defensive exclusions for utility/API routes if they are ever prerendered.
  '/404/',
  '/api/contact/',
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
