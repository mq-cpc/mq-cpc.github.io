const KEY = 'mqcp-theme';
type Theme = 'pastel' | 'indigo';

// The toggle is an icon-only button, so its accessible name has to carry the
// whole message — and name the *outcome*, not the gesture. It flips with the
// theme so it never promises the state the user is already in.
const labelFor = (current: Theme) =>
  current === 'indigo' ? 'Switch to light theme' : 'Switch to dark theme';

function label(btn: Element, current: Theme): void {
  const text = labelFor(current);
  btn.setAttribute('aria-label', text);
  btn.setAttribute('title', text);
}

export function initTheme(): void {
  const root = document.documentElement;
  const stored = (localStorage.getItem(KEY) as Theme | null) ?? 'pastel';
  root.setAttribute('data-theme', stored);
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    label(btn, stored);
    btn.addEventListener('click', () => {
      const next: Theme =
        root.getAttribute('data-theme') === 'indigo' ? 'pastel' : 'indigo';
      root.setAttribute('data-theme', next);
      localStorage.setItem(KEY, next);
      label(btn, next);
    });
  });
}
