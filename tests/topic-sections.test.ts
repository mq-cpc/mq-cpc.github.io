import { describe, it, expect } from 'vitest';
import {
  DEFAULT_SECTIONS,
  sectionsFor,
  assignSection,
  groupProblems,
  type ProblemLike,
  type TopicSection,
} from '../src/lib/topic-sections';

const declared: TopicSection[] = [
  { id: 'tutorials', title: 'Video Tutorials', intro: 'Watch, then solve.' },
  { id: 'extra', title: 'Additional Problems' },
];

const problem = (id: string, over: Partial<ProblemLike> = {}): ProblemLike => ({
  id,
  hasVideo: false,
  ...over,
});

describe('sectionsFor', () => {
  it('falls back to the default split when a topic declares nothing', () => {
    expect(sectionsFor()).toEqual([...DEFAULT_SECTIONS]);
    expect(sectionsFor([])).toEqual([...DEFAULT_SECTIONS]);
  });

  it('keeps what the topic declares, in order', () => {
    expect(sectionsFor(declared)).toEqual(declared);
  });

  it('does not hand back the shared default objects', () => {
    // A caller mutating its sections must not poison every other topic.
    sectionsFor()[0].title = 'Mutated';
    expect(DEFAULT_SECTIONS[0].title).toBe('Video Tutorials');
  });

  it('rejects duplicate ids', () => {
    expect(() =>
      sectionsFor([
        { id: 'a', title: 'One' },
        { id: 'a', title: 'Two' },
      ]),
    ).toThrow(/Duplicate section id "a"/);
  });
});

describe('assignSection', () => {
  it('sends a problem with a video to the first section', () => {
    expect(assignSection(declared, problem('filip', { hasVideo: true }), 'java-basics')).toBe('tutorials');
  });

  it('sends a problem without a video to the last section', () => {
    expect(assignSection(declared, problem('filip'), 'java-basics')).toBe('extra');
  });

  it('lets an explicit section beat the video rule', () => {
    expect(assignSection(declared, problem('filip', { hasVideo: true, section: 'extra' }), 'java-basics')).toBe('extra');
    expect(assignSection(declared, problem('sort', { section: 'tutorials' }), 'java-basics')).toBe('tutorials');
  });

  it('puts everything in the one section when a topic declares only one', () => {
    const only: TopicSection[] = [{ id: 'all', title: 'Problems' }];
    expect(assignSection(only, problem('a', { hasVideo: true }), 't')).toBe('all');
    expect(assignSection(only, problem('b'), 't')).toBe('all');
  });

  it('throws on a section the topic does not declare, naming the valid ids', () => {
    expect(() => assignSection(declared, problem('filip', { section: 'nope' }), 'java-basics')).toThrow(
      /"filip".*"nope".*"java-basics".*tutorials, extra/,
    );
  });

  it('throws rather than reading off the end of an empty section list', () => {
    expect(() => assignSection([], problem('filip'), 'java-basics')).toThrow(/no sections/);
  });
});

describe('groupProblems', () => {
  const problems = [
    problem('withvideo', { hasVideo: true }),
    problem('cold'),
    problem('forced', { hasVideo: true, section: 'extra' }),
  ];

  it('buckets problems and preserves the order given', () => {
    const groups = groupProblems(declared, problems, 'java-basics');
    expect(groups.map((g) => g.section.id)).toEqual(['tutorials', 'extra']);
    expect(groups[0].items.map((p) => p.id)).toEqual(['withvideo']);
    expect(groups[1].items.map((p) => p.id)).toEqual(['cold', 'forced']);
  });

  it('drops empty sections', () => {
    // Today's content: every problem has a walkthrough, so "Additional
    // Problems" must not render as a bare heading.
    const groups = groupProblems(declared, [problem('a', { hasVideo: true })], 'java-basics');
    expect(groups.map((g) => g.section.id)).toEqual(['tutorials']);
  });

  it('returns nothing for a topic with no problems', () => {
    expect(groupProblems(declared, [], 'java-basics')).toEqual([]);
  });

  it('carries the section through so the page can render its title and intro', () => {
    const [first] = groupProblems(declared, problems, 'java-basics');
    expect(first.section.title).toBe('Video Tutorials');
    expect(first.section.intro).toBe('Watch, then solve.');
  });
});
