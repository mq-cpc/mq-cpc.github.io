import { describe, it, expect } from 'vitest';
import {
  groupTopicsByLevel,
  flattenRoadmap,
  nextTopic,
  roadmapNumbers,
  totalDuration,
  type RoadmapTopic,
} from '../src/lib/roadmap';

// Mirrors the real shape: `optional` is a fourth level that sorts after the
// required path, not a flag on a topic that also has a difficulty.
const withOptional: RoadmapTopic[] = [
  { slug: 'start', name: 'Getting Started', level: 'foundations', order: 0 },
  { slug: 'java', name: 'Java Basics', level: 'foundations', order: 1 },
  { slug: 'cpp', name: 'C++ Basics', level: 'optional', order: 1 },
  { slug: 'rec', name: 'Recursion', level: 'intermediate', order: 1 },
];

const topics: RoadmapTopic[] = [
  { slug: 'dp', name: 'DP', level: 'advanced', order: 2 },
  { slug: 'basics', name: 'Basics', level: 'foundations', order: 1 },
  { slug: 'greedy', name: 'Greedy', level: 'intermediate', order: 2 },
  { slug: 'twoptr', name: 'Two Pointers', level: 'intermediate', order: 1 },
];

describe('groupTopicsByLevel', () => {
  it('orders groups foundations -> intermediate -> advanced', () => {
    const groups = groupTopicsByLevel(topics);
    expect(groups.map((g) => g.level)).toEqual(['foundations', 'intermediate', 'advanced']);
  });

  it('sorts items within a group by order', () => {
    const groups = groupTopicsByLevel(topics);
    const inter = groups.find((g) => g.level === 'intermediate')!;
    expect(inter.items.map((t) => t.slug)).toEqual(['twoptr', 'greedy']);
  });

  it('omits levels with no topics', () => {
    const groups = groupTopicsByLevel([{ slug: 'x', name: 'X', level: 'foundations', order: 1 }]);
    expect(groups.map((g) => g.level)).toEqual(['foundations']);
  });

  it('puts the optional band last, after every required level', () => {
    const groups = groupTopicsByLevel(withOptional);
    expect(groups.map((g) => g.level)).toEqual(['foundations', 'intermediate', 'optional']);
    expect(groups.at(-1)!.items.map((t) => t.slug)).toEqual(['cpp']);
  });

  it('adds no optional group when nothing is optional', () => {
    expect(groupTopicsByLevel(topics).some((g) => g.level === 'optional')).toBe(false);
  });
});

describe('flattenRoadmap', () => {
  it('returns one sequence across levels, in curriculum order', () => {
    expect(flattenRoadmap(topics).map((t) => t.slug)).toEqual(['basics', 'twoptr', 'greedy', 'dp']);
  });

  it('sorts the optional band after every required level', () => {
    expect(flattenRoadmap(withOptional).map((t) => t.slug)).toEqual(['start', 'java', 'rec', 'cpp']);
  });
});

describe('nextTopic', () => {
  it('follows roadmap order within a level', () => {
    expect(nextTopic(topics, 'twoptr')?.slug).toBe('greedy');
  });

  it('crosses a level boundary', () => {
    expect(nextTopic(topics, 'basics')?.slug).toBe('twoptr');
    expect(nextTopic(topics, 'greedy')?.slug).toBe('dp');
  });

  it('returns null at the end of the roadmap', () => {
    expect(nextTopic(topics, 'dp')).toBeNull();
  });

  it('returns null for a slug that is not on the roadmap', () => {
    expect(nextTopic(topics, 'nope')).toBeNull();
  });

  it('never points at an optional topic', () => {
    expect(nextTopic(withOptional, 'java')?.slug).toBe('rec');
    expect(nextTopic(withOptional, 'rec')).toBeNull();
  });

  it('returns null from inside the optional band', () => {
    // Nothing required follows it; the page shows a route back to /learn.
    expect(nextTopic(withOptional, 'cpp')).toBeNull();
  });
});

describe('roadmapNumbers', () => {
  it('numbers only required topics, with no gaps', () => {
    const n = roadmapNumbers(withOptional);
    expect(n.get('start')).toBe(1);
    expect(n.get('java')).toBe(2);
    expect(n.get('rec')).toBe(3);
  });

  it('omits optional topics entirely', () => {
    expect(roadmapNumbers(withOptional).has('cpp')).toBe(false);
  });
});

describe('totalDuration', () => {
  it('sums M:SS values, rounding to the nearest minute', () => {
    // 9:13 + 16:36 = 25:49
    expect(totalDuration(['9:13', '16:36'])).toBe('26m');
  });

  it('rolls over into hours', () => {
    expect(totalDuration(['47:36', '30:23', '19:41'])).toBe('1h 38m');
  });

  it('handles H:MM:SS', () => {
    expect(totalDuration(['1:00:00', '30:00'])).toBe('1h 30m');
  });

  it('skips missing and unparseable entries', () => {
    expect(totalDuration([undefined, 'soon', '10:00'])).toBe('10m');
  });

  it('returns null when nothing is parseable, so callers can omit the label', () => {
    expect(totalDuration([])).toBeNull();
    expect(totalDuration([undefined, 'tbc'])).toBeNull();
  });
});
