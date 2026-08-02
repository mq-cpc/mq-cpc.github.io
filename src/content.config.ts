import { defineCollection, reference as refField, z } from 'astro:content';
import { glob } from 'astro/loaders';

// `optional` is a band, not a difficulty: supplementary topics that sit after
// the required path and can be skipped entirely.
const LEVEL = z.enum(['foundations', 'intermediate', 'advanced', 'optional']);
const CATEGORY = z.enum(['c1', 'c2', 'c3', 'c4', 'c5', 'c6']);
const DIFFICULTY = z.enum(['easy', 'medium', 'hard']);

const topics = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: 'src/content/topics' }),
  schema: z.object({
    name: z.string(),
    level: LEVEL,
    order: z.number().int().nonnegative(),
    blurb: z.string(),
    color: CATEGORY,
    videos: z
      .array(
        z.object({
          title: z.string(),
          youtubeId: z.string(),
          channel: z.string().optional(),
          duration: z.string().optional(),
        }),
      )
      .default([]),
  }),
});

const problems = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: 'src/content/problems' }),
  schema: z.object({
    topic: refField('topics'),
    title: z.string(),
    difficulty: DIFFICULTY,
    tags: z.array(z.string()).default([]),
    judge: z.string(),
    url: z.string().url(),
    order: z.number().int().nonnegative().default(0),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: 'src/content/events' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    location: z.string().optional(),
    type: z.enum(['contest', 'workshop', 'social', 'other']).default('other'),
    tag: z.string().optional(),
  }),
});

const reference = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: 'src/content/reference' }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    lang: z.string().default('cpp'),
    order: z.number().int().nonnegative().default(0),
  }),
});

const resources = defineCollection({
  loader: glob({ pattern: '**/[^_]*.json', base: './src/content/resources' }),
  schema: z.object({
    category: z.string(),
    order: z.number().int().nonnegative().default(0),
    links: z.array(
      z.object({ label: z.string(), url: z.string().url(), note: z.string().optional() }),
    ),
  }),
});

export const collections = { topics, problems, events, reference, resources };
