// How a topic's problems are split into the sections a topic page renders.
//
// A topic declares its sections in front-matter; a problem may name one with
// `section:`. Most never do, so the fallback carries the weight: a problem with
// a walkthrough belongs under the first section (the video one), and one
// without belongs under the last (the "go solve it yourself" one).

export interface TopicSection {
  id: string;
  title: string;
  /** Markdown. Rendered by the page, not here. */
  intro?: string;
}

/** What grouping needs from a problem — deliberately not a CollectionEntry. */
export interface ProblemLike {
  /** The content id, used only to name the file in build errors. */
  id: string;
  section?: string;
  hasVideo: boolean;
}

export interface SectionGroup<T> {
  section: TopicSection;
  items: T[];
}

// The split a topic gets for free. Every topic currently relies on it.
export const DEFAULT_SECTIONS: readonly TopicSection[] = [
  { id: 'tutorials', title: 'Video Tutorials' },
  { id: 'extra', title: 'Additional Problems' },
];

/** A topic's declared sections, or the default split when it declares none. */
export function sectionsFor(declared?: readonly TopicSection[]): TopicSection[] {
  const sections = declared && declared.length > 0 ? [...declared] : DEFAULT_SECTIONS.map((s) => ({ ...s }));
  const seen = new Set<string>();
  for (const s of sections) {
    // Two sections sharing an id would give the page duplicate anchors and make
    // `section:` on a problem ambiguous. Fail the build instead.
    if (seen.has(s.id)) throw new Error(`Duplicate section id "${s.id}"`);
    seen.add(s.id);
  }
  return sections;
}

/** The section a problem lands in. Throws if it names one that doesn't exist. */
export function assignSection(
  sections: readonly TopicSection[],
  problem: ProblemLike,
  topicId: string,
): string {
  // sectionsFor() never returns an empty list; this only fires if a caller
  // skips it and hands us one, where the fallback below would read undefined.
  if (sections.length === 0) throw new Error(`Topic "${topicId}" has no sections to place problems in`);
  if (problem.section) {
    if (!sections.some((s) => s.id === problem.section)) {
      const valid = sections.map((s) => s.id).join(', ');
      throw new Error(
        `Problem "${problem.id}" asks for section "${problem.section}", which topic "${topicId}" does not declare. Valid ids: ${valid}`,
      );
    }
    return problem.section;
  }
  return problem.hasVideo ? sections[0].id : sections[sections.length - 1].id;
}

/**
 * Problems bucketed into their sections, input order preserved within each.
 * Sections that end up empty are dropped — a topic with no video-less problems
 * should not render an empty "Additional Problems" heading.
 */
export function groupProblems<T extends ProblemLike>(
  sections: readonly TopicSection[],
  problems: readonly T[],
  topicId: string,
): SectionGroup<T>[] {
  const buckets = new Map<string, T[]>(sections.map((s) => [s.id, []]));
  for (const p of problems) buckets.get(assignSection(sections, p, topicId))!.push(p);
  return sections
    .map((section) => ({ section, items: buckets.get(section.id)! }))
    .filter((g) => g.items.length > 0);
}
