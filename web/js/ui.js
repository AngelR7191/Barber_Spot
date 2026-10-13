// BarberSpot - utilidades de UI compartidas (acceso y registro)
// expone window.BarberSpotUI
(function () {
  'use strict';

  // iconos svg tipo Lucide 24x24, se inyectan como sprite
  var ICONS = {
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    scissors: '<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    'eye-off': '<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    key: '<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>',
    store: '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/>',
    'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    alert: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    pole: '<path d="M8 3h8"/><path d="M8 21h8"/><rect x="9" y="5" width="6" height="14" rx="1"/><path d="m9 10 6-3"/><path d="m9 14 6-3"/><path d="m9 18 6-3"/>'
  };

  function injectIconSprite() {
    var symbols = Object.keys(ICONS).map(function (id) {
      return '<symbol id="i-' + id + '" viewBox="0 0 24 24">' + ICONS[id] + '</symbol>';
    }).join('');
    document.body.insertAdjacentHTML(
      'afterbegin',
      '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" ' +
      'style="position:absolute;width:0;height:0;overflow:hidden">' + symbols + '</svg>'
    );
  }

  // selector de tipo de cuenta (tabs de rol)
  function initRoleTabs(tablist, options) {
    options = options || {};
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var panel = options.panel || null;
    var subtitle = options.subtitle || null;
    var active = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0];

    function select(tab, moveFocus) {
      active = tab;
      tabs.forEach(function (t) {
        var isActive = t === tab;
        t.setAttribute('aria-selected', String(isActive));
        t.tabIndex = isActive ? 0 : -1;
      });
      if (panel) panel.setAttribute('aria-labelledby', tab.id);
      if (subtitle && tab.dataset.subtitulo) subtitle.textContent = tab.dataset.subtitulo;
      if (moveFocus) tab.focus();
      if (options.onChange) options.onChange(tab.dataset.rol);
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        if (tab !== active) select(tab, false);
      });
    });

    // navegacion por teclado entre tabs
    tablist.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i === -1) return;
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (!next) return;
      e.preventDefault();
      select(next, true);
    });

    select(active, false);

    return {
      get value() { return active.dataset.rol; },
      setDisabled: function (disabled) {
        tabs.forEach(function (t) { t.disabled = disabled; });
      }
    };
  }

  // botones mostrar/ocultar password
  function initPasswordToggles(root) {
    (root || document).querySelectorAll('[data-toggle-password]').forEach(function (btn) {
      var input = document.getElementById(btn.getAttribute('aria-controls'));
      btn.addEventListener('mousedown', function (e) {
        if (document.activeElement === input) e.preventDefault();
      });
      btn.addEventListener('click', function () {
        var mostrar = input.type === 'password';
        input.type = mostrar ? 'text' : 'password';
        btn.setAttribute('aria-pressed', String(mostrar));
      });
    });
  }

  // marcar o limpiar error en un campo del form
  function setFieldError(input, message) {
    var errorEl = document.getElementById(input.id + '-error');
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (!errorEl) return;
    errorEl.querySelector('[data-msg]').textContent = message || '';
    errorEl.hidden = !message;
  }

  // marcar invalido sin mensaje (el error lo explica otro elemento)
  function markInvalid(input) {
    setFieldError(input, '');
    input.setAttribute('aria-invalid', 'true');
  }

  function getFieldError(input) {
    var errorEl = document.getElementById(input.id + '-error');
    return errorEl && !errorEl.hidden ? errorEl.querySelector('[data-msg]').textContent : '';
  }

  // acceso al backend C# via WebView2
  function getBackend() {
    var webview = window.chrome && window.chrome.webview;
    if (!webview || !webview.hostObjects) {
      throw new Error('BridgeService no disponible: no se esta ejecutando dentro de WebView2.');
    }
    return webview.hostObjects.backend;
  }

  injectIconSprite();

  // links sin destino (soporte, terminos, etc) no hacen nada por ahora
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href="#"]');
    if (link) e.preventDefault();
  });

  window.BarberSpotUI = {
    initRoleTabs: initRoleTabs,
    initPasswordToggles: initPasswordToggles,
    setFieldError: setFieldError,
    markInvalid: markInvalid,
    getFieldError: getFieldError,
    getBackend: getBackend
  };
})();
