// BarberSpot - pantalla de crear cuenta (registro.html)
(function () {
  'use strict';

  var UI = window.BarberSpotUI;

  var MSG_NO_COINCIDEN = 'Las contrasenas no coinciden.';

  var form = document.getElementById('form-registro');
  var inputNombre = document.getElementById('nombre');
  var inputCorreo = document.getElementById('correo');
  var inputTelefono = document.getElementById('telefono');
  var inputEspecialidad = document.getElementById('especialidad');
  var inputInvitacion = document.getElementById('codigo-invitacion');
  var inputBarberia = document.getElementById('barberia');
  var inputCodigoAdmin = document.getElementById('codigo-admin');
  var inputPassword = document.getElementById('password');
  var inputConfirmacion = document.getElementById('password-confirmacion');
  var chkTerminos = document.getElementById('terminos');
  var btn = document.getElementById('btn-registro');
  var filasPorRol = document.querySelectorAll('[data-solo-rol]');

  // campos exclusivos de un rol se ocultan y deshabilitan
  function aplicarRol(rol) {
    filasPorRol.forEach(function (fila) {
      var visible = fila.dataset.soloRol === rol;
      fila.hidden = !visible;
      fila.querySelectorAll('input').forEach(function (input) {
        input.disabled = !visible;
        if (!visible) UI.setFieldError(input, '');
      });
    });
  }

  var roles = UI.initRoleTabs(document.getElementById('roles-registro'), {
    panel: document.getElementById('panel-registro'),
    subtitle: document.getElementById('subtitulo-registro'),
    onChange: aplicarRol
  });

  UI.initPasswordToggles(form);

  // validacion en vivo de que las contrasenas coincidan
  function validarCoincidencia() {
    var confirmacion = inputConfirmacion.value;
    if (confirmacion && confirmacion !== inputPassword.value) {
      UI.setFieldError(inputConfirmacion, MSG_NO_COINCIDEN);
    } else if (confirmacion || UI.getFieldError(inputConfirmacion) === MSG_NO_COINCIDEN) {
      UI.setFieldError(inputConfirmacion, '');
    }
  }

  inputPassword.addEventListener('input', function () {
    UI.setFieldError(inputPassword, '');
    validarCoincidencia();
  });
  inputConfirmacion.addEventListener('input', validarCoincidencia);

  // limpiar error al escribir en cualquier campo
  form.querySelectorAll('.bs-input').forEach(function (input) {
    if (input === inputPassword || input === inputConfirmacion) return;
    input.addEventListener('input', function () { UI.setFieldError(input, ''); });
  });

  // el boton se habilita solo si acepta terminos
  function sincronizarBoton() {
    btn.disabled = !chkTerminos.checked;
  }
  chkTerminos.addEventListener('change', sincronizarBoton);
  sincronizarBoton();

  // validacion de campos antes de enviar
  function validar() {
    var reglas = [
      [inputNombre, function (v) { return v ? '' : 'Ingresa tu nombre completo.'; }],
      [inputCorreo, function (v) {
        if (!v) return 'Ingresa tu correo electronico.';
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Ingresa un correo electronico valido.';
      }],
      [inputTelefono, function (v) {
        if (!v) return 'Ingresa tu telefono.';
        return /^\d{10}$/.test(v) ? '' : 'El telefono debe tener 10 digitos.';
      }],
      [inputEspecialidad, function (v) { return v ? '' : 'Ingresa tu especialidad.'; }],
      [inputInvitacion, function (v) { return v ? '' : 'Ingresa tu codigo de invitacion.'; }],
      [inputBarberia, function (v) { return v ? '' : 'Ingresa el nombre de la barberia.'; }],
      [inputCodigoAdmin, function (v) { return v ? '' : 'Ingresa el codigo de administrador.'; }],
      [inputPassword, function (v) {
        if (!v) return 'Ingresa una contrasena.';
        return v.length >= 8 ? '' : 'Debe tener al menos 8 caracteres.';
      }],
      [inputConfirmacion, function (v) {
        if (!v) return 'Confirma tu contrasena.';
        return v === inputPassword.value ? '' : MSG_NO_COINCIDEN;
      }]
    ];

    var primerInvalido = null;
    reglas.forEach(function (regla) {
      var input = regla[0];
      if (input.disabled) return;
      var esPassword = input === inputPassword || input === inputConfirmacion;
      var mensaje = regla[1](esPassword ? input.value : input.value.trim());
      UI.setFieldError(input, mensaje);
      if (mensaje && !primerInvalido) primerInvalido = input;
    });
    return primerInvalido;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!chkTerminos.checked) return;

    var primerInvalido = validar();
    if (primerInvalido) {
      primerInvalido.focus();
      return;
    }

    // datos que se enviaran al backend C# cuando exista Registrar()
    var datos = {
      rol: roles.value,
      nombre: inputNombre.value.trim(),
      correo: inputCorreo.value.trim(),
      telefono: inputTelefono.value.trim(),
      especialidad: inputEspecialidad.disabled ? null : inputEspecialidad.value.trim(),
      codigoInvitacion: inputInvitacion.disabled ? null : inputInvitacion.value.trim(),
      barberia: inputBarberia.disabled ? null : inputBarberia.value.trim(),
      codigoAdmin: inputCodigoAdmin.disabled ? null : inputCodigoAdmin.value.trim(),
      password: inputPassword.value
    };

    // TODO: conectar con BridgeService.Registrar en C#
    void datos;
  });
})();
