$(document).ready(function () {
  var id_usuario;
  var id_supervisor;

  function checkSession() {
    $.ajax({
      type: "GET",
      url: "php/checkSession.php",
      success: function (resultado) {
        resultado = JSON.parse(resultado);
        if (resultado.user == false) {
          location.href = "index.html";
        } else if (resultado.rol != 2) {
          location.href = "index.html";
        } else {
          $(".bienvenidah1").html("¡Bienvenido/a <span class='nomUsuario'>" + resultado.user + "</span>!");
          id_usuario = resultado.id_user;
          id_supervisor = resultado.id_supervisor;
          obtenerReformasCalendario();
          mostrarProyectosAsignados();
        }
      },
      error: function () {
        alert("Ha habido un error: checkSession.php.");
      },
    });
  }

  function obtenerReformasCalendario() {
    var datos = {
      id_usuario: id_usuario,
      id_supervisor: id_supervisor
    }

    $.ajax({
      type: "GET",
      url: "php/getReformasCalendarioEmpleado.php",
      data: datos,
      success: function (resultado) {
        var calendario = JSON.parse(resultado);
        var eventosCalendario = [];

        for (var evento of calendario) {
          var fechaFinal = new Date(evento.fecha_finalizacion);
          fechaFinal.setDate(fechaFinal.getDate() + 1);
          eventosCalendario.push({
            id: evento.id_reforma, // campo 'id' único
            title: "Reforma #" + evento.id_reforma + " de " + evento.nombre_usuario, // un campo 'titulo'
            start: evento.fecha_inicio, // campo 'fecha_inicio'
            end: fechaFinal, // campo 'fecha_fin'
            allDay: true,
            borderColor: '#944b06',
            textColor: '#944b06',
            className: 'eventCalendario',
          });
        }

        // Inicializar el calendario con los eventos obtenidos
        var calendarEl = document.querySelector('#calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
          headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: ''
          },
          locale: 'es',
          timeZone: 'local',
          firstDay: 1,
          events: eventosCalendario, // Asignar el array de eventos al calendario
          eventColor: '#FFEEDE',

          eventClick: function (info) {
            // Obtener la información del evento
            // Si se tiene fecha fin, hacer un if para en caso de no tener, no mostrarlo y al contrario
            var title = info.event.title;
            var start = info.event.start;
            // Si el evento tiene un campo 'end', puedes incluirlo también
            var end = info.event.end;

            // Construir el contenido del popover
            var popoverContent = '<h3 class="popover-header">' + title + '</h3>';
            var fechaFormateada = ('0' + start.getDate()).slice(-2) + '/' + ('0' + (start.getMonth() + 1)).slice(-2) + '/' + start.getFullYear();
            var fechaFormateadaEnd;
            if (end) {
              var fechaFinal = new Date(end.getTime() - 24 * 60 * 60 * 1000);
              fechaFormateadaEnd = ('0' + fechaFinal.getDate()).slice(-2) + '/' + ('0' + (end.getMonth() + 1)).slice(-2) + '/' + end.getFullYear();
            } else {
              fechaFormateadaEnd = "Sin fecha";
            }

            popoverContent += '<div class="popover-body popoverDesc"><p class="mb-1">Fecha de inicio: ' + fechaFormateada + '<p class="mb-1">Fecha de finalización: ' + fechaFormateadaEnd + '</p></div>';
            // Si el evento tiene un campo 'end', puedes incluirlo también
            // popoverContent += '<div class="popover-body">Fin: ' + end.toLocaleString() + '</div>';

            // Configurar el popover de Bootstrap
            $('#eventoPopover').attr('data-original-title', title);
            $('#eventoPopover').find('.popover-body').html(popoverContent);


            // Mostrar el popover en la posición del evento
            $(info.el).popover({
              container: 'body',
              placement: 'top',
              html: true,
              content: function () {
                return $('#eventoPopover').html();
              }
            }).on('shown.bs.popover', function () {
              // Enfocar el botón cuando el popover se muestra
              $('#cerrarPopover').focus();

              // Cerrar el popover cuando se haga clic fuera de él
              $(document).on('click', function (e) {
                if (!$(info.el).is(e.target) && $(info.el).has(e.target).length === 0 &&
                  $('.popover').has(e.target).length === 0) {
                  $(info.el).popover('hide');
                }
              });
            });

            // Mostrar el popover en la posición del evento
            $(info.el).popover('show');

            // Cerrar el popover cuando se haga clic en el botón
            $('#cerrarPopover').on('click', function () {
              $(info.el).popover('hide');
            });
          }
        });

        calendar.render();

        $('#eventoPopover').popover({
          trigger: 'focus'
        });

      },
      error: function () {
        alert("Ha habido un error: getReformasCalendarioCliente.php.");
      },
    });
  }

  checkSession();

  $("#verReformasAsignadas").click(function () {
    mostrarProyectosAsignados();
  });

  $("#verInformacionPersonal").click(function () {
    informacionPersonal();
  });

  $("#modificarContraseña").click(function () {
    modificarContraseña();
  });

  function informacionPersonal() {
    $("#divEmpleadoOpciones").empty();
    $('<h2 class="h2Cliente text-lg-start text-center">Ver información personal</h2>').appendTo("#divEmpleadoOpciones");
    var datos = {
      id_usuario: id_usuario,
      id_supervisor: id_supervisor
    }
    $.ajax({
      type: "GET",
      url: "php/getInformacionEmpleado.php",
      data: datos,
      success: function (resultado) {
        var informacion = JSON.parse(resultado);
        for (var infoEmpleado of informacion) {
          verInfoPersonal(infoEmpleado);
        }
      },
      error: function () {
        alert("Ha habido un error: getInformacionEmpleado.php.");
      },
    });
  }

  function mostrarProyectosAsignados() {
    $("#divEmpleadoOpciones").empty();
    $('<h2 class="h2Cliente text-lg-start text-center">Reformas asignadas en curso</h2>').appendTo("#divEmpleadoOpciones");
    var datos = {
      id_supervisor: id_supervisor
    }
    $.ajax({
      type: "GET",
      url: "php/getReformasActualesEmpleado.php",
      data: datos,
      success: function (resultado) {
        var proyectos = JSON.parse(resultado);
        if (proyectos.length == 0) {
          $('<p class="pReformasInfo text-lg-start text-center">Actualmente no hay reformas en curso. Aquí aparecerán las reformas que estén bajo la supervisión de tu jefe.</p>').appendTo("#divEmpleadoOpciones");
        } else {
          for (var proyectoAsignado of proyectos) {
            proyectosAsignados(proyectoAsignado);
          }
        }
      },
      error: function () {
        alert("Ha habido un error al iniciar sesión: getReformasActualesEmpleado.php.");
      },
    });
  }

  function proyectosAsignados(reforma) {
    $('<div class="divReformasEmpleado text-center d-flex justify-content-center align-items-center flex-column mb-5">' +
      '<h3>Reforma #' + reforma.id_reforma + '</h3>' +
      '<div class="table-responsive-mobile d-md-flex">' +
      '<table class="table">' +
      '<thead>' +
      '<tr>' +
      '<th scope="col">Nombre del cliente</th>' +
      '<th scope="col">Zona de reforma</th>' +
      '<th scope="col">Tipo de reforma</th>' +
      '<th scope="col">Metros cuadrados</th>' +
      '<th scope="col">Fecha de inicio</th><th scope="col">Fecha de finalización</th></tr>' +
      '</thead>' +
      '<tbody>' +
      '<tr>' +
      '<td>' + reforma.nombre_usuario + '</td>' +
      '<td>' + reforma.nombre_zona + '</td>' +
      '<td>' + reforma.nombre_proyecto + '</td>' +
      '<td>' + reforma.cantidad_metros + '</td>' +
      '<td>' + reforma.fecha_inicio + '</td>' +
      '<td>' + reforma.fecha_finalizacion + '</td>' +
      '</tr>' +
      '</tbody>' +
      '</table>' +
      '</div>' +
      '<h4 class="mt-3">Descripción de la reforma</h4>' +
      '<q class="pReformasInfo mb-0">' + reforma.descripcion_reforma + '</q>' +
      '</div>').appendTo("#divEmpleadoOpciones");
  }

  function modificarContraseña() {
    $("#divEmpleadoOpciones").empty();
    $('<h2 class="h2Cliente text-lg-start text-center">Modificar contraseña de empleado</h2>').appendTo("#divEmpleadoOpciones");
    cambiarContraseña();
  }

  var validatePassEmpleado = false;
  var validateRePassEmpleado = false;

    $(document).on("input", "#inputPassNueva", function() {
      $("#txtBtnForm").empty();
      $("#divPass").empty();
      var regex =
        /^(?=.*[a-zñç])(?=.*[A-Zñç])(?=.*\d)(?=.*[@$!%^&*()_+={}\[\]:;"'\\|,.<>\/?~-])[A-Za-zñç\d@$!%^&*()_+={}\[\]:;"'\\|,.<>\/?~-]{8,}$/;
      var password = $("#inputPassNueva").val();
      var repassword = $("#inputRePassNueva").val();
      if (regex.test(password)) {
        $("#divPass").empty();
        validatePassEmpleado = true;
      } else if (password == "") {
        $("#divPass").empty();
        validatePassEmpleado = false;
      } else {
        $(
          "<p class='error'>Falta 1 mayúscula, 1 minúscula, 1 carácter especial o la longitud es menor a 8 carácteres.</p>"
        ).appendTo("#divPass");
        validatePassEmpleado = false;
      }

      if (repassword == password) {
        $("#divRePass").empty();
        validateRePassEmpleado = true;
      } else if (!(repassword == "") && !(repassword == password)) {
        $("#divRePass").empty();
        $("<p class='error'>Las contraseñas no coinciden.</p>").appendTo(
          "#divRePass"
        );
        validateRePassEmpleado = false;
      }
    });

    $(document).on("input", "#inputRePassNueva", function () {
      $("#divRePass").empty();
      $("#txtBtnForm").empty();
      var password = $("#inputPassNueva").val();
      var repassword = $("#inputRePassNueva").val();
  
      if (repassword == password) {
        $("#divRePass").empty();
        validateRePassEmpleado = true;
      } else if (repassword == "") {
        $("#divRePass").empty();
      } else {
        $("<p class='error'>Las contraseñas no coinciden.</p>").appendTo(
          "#divRePass"
        );
        validateRePassEmpleado = false;
      }
    });

    $(document).on("click", "#btnModificarPass", function(event) {
      event.preventDefault();
      $("#txtBtnForm").empty();
      var inputPassAntigua = $("#inputPassAnterior").val();
      var inputPassNueva = $("#inputPassNueva").val();
      var inputRePassNueva = $("#inputRePassNueva").val();
      if (inputPassAntigua == "" || inputPassNueva == "" || inputRePassNueva == "") {
        $("<p class='error mb-0'>Hay algunos campos vacíos, rellénalos.</p>").appendTo("#txtBtnForm");
      } else if (validatePassEmpleado && validateRePassEmpleado) {
        var datos = {
          id_empleado: id_usuario,
          passAntigua: inputPassAntigua,
          passNueva: inputPassNueva
        }
        $.ajax({
          type: "POST",
          url: "php/modificarPassEmpleado.php",
          data: datos,
          success: function (resultado) {
            if (resultado == "esMisma") {
              $("<p class='error mb-0'>La contraseña nueva que estás introduciendo es la misma que la actual. No se realizarán modificaciones.</p>").appendTo("#txtBtnForm");
            } else if(resultado == "correct") {
              $("#inputPassAnterior").val("");
              $("#inputPassNueva").val("");
              $("<p class='success mb-0'>Modificación realizada correctamente.</p>").appendTo("#txtBtnForm");
            } else {
              $("<p class='error mb-0'>Error. La contraseña actual no es correcta.</p>").appendTo("#txtBtnForm");
            }
          },
          error: function () {
            alert("Ha habido un error: modificarPassEmpleado.php.");
          },
        });
      }
    })

    $(document).on("click", "#verPassBtn1", function (event) {
      event.preventDefault();
      var passwordInput = $("#inputPassAnterior");
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

    $(document).on("click", "#verPassBtn2", function (event) {
      event.preventDefault();
      var passwordInput2 = $("#inputPassNueva");
      var passwordFieldType2 = passwordInput2.attr("type");
  
      if (passwordFieldType2 == "password") {
        passwordInput2.attr("type", "text");
        $(this).empty()
        $(this).html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/></svg>');
      } else {
        passwordInput2.attr("type", "password");
        $(this).empty()
        $(this).html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16"><path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/><path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/></svg>');
      }
    });

    $(document).on("click", "#verPassBtn3", function (event) {
      event.preventDefault();
      var passwordInput3 = $("#inputRePassNueva");
      var passwordFieldType3 = passwordInput3.attr("type");
  
      if (passwordFieldType3 == "password") {
        passwordInput3.attr("type", "text");
        $(this).empty()
        $(this).html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/></svg>');
      } else {
        passwordInput3.attr("type", "password");
        $(this).empty()
        $(this).html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16"><path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/><path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/></svg>');
      }
    });

  function verInfoPersonal(info) {
    var jefetxt = "";
    if (info.supervisor_empleado == null) {
      jefetxt = "Jefe sin asignar";
    } else {
      jefetxt = `${info.nombre_completo_jefe} - ${info.dni_jefe}`;
    }
    
    $(`<div class="divReformasEmpleado text-center d-flex justify-content-center align-items-center flex-column mb-5"> 
      <h3 class="mb-3">Información personal</h3>
      <table class="table table-striped fs-5"> 
      <tbody id="historialTabla" class="align-middle"> 
      <tr>
      <td>Nombre de usuario:</td>
      <td class="fw-bold">${info.nombre_empleado}</td>
      </tr>
      <tr>
      <td>DNI de empleado:</td>
      <td class="fw-bold">${info.dni_empleado}</td>
      </tr>
      <tr>
      <td>Email de empleado:</td>
      <td class="fw-bold">${info.email_empleado}</td>
      </tr>
      <tr>
      <td>Número de teléfono:</td>
      <td class="fw-bold">${info.num_tlf_empleado}</td>
      </tr>
      <tr>
      <td>Tipo de empleado:</td>
      <td class="fw-bold">${info.nombre_rol_empleado}</td>
      </tr>
      <tr>
      <td>Supervisor del empleado:</td>
      <td class="fw-bold">` + jefetxt + `</td>
      </tr>
      </tbody> 
      </table> 
      </div>`).appendTo("#divEmpleadoOpciones");
  }

  function cambiarContraseña() {
    $(`<div class="divReformasEmpleado text-center mb-5"> 
      <h3 class="mb-3">Modificar contraseña</h3>
      <form id="formPassword">
      <div class="row d-flex justify-content-center mb-3">
      <div class="col-md-4">
      <label for="inputPassAnterior" class="form-label">Introduce la contraseña actual:</label>
      <div class="input-group mb-3 mb-md-0">
      <input type="password" class="form-control" id="inputPassAnterior" placeholder="Introduce la contraseña actual..."><button class="btn d-flex align-items-center botonVerPass" id="verPassBtn1" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">
      <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
      <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
      </svg></button>
      </div>
      </div>
      <div class="col-md-4">
      <label for="inputPassNueva" class="form-label">Introduce la nueva contraseña:</label>
      <div class="input-group mb-3">
      <input type="password" class="form-control" id="inputPassNueva" placeholder="Introduce la contraseña nueva..."><button class="btn d-flex align-items-center botonVerPass" id="verPassBtn2" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">
      <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
      <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
      </svg></button>
      </div>
      <div id="divPass"></div>
      </div>
      <div class="col-md-4">
      <label for="inputRePassNueva" class="form-label">Repite la contraseña nueva:</label>
      <div class="input-group mb-3">
      <input type="password" class="form-control" id="inputRePassNueva" placeholder="Introduce la contraseña nueva..."><button class="btn d-flex align-items-center botonVerPass" id="verPassBtn3" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">
      <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
      <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
      </svg></button>
      </div>
      <div id="divRePass"></div>
      </div>
      </div>
      <button type="submit" class="btn btn-outline-success mb-3" id="btnModificarPass">Modificar contraseña</button>
      <div id="txtBtnForm" class="fs-5"></div>
      </form>
      </div>`).appendTo("#divEmpleadoOpciones");
  }
});