/**
 * Generates the theme detection script to prevent flash of wrong theme
 * This script runs before React hydration to set the initial theme
 */
export function getThemeScript(): string {
  return `
    (function() {
      function getInitialTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && savedTheme !== 'system') {
          return savedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      document.documentElement.setAttribute('data-theme', getInitialTheme());
    })();
  `;
}

/**
 * Component that renders the theme script
 * Used in the document head to prevent theme flash
 */
export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: getThemeScript(),
      }}
    />
  );
}
