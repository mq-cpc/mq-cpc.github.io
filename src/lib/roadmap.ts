export type Level = 'foundations' | 'intermediate' | 'advanced';
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

const LEVEL_ORDER: Level[] = ['foundations', 'intermediate', 'advanced'];
const LEVEL_LABEL: Record<Level, string> = {
  foundations: 'Foundations',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export function groupTopicsByLevel(topics: RoadmapTopic[]): RoadmapGroup[] {
  return LEVEL_ORDER.map((level) => ({
    level,
    label: LEVEL_LABEL[level],
    items: topics
      .filter((t) => t.level === level)
      .sort((a, b) => a.order - b.order),
  })).filter((g) => g.items.length > 0);
}
