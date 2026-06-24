import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    image: z.string().optional(),
    lastModified: z.coerce.date().optional(),
    articleSection: z.string().optional(),
    keywords: z.string().optional(),
    lang: z.string().optional(),
  }),
});

export const collections = { blog };
