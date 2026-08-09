// Strip the common leading indentation from a template literal.
//
// A <pre> renders its source whitespace literally, and a template literal's
// content is literal too — so a code sample written inline in the markup would
// otherwise have to sit flush against column 0, in the middle of indented
// markup. This lets the sample be indented with the element that holds it while
// still rendering flush, which is what keeps single-use snippets next to their
// <pre> instead of collected at the top of the file.
//
// Only the SHARED indent is removed, so indentation *within* the snippet — YAML
// nesting, a continued line — survives.
export function dedent(text: string): string {
  const lines = text
    .replace(/^\r?\n/, '') // the newline straight after the opening backtick
    .replace(/\s+$/, '') // the indentation before the closing backtick
    .split('\n')
    .map((l) => l.replace(/\r$/, ''));

  const indents = lines
    .filter((l) => l.trim() !== '') // blank lines carry no indent to measure
    .map((l) => l.match(/^[ \t]*/)![0].length);

  // Math.min() of nothing is Infinity, which would slice every line to ''.
  const pad = indents.length > 0 ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(pad)).join('\n');
}
