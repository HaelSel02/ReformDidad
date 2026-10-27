$(document).ready(function () {
    var validateNombre = false;
    var validateEmail = false;
    var validateTelefono = false;
    var validateMensaje = false;
  
    $("#inputNombreContacto").on("input", function () {
        $("#pBoton").text("");
        $("#pBoton").removeClass("errorP");
        $("#pBoton").addClass("noerrorP");
    });
  
    $("#inputNombreContacto").focusout(function () {
        if (!($("#inputNombreContacto").val() == "")) {
            validateNombre = true;
            $("#pNombre").text("");
            $("#pNombre").removeClass("errorP");
            $("#pNombre").addClass("noerrorP");
          } else {
            validateNombre = false;
            $("#pNombre").text("Error. El campo no debe estar vacío.");
            $("#pNombre").addClass("errorP");
            $("#pNombre").removeClass("noerrorP");
          }
    });

    $("#inputEmailContacto").on("input", function () {
        $("#pBoton").text("");
        $("#pBoton").removeClass("errorP");
        $("#pBoton").addClass("noerrorP");
    });
  
    $("#inputEmailContacto").focusout(function () {
      var email = $("#inputEmailContacto").val();
      var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      if (regex.test(email)) {
        $("#pEmail").text("");
        $("#pEmail").removeClass("errorP");
        $("#pEmail").addClass("noerrorP");
        validateEmail = true;
      } else if (email == ""){
        $("#pEmail").text("Error. El campo no debe estar vacío.");
        $("#pEmail").addClass("errorP");
        $("#pEmail").removeClass("noerrorP");
        validateEmail = false;
      } else {
        $("#pEmail").text("Error. Dirección de correo electrónico no válida");
        $("#pEmail").addClass("errorP");
        $("#pEmail").removeClass("noerrorP");
        validateEmail = false;
      }
    });

    $("#inputTelefonoContacto").focusout(function () {
        if (!($("#inputTelefonoContacto").val() == "")) {
            validateTelefono = true;
            $("#pTelefono").text("");
            $("#pTelefono").removeClass("errorP");
            $("#pTelefono").addClass("noerrorP");
          } else {
            validateTelefono = false;
            $("#pTelefono").text("Error. El campo no debe estar vacío.");
            $("#pTelefono").addClass("errorP");
            $("#pTelefono").removeClass("noerrorP");
          }
    });

    $('#inputTelefonoContacto').on('input', function() {
        $("#pBoton").text("");
        $("#pBoton").removeClass("errorP");
        $("#pBoton").addClass("noerrorP");

        if ($(this).val().length > 9) {
            $(this).val($(this).val().slice(0, 9));
        }
    });

    $("#textareaMensajeContacto").focusout(function () {
        if (!($("#textareaMensajeContacto").val() == "")) {
            validateMensaje = true;
            $("#pMensaje").text("");
            $("#pMensaje").removeClass("errorP");
            $("#pMensaje").addClass("noerrorP");
          } else {
            validateMensaje = false;
            $("#pMensaje").text("Error. El campo no debe estar vacío.");
            $("#pMensaje").addClass("errorP");
            $("#pMensaje").removeClass("noerrorP");
          }
    });

    $('#textareaMensajeContacto').on('input', function() {
        $("#pBoton").text("");
        $("#pBoton").removeClass("errorP");
        $("#pBoton").addClass("noerrorP");
    });
  
    $("#btnEnviarMensaje").click(function (event) {
      event.preventDefault();
      var nombre = $("#inputNombreContacto").val();
      var email = $("#inputEmailContacto").val();
      var telefono = $("#inputTelefonoContacto").val();
      var mensaje = $("#textareaMensajeContacto").val();

  
      if (nombre == "" || email == "" || telefono == "" || mensaje == "") {
        $("#pBoton").text("Error. Algunos campos están vacíos.");
            $("#pBoton").addClass("errorP");
            $("#pBoton").removeClass("noerrorP");
      } else if (
        validateNombre &&
        validateEmail && 
        validateTelefono && 
        validateMensaje
      ) {
              $.ajax({
                type: "POST",
                url: $("#myForm").attr("action"),
                data: $("#myForm").serialize(),
                dataType: "json",
                success: function (response) {
                    if (response.status === "success") {
                        alert(response.message);
                        // Aquí puedes redirigir o hacer otras acciones después de enviar el correo
                    } else {
                        alert(response.message);
                    }
                },
                error: function () {
                    alert("Error al enviar el formulario");
                }
            });
      }
    });
  });
  