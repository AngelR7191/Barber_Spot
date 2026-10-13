// BarberSpot - pantalla de login (index.html)
(function () {
  'use strict';

  var UI = window.BarberSpotUI;

  var form = document.getElementById('form-acceso');
  var inputUsuario = document.getElementById('usuario');
  var inputPassword = document.getElementById('password');
  var chkRecordarme = document.getElementById('recordarme');
  var toggle = form.querySelector('[data-toggle-password]');
  var btn = document.getElementById('btn-acceso');
  var btnLabel = btn.querySelector('[data-label]');
  var banner = document.getElementById('banner-error');

  var roles = UI.initRoleTabs(document.getElementById('roles-acceso'), {
    panel: document.getElementById('panel-acceso'),
    subtitle: document.getElementById('subtitulo-acceso')
  });

  UI.initPasswordToggles(form);

  var enviando = false;

  function setCargando(cargando) {
    enviando = cargando;
    btn.setAttribute('aria-busy', String(cargando));
    btn.setAttribute('aria-disabled', String(cargando));
    btnLabel.textContent = cargando ? 'Iniciando sesion…' : 'Iniciar sesion';
    [inputUsuario, inputPassword, chkRecordarme, toggle].forEach(function (el) {
      el.disabled = cargando;
    });
    roles.setDisabled(cargando);
  }

  function mostrarErrorCredenciales() {
    banner.hidden = false;
    UI.markInvalid(inputUsuario);
    UI.markInvalid(inputPassword);
  }

  function limpiarErrorCredenciales() {
    banner.hidden = true;
    UI.setFieldError(inputUsuario, '');
    UI.setFieldError(inputPassword, '');
  }

  // panel destino segun el rol que devuelve C#
  var PANELES = {
    usuario: 'panel-usuario.html',
    barbero: 'panel-barbero.html',
    admin: 'panel-admin.html'
  };

  function alIniciarSesion(resultado) {
    var destino = PANELES[resultado.rol];
    if (!destino) {
      console.error('[login] Rol desconocido:', resultado.rol);
      setCargando(false);
      mostrarErrorCredenciales();
      return;
    }
    window.location.href = destino;
  }

  // al corregir un campo se limpia su error
  [inputUsuario, inputPassword].forEach(function (input) {
    input.addEventListener('input', function () {
      if (!banner.hidden) limpiarErrorCredenciales();
      else UI.setFieldError(input, '');
    });
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (enviando) return;

    limpiarErrorCredenciales();

    var usuario = inputUsuario.value.trim();
    var password = inputPassword.value;
    var invalidos = [];

    if (!usuario) {
      UI.setFieldError(inputUsuario, 'Ingresa tu usuario o correo electronico.');
      invalidos.push(inputUsuario);
    }
    if (!password) {
      UI.setFieldError(inputPassword, 'Ingresa tu contrasena.');
      invalidos.push(inputPassword);
    }
    if (invalidos.length) {
      invalidos[0].focus();
      return;
    }

    setCargando(true);

    var resultado = null;
    try {
      // llama a BridgeService.Login en C# y parsea el JSON
      var respuesta = await UI.getBackend().Login(usuario, password, roles.value, chkRecordarme.checked);
      resultado = typeof respuesta === 'string' ? JSON.parse(respuesta) : respuesta;
    } catch (err) {
      console.error('[login] Error al llamar al backend:', err);
    }

    if (resultado && resultado.ok) {
      alIniciarSesion(resultado);
      return;
    }

    setCargando(false);
    mostrarErrorCredenciales();
    inputPassword.focus();
  });
})();
