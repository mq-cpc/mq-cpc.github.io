const KEY = 'mqcp-theme';
type Theme = 'pastel' | 'indigo';

export function initTheme(): void {
  const root = document.documentElement;
  const stored = (localStorage.getItem(KEY) as Theme | null) ?? 'pastel';
  root.setAttribute('data-theme', stored);
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next: Theme =
        root.getAttribute('data-theme') === 'indigo' ? 'pastel' : 'indigo';
      root.setAttribute('data-theme', next);
      localStorage.setItem(KEY, next);
    });
  });
}
