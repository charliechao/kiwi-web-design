import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    lastModified: z.coerce.date().optional(),
    image: z.string().optional(),
    lang: z.string().optional(),
    articleSection: z.string().optional(),
    keywords: z.union([z.string(), z.array(z.string())]).optional(),
  }),
});

export const collections = { blog };
