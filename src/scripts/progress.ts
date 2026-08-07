/* Client-side progress tracking.
 *
 * Deliberately localStorage-only: the site has no backend and content ships as
 * static HTML, so this is the most a returning member can get until auth lands.
 * It is progressive enhancement — the server renders every item unmarked and
 * this hydrates it. With JS off, or storage blocked, the pages still work; you
 * just do not get the marks.
 *
 * When auth ships, this becomes the offline half of a sync: the same shape can
 * be pushed to an account on first sign-in, so nothing recorded here is lost.
 */

const KEY = 'mqcp-progress';

type Kind = 'problem' | 'video';
interface Store {
  problems: string[];
  videos: string[];
}

const empty = (): Store => ({ problems: [], videos: [] });

function read(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as Partial<Store>;
    return {
      problems: Array.isArray(parsed.problems) ? parsed.problems.filter((s) => typeof s === 'string') : [],
      videos: Array.isArray(parsed.videos) ? parsed.videos.filter((s) => typeof s === 'string') : [],
    };
  } catch {
    // Private mode, disabled storage, or corrupt JSON — behave like a new visitor.
    return empty();
  }
}

function write(store: Store): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* Quota or blocked storage: the in-page state stays correct for this visit. */
  }
}

const bucket = (store: Store, kind: Kind) => (kind === 'problem' ? store.problems : store.videos);

function isDone(store: Store, kind: Kind, id: string): boolean {
  return bucket(store, kind).includes(id);
}

function toggle(store: Store, kind: Kind, id: string): Store {
  const list = bucket(store, kind);
  const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  return kind === 'problem' ? { ...store, problems: next } : { ...store, videos: next };
}

/** Reflect state onto one toggle control. The visible label carries the state
 *  too — `aria-pressed` alone would leave sighted users guessing. */
function paint(el: HTMLElement, done: boolean): void {
  el.setAttribute('aria-pressed', String(done));
  el.dataset.done = done ? '1' : '0';
  const kind = el.dataset.progressKind === 'video' ? 'watched' : 'solved';
  const label = el.querySelector('[data-progress-label]');
  if (label) label.textContent = done ? kind : `mark ${kind}`;
  el.setAttribute('aria-label', done ? `Marked ${kind} — click to clear` : `Mark as ${kind}`);
}

/** Recompute every "n / m solved" summary from the current store. */
function paintCounts(store: Store): void {
  document.querySelectorAll<HTMLElement>('[data-progress-count]').forEach((el) => {
    const ids = (el.dataset.progressIds ?? '').split(',').filter(Boolean);
    if (!ids.length) return;
    const kind = (el.dataset.progressCount as Kind) ?? 'problem';
    const done = ids.filter((id) => isDone(store, kind, id)).length;
    // `short` is for stat panels where a neighbouring label already says what
    // the number counts; the default form has to stand on its own in a list.
    el.textContent =
      el.dataset.progressFormat === 'short'
        ? `${done}/${ids.length}`
        : done
          ? `${done}/${ids.length} solved`
          : `${ids.length} problems`;
    el.dataset.done = done === ids.length ? '1' : '0';
  });
}

export function initProgress(): void {
  let store = read();

  document.querySelectorAll<HTMLElement>('[data-progress-id]').forEach((el) => {
    const kind = (el.dataset.progressKind as Kind) ?? 'problem';
    const id = el.dataset.progressId!;
    paint(el, isDone(store, kind, id));
    el.addEventListener('click', () => {
      store = toggle(store, kind, id);
      write(store);
      paint(el, isDone(store, kind, id));
      paintCounts(store);
    });
  });

  document.querySelectorAll<HTMLElement>('[data-progress-reset]').forEach((el) => {
    el.addEventListener('click', () => {
      // Destructive and un-undoable, and it is the only control here that
      // destroys anything, so it confirms.
      if (!confirm('Clear every solved problem and watched video on this device?')) return;
      store = empty();
      write(store);
      document.querySelectorAll<HTMLElement>('[data-progress-id]').forEach((t) => paint(t, false));
      paintCounts(store);
    });
  });

  paintCounts(store);
}
