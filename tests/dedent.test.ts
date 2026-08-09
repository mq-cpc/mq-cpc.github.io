import { describe, it, expect } from 'vitest';
import { dedent } from '../src/lib/dedent';

describe('dedent', () => {
  it('strips the shared indent and the wrapping newlines', () => {
    // Written the way it is authored inside indented markup.
    const out = dedent(`
      topic: java-basics
      title: "Free Food"
    `);
    expect(out).toBe('topic: java-basics\ntitle: "Free Food"');
  });

  it('keeps indentation inside the snippet', () => {
    const out = dedent(`
      sections:
        - id: tutorials
          title: Video Tutorials
    `);
    expect(out).toBe('sections:\n  - id: tutorials\n    title: Video Tutorials');
  });

  it('measures the indent from the least-indented line, blank lines aside', () => {
    const out = dedent(`
        deeper

      shallower
    `);
    // The blank line contributes no indent, so it does not pull `pad` to 0.
    expect(out).toBe('  deeper\n\nshallower');
  });

  it('leaves already-flush text alone', () => {
    expect(dedent('a\nb')).toBe('a\nb');
  });

  it('handles a snippet whose lines are all blank', () => {
    // Math.min() of no lines is Infinity; slicing by that would empty the text.
    expect(dedent('\n   \n  ')).toBe('');
  });

  it('handles a single line', () => {
    expect(dedent(`
      just one
    `)).toBe('just one');
  });

  it('does not touch braces or interpolated values', () => {
    const repoUrl = 'https://example.test/repo';
    const out = dedent(`
      { "handle": "you" }
      git clone ${repoUrl}.git
    `);
    expect(out).toBe('{ "handle": "you" }\ngit clone https://example.test/repo.git');
  });
});
