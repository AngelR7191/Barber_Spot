/*
 * Configuración de Tailwind para BarberSpot.
 *
 * El proyecto usa el Play CDN de Tailwind (sin build step), que lee la
 * configuración desde `window.tailwind.config`. Si más adelante se migra al
 * CLI de Tailwind, este mismo archivo se exporta con `module.exports`.
 */
(function () {
  var config = {
    content: ['./**/*.html', './js/**/*.js'],
    // El reset base vive en css/app.css; el preflight de Tailwind pisaría los
    // estilos de componentes (p. ej. `[type='submit'] { background: transparent }`).
    corePlugins: { preflight: false },
    theme: {
      extend: {
        colors: {
          'bs-base': '#121212',
          'bs-surface': '#1E1E1E',
          'bs-field': '#171717',
          'bs-line': '#2E2E2E',
          'bs-line-strong': '#3A3A3A',
          'bs-ink': '#F4F1EA',
          'bs-muted': '#A8A29A',
          'bs-faint': '#8A857D',
          'bs-accent': '#E8A33D',
          'bs-accent-hover': '#F2B658',
          'bs-accent-press': '#C98A28',
          'bs-accent-ink': '#141210',
          'bs-error': '#F0625A'
        },
        fontFamily: {
          display: ['"Big Shoulders Display"', '"Arial Narrow"', 'sans-serif'],
          sans: ['"Instrument Sans"', '"Segoe UI"', 'system-ui', 'sans-serif'],
          mono: ['"IBM Plex Mono"', 'Consolas', 'monospace']
        }
      }
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
  } else {
    window.tailwind.config = config;
  }
})();
