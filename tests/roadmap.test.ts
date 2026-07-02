import { describe, it, expect } from 'vitest';
import { groupTopicsByLevel, type RoadmapTopic } from '../src/lib/roadmap';

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
});
