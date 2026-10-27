$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "php/checkSession.php",
    success: function (resultado) {
      resultado = JSON.parse(resultado);
      if (resultado.user != false) {
        location.href = "index.html";
      }
    },
    error: function () {
      alert("Ha habido un error al iniciar sesión: checkSession.php.");
    },
  });


  var validateUser = false;
  var validateEmail = false;
  var validateTelefono = false;
  var validatePass = false;
  var validateRepass = false;
  var validateDNI = false;

  $("#inputUsuarioSign").on("input", function () {
    $("#div-user").empty();
    var longitud = $(this).val().length;
    var minLength = 4
    var maxLength = 20;
    $("#div-button").empty();

    if (longitud < minLength) {
      $("<p class='error'>La longitud mínima de nombre de usuario es de " + minLength + " carácteres</p>").appendTo("#div-user");
      validateUser = false;
    } else if (longitud > maxLength) {
      $("<p class='error'>La longitud máxima de nombre de usuario es de " + maxLength + " carácteres</p>").appendTo("#div-user");
      validateUser = false;
    } else {
      validateUser = true;
    }

    var username = $(this).val().trim();
    $(this).val(username.replace(/\s+/g, ''));
  });

  $("#inputUsuarioDNI").on("input", function () {
    $("#div-button").empty();
    $("#div-dni").empty();
    /*var longitud = $(this).val().length;
    if (longitud != 9) {
      $("<p class='error'>El campo DNI / NIE debe contener 9 carácteres.</p>").appendTo("#div-dni");
      validateDNI = false;
    } else {
      validateDNI = true;
    }*/

    var dni = $(this).val().trim();
    var regex = /^[XYZ]?\d{7,8}[A-Z]$/;

    if (!regex.test(dni)) {
        $("<p class='error'>El campo DNI / NIE no tiene el formato válido.</p>").appendTo("#div-dni");
        validateDNI = false;
    } else {
        validateDNI = true;
    }
  });

  $('#inputTelefonoSign').on('input', function () {
    var tlf = $(this).val();
    if (!validatePhone(tlf)) {
      $(this).val(tlf.slice(0, -1));
    }
    $("#div-button").empty();
    if ($(this).val().length > 9) {
      $(this).val($(this).val().slice(0, 9));
    }
  });

  function validatePhone(telefono) {
    var regex = /^[0-9]+$/;
    return regex.test(telefono);
  }

  $("#inputTelefonoSign").focusout(function () {
    $("#div-telefono").empty();
    if ($("#inputTelefonoSign").val() == "") {
      validateTelefono = false;
      $(
        "<p class='error'>El campo no debe estar vacío.</p>"
      ).appendTo("#div-telefono");
    } else if ($(this).val().length < 9) {
      validateTelefono = false;
      $(
        "<p class='error'>El número de teléfono debe contener nueve dígitos.</p>"
      ).appendTo("#div-telefono");
    } else {
      validateTelefono = true;
    }
  });

  $("#inputEmailSign").focusout(function () {
    $("#div-email").empty();
    var email = $("#inputEmailSign").val();
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (regex.test(email)) {
      $("#div-email").empty();
      validateEmail = true;
    } else if (email == "") {
      $("#div-email").empty();
      validateEmail = false;
    } else {
      $(
        "<p class='error'>Dirección de correo electrónico no válida.</p>"
      ).appendTo("#div-email");
      validateEmail = false;
    }
  });

  $("#inputPassSign").on("input", function () {
    $("#div-button").empty();
    $("#div-pass").empty();
    $("#div-repass").empty();
    var regex =
      /^(?=.*[a-zñç])(?=.*[A-Zñç])(?=.*\d)(?=.*[@$!%^&*()_+={}\[\]:;"'\\|,.<>\/?~-])[A-Za-zñç\d@$!%^&*()_+={}\[\]:;"'\\|,.<>\/?~-]{8,}$/;
    var password = $("#inputPassSign").val();
    var repassword = $("#inputRePassSign").val();


    if (regex.test(password)) {
      $("#div-pass").empty();
      validatePass = true;
    } else if (password == "") {
      $("#div-pass").empty();
      validatePass = false;
    } else {
      $(
        "<p class='error'>Falta 1 mayúscula, 1 minúscula, 1 carácter especial o la longitud es menor a 8 carácteres.</p>"
      ).appendTo("#div-pass");
      validatePass = false;
    }

    if (repassword == password) {
      $("#div-repass").empty();
      validateRepass = true;
    } else if (!(repassword == "") && !(repassword == password)) {
      $("<p class='error'>Las contraseñas no coinciden.</p>").appendTo(
        "#div-repass"
      );
      validateRepass = false;
    }
  });

  $("#inputRePassSign").on("input", function () {
    $("#div-button").empty();
    $("#div-repass").empty();
    var password = $("#inputPassSign").val();
    var repassword = $("#inputRePassSign").val();

    if (repassword == password) {
      $("#div-repass").empty();
      validateRepass = true;
    } else if (repassword == "") {
      $("#div-repass").empty();
    } else {
      $("<p class='error'>Las contraseñas no coinciden.</p>").appendTo(
        "#div-repass"
      );
      validateRepass = false;
    }
  });

  $("#btnRegistro").click(function (event) {
    $("#div-button").empty();
    event.preventDefault();
    var user = $("#inputUsuarioSign").val();
    var email = $("#inputEmailSign").val();
    var password = $("#inputPassSign").val();
    var repassword = $("#inputRePassSign").val();
    var telefono = $("inputTelefonoSign").val();
    var dni = $("#inputUsuarioDNI").val();

    if (user == "" || email == "" || password == "" || repassword == "" || telefono == "" || dni == "") {
      $("<p class='error mb-0 mt-3'>Hay algunos campos vacíos, rellénalos.</p>").appendTo(
        "#div-button"
      );
    } else if (
      validateUser &&
      validateEmail &&
      validatePass &&
      validateRepass &&
      validateTelefono &&
      validateDNI
    ) {
      var datos_new_user = $("#myForm").serialize();
      $.ajax({
        type: "POST",
        url: "php/nuevoUsuario.php",
        data: datos_new_user,
        success: function (resultado) {
          if (typeof resultado === "string" && resultado.startsWith("El")) {
            $("<p class='error'>" + resultado + "</p>").appendTo("#div-button"); // Mostrar el mensaje de error
          } else {
            sessionStorage.setItem("successSignin", "true");
            location.href = "iniciar_sesion.html";
          }
        },
        error: function () {
          alert("Ha habido un error al registrar usuario: nuevoUsuario.php.");
        },
      });
    }
  });
});
