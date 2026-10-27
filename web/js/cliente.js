$(document).ready(function () {
  var id_usuario;
  var paginaActual = 1;

  function checkSession() {
    $.ajax({
      type: "GET",
      url: "php/checkSession.php",
      success: function (resultado) {
        resultado = JSON.parse(resultado);
        if (resultado.user == false) {
          location.href = "index.html";
        } else if (resultado.rol != 3) {
          location.href = "index.html";
        } else {
          $(".bienvenidah1").html("¡Bienvenido/a <span class='nomUsuario'>" + resultado.user + "</span>!");
          id_usuario = resultado.id_user;
          obtenerReformasCalendario();
          mostrarReformasActuales();
        }
      },
      error: function () {
        alert("Ha habido un error al iniciar sesión: checkSession.php.");
      },
    });
  }

  function obtenerReformasCalendario() {
    var datos = {
      id_usuario: id_usuario
    }

    $.ajax({
      type: "GET",
      url: "php/getReformasCalendarioCliente.php",
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

            console.log(fechaFormateadaEnd);
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

  $("#verReformasCurso").click(function () {
    mostrarReformasActuales();
  });

  $("#verHistorialReformas").click(function () {
    historialReformasUsuario(paginaActual);
  });

  $(document).on("click", ".btnValorar", function () {
    var idReforma = $(this).val();

    var modalHtml = `<div class="modal fade" id="modalFormValoracion" tabindex="-1" aria-labelledby="modalForm" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modalForm">Reseña de la reforma #`+ idReforma + `</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="formValoracion" class="fs-5">
            <div class="mb-3">
              <label for="valoracion" class="col-form-label">¿Qué tan bueno ha sido nuestro servicio?:</label>
              <div id="seleccionValoracion" class="fs-3">
              <span data-value="1" class="valorReforma"><i class="bi bi-star-fill"></i></span>
              <span data-value="2" class="valorReforma"><i class="bi bi-star"></i></span>
              <span data-value="3" class="valorReforma"><i class="bi bi-star"></i></span>
              <span data-value="4" class="valorReforma"><i class="bi bi-star"></i></span>
              <span data-value="5" class="valorReforma"><i class="bi bi-star"></i></span>
              </div>
              <input type="hidden" id="cantidadValoracion" name="valoracion" value="1">
            </div>
            <div class="mb-3">
              <label for="comentarioValoracion" class="col-form-label">Déjanos un comentario del servicio recibido:</label>
              <textarea class="form-control" id="comentarioValoracion" placeholder="Comentario de valoración..." rows="3"></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success btnEnviarValoracion" data-bs-dismiss="modal" value="`+ idReforma + `">Enviar reseña</button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Volver</button>
        </div>
      </div>
    </div>
  </div>`;

    $('#modalContainer').html(modalHtml);

    // Mostrar el modal
    $('#modalFormValoracion').modal('show');

    $('#modalFormValoracion').on('hidden.bs.modal', function () {
      $('#modalContainer').empty();
    });
  });

  // Manejar clic en estrellas
  $(document).on('click', '.valorReforma', function () {
    var valor = $(this).data('value');

    // Actualizar el valor del campo oculto
    $('#cantidadValoracion').val(valor);

    // Cambiar la apariencia de las estrellas
    $(this).prevAll().addBack().html('<i class="bi bi-star-fill"></i>');
    $(this).nextAll().html('<i class="bi bi-star"></i>');
  });

  $(document).on("click", ".btnEnviarValoracion", function(event) {
    event.preventDefault();
    var idReforma = $(this).val();
    var comentarioReseña = $("#comentarioValoracion").val();
    var cantidadValoracion = parseInt($("#cantidadValoracion").val());
    var datos = {
      idReforma: idReforma,
      idUsuario: id_usuario,
      comentarioReseña: comentarioReseña,
      cantidadValoracion: cantidadValoracion
    };

    $.ajax({
      type: "POST",
      url: "php/nuevaResena.php",
      data: datos,
      success: function (resultado) {
        if (resultado == "correct") {
          var modalHtml = `<div class="modal fade" id="modalFormCorrect" tabindex="-1" aria-labelledby="modalForm" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="modalForm">Reseña de reforma</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
              <p class="mb-0">La reseña se ha añadido correctamente. <br>¡Gracias por tu valoración!</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-success" data-bs-dismiss="modal">Aceptar</button>
              </div>
            </div>
          </div>
        </div>`;
      
          $('#modalContainer').html(modalHtml);
      
          // Mostrar el modal
          $('#modalFormCorrect').modal('show');
      
          $('#modalFormCorrect').on('hidden.bs.modal', function () {
            $('#modalContainer').empty();
          });

          historialReformasUsuario(paginaActual);
        } else {
          var modalHtml = `<div class="modal fade" id="modalFormCorrect" tabindex="-1" aria-labelledby="modalForm" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="modalForm">Error</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
              <p class="mb-0">Error al enviar la reseña. Inténtelo de nuevo.</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-success" data-bs-dismiss="modal">Aceptar</button>
              </div>
            </div>
          </div>
        </div>`;
      
          $('#modalContainer').html(modalHtml);
      
          // Mostrar el modal
          $('#modalFormCorrect').modal('show');
      
          $('#modalFormCorrect').on('hidden.bs.modal', function () {
            $('#modalContainer').empty();
          });
          }
      },
      error: function () {
        alert("Ha habido un error: nuevaReseña.php.");
      },
    });
  });

  $(document).on("click", "#pagAnteriorHistorialCliente", function (event) {
    event.preventDefault();
    if (paginaActual > 1) {
        paginaActual--;
        historialReformasUsuario(paginaActual);
    }
});

$(document).on("click", "#pagSiguienteHistorialCliente", function (event) {
    event.preventDefault();
    paginaActual++;
    historialReformasUsuario(paginaActual);
});

  function historialReformasUsuario(pagina) {
    var datos = {
      id_usuario: id_usuario,
      pagina: pagina,
    }
    $.ajax({
      type: "GET",
      url: "php/getReformasSolicitadasCliente.php",
      data: datos,
      success: function (resultado) {
        var respuesta = JSON.parse(resultado);
        var historial = respuesta.datos;
        var paginaActual = parseInt(respuesta.pagina_actual);
        var totalPaginas = parseInt(respuesta.total_paginas);
        if (historial.length == 0) {
          $('<p class="pReformasInfo text-lg-start text-center">No ha solicitado ninguna reforma.</p>').appendTo("#divClienteOpciones");
        } else {
          $("#divClienteOpciones").empty();
          $('<h2 class="h2Cliente text-lg-start text-center">Historial de reformas solicitadas</h2>').appendTo("#divClienteOpciones");
          crearTablaHistorial();
          for (var reformaHistorial of historial) {
            vistaHistorialReformas(reformaHistorial);
          }
        }

        if (paginaActual == 1) {
          $("#liPagAnteriorHistorialCliente").addClass("disabled");
      } else {
          $("#liPagAnteriorHistorialCliente").removeClass("disabled");
      }

      if (paginaActual == totalPaginas) {
          $("#liPagSiguienteHistorialCliente").addClass("disabled");
      } else {
          $("#liPagSiguienteHistorialCliente").removeClass("disabled");
      }
      },
      error: function () {
        alert("Ha habido un error al iniciar sesión: getReformasSolicitadasCliente.php.");
      },
    });
  }

  function mostrarReformasActuales() {
    $("#divClienteOpciones").empty();
    $('<h2 class="h2Cliente text-lg-start text-center">Reformas en curso</h2>').appendTo("#divClienteOpciones");
    var datos = {
      id_usuario: id_usuario
    }
    $.ajax({
      type: "GET",
      url: "php/getReformasActualesClientes.php",
      data: datos,
      success: function (resultado) {
        var reformaActual = JSON.parse(resultado);
        if (reformaActual.length == 0) {
          $('<p class="pReformasInfo text-lg-start text-center">Actualmente no hay reformas en curso. Solicita una reforma para ver la información aquí.</p>').appendTo("#divClienteOpciones");
        } else {
          for (var reforma of reformaActual) {
            vistaReformasActuales(reforma);
          }
        }
      },
      error: function () {
        alert("Ha habido un error al iniciar sesión: getReformasActualesClientes.php.");
      },
    });
  }

  function vistaReformasActuales(reforma) {
    $('<div class="divReformasCliente table-responsive-mobile text-center d-md-flex justify-content-center align-items-center flex-column mb-5">' +
      '<h3>Reforma ' + reforma.id_reforma + '</h3>' +
      '<table class="table">' +
      '<thead>' +
      '<tr>' +
      '<th scope="col">Jefe a cargo</th>' +
      '<th scope="col">Zona de reforma</th>' +
      '<th scope="col">Tipo de reforma</th>' +
      '<th scope="col">Metros cuadrados</th>' +
      '<th scope="col">Precio aproximado</th><th scope="col">Fecha de inicio</th><th scope="col">Fecha de finalización</th></tr>' +
      '</thead>' +
      '<tbody>' +
      '<tr>' +
      '<td>' + reforma.nombre_completo_jefe + '</td>' +
      '<td>' + reforma.nombre_zona + '</td>' +
      '<td>' + reforma.nombre_proyecto + '</td>' +
      '<td>' + reforma.cantidad_metros + '</td>' +
      '<td>' + reforma.precio_aprox + '€</td>' +
      '<td>' + reforma.fecha_inicio + '</td>' +
      '<td>' + reforma.fecha_finalizacion + '</td>' +
      '</tr>' +
      '</tbody>' +
      '</table>' +
      '</div>').appendTo("#divClienteOpciones");
  }

  function crearTablaHistorial() {
    $('<div class="divReformasCliente text-center table-responsive-mobile d-md-flex justify-content-center align-items-center flex-column mb-5">' +
      '<table class="table">' +
      '<thead>' +
      '<tr>' +
      '<th scope="col">¿Reforma aprobada?</th>' +
      '<th scope="col">Jefe a cargo</th>' +
      '<th scope="col">Zona de reforma</th>' +
      '<th scope="col">Tipo de reforma</th>' +
      '<th scope="col">Metros cuadrados</th>' +
      '<th scope="col">Precio aproximado</th><th scope="col">Fecha de inicio</th><th scope="col">Fecha de finalización</th><th scope="col">¿Solicitud finalizada?</th><th scope="col">Valorar reforma</th></tr>' +
      '</thead>' +
      '<tbody id="historialTabla" class="align-middle">' +
      '</tbody>' +
      '</table>' +
      '</div>').appendTo("#divClienteOpciones");

      $(`<nav aria-label="Paginacion mostrar historial" class="mb-5">
      <ul class="pagination justify-content-center pagination-lg">
        <li class="page-item" id="liPagAnteriorHistorialCliente">
          <button class="page-link" id="pagAnteriorHistorialCliente"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill" viewBox="0 0 16 16">
          <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
        </svg></button>
        </li>
        <li class="page-item" id="liPagSiguienteHistorialCliente">
          <button class="page-link" id="pagSiguienteHistorialCliente"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
          <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
        </svg></button>
        </li>
      </ul>
      </nav>`).appendTo("#divClienteOpciones");
  }

  function vistaHistorialReformas(reforma) {
    var nomJefe = reforma.nombre_completo_jefe;
    var isAprobado = "";
    if (reforma.nombre_completo_jefe == null) {
      nomJefe = "No se asignó jefe";
    }

    if (reforma.reforma_aprobada == 1) {
      isAprobado = "Aprobada";
    } else if (reforma.reforma_aprobada == 0) {
      isAprobado = "No aprobada";
    } else {
      isAprobado = "Pendiente de aprobar";
    }

    var finalizado = "";
    if (reforma.finalizado == 1) {
      finalizado = "Sí";
    } else {
      finalizado = "No";
    }
    var buttonValorar = "";
    if (reforma.reforma_aprobada == 1 && reforma.finalizado == 1 && reforma.id_reseña == null) {
      buttonValorar = '<button class="btn btn-success btnValorar" value="' + reforma.id_reforma + '" data-bs-toggle="modal" data-bs-target="#modalFormValoracion">Valorar</button>';
    } else {
      buttonValorar = '<button class="btn btn-success" disabled>Valorar</button>';
    }

    $('<tr>' +
      '<td>' + isAprobado + '</td>' +
      '<td>' + nomJefe + '</td>' +
      '<td>' + reforma.nombre_zona + '</td>' +
      '<td>' + reforma.nombre_proyecto + '</td>' +
      '<td>' + reforma.cantidad_metros + '</td>' +
      '<td>' + reforma.precio_aprox + '€</td>' +
      '<td>' + reforma.fecha_inicio + '</td>' +
      '<td>' + reforma.fecha_finalizacion + '</td>' +
      '<td>' + finalizado + '</td>' +
      '<td>' + buttonValorar + '</td>' +
      '</tr>').appendTo("#historialTabla");
  }
});