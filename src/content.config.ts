import { defineCollection, reference as refField, z } from 'astro:content';
import { glob } from 'astro/loaders';

// `optional` is a band, not a difficulty: supplementary topics that sit after
// the required path and can be skipped entirely.
const LEVEL = z.enum(['foundations', 'intermediate', 'advanced', 'optional']);
const CATEGORY = z.enum(['c1', 'c2', 'c3', 'c4', 'c5', 'c6']);
const DIFFICULTY = z.enum(['easy', 'medium', 'hard']);

// Shared by topics and problems. A video usually teaches one problem, so it
// lives on that problem; topics keep the ones that teach a concept with no
// problem attached.
const VIDEO = z.object({
  title: z.string(),
  youtubeId: z.string(),
  channel: z.string().optional(),
  duration: z.string().optional(),
});

const topics = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: 'src/content/topics' }),
  schema: z.object({
    name: z.string(),
    level: LEVEL,
    order: z.number().int().nonnegative(),
    blurb: z.string(),
    color: CATEGORY,
    // Concept videos only: anything that walks through a specific problem
    // belongs on that problem instead.
    videos: z.array(VIDEO).default([]),
  }),
});

const problems = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: 'src/content/problems' }),
  schema: z.object({
    topic: refField('topics'),
    title: z.string(),
    difficulty: DIFFICULTY,
    tags: z.array(z.string()).default([]),
    // Free-form on purpose: Kattis, CodingBat, HackerRank, LeetCode, …
    judge: z.string(),
    url: z.string().url(),
    // The identifier at that judge — what you type into kattis-cli, or the
    // method name CodingBat asks you to implement. Optional because Kattis
    // puts it in the URL; set it whenever the URL does not carry it, as
    // CodingBat's /prob/p145416 does not.
    problemId: z.string().optional(),
    order: z.number().int().nonnegative().default(0),
    // Usually one walkthrough; Walrus Weights has two (top-down and bottom-up),
    // which is why this is an array.
    videos: z.array(VIDEO).default([]),
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

// A page of the team reference notebook. Categories are their own collection so
// each can carry a blurb and an identity colour, and so a typo in a snippet's
// category fails the build instead of silently creating an orphan page.
const refcategories = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: 'src/content/refcategories' }),
  schema: z.object({
    name: z.string(),
    blurb: z.string(),
    order: z.number().int().nonnegative().default(0),
    color: CATEGORY,
  }),
});

const reference = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: 'src/content/reference' }),
  schema: z.object({
    title: z.string(),
    category: refField('refcategories'),
    // Java by default: writing the reference in Java is the thing that makes
    // this notebook ours rather than a copy of every other team's.
    lang: z.string().default('java'),
    order: z.number().int().nonnegative().default(0),
    blurb: z.string().optional(),
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

export const collections = { topics, problems, events, refcategories, reference, resources };
