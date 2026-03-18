import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// TODO: Replace https://example.com with your real deployed domain.
// @astrojs/sitemap requires this — without it no sitemap files are generated.

export default defineConfig({
  output: 'static',
  site: 'https://www.kiwiwebdesign.co.nz',
  trailingSlash: 'always',
  adapter: cloudflare({
    imageService: 'compile', // use Sharp at build time for prerendered pages
  }),
  integrations: [
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  // image: Sharp is the default service for static output; no config needed.
  // To disable optimisation: service: { entrypoint: 'astro/assets/services/noop' }
});
