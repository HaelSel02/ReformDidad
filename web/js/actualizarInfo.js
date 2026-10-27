$(document).ready(function () {
  var id_usuario;
  var prepass = "";
  checkSession();

  function checkSession() {
    $.ajax({
      type: "GET",
      url: "php/checkSession.php",
      success: function (resultado) {
        resultado = JSON.parse(resultado);
        if (resultado.user == false) {
          location.href = "iniciar_sesion.html";
        } else if (resultado.rol == 1) {
          location.href = "admin.html";
        } else if (resultado.rol == 2) {
          location.href = "empleado.html";
        } else {
          id_usuario = resultado.id_user;
        }
      },
      error: function () {
        alert("Ha habido un error al iniciar sesión: checkSession.php.");
      },
    });
  }

  $("#inputPrePass").on("input", function () {
    $("#divBotonError").empty();
  });

  $("#enterPass").click(function (event) {
    event.preventDefault();
    prepass = $("#inputPrePass").val();
    if (prepass == "") {
      $("#divBotonError").append("<p class='error mt-4 mb-0'>El campo está vacío, introduzca la contraseña.</p>")
    } else {
      $.ajax({
        type: "POST",
        url: "php/getPassUsuario.php?id_user=" + id_usuario,
        data: { prepass: prepass },
        success: function (resultado) {
          if (resultado == "true") {
            $("#formUsuario").empty();
            $("#formUsuario").html('<div class="mt-5 mb-5 p-5 d-flex justify-content-center flex-column align-items-center"><div class="spinner-border" role="status"></div><h3 class="colorPrincipal mt-4">Espere un momento...</h3></div>');
            setTimeout(function () {
              mostrarFormUser();
              recargarForm();
            }, 2000);
          } else {
            $("#divBotonError").append("<p class='error mt-4 mb-0'>Contraseña incorrecta. Inténtelo de nuevo.</p>")
          }
        },
  
        error: function () {
          alert("Atencion: se ha producido un error (getPassUsuario.php)");
        },
      });
    }
  })

  $("#buttonVista").click(function (event) {
    event.preventDefault();
    var passwordInput = $("#inputPrePass");
    var passwordFieldType = passwordInput.attr("type");

    if (passwordFieldType == "password") {
      passwordInput.attr("type", "text");
      $(this).empty()
      $(this).html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/></svg>');
    } else {
      passwordInput.attr("type", "password");
      $(this).empty()
      $(this).html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16"><path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/><path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/></svg>');
    }
  });

  var validateEmail = true;
  var validatePass = true;
  var validateTelefono = true;
  var validateRepass = false;

  $(document).on('click', '#editarUser', function (event) {
    event.preventDefault();
    var email = $("#inputPassUser").val();
    var password = $("#inputEmailUser").val();
    var repassword = $("#inputRepassUser").val();
    var telefono = $("#inputTelefonoUser").val();

    if (email == "" || password == "" || telefono == "" || repassword == "") {
      $("#div-button").empty();
      $("<p class='error'>Hay algunos campos vacíos, rellénalos.</p>").appendTo("#div-button");
    } else if (validatePass && validateEmail && validateTelefono && validateRepass) {

      var formData = new FormData($("#formularioUser")[0]);

      $.ajax({
        type: 'POST',
        url: 'php/editUser.php?id_user=' + id_usuario,
        data: formData,
        processData: false,
        contentType: false,
        success: function (resultado) {
          if (typeof resultado === "string" && resultado.startsWith("El")) {
            $("<p class='error'>" + resultado + "</p>").appendTo("#div-button");
          } else {
            location.href = "cliente.html";
          }
        },
        error: function (error) {
          alert("Ocurrio un error:" + error);
        }
      });
    }
  });

  $(document).on('click', '#volverInicio', function (event) {
    event.preventDefault();
    location.href = "cliente.html";
  });

  function recargarForm() {
    $.ajax({
      type: "GET",
      url: "php/getInfoUsuario.php?id_user=" + id_usuario,
      success: function (resultado) {
        var usuario = jQuery.parseJSON(resultado);
        $("#inputEmailUser").val(usuario[0].email);
        $("#inputPassUser").val(prepass);
        $("#inputTelefonoUser").val(usuario[0].num_tlf);
      },

      error: function () {
        alert("Atencion: se ha producido un error (getInfoUsuario.php)");
      },
    });
  }


  function mostrarFormUser() {
    $("#formUsuario").empty();
    $("<h2 class='fs-2 p-2 mt-5 text-center'>Aquí puedes actualizar la información que necesites:</h2>" +
      "  <form id='formularioUser' enctype='multipart/form-data'>" +
      "  <div class='mb-3'>" +
      "    <div class='row d-flex justify-content-center'>" +
      "      <div class='col-md-5'>" +
      "        <p class='pEditInfo'>Correo electrónico:</p>" +
      "        <input type='email' class='form-control' id='inputEmailUser' name='email' placeholder='Introduce el email...'>" +
      "        <p class='pEditInfo'>Contraseña:</p>" +
      "         <div class='input-group'>" +
      "         <input type='password' class='form-control' id='inputPassUser' name='pass' placeholder='Introduce la contraseña...'>" +
      "         <button class='btn d-flex align-items-center botonVerPass' type='button' id='btnVerPass'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-eye-slash-fill' viewBox='0 0 16 16'>" +
      "         <path d='m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z'/>" +
      "         <path d='M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z'/>" +
      "         </svg></button>" +
      "         </div>" +
      "        <p class='pEditInfo'>Repetir contraseña (Escribir la misma si no se quiere actualizar):</p>" +
      "         <div class='input-group'>" +
      "         <input type='password' class='form-control' id='inputRepassUser' name='repass' placeholder='Introduce de nuevo la contraseña...'>" +
      "         <button class='btn d-flex align-items-center botonVerPass' type='button' id='btnVerRepass'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-eye-slash-fill' viewBox='0 0 16 16'>" +
      "         <path d='m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z'/>" +
      "         <path d='M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z'/>" +
      "         </svg></button>" +
      "         </div>" +
      "        <p class='pEditInfo'>Número de teléfono:</p>" +
      "        <input type='number' class='form-control' id='inputTelefonoUser' name='telefono' placeholder='Introduce el número de teléfono...'>" +
      "      </div>" +
      "    </div>" +
      "  </div>" +
      "  <div class='mb-3 d-flex justify-content-center' id='divButton'>" +
      "      <button type='submit' class='btn btn-outline-success me-2' id='editarUser'>Editar información</button>" +
      "      <button type='submit' class='btn btn-outline-danger ms-2' id='volverInicio'>Cancelar edición</button>" +
      "    </div>" +
      "  </div>" +
      "</form>" +
      "<div id='div-button' class='d-flex justify-content-center text-center'></div>"
    ).appendTo("#formUsuario");
  }

  $(document).on("click", "#btnVerPass",function (event) {
    event.preventDefault();
    var passwordInput = $("#inputPassUser");
    var passwordFieldType = passwordInput.attr("type");

    if (passwordFieldType == "password") {
      passwordInput.attr("type", "text");
      $(this).empty()
      $(this).html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/></svg>');
    } else {
      passwordInput.attr("type", "password");
      $(this).empty()
      $(this).html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16"><path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/><path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/></svg>');
    }
  });

  $(document).on("click", "#btnVerRepass",function (event) {
    event.preventDefault();
    var passwordInput = $("#inputRepassUser");
    var passwordFieldType = passwordInput.attr("type");

    if (passwordFieldType == "password") {
      passwordInput.attr("type", "text");
      $(this).empty()
      $(this).html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/></svg>');
    } else {
      passwordInput.attr("type", "password");
      $(this).empty()
      $(this).html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16"><path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/><path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/></svg>');
    }
  });

  $(document).on("focusout", "#inputEmailUser", function () {
    $("#div-button").empty();
    var email = $("#inputEmailUser").val();
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (regex.test(email)) {
      $("#div-button").empty();
      validateEmail = true;
    } else if (email == "") {
      $("#div-button").empty();
      validateEmail = false;
    } else {
      $(
        "<p class='error'>Dirección de correo electrónico no válida.</p>"
      ).appendTo("#div-button");
      validateEmail = false;
    }
  });

  $(document).on("input", "#inputPassUser", function () {
    $("#div-button").empty();
    var regex =
      /^(?=.*[a-zñç])(?=.*[A-Zñç])(?=.*\d)(?=.*[@$!%^&*()_+={}\[\]:;"'\\|,.<>\/?~-])[A-Za-zñç\d@$!%^&*()_+={}\[\]:;"'\\|,.<>\/?~-]{8,}$/;
    var password = $("#inputPassUser").val();
    var repassword = $("#inputRepassUser").val();


    if (regex.test(password)) {
      $("#div-button").empty();
      validatePass = true;
    } else if (password == "") {
      $("#div-button").empty();
      validatePass = false;
    } else {
      $(
        "<p class='error'>Falta 1 mayúscula, 1 minúscula, 1 carácter especial o la longitud es menor a 8 carácteres.</p>"
      ).appendTo("#div-button");
      validatePass = false;
    }

    if (repassword == password) {
      $("#div-button").empty();
      validateRepass = true;
    } else if (!(repassword == "") && !(repassword == password)) {
      $("<p class='error'>Las contraseñas no coinciden.</p>").appendTo(
        "#div-button"
      );
      validateRepass = false;
    }
  });


  $(document).on("input", "#inputRepassUser", function () {
    $("#div-button").empty();
    var password = $("#inputPassUser").val();
    var repassword = $("#inputRepassUser").val();

    if (repassword == password) {
      $("#div-button").empty();
      validateRepass = true;
    } else if (repassword == "") {
      $("#div-button").empty();
    } else {
      $("<p class='error'>Las contraseñas no coinciden.</p>").appendTo(
        "#div-button"
      );
      validateRepass = false;
    }
  });

  $(document).on('input', '#inputTelefonoUser', function () {
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

  $(document).on('focusout', '#inputTelefonoUser', function () {
    $("#div-button").empty();
    if ($("#inputTelefonoUser").val() == "") {
      validateTelefono = false;
      $(
        "<p class='error'>El campo no debe estar vacío.</p>"
      ).appendTo("#div-button");
    } else if ($(this).val().length < 9) {
      validateTelefono = false;
      $(
        "<p class='error'>El número de teléfono debe contener nueve dígitos.</p>"
      ).appendTo("#div-button");
    } else {
      validateTelefono = true;
    }
  });

});