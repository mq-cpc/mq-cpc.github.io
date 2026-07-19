import { describe, it, expect } from 'vitest';
import { parseTeamBoard } from '../src/lib/team-board';

describe('parseTeamBoard', () => {
  it('parses valid entries', () => {
    const out = parseTeamBoard({ entries: [{ handle: 'a', looking: '1 more', contact: 'dm' }] });
    expect(out).toEqual([{ handle: 'a', looking: '1 more', contact: 'dm' }]);
  });

  it('throws on a missing required field', () => {
    expect(() => parseTeamBoard({ entries: [{ handle: 'a' }] })).toThrow(/looking|contact/);
  });

  it('throws when entries is not an array', () => {
    expect(() => parseTeamBoard({ entries: 'nope' })).toThrow();
  });
});
