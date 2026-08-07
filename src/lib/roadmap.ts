/** `optional` is a band rather than a difficulty: supplementary topics that sit
 *  after the required path, are unnumbered, and can be skipped entirely. */
export type Level = 'foundations' | 'intermediate' | 'advanced' | 'optional';

export const isOptional = (t: { level: Level }) => t.level === 'optional';

export interface RoadmapTopic {
  slug: string;
  name: string;
  level: Level;
  order: number;
}
export interface RoadmapGroup {
  level: Level;
  label: string;
  items: RoadmapTopic[];
}

/** Optional sorts last, so "after the required path" falls out of the ordering
 *  instead of needing a special case anywhere. */
const LEVEL_ORDER: Level[] = ['foundations', 'intermediate', 'advanced', 'optional'];
const LEVEL_LABEL: Record<Level, string> = {
  foundations: 'Foundations',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  optional: 'Optional',
};

/** The roadmap as one ordered sequence: by level, then by order. Optional
 *  topics land at the end because their level sorts last. */
export function flattenRoadmap(topics: RoadmapTopic[]): RoadmapTopic[] {
  return [...topics].sort(
    (a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level) || a.order - b.order,
  );
}

/** The next *required* topic after `slug`, or null when there isn't one.
 *  Returns null for anything in the optional band, since nothing required
 *  follows it — callers show a route back to the roadmap instead. */
export function nextTopic(topics: RoadmapTopic[], slug: string): RoadmapTopic | null {
  const flat = flattenRoadmap(topics);
  const i = flat.findIndex((t) => t.slug === slug);
  if (i < 0) return null;
  return flat.slice(i + 1).find((t) => !isOptional(t)) ?? null;
}

/** Sequence numbers for the required path. Optional topics are absent from the
 *  map, so the visible numbering reads 01, 02, 03 without gaps. */
export function roadmapNumbers(topics: RoadmapTopic[]): Map<string, number> {
  const numbers = new Map<string, number>();
  let n = 0;
  for (const t of flattenRoadmap(topics)) {
    if (!isOptional(t)) numbers.set(t.slug, ++n);
  }
  return numbers;
}

/** Sum "M:SS" / "H:MM:SS" duration strings into a human total ("3h 40m").
 *  Returns null when nothing parseable was supplied, so callers can omit the
 *  label rather than print "0m". */
export function totalDuration(durations: (string | undefined)[]): string | null {
  let seconds = 0;
  let counted = 0;
  for (const d of durations) {
    if (!d) continue;
    const parts = d.split(':').map((n) => Number(n));
    if (parts.some((n) => !Number.isFinite(n))) continue;
    seconds += parts.reduce((acc, n) => acc * 60 + n, 0);
    counted++;
  }
  if (!counted) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/** Display grouping for /learn. Optional needs no special case: it is a level
 *  like the others and sorts last. */
export function groupTopicsByLevel(topics: RoadmapTopic[]): RoadmapGroup[] {
  return LEVEL_ORDER.map((level) => ({
    level,
    label: LEVEL_LABEL[level],
    items: topics
      .filter((t) => t.level === level)
      .sort((a, b) => a.order - b.order),
  })).filter((g) => g.items.length > 0);
}
