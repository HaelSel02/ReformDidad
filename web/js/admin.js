$(document).ready(function () {
  checkSession();
  verSolicitudesReforma();
  var paginaActual = 1;
  var ordenActual;
  var filtroActual;


  $(document).on("click", ".aceptarSolicitud", function () {
    var idSolicitud = $(this).val();
    var jefeSeleccionado = $("select[data-solicitud='" + idSolicitud + "']").val();
    var fechaInicioSeleccionada = $("input[data-solicitud='" + idSolicitud + "']").val();
    var textoDescripcion = $("textarea[data-solicitud='" + idSolicitud + "']").val();
    var seleccionAdmin = "true";
    var datos = {
      idSolicitud: idSolicitud,
      jefeSeleccionado: jefeSeleccionado,
      fechaSeleccionada: fechaInicioSeleccionada,
      seleccionAdmin: seleccionAdmin,
      textoDescripcion: textoDescripcion
    }

    if (jefeSeleccionado == null || fechaInicioSeleccionada == "" || textoDescripcion == "") {
      $("#divError" + idSolicitud).removeClass("d-none");
      $("#divError" + idSolicitud).addClass("d-flex");
    } else {
      $.ajax({
        type: "POST",
        url: "php/updateSolicitudesAdmin.php",
        data: datos,
        success: function (resultado) {
          if (resultado == "true") {
            $("#collapse" + idSolicitud).html('<div class="accordion-body"><div class="mt-2 d-flex justify-content-center"><h4>Solicitud aceptada. La solicitud se eliminará de esta vista al actualizar la página.</h4></div></div>');
            mostrarCalendario();
          } else {
            $("#collapse" + idSolicitud).html('<div class="accordion-body"><div class="mt-2 d-flex justify-content-center"><h4>Error al aceptar solicitud. Recarga la página para intentar solucionarlo.</h4></div></div>');
          }
        },
        error: function () {
          alert("Ha habido un error: updateSolicitudesAdmin.php.");
        },
      });
    }
  });

  $(document).on("click", ".cancelarSolicitud", function () {
    var idSolicitud = $(this).val();
    var modalHtml = `<div class="modal fade" id="dialogSolicitud` + idSolicitud + `" aria-labelledby="dialogoNum` + idSolicitud + `" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="dialogoNum`+ idSolicitud + `">Cancelar solicitud</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="mb-0">¿Deseas cancelar la solicitud con ID: #`+ idSolicitud + `? <br>Puedes volver a restaurarla al editar la solicitud en la vista de todas las reformas.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success btnCancelarDefinitivo" value="`+ idSolicitud + `" data-bs-dismiss="modal">Aceptar</button>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Volver</button>
                </div>
            </div>
        </div>
    </div>`;

    // Agregar el modal al contenedor
    $('#modalContainer').html(modalHtml);

    // Mostrar el modal
    $('#dialogSolicitud' + idSolicitud).modal('show');

    $('#dialogSolicitud' + idSolicitud).on('hidden.bs.modal', function () {
      $('#modalContainer').empty();
    });
  });

  $(document).on("click", ".btnCancelarDefinitivo", function () {
    var idSolicitud = $(this).val();
    var jefeSeleccionado = $("select[data-solicitud='" + idSolicitud + "']").val();
    var fechaInicioSeleccionada = $("input[data-solicitud='" + idSolicitud + "']").val();
    var textoDescripcion = $("textarea[data-solicitud='" + idSolicitud + "']").val();
    var seleccionAdmin = "false";
    var datos = {
      idSolicitud: idSolicitud,
      jefeSeleccionado: jefeSeleccionado,
      fechaSeleccionada: fechaInicioSeleccionada,
      seleccionAdmin: seleccionAdmin,
      textoDescripcion: textoDescripcion
    }

    $.ajax({
      type: "POST",
      url: "php/updateSolicitudesAdmin.php",
      data: datos,
      success: function (resultado) {
        if (resultado == "false") {
          $("#collapse" + idSolicitud).html('<div class="accordion-body"><div class="mt-2 d-flex justify-content-center"><h4>Solicitud cancelada. La solicitud se eliminará de esta vista al actualizar la página.</h4></div></div>');
        } else {
          $("#collapse" + idSolicitud).html('<div class="accordion-body"><div class="mt-2 d-flex justify-content-center"><h4>Error al cancelar solicitud. Recarga la página para intentar solucionarlo.</h4></div></div>');
        }
      },
      error: function () {
        alert("Ha habido un error: updateSolicitudesAdmin.php.");
      },
    });
  });

  $(document).on("change", ".seleccionesAdmin", function () {
    var idSolicitud = $(this).data("solicitud");
    $("#divError" + idSolicitud).removeClass("d-flex");
    $("#divError" + idSolicitud).addClass("d-none");
  })

  $(document).on("click", ".seleccionFecha", function () {
    var idSolicitud = $(this).data("solicitud");
    $("#divError" + idSolicitud).removeClass("d-flex");
    $("#divError" + idSolicitud).addClass("d-none");
  });

  $(document).on("input", ".descAdmin", function () {
    var idSolicitud = $(this).data("solicitud");
    $("#divError" + idSolicitud).removeClass("d-flex");
    $("#divError" + idSolicitud).addClass("d-none");
  });

  $("#verTodasReformas").click(function () {
    $("#divSeccionesAdmin").empty();
    paginaActual = 1;
    ordenActual = "Proyecto_reforma.id_reforma DESC";
    filtroActual = 0;
    verTodasReformas();
  });

  $("#verSolicitudesReformas").click(function () {
    $("#divSeccionesAdmin").empty();
    paginaActual = 1;
    verSolicitudesReforma();
  });

  $("#verTodosClientes").click(function () {
    $("#divSeccionesAdmin").empty();
    paginaActual = 1;
    ordenActual = "Usuarios.id_usuario DESC";
    verClientesReforma();
  });

  $("#verTodosEmpleados").click(function () {
    $("#divSeccionesAdmin").empty();
    paginaActual = 1;
    ordenActual = "Empleados.id_empleado DESC";
    verEmpleadosReforma();
  });

  $("#verTodosJefes").click(function () {
    $("#divSeccionesAdmin").empty();
    paginaActual = 1;
    ordenActual = "Jefes.id_jefe DESC";
    verJefesReforma();
  });

  $("#verReseñasPorAprobar").click(function () {
    $("#divSeccionesAdmin").empty();
    paginaActual = 1;
    verReseñasAprobar();
  });

  $(document).on("change", "#estadoSoli", function () {
    if ($(this).val() == 0) {
      $("#finalizacionSolicitud").val(1);
      $('#finalizacionSolicitud option[value="0"]').prop('disabled', true);
      $('#finalizacionSolicitud option[value="1"]').prop('disabled', false);
    } else if ($(this).val() == 2) {
      $("#finalizacionSolicitud").val(0);
      $('#finalizacionSolicitud option[value="0"]').prop('disabled', false);
      $('#finalizacionSolicitud option[value="1"]').prop('disabled', true);
    } else {
      $("#finalizacionSolicitud").val(0);
      $('#finalizacionSolicitud option[value="0"]').prop('disabled', false);
      $('#finalizacionSolicitud option[value="1"]').prop('disabled', false);
    }
  });

  $(document).on("click", ".editarSolicitudReforma", function () {
    $("#divBotonForm").empty()
    $("#txtButtonForm").empty();
    $("#divBotonForm").append('<button id="btnEnviarDatos" class="btn btn-outline-success mb-3">Enviar datos</button><button id="btnCancelarEdicion" class="btn btn-outline-danger mb-3 ms-3">Cancelar edición</button>');
    var idReforma = $(this).val();
    var datos = {
      id_reforma: idReforma
    };

    $('#checkboxEliminarImgAntes').prop('disabled', false);
    $('#checkboxEliminarImgDespues').prop('disabled', false);
    $('#fotoAntesReforma').prop('disabled', false);
    $('#fotoDespuesReforma').prop('disabled', false);
    $.ajax({
      type: "GET",
      url: "php/mostrarReformaEditar.php",
      data: datos,
      success: function (resultado) {
        var reforma = JSON.parse(resultado);
        if (reforma[0].reforma_aprobada == null) {
          $("#estadoSoli").val("2");
        } else {
          $("#estadoSoli").val(reforma[0].reforma_aprobada);
        }

        if (reforma[0].reforma_aprobada == 0) {
          $("#finalizacionSolicitud").val(1);
          $('#finalizacionSolicitud option[value="0"]').prop('disabled', true);
          $('#finalizacionSolicitud option[value="1"]').prop('disabled', false);
        } else if (reforma[0].reforma_aprobada == null) {
          $("#finalizacionSolicitud").val(0);
          $('#finalizacionSolicitud option[value="0"]').prop('disabled', false);
          $('#finalizacionSolicitud option[value="1"]').prop('disabled', true);
        } else {
          $("#finalizacionSolicitud").val(0);
          $('#finalizacionSolicitud option[value="0"]').prop('disabled', false);
          $('#finalizacionSolicitud option[value="1"]').prop('disabled', false);
        }

        $("#usuarioSoli").val(reforma[0].usuario_solicitante);
        $("#selecZonaReforma").val(reforma[0].zona_reforma);
        $("#selecTipoReforma").val(reforma[0].tipo_reforma);
        $("#selecMetrosReforma").val(reforma[0].metros_aprox_reforma);
        $("#selecJefeReforma").val(reforma[0].jefe_seleccionado);
        $("#finalizacionSolicitud").val(reforma[0].finalizado);
        $("#fechaInicioReforma").val(reforma[0].fecha_inicio);
        $("#fechaFinalizacionReforma").val(reforma[0].fecha_finalizacion);
        $("#descReforma").val(reforma[0].descripcion_reforma);
        $("#precioReforma").val(reforma[0].precio_aprox);
        $("#nombreImgAntes").val(reforma[0].foto_antes);
        $("#nombreImgDespues").val(reforma[0].foto_despues);
        $("#btnEnviarDatos").val(reforma[0].id_reforma);
        $("#btnEnviarDatos").text("Editar datos");
        $("#btnEnviarDatos").attr({ id: "editarReforma" }); //pasa a ser #editarReforma


        var fechaInicio = $("#fechaInicioReforma").val();
        var fechaInicioInput = $('#fechaInicioReforma');
        var fechaFinalizacion = $("#fechaFinalizacionReforma").val();
        var fechaFinalizacionInput = $('#fechaFinalizacionReforma');

        if ((reforma[0].fecha_inicio != null) && (reforma[0].fecha_finalizacion != null)) {
          var fechaInicioDate = new Date(fechaInicio);
          // Establecer la fecha mínima como 2 días después de la fecha de inicio
          fechaInicioDate.setDate(fechaInicioDate.getDate() + 2);
          var fechaMinima = fechaInicioDate.toISOString().split('T')[0];

          // Habilitar el campo de fecha de finalización y establecer la fecha mínima
          fechaFinalizacionInput.prop('disabled', false);
          fechaFinalizacionInput.attr('min', fechaMinima);

          var fechaFinalizacionDate = new Date(fechaFinalizacion);
          fechaFinalizacionDate.setDate(fechaFinalizacionDate.getDate() - 2);

          var fechaMaxima = fechaFinalizacionDate.toISOString().split('T')[0];
          // Establecer la fecha máxima para el input de fecha de inicio
          fechaInicioInput.prop('max', fechaMaxima);
        } else if (reforma[0].fecha_inicio != null) {
          // Convertir la cadena de fecha en un objeto Date          
          fechaInicioInput.removeAttr("max");

          var fechaInicioDate = new Date(fechaInicio);
          // Establecer la fecha mínima como 2 días después de la fecha de inicio
          fechaInicioDate.setDate(fechaInicioDate.getDate() + 2);
          var fechaMinima = fechaInicioDate.toISOString().split('T')[0];

          // Habilitar el campo de fecha de finalización y establecer la fecha mínima
          fechaFinalizacionInput.prop('disabled', false);
          fechaFinalizacionInput.attr('min', fechaMinima);
        } else {
          fechaInicioInput.removeAttr("max");
          fechaFinalizacionInput.prop('disabled', true);
        }

        var id_usuario = reforma[0].usuario_solicitante;

        var datosUsuario = {
          id_usuario: id_usuario,
        }

        $.ajax({
          type: "GET",
          url: "php/getCantidadReformasCliente.php",
          data: datosUsuario,
          success: function (resultadoCantidad) {
            if (resultadoCantidad == "true" && reforma[0].reforma_aprobada == 0) {
              $('#estadoSoli option[value="1"]').prop('disabled', true);
              $('#estadoSoli option[value="2"]').prop('disabled', true);
            } else {
              $('#estadoSoli option[value="1"]').prop('disabled', false);
              $('#estadoSoli option[value="2"]').prop('disabled', false);
            }
          },
          error: function () {
            alert("Ha habido un error: getCantidadReformasCliente.php.");
          },
        });

      },
      error: function () {
        alert("Ha habido un error: mostrarReformaEditar.php.");
      },
    });

  });

  $(document).on("click", "#editarReforma", function (event) {
    $("#txtButtonForm").empty();
    var idReforma = $(this).val();
    event.preventDefault();
    var precioReforma = $("#precioReforma").val();
    var descripcionReforma = $("#descReforma").val();
    var fechaInicioReforma = $("#fechaInicioReforma").val();
    var estadoSolicitud = $("#estadoSoli").val();

    if (estadoSolicitud == 1) {
      if (precioReforma == "" || descripcionReforma == "" || fechaInicioReforma == "") {
        $("<p class='error mb-0'>Hay algunos campos vacíos, rellénalos.</p>").appendTo("#txtButtonForm");
      } else {
        var precio = parseFloat($("#precioReforma").val());
        //var datos_edit_reforma = $("#formTodasReformas").serialize(); // Crea un objeto FormData con los datos del formulario
        var datos_edit_reforma = new FormData($("#formTodasReformas")[0]);
        datos_edit_reforma.append('precioReforma', precio);
        $.ajax({
          type: 'POST',
          url: 'php/editarReforma.php?id_reforma=' + idReforma,
          data: datos_edit_reforma,
          processData: false,
          contentType: false,
          success: function (resultado) {
            if (resultado == "correct") {
              $("#divSeccionesAdmin").empty();
              verTodasReformas();
              mostrarCalendario();
              $("<p class='success mb-0'>Reforma editada correctamente.</p>").appendTo("#txtButtonForm");
            } else {
              $("<p class='success mb-0'>" + resultado + "</p>").appendTo("#txtButtonForm");
            }
          },
          error: function () {
            alert("Ha habido un error: editarReforma.php.");
          }
        });
      }
    } else {
      if (precioReforma == "") {
        $("<p class='error mb-0'>Hay algunos campos vacíos, rellénalos.</p>").appendTo("#txtButtonForm");
      } else {
        var precio = parseFloat($("#precioReforma").val());
        var datos_edit_reforma = new FormData($("#formTodasReformas")[0]);
        datos_edit_reforma.append('precioReforma', precio);
        $.ajax({
          type: 'POST',
          url: 'php/editarReforma.php?id_reforma=' + idReforma,
          data: datos_edit_reforma,
          processData: false,
          contentType: false,
          success: function (resultado) {
            if (resultado == "correct") {
              $("#divSeccionesAdmin").empty();
              verTodasReformas();
              mostrarCalendario();
              $("<p class='success mb-0'>Reforma editada correctamente.</p>").appendTo("#txtButtonForm");
            } else {
              $("<p class='error mb-0'>" + resultado + "</p>").appendTo("#txtButtonForm");
            }
          },
          error: function () {
            alert("Ha habido un error: editarReforma.php.");
          }
        });
      }
    }
  });

  $(document).on("click", "#btnCancelarEdicion", function (event) {
    event.preventDefault();
    $("#divSeccionesAdmin").empty();
    verTodasReformas();
  });

  $(document).on("click", "#btnEnviarDatos", function (event) {
    event.preventDefault();
    $("#txtButtonForm").empty();
    var precioReforma = $("#precioReforma").val();
    var descripcionReforma = $("#descReforma").val();
    var fechaInicioReforma = $("#fechaInicioReforma").val();
    var estadoSolicitud = $("#estadoSoli").val();
    var zonaReforma = $("#selecZonaReforma").val();
    var tipoReforma = $("#selecTipoReforma").val();
    var metrosReforma = $("#selecMetrosReforma").val();
    var jefeReforma = $("#selecJefeReforma").val();
    var usuarioReforma = $("#usuarioSoli").val();
    if (estadoSolicitud == null) {
      $("<p class='error mb-0'>Debes seleccionar un estado de solicitud.</p>").appendTo("#txtButtonForm");
    } else if (estadoSolicitud == 1) {
      if (precioReforma == "" || descripcionReforma == "" || fechaInicioReforma == "" || zonaReforma == null || tipoReforma == null || metrosReforma == null || jefeReforma == null || usuarioReforma == null) {
        $("<p class='error mb-0'>Hay algunos campos vacíos, rellénalos.</p>").appendTo("#txtButtonForm");
      } else {
        var precio = parseFloat($("#precioReforma").val());
        var datos_nueva_reforma = new FormData($("#formTodasReformas")[0]);
        datos_nueva_reforma.append('precioReforma', precio);
        $.ajax({
          type: 'POST',
          url: 'php/nuevaReformaForm.php',
          data: datos_nueva_reforma,
          processData: false,
          contentType: false,
          success: function (resultado) {
            if (resultado == "correct") {
              $("#divSeccionesAdmin").empty();
              verTodasReformas();
              mostrarCalendario();
              $("<p class='success mb-0'>Solicitud de reforma creada correctamente.</p>").appendTo("#txtButtonForm");
            } else if (resultado == "errorLimit") {
              $("<p class='success mb-0'>Error. El usuario ha alcanzado el límite de solicitudes en curso.</p>").appendTo("#txtButtonForm");
            }
          },
          error: function () {
            alert("Ha habido un error: nuevaReformaForm.php.");
          }
        });
      }
    } else {
      if (precioReforma == "" || zonaReforma == null || tipoReforma == null || metrosReforma == null || usuarioReforma == null) {
        $("<p class='error mb-0'>Hay algunos campos vacíos, rellénalos.</p>").appendTo("#txtButtonForm");
      } else {
        var precio = parseFloat($("#precioReforma").val());
        var datos_nueva_reforma = new FormData($("#formTodasReformas")[0]);
        datos_nueva_reforma.append('precioReforma', precio);
        $.ajax({
          type: 'POST',
          url: 'php/nuevaReformaForm.php',
          data: datos_nueva_reforma,
          processData: false,
          contentType: false,
          success: function (resultado) {
            console.log(resultado);
            if (resultado == "correct") {
              $("#divSeccionesAdmin").empty();
              verTodasReformas();
              mostrarCalendario();
              $("<p class='success mb-0'>Solicitud de reforma creada correctamente.</p>").appendTo("#txtButtonForm");
            } else if (resultado == "errorLimit") {
              $("<p class='error mb-0'>Error. El usuario ha alcanzado el límite de solicitudes en curso.</p>").appendTo("#txtButtonForm");
            }
          },
          error: function () {
            alert("Ha habido un error: nuevaReformaForm.php.");
          }
        });
      }
    }
  });

  $(document).on("change", "#fotoAntesReforma", function () {
    if (this.files.length > 0) {
      // Si contiene archivos subidos, deshabilitar el checkbox
      $('#checkboxEliminarImgAntes').prop('disabled', true);
    } else {
      // Si no contiene archivos subidos, habilitar el checkbox
      $('#checkboxEliminarImgAntes').prop('disabled', false);
    }
  });

  $(document).on("change", "#checkboxEliminarImgAntes", function () {
    if ($(this).is(':checked')) {
      // Si está marcado, deshabilitar el input file
      $('#fotoAntesReforma').prop('disabled', true);
    } else {
      // Si no está marcado, habilitar el input file
      $('#fotoAntesReforma').prop('disabled', false);
    }
  });

  $(document).on("change", "#fotoDespuesReforma", function () {
    if (this.files.length > 0) {
      // Si contiene archivos subidos, deshabilitar el checkbox
      $('#checkboxEliminarImgDespues').prop('disabled', true);
    } else {
      // Si no contiene archivos subidos, habilitar el checkbox
      $('#checkboxEliminarImgDespues').prop('disabled', false);
    }
  });

  $(document).on("change", "#checkboxEliminarImgDespues", function () {
    if ($(this).is(':checked')) {
      // Si está marcado, deshabilitar el input file
      $('#fotoDespuesReforma').prop('disabled', true);
    } else {
      // Si no está marcado, habilitar el input file
      $('#fotoDespuesReforma').prop('disabled', false);
    }
  });

  $(document).on("change", "#fechaInicioReforma", function () {
    var fechaInicio = $(this).val();
    var fechaFinalizacionInput = $('#fechaFinalizacionReforma');
    var fechaFinalizacion = new Date(fechaInicio);

    // Establecer la fecha mínima como 2 días después de la fecha de inicio
    fechaFinalizacion.setDate(fechaFinalizacion.getDate() + 2);
    var fechaMinima = fechaFinalizacion.toISOString().split('T')[0];

    // Habilitar el campo de fecha de finalización y establecer la fecha mínima
    fechaFinalizacionInput.prop('disabled', false);
    fechaFinalizacionInput.attr('min', fechaMinima);
  });


  $(document).on("change", "#fechaFinalizacionReforma", function () {
    var fechaFinalizacion = new Date($(this).val());
    fechaFinalizacion.setDate(fechaFinalizacion.getDate() - 2);

    var fechaMaxima = fechaFinalizacion.toISOString().split('T')[0];
    var fechaInicioInput = $('#fechaInicioReforma');

    // Establecer la fecha máxima para el input de fecha de inicio
    fechaInicioInput.prop('max', fechaMaxima);
  });

  $(document).on("focusout", "#precioReforma", function () {
    // Obtener el valor actual del campo de precio
    var precio = $(this).val();

    // Convertir el valor a un número decimal
    var precioDecimal = parseFloat(precio);

    // Validar si el valor es negativo o no es un número y corregirlo
    if (isNaN(precioDecimal) || precioDecimal < 0) {
      $(this).val("1000.00");
      return;
    }

    // Limitar el mínimo a 1000
    if (precioDecimal < 1000) {
      $(this).val("1000.00");
      return;
    }

    // Limitar el número de decimales a 2 como máximo y agregar ".00" automáticamente
    precioDecimal = parseFloat(precioDecimal.toFixed(2));

    // Actualizar el valor del campo de precio
    $(this).val(precioDecimal.toString() + (precio.indexOf(".") === -1 ? ".00" : ""));
  });

  $(document).on("click", ".eliminarSolicitudReforma", function () {
    var idReforma = $(this).val();

    var modalHtml = `<div class="modal fade" id="dialogEliminarReforma` + idReforma + `" aria-labelledby="dialogoReform` + idReforma + `" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="dialogoReform`+ idReforma + `">Eliminar solicitud de reforma</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p class="mb-0">¿Deseas eliminar la solicitud de reforma con ID: #`+ idReforma + `?<br>Se eliminará toda la información de la reforma, así como imágenes que estén vinculadas.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success btnEliminarReforma" value="`+ idReforma + `" data-bs-dismiss="modal">Aceptar</button>
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>
</div>`;

    // Agregar el modal al contenedor
    $('#modalContainer').html(modalHtml);

    // Mostrar el modal
    $('#dialogEliminarReforma' + idReforma).modal('show');

    $('#dialogEliminarReforma' + idReforma).on('hidden.bs.modal', function () {
      $('#modalContainer').empty();
    });
  });

  $(document).on("click", ".btnEliminarReforma", function () {
    var idEliminarReforma = $(this).val();
    $.ajax({
      type: "GET",
      url: "php/deleteReformaAdmin.php",
      data: {
        idReforma: idEliminarReforma,
      },
      success: function (resultado) {
        if (resultado == "true") {
          var modalHtml = `<div class="modal fade" id="dialogReformaEliminada` + idEliminarReforma + `" aria-labelledby="dialogoReform` + idEliminarReforma + `" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h1 class="modal-title fs-5" id="dialogoReform`+ idEliminarReforma + `">Reforma eliminada</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <p class="mb-0">La reforma con ID: #`+ idEliminarReforma + ` ha sido eliminada.</p>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-success" data-bs-dismiss="modal">Aceptar</button>
                  </div>
              </div>
          </div>
      </div>`;

          // Agregar el modal al contenedor
          $('#modalContainer').html(modalHtml);

          // Mostrar el modal
          $('#dialogReformaEliminada' + idEliminarReforma).modal('show');

          $('#dialogReformaEliminada' + idEliminarReforma).on('hidden.bs.modal', function () {
            $('#modalContainer').empty();
          });

          $("#divSeccionesAdmin").empty();
          verTodasReformas();
          mostrarCalendario();
        } else {
          var modalHtml = `<div class="modal fade" id="dialogReformaError" aria-labelledby="dialogoReform` + idEliminarReforma + `" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h1 class="modal-title fs-5" id="dialogoReform`+ idEliminarReforma + `">Error</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <p class="mb-0">Error. Inténtelo de nuevo.</p>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-success" data-bs-dismiss="modal">Aceptar</button>
                  </div>
              </div>
          </div>
      </div>`;

          // Agregar el modal al contenedor
          $('#modalContainer').html(modalHtml);

          // Mostrar el modal
          $('#dialogReformaError').modal('show');

          $('#dialogReformaError').on('hidden.bs.modal', function () {
            $('#modalContainer').empty();
          });
        }
      },
      error: function () {
        alert("Ha habido un error: deleteReformaAdmin.php.");
      },
    });
  });

  $(document).on("click", ".pdfSolicitudReforma", function(event) {
    event.preventDefault();
    var idReforma = $(this).val();
    $.ajax({
      type: 'GET',
      url: 'php/mostrarReformaPDF.php',
      data: {idReforma: idReforma},
      dataType: 'json', 
      success: function (resultado) {
        if (resultado.message == "correct") {
          var modalHtml = `<div class="modal fade" id="dialogPDFGenerado" aria-labelledby="dialogPDFGenerado" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h1 class="modal-title fs-5" id="dialogPDFGenerado">Generador de PDF de la reforma #${idReforma}</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <p class="mb-0">El reporte de la reforma con ID: ${idReforma} ha sido creado correctamente.<br>¿Deseas revisar el PDF generado?</p>
                  </div>
                  <div class="modal-footer">
                      <a href="${resultado.file_path}" target="_blank"><button type="button" class="btn btn-success">Aceptar</button></a>
                      <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
                  </div>
              </div>
          </div>
      </div>`;
      
          // Agregar el modal al contenedor
          $('#modalContainer').html(modalHtml);
      
          // Mostrar el modal
          $('#dialogPDFGenerado').modal('show');
      
          $('#dialogPDFGenerado').on('hidden.bs.modal', function () {
            $('#modalContainer').empty();
          });
        } else {
          var modalHtml = `<div class="modal fade" id="dialogPDFGenerado" aria-labelledby="dialogPDFGenerado" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h1 class="modal-title fs-5" id="dialogPDFGenerado">Generador de PDF de la reforma #${idReforma}</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <p class="mb-0">Error. ${resultado.message}</p>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-success" data-bs-dismiss="modal">Aceptar</button>
                  </div>
              </div>
          </div>
      </div>`;
      
          // Agregar el modal al contenedor
          $('#modalContainer').html(modalHtml);
      
          // Mostrar el modal
          $('#dialogPDFGenerado').modal('show');
      
          $('#dialogPDFGenerado').on('hidden.bs.modal', function () {
            $('#modalContainer').empty();
          });
        }
      },
      error: function () {
        alert("Ha habido un error: mostrarReformaPDF.php.");
      }
    });
  });

  var validateUserCliente = false;
  var validateEmailCliente = false;
  var validateTelefonoCliente = false;
  var validatePassCliente = false;
  var validateDNICliente = false;
  var validateRepassCliente = false;

  $(document).on("input", "#usuarioForm", function () {
    $("#divUsuarioClienteForm").empty();
    var longitud = $(this).val().length;
    var minLength = 4
    var maxLength = 20;
    $("#txtButtonFormCliente").empty();

    if (longitud < minLength) {
      $("<p class='error'>La longitud mínima de nombre de usuario es de " + minLength + " carácteres</p>").appendTo("#divUsuarioClienteForm");
      validateUserCliente = false;
    } else if (longitud > maxLength) {
      $("<p class='error'>La longitud máxima de nombre de usuario es de " + maxLength + " carácteres</p>").appendTo("#divUsuarioClienteForm");
      validateUserCliente = false;
    } else {
      validateUserCliente = true;
    }

    var username = $(this).val().trim();
    $(this).val(username.replace(/\s+/g, ''));
  });

  $(document).on("input", "#dniUsuario", function () {
    $("#txtButtonFormCliente").empty();
    $("#divDNIClienteForm").empty();

    var dni = $(this).val().trim();
    var regex = /^[XYZ]?\d{7,8}[A-Z]$/;

    if (!regex.test(dni)) {
      $("<p class='error'>El campo DNI / NIE no tiene el formato válido.</p>").appendTo("#divDNIClienteForm");
      validateDNICliente = false;
    } else {
      validateDNICliente = true;
    }
  });

  $(document).on('input', '#telUsuario', function () {
    var tlf = $(this).val();
    if (!validatePhone(tlf)) {
      $(this).val(tlf.slice(0, -1));
    }
    $("#txtButtonFormCliente").empty();
    if ($(this).val().length > 9) {
      $(this).val($(this).val().slice(0, 9));
    }
  });

  function validatePhone(telefono) {
    var regex = /^[0-9]+$/;
    return regex.test(telefono);
  }

  $(document).on("focusout", "#telUsuario", function () {
    $("#divTelClienteForm").empty();
    if ($("#telUsuario").val() == "") {
      validateTelefonoCliente = false;
      $(
        "<p class='error'>El campo no debe estar vacío.</p>"
      ).appendTo("#divTelClienteForm");
    } else if ($(this).val().length < 9) {
      validateTelefonoCliente = false;
      $(
        "<p class='error'>El número de teléfono debe contener nueve dígitos.</p>"
      ).appendTo("#divTelClienteForm");
    } else {
      validateTelefonoCliente = true;
    }
  });

  $(document).on("focusout", "#emailUsuario", function () {
    $("#txtButtonFormCliente").empty();
    $("#divEmailClienteForm").empty();
    var email = $("#emailUsuario").val();
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (regex.test(email)) {
      $("#divEmailClienteForm").empty();
      validateEmailCliente = true;
    } else if (email == "") {
      $("#divEmailClienteForm").empty();
      validateEmailCliente = false;
    } else {
      $(
        "<p class='error'>Dirección de correo electrónico no válida.</p>"
      ).appendTo("#divEmailClienteForm");
      validateEmailCliente = false;
    }
  });

  $(document).on("input", "#passUsuario", function () {
    $("#txtButtonFormCliente").empty();
    $("#divPassClienteForm").empty();
    var regex =
      /^(?=.*[a-zñç])(?=.*[A-Zñç])(?=.*\d)(?=.*[@$!%^&*()_+={}\[\]:;"'\\|,.<>\/?~-])[A-Za-zñç\d@$!%^&*()_+={}\[\]:;"'\\|,.<>\/?~-]{8,}$/;
    var password = $("#passUsuario").val();
    var repassword = $("#rePassUsuario").val();
    if (regex.test(password)) {
      $("#divPassClienteForm").empty();
      validatePassCliente = true;
    } else if (password == "") {
      $("#divPassClienteForm").empty();
      validatePassCliente = false;
    } else {
      $(
        "<p class='error'>Falta 1 mayúscula, 1 minúscula, 1 carácter especial o la longitud es menor a 8 carácteres.</p>"
      ).appendTo("#divPassClienteForm");
      validatePassCliente = false;
    }
    
    if (repassword == password) {
      $("#divRePassClienteForm").empty();
      validateRepassCliente = true;
    } else if (!(repassword == "") && !(repassword == password)) {
      $("#divRePassClienteForm").empty();
      $("<p class='error'>Las contraseñas no coinciden.</p>").appendTo(
        "#divRePassClienteForm"
      );
      validateRepassCliente = false;
    }
  });

  $(document).on("input", "#rePassUsuario", function () {
    $("#divRePassClienteForm").empty();
    var password = $("#passUsuario").val();
    var repassword = $("#rePassUsuario").val();

    if (repassword == password) {
      $("#divRePassClienteForm").empty();
      validateRepassCliente = true;
    } else if (repassword == "") {
      $("#divRePassClienteForm").empty();
    } else {
      $("<p class='error'>Las contraseñas no coinciden.</p>").appendTo(
        "#divRePassClienteForm"
      );
      validateRepassCliente = false;
    }


  });

  $(document).on("click", "#btnEnviarDatosCliente", function (event) {
    event.preventDefault();
    $("#txtButtonFormCliente").empty();
    var usuarioCliente = $("#usuarioForm").val();
    var dniCliente = $("#dniUsuario").val();
    var emailCliente = $("#emailUsuario").val();
    var passCliente = $("#passUsuario").val();
    var rePassCliente = $("#rePassUsuario").val();
    var telCliente = $("#telUsuario").val();
    var cuentaActiva = $("#cuentaActiva").val();
    if (usuarioCliente == "" || dniCliente == "" || emailCliente == "" || telCliente == "" || passCliente == "" || rePassCliente == "" || cuentaActiva == null) {
      $("<p class='error mb-0'>Hay algunos campos vacíos, rellénalos.</p>").appendTo("#txtButtonFormCliente");
    } else if (
      validateUserCliente &&
      validateEmailCliente &&
      validatePassCliente &&
      validateRepassCliente &&
      validateTelefonoCliente &&
      validateDNICliente
    ) {
      var nuevoCliente = $("#formClientes").serialize();
      $.ajax({
        type: 'POST',
        url: 'php/nuevoClienteForm.php',
        data: nuevoCliente,
        success: function (resultado) {
          if (resultado.trim() == "correct") {
            $("#divSeccionesAdmin").empty();
            validateUserCliente = false;
            validateEmailCliente = false;
            validateTelefonoCliente = false;
            validatePassCliente = false;
            validateDNICliente = false;
            validateRepassCliente = false;
            verClientesReforma();
            $("<p class='success mb-0'>Usuario creado correctamente.</p>").appendTo("#txtButtonFormCliente");
          } else {
            $("<p class='error mb-0'>" + resultado + "</p>").appendTo("#txtButtonFormCliente");
          }
        },
        error: function () {
          alert("Ha habido un error: nuevoClienteForm.php.");
        }
      });
    }
  });

  $(document).on("click", "#verPass1", function (event) {
    event.preventDefault();
    var passwordInput = $("#passUsuario");
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

  $(document).on("click", "#verPass2", function (event) {
    event.preventDefault();
    var passwordInput = $("#rePassUsuario");
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

  $(document).on("click", ".editarCliente", function (event) {
    event.preventDefault();
    $("#divBotonFormCliente").empty()
    $("#divUsuarioClienteForm").empty()
    $("#divDNIClienteForm").empty()
    $("#divEmailClienteForm").empty()
    $("#divPassClienteForm").empty()
    $("#divRePassClienteForm").empty()
    $("#divTelClienteForm").empty()
    $("#txtButtonFormCliente").empty();
    $("#divBotonFormCliente").append('<button id="btnEnviarDatosCliente" class="btn btn-outline-success mb-3">Editar cliente</button><button id="btnCancelarEdicionCliente" class="btn btn-outline-danger mb-3 ms-3">Cancelar edición</button>');
    var idUsuario = $(this).val();
    $.ajax({
      type: 'GET',
      url: 'php/mostrarClienteEditar.php',
      data: { idUsuario: idUsuario },
      success: function (resultado) {
        var cliente = JSON.parse(resultado);
        $("#usuarioForm").val(cliente[0].nombre_usuario);
        $("#dniUsuario").val(cliente[0].dni_usuario);
        $("#emailUsuario").val(cliente[0].email);
        $("#passUsuario").val(cliente[0].password);
        $("#rePassUsuario").val(cliente[0].password);
        $("#telUsuario").val(cliente[0].num_tlf);
        $("#cuentaActiva").val(cliente[0].cuenta_activa);
        $("#btnEnviarDatosCliente").val(cliente[0].id_usuario);
        $("#btnEnviarDatosCliente").attr({ id: "btnEditarCliente" });
        $("#labelPass").text("Contraseña del usuario (No editarla si es la misma):");
        validateUserCliente = true;
        validateEmailCliente = true;
        validateTelefonoCliente = true;
        validatePassCliente = true;
        validateDNICliente = true;
        validateRepassCliente = true;
      },
      error: function () {
        alert("Ha habido un error: mostrarClienteEditar.php.");
      }
    });
  });

  $(document).on("click", "#btnCancelarEdicionCliente", function (event) {
    event.preventDefault();
    $("#divSeccionesAdmin").empty();
    verClientesReforma();
  });

  $(document).on("click", "#btnEditarCliente", function (event) {
    event.preventDefault();
    $("#txtButtonFormCliente").empty();
    var idUsuario = $(this).val();
    var usuarioForm = $("#usuarioForm").val();
    var dniUsuarioForm = $("#dniUsuario").val();
    var emailUsuarioForm = $("#emailUsuario").val();
    var passUsuarioForm = $("#passUsuario").val();
    var rePassUsuarioForm = $("#rePassUsuario").val();
    var telUsuarioForm = parseInt($("#telUsuario").val());
    var cuentaActiva = $("#cuentaActiva").val();

    if (usuarioForm == "" || dniUsuarioForm == "" || emailUsuarioForm == "" || passUsuarioForm == "" || rePassUsuarioForm == "" || telUsuarioForm == "" || cuentaActiva == null) {
      $("<p class='error mb-0'>Hay algunos campos vacíos, rellénalos.</p>").appendTo("#txtButtonFormCliente");
    } else if(validateUserCliente &&
      validateEmailCliente &&
      validatePassCliente &&
      validateRepassCliente &&
      validateTelefonoCliente &&
      validateDNICliente) {
      var datos_edit_cliente = new FormData($("#formClientes")[0]);
      $.ajax({
        type: 'POST',
        url: 'php/editarClienteForm.php?id_usuario=' + idUsuario,
        data: datos_edit_cliente,
        processData: false,
        contentType: false,
        success: function (resultado) {
          if (resultado == "correct") {
            $("#divSeccionesAdmin").empty();
            validateUserCliente = false;
            validateEmailCliente = false;
            validateTelefonoCliente = false;
            validatePassCliente = false;
            validateDNICliente = false;
            validateRepassCliente = false;
            verClientesReforma();
            mostrarCalendario();
            $("<p class='success mb-0'>Cliente editado correctamente.</p>").appendTo("#txtButtonFormCliente");
          } else {
            $("<p class='error mb-0'>" + resultado + "</p>").appendTo("#txtButtonFormCliente");
          }
        },
        error: function () {
          alert("Ha habido un error: editarClienteForm.php.");
        }
      });
    }
  });

  $(document).on("click", ".eliminarCliente", function () {
    var idCliente = $(this).val();

    var modalHtml = `<div class="modal fade" id="dialogEliminarCliente` + idCliente + `" aria-labelledby="dialogoCliente` + idCliente + `" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="dialogoCliente`+ idCliente + `">Eliminar cliente</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p class="mb-0">¿Deseas eliminar al cliente con ID: #`+ idCliente + `?<br>Se eliminará toda la información del cliente con el que ha sido registrado en la página.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success btnEliminarCliente" value="`+ idCliente + `" data-bs-dismiss="modal">Aceptar</button>
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>
</div>`;

    // Agregar el modal al contenedor
    $('#modalContainer').html(modalHtml);

    // Mostrar el modal
    $('#dialogEliminarCliente' + idCliente).modal('show');

    $('#dialogEliminarCliente' + idCliente).on('hidden.bs.modal', function () {
      $('#modalContainer').empty();
    });
  });

  $(document).on("click", ".btnEliminarCliente", function () {
    var idEliminarCliente = $(this).val();
    $.ajax({
      type: "GET",
      url: "php/deleteClienteAdmin.php",
      data: {
        idCliente: idEliminarCliente,
      },
      success: function (resultado) {
        if (resultado == "inactivo") {
          var modalHtml = `<div class="modal fade" id="dialogEliminarCliente` + idEliminarCliente + `" aria-labelledby="dialogoCliente` + idEliminarCliente + `" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h1 class="modal-title fs-5" id="dialogoCliente`+ idEliminarCliente + `">Cuenta desactivada</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <p class="mb-0">La cuenta del usuario con ID: #`+ idEliminarCliente + ` ha sido desactivada debido a que tiene un historial de reformas.<br>Puedes volver a activar la cuenta desde la vista de las cuentas.</p>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-success" data-bs-dismiss="modal">Aceptar</button>
                  </div>
              </div>
          </div>
      </div>`;

          $('#modalContainer').html(modalHtml);

          $('#dialogEliminarCliente' + idEliminarCliente).modal('show');

          $('#dialogEliminarCliente' + idEliminarCliente).on('hidden.bs.modal', function () {
            $('#modalContainer').empty();
          });

          $("#divSeccionesAdmin").empty();
          verClientesReforma();
        } else if (resultado == "eliminado") {
          var modalHtml = `<div class="modal fade" id="dialogClienteEliminado" aria-labelledby="dialogoCliente` + idEliminarCliente + `" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h1 class="modal-title fs-5" id="dialogoCliente`+ idEliminarCliente + `">Cliente eliminado</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <p class="mb-0">El cliente con ID: #`+ idEliminarCliente + ` ha sido eliminado.</p>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-success" data-bs-dismiss="modal">Aceptar</button>
                  </div>
              </div>
          </div>
      </div>`;

          $('#modalContainer').html(modalHtml);

          $('#dialogClienteEliminado').modal('show');

          $('#dialogClienteEliminado').on('hidden.bs.modal', function () {
            $('#modalContainer').empty();
          });

          $("#divSeccionesAdmin").empty();
          verClientesReforma();
        } else {
          var modalHtml = `<div class="modal fade" id="dialogClienteError" aria-labelledby="dialogoCliente` + idEliminarCliente + `" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h1 class="modal-title fs-5" id="dialogoCliente`+ idEliminarCliente + `">Error</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <p class="mb-0">Error. Inténtelo de nuevo.</p>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-success" data-bs-dismiss="modal">Aceptar</button>
                  </div>
              </div>
          </div>
      </div>`;

          $('#modalContainer').html(modalHtml);

          $('#dialogClienteError').modal('show');

          $('#dialogClienteError').on('hidden.bs.modal', function () {
            $('#modalContainer').empty();
          });
        }
      },
      error: function () {
        alert("Ha habido un error: deleteClienteAdmin.php.");
      },
    });
  });

  $(document).on("click", "#ordenarIDCliente", function(event) {
    event.preventDefault();
    paginaActual = 1;
    var iconoSelec = $("#triangleIDCliente");
    if (iconoSelec.hasClass("bi-caret-down-fill")) {
      iconoSelec.toggleClass("bi-caret-down-fill bi-caret-up-fill");
      ordenActual = "Usuarios.id_usuario ASC";
    } else {
      iconoSelec.toggleClass("bi-caret-up-fill bi-caret-down-fill");
      ordenActual = "Usuarios.id_usuario DESC";
    }

    cargarDatosClientes(paginaActual, ordenActual); 
  });

  var validateUserEmpleado = false;
  var validateEmailEmpleado = false;
  var validateTelefonoEmpleado = false;
  var validatePassEmpleado = false;
  var validateRePassEmpleado = false;
  var validateDNIEmpleado = false;

  $(document).on("input", "#usuarioEmpleadoForm", function () {
    $("#divUsuarioEmpleadoForm").empty();
    var longitud = $(this).val().length;
    var minLength = 4
    var maxLength = 20;
    $("#txtButtonFormEmpleado").empty();

    if (longitud < minLength) {
      $("<p class='error'>La longitud mínima de nombre de usuario es de " + minLength + " carácteres</p>").appendTo("#divUsuarioEmpleadoForm");
      validateUserEmpleado = false;
    } else if (longitud > maxLength) {
      $("<p class='error'>La longitud máxima de nombre de usuario es de " + maxLength + " carácteres</p>").appendTo("#divUsuarioEmpleadoForm");
      validateUserEmpleado = false;
    } else {
      validateUserEmpleado = true;
    }

    var username = $(this).val().trim();
    $(this).val(username.replace(/\s+/g, ''));
  });

  $(document).on("input", "#dniEmpleado", function () {
    $("#txtButtonFormEmpleado").empty();
    $("#divDNIEmpleadoForm").empty();

    var dni = $(this).val().trim();
    var regex = /^[XYZ]?\d{7,8}[A-Z]$/;

    if (!regex.test(dni)) {
      $("<p class='error'>El campo DNI / NIE no tiene el formato válido.</p>").appendTo("#divDNIEmpleadoForm");
      validateDNIEmpleado = false;
    } else {
      validateDNIEmpleado = true;
    }
  });

  $(document).on('input', '#telEmpleado', function () {
    var tlf = $(this).val();
    if (!validatePhone(tlf)) {
      $(this).val(tlf.slice(0, -1));
    }
    $("#txtButtonFormEmpleado").empty();
    if ($(this).val().length > 9) {
      $(this).val($(this).val().slice(0, 9));
    }
  });

  function validatePhone(telefono) {
    var regex = /^[0-9]+$/;
    return regex.test(telefono);
  }

  $(document).on("focusout", "#telEmpleado", function () {
    $("#divTelEmpleadoForm").empty();
    if ($("#telEmpleado").val() == "") {
      validateTelefonoEmpleado = false;
      $(
        "<p class='error'>El campo no debe estar vacío.</p>"
      ).appendTo("#divTelEmpleadoForm");
    } else if ($(this).val().length < 9) {
      validateTelefonoEmpleado = false;
      $(
        "<p class='error'>El número de teléfono debe contener nueve dígitos.</p>"
      ).appendTo("#divTelEmpleadoForm");
    } else {
      validateTelefonoEmpleado = true;
    }
  });

  $(document).on("focusout", "#emailEmpleado", function () {
    $("#txtButtonFormEmpleado").empty();
    $("#divEmailEmpleadoForm").empty();
    var email = $("#emailEmpleado").val();
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (regex.test(email)) {
      $("#divEmailEmpleadoForm").empty();
      validateEmailEmpleado = true;
    } else if (email == "") {
      $("#divEmailEmpleadoForm").empty();
      validateEmailEmpleado = false;
    } else {
      $(
        "<p class='error'>Dirección de correo electrónico no válida.</p>"
      ).appendTo("#divEmailEmpleadoForm");
      validateEmailEmpleado = false;
    }
  });

  $(document).on("input", "#passEmpleado", function () {
    $("#txtButtonFormEmpleado").empty();
    $("#divPassEmpleadoForm").empty();
    var regex =
      /^(?=.*[a-zñç])(?=.*[A-Zñç])(?=.*\d)(?=.*[@$!%^&*()_+={}\[\]:;"'\\|,.<>\/?~-])[A-Za-zñç\d@$!%^&*()_+={}\[\]:;"'\\|,.<>\/?~-]{8,}$/;
    var password = $("#passEmpleado").val();
    var repassword = $("#rePassEmpleado").val();
    if (regex.test(password)) {
      $("#divPassEmpleadoForm").empty();
      validatePassEmpleado = true;
    } else if (password == "") {
      $("#divPassEmpleadoForm").empty();
      validatePassEmpleado = false;
    } else {
      $(
        "<p class='error'>Falta 1 mayúscula, 1 minúscula, 1 carácter especial o la longitud es menor a 8 carácteres.</p>"
      ).appendTo("#divPassEmpleadoForm");
      validatePassEmpleado = false;
    }

    if (repassword == password) {
      $("#divRePassEmpleadoForm").empty();
      validateRePassEmpleado = true;
    } else if (!(repassword == "") && !(repassword == password)) {
      $("#divRePassEmpleadoForm").empty();
      $("<p class='error'>Las contraseñas no coinciden.</p>").appendTo(
        "#divRePassEmpleadoForm"
      );
      validateRePassEmpleado = false;
    }
  });

  $(document).on("input", "#rePassEmpleado", function () {
    $("#divRePassEmpleadoForm").empty();
    var password = $("#passEmpleado").val();
    var repassword = $("#rePassEmpleado").val();

    if (repassword == password) {
      $("#divRePassEmpleadoForm").empty();
      validateRePassEmpleado = true;
    } else if (repassword == "") {
      $("#divRePassEmpleadoForm").empty();
    } else {
      $("<p class='error'>Las contraseñas no coinciden.</p>").appendTo(
        "#divRePassEmpleadoForm"
      );
      validateRePassEmpleado = false;
    }
  });

  $(document).on("click", "#verPass3", function (event) {
    event.preventDefault();
    var passwordInput = $("#passEmpleado");
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

  $(document).on("click", "#verPass4", function (event) {
    event.preventDefault();
    var passwordInput = $("#rePassEmpleado");
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

  $(document).on("click", "#btnEnviarDatosEmpleado", function (event) {
    event.preventDefault();
    $("#txtButtonFormEmpleado").empty();
    var usuarioEmpleado = $("#usuarioEmpleadoForm").val();
    var dniEmpleado = $("#dniEmpleado").val();
    var emailEmpleado = $("#emailEmpleado").val();
    var passEmpleado = $("#passEmpleado").val();
    var rePassEmpleado = $("#rePassEmpleado").val();
    var telEmpleado = $("#telEmpleado").val();
    var tipoEmpleado = $("#tipoEmpleado").val();
    var supervisorEmpleado = $("#supervisorEmpleado").val();
    if (usuarioEmpleado == "" || dniEmpleado == "" || emailEmpleado == "" || telEmpleado == "" || passEmpleado == "" || rePassEmpleado == "" || tipoEmpleado == null || supervisorEmpleado == null) {
      $("<p class='error mb-0'>Hay algunos campos vacíos, rellénalos.</p>").appendTo("#txtButtonFormEmpleado");
    } else if (
      validateUserEmpleado &&
      validateEmailEmpleado &&
      validatePassEmpleado &&
      validateRePassEmpleado &&
      validateTelefonoEmpleado &&
      validateDNIEmpleado
    ) {
      var nuevoEmpleado = $("#formEmpleados").serialize();
      $.ajax({
        type: 'POST',
        url: 'php/nuevoEmpleadoForm.php',
        data: nuevoEmpleado,
        success: function (resultado) {
          if (resultado.trim() == "correct") {
            $("#divSeccionesAdmin").empty();
            validateUserEmpleado = false;
            validateEmailEmpleado = false;
            validateTelefonoEmpleado = false;
            validatePassEmpleado = false;
            validateRePassEmpleado = false;
            validateDNIEmpleado = false;
            verEmpleadosReforma();
            $("<p class='success mb-0'>Empleado creado correctamente.</p>").appendTo("#txtButtonFormEmpleado");
          } else {
            $("<p class='error mb-0'>" + resultado + "</p>").appendTo("#txtButtonFormEmpleado");
          }
        },
        error: function () {
          alert("Ha habido un error: nuevoEmpleadoForm.php.");
        }
      });
    }
  });

  $(document).on("click", ".editarEmpleado", function (event) {
    event.preventDefault();
    $("#divBotonFormEmpleado").empty();
    $("#txtButtonFormEmpleado").empty();
    $("#divDNIEmpleadoForm").empty();
    $("#divEmailEmpleadoForm").empty();
    $("#divTelEmpleadoForm").empty();
    $("#divPassEmpleadoForm").empty();
    $("#divRePassEmpleadoForm").empty();
    $("#divBotonFormEmpleado").append('<button id="btnEnviarDatosEmpleado" class="btn btn-outline-success mb-3">Editar empleado</button><button id="btnCancelarEdicionEmpleado" class="btn btn-outline-danger mb-3 ms-3">Cancelar edición</button>');
    var idEmpleado = $(this).val();
    $.ajax({
      type: 'GET',
      url: 'php/mostrarEmpleadoEditar.php',
      data: { idEmpleado: idEmpleado },
      success: function (resultado) {
        var empleado = JSON.parse(resultado);
        $("#usuarioEmpleadoForm").val(empleado[0].nombre_empleado);
        $("#dniEmpleado").val(empleado[0].dni_empleado);
        $("#emailEmpleado").val(empleado[0].email_empleado);
        $("#passEmpleado").val(empleado[0].password_empleado);
        $("#rePassEmpleado").val(empleado[0].password_empleado);
        $("#telEmpleado").val(empleado[0].num_tlf_empleado);
        $("#tipoEmpleado").val(empleado[0].tipo_empleado);
        $("#supervisorEmpleado").val(empleado[0].supervisor_empleado);
        $("#btnEnviarDatosEmpleado").val(empleado[0].id_empleado);
        $("#btnEnviarDatosEmpleado").attr({ id: "btnEditarEmpleado" });
        $("#labelPassE").text("Contraseña del usuario (No editarla si es la misma):")

        validateUserEmpleado = true;
        validateEmailEmpleado = true;
        validateTelefonoEmpleado = true;
        validatePassEmpleado = true;
        validateRePassEmpleado = true;
        validateDNIEmpleado = true;
      },
      error: function () {
        alert("Ha habido un error: mostrarEmpleadoEditar.php.");
      }
    });
  });

  $(document).on("click", "#btnCancelarEdicionEmpleado", function (event) {
    event.preventDefault();
    $("#divSeccionesAdmin").empty();
    verEmpleadosReforma();
  });

  $(document).on("click", "#btnEditarEmpleado", function (event) {
    event.preventDefault();
    $("#txtButtonFormEmpleado").empty();
    var idEmpleado = $(this).val();
    var empleadoForm = $("#usuarioEmpleadoForm").val();
    var dniEmpleadoForm = $("#dniEmpleado").val();
    var emailEmpleadoForm = $("#emailEmpleado").val();
    var passEmpleadoForm = $("#passEmpleado").val();
    var rePassEmpleadoForm = $("#rePassEmpleado").val();
    var telEmpleadoForm = parseInt($("#telEmpleado").val());
    var tipoEmpleadoForm = $("#tipoEmpleado").val();
    var supervisorEmpleado = $("#supervisorEmpleado").val();
    if (empleadoForm == "" || dniEmpleadoForm == "" || emailEmpleadoForm == "" || passEmpleadoForm == "" || rePassEmpleadoForm == "" || telEmpleadoForm == "" || tipoEmpleadoForm == null || supervisorEmpleado == null) {
      $("<p class='error mb-0'>Hay algunos campos vacíos, rellénalos.</p>").appendTo("#txtButtonFormEmpleado");
    } else if(validateUserEmpleado &&
      validateEmailEmpleado &&
      validatePassEmpleado &&
      validateRePassEmpleado &&
      validateTelefonoEmpleado &&
      validateDNIEmpleado){
      var datos_edit_empleado = new FormData($("#formEmpleados")[0]);;
      $.ajax({
        type: 'POST',
        url: 'php/editarEmpleadoForm.php?id_empleado=' + idEmpleado,
        data: datos_edit_empleado,
        processData: false,
        contentType: false,
        success: function (resultado) {
          if (resultado == "correct") {
            $("#divSeccionesAdmin").empty();
            validateUserEmpleado = false;
            validateEmailEmpleado = false;
            validateTelefonoEmpleado = false;
            validatePassEmpleado = false;
            validateRePassEmpleado = false;
            validateDNIEmpleado = false;
            verEmpleadosReforma();
            $("<p class='success mb-0'>Empleado editado correctamente.</p>").appendTo("#txtButtonFormEmpleado");
          } else {
            $("<p class='error mb-0'>" + resultado + "</p>").appendTo("#txtButtonFormEmpleado");
          }
        },
        error: function () {
          alert("Ha habido un error: editarEmpleadoForm.php.");
        }
      });
    }
  });

  $(document).on("click", ".eliminarEmpleado", function () {
    var idEmpleado = $(this).val();

    var modalHtml = `<div class="modal fade" id="dialogEliminarEmpleado` + idEmpleado + `" aria-labelledby="dialogoEmpleado` + idEmpleado + `" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="dialogoEmpleado`+ idEmpleado + `">Eliminar empleado</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p class="mb-0">¿Deseas eliminar al empleado con ID: #`+ idEmpleado + `?<br>Se eliminará toda la información del empleado con el que ha sido registrado/a en la página.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success btnEliminarEmpleado" value="`+ idEmpleado + `" data-bs-dismiss="modal">Aceptar</button>
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>
  </div>`;

    // Agregar el modal al contenedor
    $('#modalContainer').html(modalHtml);

    // Mostrar el modal
    $('#dialogEliminarEmpleado' + idEmpleado).modal('show');

    $('#dialogEliminarEmpleado' + idEmpleado).on('hidden.bs.modal', function () {
      $('#modalContainer').empty();
    });
  });

  $(document).on("click", ".btnEliminarEmpleado", function () {
    var idEliminarEmpleado = $(this).val();
    $.ajax({
      type: "GET",
      url: "php/deleteEmpleadoAdmin.php",
      data: {
        idEmpleado: idEliminarEmpleado,
      },
      success: function (resultado) {
        if (resultado == "eliminado") {
          var modalHtml = `<div class="modal fade" id="dialogEmpleadoEliminado" aria-labelledby="dialogoEmpleado` + idEliminarEmpleado + `" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h1 class="modal-title fs-5" id="dialogoEmpleado`+ idEliminarEmpleado + `">Empleado eliminado</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <p class="mb-0">El empleado con ID: #`+ idEliminarEmpleado + ` ha sido eliminado.</p>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-success" data-bs-dismiss="modal">Aceptar</button>
                  </div>
              </div>
          </div>
      </div>`;

          $('#modalContainer').html(modalHtml);

          $('#dialogEmpleadoEliminado').modal('show');

          $('#dialogEmpleadoEliminado').on('hidden.bs.modal', function () {
            $('#modalContainer').empty();
          });

          $("#divSeccionesAdmin").empty();
          verEmpleadosReforma();
        } else {
          var modalHtml = `<div class="modal fade" id="dialogEmpleadoError" aria-labelledby="dialogoEmpleado` + idEliminarEmpleado + `" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h1 class="modal-title fs-5" id="dialogoEmpleado`+ idEliminarEmpleado + `">Error</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <p class="mb-0">Error. Inténtelo de nuevo.</p>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-success" data-bs-dismiss="modal">Aceptar</button>
                  </div>
              </div>
          </div>
      </div>`;

          $('#modalContainer').html(modalHtml);

          $('#dialogEmpleadoError').modal('show');

          $('#dialogEmpleadoError').on('hidden.bs.modal', function () {
            $('#modalContainer').empty();
          });
        }
      },
      error: function () {
        alert("Ha habido un error: deleteEmpleadoAdmin.php.");
      },
    });
  });

  var validateNombreJefe = false;
  var validateDNIJefe = false;

  $(document).on("click", "#btnEnviarDatosJefe", function (event) {
    event.preventDefault();
    $("#txtButtonFormJefe").empty();
    var nombreJefe = $("#nombreJefeForm").val();
    var dniJefe = $("#dniJefe").val();
    var jefeActivo = $("#jefeActivo").val();
    if (nombreJefe == "" || dniJefe == "" || jefeActivo == null) {
      $("<p class='error mb-0'>Hay algunos campos vacíos, rellénalos.</p>").appendTo("#txtButtonFormJefe");
    } else if (
      validateNombreJefe &&
      validateDNIJefe
    ) {
      var nuevoJefe = $("#formJefes").serialize();
      $.ajax({
        type: 'POST',
        url: 'php/nuevoJefeForm.php',
        data: nuevoJefe,
        success: function (resultado) {
          if (resultado.trim() == "correct") {
            $("#divSeccionesAdmin").empty();
            validateNombreJefe = false;
            validateDNIJefe = false;
            verJefesReforma();
            $("<p class='success mb-0'>Jefe creado correctamente.</p>").appendTo("#txtButtonFormJefe");
          } else {
            $("<p class='error mb-0'>" + resultado + "</p>").appendTo("#txtButtonFormJefe");
          }
        },
        error: function () {
          alert("Ha habido un error: nuevoJefeForm.php.");
        }
      });
    }
  });

  $(document).on("input", "#nombreJefeForm", function () {
    $("#divUsuarioJefeForm").empty();
    var longitud = $(this).val().length;
    var minLength = 4
    var maxLength = 20;
    $("#txtButtonFormJefe").empty();

    if (longitud < minLength) {
      $("<p class='error'>La longitud mínima de nombre de usuario es de " + minLength + " carácteres</p>").appendTo("#divUsuarioJefeForm");
      validateNombreJefe = false;
    } else if (longitud > maxLength) {
      $("<p class='error'>La longitud máxima de nombre de usuario es de " + maxLength + " carácteres</p>").appendTo("#divUsuarioJefeForm");
      validateNombreJefe = false;
    } else {
      validateNombreJefe = true;
    }
  });

  $(document).on("input", "#dniJefe", function () {
    $("#txtButtonFormJefe").empty();
    $("#divDNIJefeForm").empty();

    var dni = $(this).val().trim();
    var regex = /^[XYZ]?\d{7,8}[A-Z]$/;

    if (!regex.test(dni)) {
      $("<p class='error'>El campo DNI / NIE no tiene el formato válido.</p>").appendTo("#divDNIJefeForm");
      validateDNIJefe = false;
    } else {
      validateDNIJefe = true;
    }
  });

  $(document).on("click", ".editarJefe", function (event) {
    event.preventDefault();
    $("#divBotonFormJefe").empty()
    $("#txtButtonFormJefe").empty();
    $("#divBotonFormJefe").append('<button id="btnEnviarDatosJefe" class="btn btn-outline-success mb-3">Editar jefe</button><button id="btnCancelarEdicionJefe" class="btn btn-outline-danger mb-3 ms-3">Cancelar edición</button>');
    var idJefe = $(this).val();
    $.ajax({
      type: 'GET',
      url: 'php/mostrarJefeEditar.php',
      data: { idJefe: idJefe },
      success: function (resultado) {
        var jefe = JSON.parse(resultado);
        $("#nombreJefeForm").val(jefe[0].nombre_completo_jefe);
        $("#dniJefe").val(jefe[0].dni_jefe);
        $("#btnEnviarDatosJefe").val(jefe[0].id_jefe);
        $("#jefeActivo").val(jefe[0].jefe_activo);
        $("#btnEnviarDatosJefe").attr({ id: "btnEditarJefe" });

        validateNombreJefe = true;
        validateDNIJefe = true;
      },
      error: function () {
        alert("Ha habido un error: mostrarJefeEditar.php.");
      }
    });
  });

  $(document).on("click", "#btnCancelarEdicionJefe", function (event) {
    event.preventDefault();
    $("#divSeccionesAdmin").empty();
    verJefesReforma();
  });

  $(document).on("click", "#btnEditarJefe", function (event) {
    event.preventDefault();
    $("#txtButtonFormJefe").empty();
    var idJefe = $(this).val();
    var jefeForm = $("#nombreJefeForm").val();
    var dniJefeForm = $("#dniJefe").val();
    if (jefeForm == "" || dniJefeForm == "") {
      $("<p class='error mb-0'>Hay algunos campos vacíos, rellénalos.</p>").appendTo("#txtButtonFormJefe");
    } else if(validateNombreJefe &&
      validateDNIJefe){
      var datos_edit_jefe = new FormData($("#formJefes")[0]);;
      $.ajax({
        type: 'POST',
        url: 'php/editarJefeForm.php?id_jefe=' + idJefe,
        data: datos_edit_jefe,
        processData: false,
        contentType: false,
        success: function (resultado) {
          if (resultado == "correct") {
            $("#divSeccionesAdmin").empty();
            validateNombreJefe = false;
            validateDNIJefe = false;
            verJefesReforma();
            $("<p class='success mb-0'>Jefe editado correctamente.</p>").appendTo("#txtButtonFormJefe");
          } else {
            $("<p class='error mb-0'>" + resultado + "</p>").appendTo("#txtButtonFormJefe");
          }
        },
        error: function () {
          alert("Ha habido un error: editarJefeForm.php.");
        }
      });
    }
  });

  $(document).on("click", ".eliminarJefe", function () {
    var idJefe = $(this).val();

    var modalHtml = `<div class="modal fade" id="dialogEliminarJefe` + idJefe + `" aria-labelledby="dialogoJefe` + idJefe + `" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="dialogoJefe`+ idJefe + `">Eliminar jefe</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p class="mb-0">¿Deseas eliminar al jefe con ID: #`+ idJefe + `?<br>Se eliminará toda la información del jefe con el que ha sido registrado/a en la página.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success btnEliminarJefe" value="`+ idJefe + `" data-bs-dismiss="modal">Aceptar</button>
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>
  </div>`;

    // Agregar el modal al contenedor
    $('#modalContainer').html(modalHtml);

    // Mostrar el modal
    $('#dialogEliminarJefe' + idJefe).modal('show');

    $('#dialogEliminarJefe' + idJefe).on('hidden.bs.modal', function () {
      $('#modalContainer').empty();
    });
  });

  $(document).on("click", ".btnEliminarJefe", function () {
    var idEliminarJefe = $(this).val();
    $.ajax({
      type: "GET",
      url: "php/deleteJefeAdmin.php",
      data: {
        idJefe: idEliminarJefe,
      },
      success: function (resultado) {
        if (resultado == "eliminado") {
          var modalHtml = `<div class="modal fade" id="dialogJefeEliminado" aria-labelledby="dialogoJefe` + idEliminarJefe + `" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h1 class="modal-title fs-5" id="dialogoJefe`+ idEliminarJefe + `">Jefe eliminado</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <p class="mb-0">El jefe con ID: #`+ idEliminarJefe + ` ha sido eliminado/a.</p>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-success" data-bs-dismiss="modal">Aceptar</button>
                  </div>
              </div>
          </div>
      </div>`;

          $('#modalContainer').html(modalHtml);

          $('#dialogJefeEliminado').modal('show');

          $('#dialogJefeEliminado').on('hidden.bs.modal', function () {
            $('#modalContainer').empty();
          });

          $("#divSeccionesAdmin").empty();
          verJefesReforma();
        } else if (resultado == "inactivo") {
          var modalHtml = `<div class="modal fade" id="dialogJefeEliminado` + idEliminarJefe + `" aria-labelledby="dialogoJefe` + idEliminarJefe + `" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h1 class="modal-title fs-5" id="dialogoJefe`+ idEliminarJefe + `">Cuenta desactivada</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <p class="mb-0">El jefe con ID: #`+ idEliminarJefe + ` ha sido desactivado debido a que tiene un historial de reformas realizadas.<br>Puedes volver a activar la cuenta desde la vista de las cuentas.</p>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-success" data-bs-dismiss="modal">Aceptar</button>
                  </div>
              </div>
          </div>
      </div>`;

          $('#modalContainer').html(modalHtml);

          $('#dialogJefeEliminado' + idEliminarJefe).modal('show');

          $('#dialogJefeEliminado' + idEliminarJefe).on('hidden.bs.modal', function () {
            $('#modalContainer').empty();
          });

          $("#divSeccionesAdmin").empty();
          verJefesReforma();
        } else if (resultado == "error_eliminar") {
          var modalHtml = `<div class="modal fade" id="dialogJefeError" aria-labelledby="dialogoJefe` + idEliminarJefe + `" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h1 class="modal-title fs-5" id="dialogoJefe`+ idEliminarJefe + `">Error</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <p class="mb-0">Error. El jefe con ID: #`+ idEliminarJefe + ` no se puede eliminar ni dar de baja debido a que tiene una reforma en curso.</p>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-success" data-bs-dismiss="modal">Aceptar</button>
                  </div>
              </div>
          </div>
      </div>`;

          $('#modalContainer').html(modalHtml);

          $('#dialogJefeError').modal('show');

          $('#dialogJefeError').on('hidden.bs.modal', function () {
            $('#modalContainer').empty();
          });
        } else {
          var modalHtml = `<div class="modal fade" id="dialogJefeError" aria-labelledby="dialogoJefe` + idEliminarJefe + `" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h1 class="modal-title fs-5" id="dialogoJefe`+ idEliminarJefe + `">Error</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <p>Error. Inténtelo de nuevo.</p>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-success" data-bs-dismiss="modal">Aceptar</button>
                  </div>
              </div>
          </div>
      </div>`;

          $('#modalContainer').html(modalHtml);

          $('#dialogJefeError').modal('show');

          $('#dialogJefeError').on('hidden.bs.modal', function () {
            $('#modalContainer').empty();
          });
        }
      },
      error: function () {
        alert("Ha habido un error: deleteJefeAdmin.php.");
      },
    });
  });

  $(document).on("click", ".aprobarReseña", function () {
    var idAprobarReseña = $(this).val();

          var modalHtml = `<div class="modal fade" id="dialogReseñaAprobar" aria-labelledby="dialogoAprobarReseña" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h1 class="modal-title fs-5" id="dialogoAprobarReseña">Aprobar reseña</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <p class="mb-0">¿Quieres aprobar la reseña con ID: #`+ idAprobarReseña + `?</p>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-success aprobadoDefinitivo" data-bs-dismiss="modal" value="${idAprobarReseña}">Aprobar</button>
                      <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Volver</button>
                  </div>
              </div>
          </div>
      </div>`;

          $('#modalContainer').html(modalHtml);

          $('#dialogReseñaAprobar').modal('show');

          $('#dialogReseñaAprobar').on('hidden.bs.modal', function () {
            $('#modalContainer').empty();
          });
  });

  $(document).on("click", ".denegarReseña", function () {
    var idAprobarReseña = $(this).val();

          var modalHtml = `<div class="modal fade" id="dialogReseñaDenegar" aria-labelledby="dialogoDenegarReseña" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h1 class="modal-title fs-5" id="dialogoDenegarReseña">Denegar reseña</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <p class="mb-0">¿Quieres denegar la reseña con ID: #`+ idAprobarReseña + `?</p>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-success denegadoDefinitivo" data-bs-dismiss="modal" value="${idAprobarReseña}">Denegar</button>
                      <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Volver</button>
                  </div>
              </div>
          </div>
      </div>`;

          $('#modalContainer').html(modalHtml);

          $('#dialogReseñaDenegar').modal('show');

          $('#dialogReseñaDenegar').on('hidden.bs.modal', function () {
            $('#modalContainer').empty();
          });
  });

  $(document).on("click", ".aprobadoDefinitivo", function () {
    var idReseñaAprobar = $(this).val();
    $.ajax({
      type: "GET",
      url: "php/setResenaAprobada.php",
      data: {
        idReseña: idReseñaAprobar,
      },
      success: function (resultado) {
        if (resultado == "correct") {
          var modalHtml = `<div class="modal fade" id="dialogReseñaAprobada" aria-labelledby="dialogoReseñaAprobada" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h1 class="modal-title fs-5" id="dialogoReseñaAprobada">Reseña aprobada</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <p class="mb-0">La reseña con ID: #`+ idReseñaAprobar + ` ha sido aprobada.<br>Aparecerá en la sección de "Galería" en caso de contar con imágenes.</p>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-success" data-bs-dismiss="modal">Aceptar</button>
                  </div>
              </div>
          </div>
      </div>`;

          $('#modalContainer').html(modalHtml);

          $('#dialogReseñaAprobada').modal('show');

          $('#dialogReseñaAprobada').on('hidden.bs.modal', function () {
            $('#modalContainer').empty();
          });

          $("#divSeccionesAdmin").empty();
          verReseñasAprobar();
        } else {
          var modalHtml = `<div class="modal fade" id="dialogReseñaError" aria-labelledby="dialogoReseñaAprobada"" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h1 class="modal-title fs-5" id="dialogReseñaError">Error</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <p>Error. Inténtelo de nuevo.</p>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-success" data-bs-dismiss="modal">Aceptar</button>
                  </div>
              </div>
          </div>
      </div>`;

          $('#modalContainer').html(modalHtml);

          $('#dialogReseñaError').modal('show');

          $('#dialogReseñaError').on('hidden.bs.modal', function () {
            $('#modalContainer').empty();
          });
        }
      },
      error: function () {
        alert("Ha habido un error: setReseñaAprobada.php.");
      },
    });
  });

  $(document).on("click", ".denegadoDefinitivo", function () {
    var idReseñaAprobar = $(this).val();
    $.ajax({
      type: "GET",
      url: "php/setResenaDenegada.php",
      data: {
        idReseña: idReseñaAprobar,
      },
      success: function (resultado) {
        if (resultado == "correct") {
          var modalHtml = `<div class="modal fade" id="dialogReseñaDenegada" aria-labelledby="dialogoReseñaDenegada" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h1 class="modal-title fs-5" id="dialogReseñaDenegada">Reseña denegada</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <p class="mb-0">La reseña con ID: #`+ idReseñaAprobar + ` ha sido denegada.</p>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-success" data-bs-dismiss="modal">Aceptar</button>
                  </div>
              </div>
          </div>
      </div>`;

          $('#modalContainer').html(modalHtml);

          $('#dialogReseñaDenegada').modal('show');

          $('#dialogReseñaDenegada').on('hidden.bs.modal', function () {
            $('#modalContainer').empty();
          });

          $("#divSeccionesAdmin").empty();
          verReseñasAprobar();
        } else {
          var modalHtml = `<div class="modal fade" id="dialogReseñaError" aria-labelledby="dialogReseñaDenegada"" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h1 class="modal-title fs-5" id="dialogReseñaError">Error</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <p>Error. Inténtelo de nuevo.</p>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-success" data-bs-dismiss="modal">Aceptar</button>
                  </div>
              </div>
          </div>
      </div>`;

          $('#modalContainer').html(modalHtml);

          $('#dialogReseñaError').modal('show');

          $('#dialogReseñaError').on('hidden.bs.modal', function () {
            $('#modalContainer').empty();
          });
        }
      },
      error: function () {
        alert("Ha habido un error: setReseñaDenegada.php.");
      },
    });
  });

  function cargarDatosReformas(pagina, orden, filtros) {
    $.ajax({
      url: 'php/getTodasReformas.php',
      type: 'GET',
      data: { pagina: pagina,
              orden: orden,
              filtros: filtros
            },
      success: function (resultado) {
        var respuesta = JSON.parse(resultado);
        var reformas = respuesta.datos;
        var paginaActual = parseInt(respuesta.pagina_actual);
        var totalPaginas = parseInt(respuesta.total_paginas);

        if (reformas.length == 0) {
          if ($("#divTablaReformas, #navTablaReformas").hasClass("d-none") == false) {
            $("#divTablaReformas, #navTablaReformas").addClass("d-none");
          }
          
          if ($("#pNoEncontrado").hasClass("d-none")) {
            $("#pNoEncontrado").removeClass("d-none");
          }
        } else {
          if ($("#pNoEncontrado").hasClass("d-none") == false) {
            $("#pNoEncontrado").addClass("d-none");
          }

          if($("#divTablaReformas, #navTablaReformas").hasClass("d-none")){
            $("#divTablaReformas, #navTablaReformas").removeClass("d-none");
          }

        $("#bodyTabla").empty();
        for (var reformitas of reformas) {
          mostrarTodasReformas(reformitas);
        }
      }

        if (paginaActual == 1) {
          $("#liPagAnteriorReformas").addClass("disabled");
        } else {
          $("#liPagAnteriorReformas").removeClass("disabled");
        }

        if (paginaActual == totalPaginas) {
          $("#liPagSiguienteReformas").addClass("disabled");
        } else {
          $("#liPagSiguienteReformas").removeClass("disabled");
        }
      },
      error: function () {
        alert("Ha habido un error: getTodasReformas.php.");
      }
    });
  }

  $(document).on("click", "#pagAnteriorReformas", function (event) {
    event.preventDefault();
    if (paginaActual > 1) {
      paginaActual--;
      cargarDatosReformas(paginaActual, ordenActual, filtroActual);
    }
  });

  $(document).on("click", "#pagSiguienteReformas", function (event) {
    event.preventDefault();
    paginaActual++;
    cargarDatosReformas(paginaActual, ordenActual, filtroActual);
  });

  $(document).on("click", ".ordenarTodasReformas", function () {
    paginaActual = 1;
    var tipoOrden = $(this).data("value");

    switch (tipoOrden) {
      case 1:
        var iconoSelec = $("#triangleIDReformas");
        var iconos = ["#triangleMetros", "#trianglePrecio", "#triangleFechaInicio", "#triangleFechaFin"];
        for (var i = 0; i < iconos.length; i++) {
            var icono = $(iconos[i]);
            if (icono.hasClass("bi-caret-up-fill")) {
                icono.removeClass("bi-caret-up-fill").addClass("bi-caret-down-fill");
            }
        }
        
        if (iconoSelec.hasClass("bi-caret-down-fill")) {
          iconoSelec.toggleClass("bi-caret-down-fill bi-caret-up-fill");
          ordenActual = "Proyecto_reforma.id_reforma ASC";
        } else {
          iconoSelec.toggleClass("bi-caret-up-fill bi-caret-down-fill");
          ordenActual = "Proyecto_reforma.id_reforma DESC";
        }
      cargarDatosReformas(paginaActual, ordenActual, filtroActual); 
        break;
      
      case 2:
        var iconoSelec = $("#triangleMetros");
        var iconos = ["#triangleIDReformas", "#trianglePrecio", "#triangleFechaInicio", "#triangleFechaFin"];
        for (var i = 0; i < iconos.length; i++) {
            var icono = $(iconos[i]);
            if (icono.hasClass("bi-caret-up-fill")) {
                icono.removeClass("bi-caret-up-fill").addClass("bi-caret-down-fill");
            }
        }
        
        if (iconoSelec.hasClass("bi-caret-down-fill")) {
          iconoSelec.toggleClass("bi-caret-down-fill bi-caret-up-fill");
          ordenActual = "Proyecto_reforma.metros_aprox_reforma ASC";
        } else {
          iconoSelec.toggleClass("bi-caret-up-fill bi-caret-down-fill");
          ordenActual = "Proyecto_reforma.metros_aprox_reforma DESC";
        }
      cargarDatosReformas(paginaActual, ordenActual, filtroActual); 
        break;
      
      case 3:
        var iconoSelec = $("#trianglePrecio");
        var iconos = ["#triangleMetros", "#triangleIDReformas", "#triangleFechaInicio", "#triangleFechaFin"];
        for (var i = 0; i < iconos.length; i++) {
            var icono = $(iconos[i]);
            if (icono.hasClass("bi-caret-up-fill")) {
                icono.removeClass("bi-caret-up-fill").addClass("bi-caret-down-fill");
            }
        }
        
        if (iconoSelec.hasClass("bi-caret-down-fill")) {
          iconoSelec.toggleClass("bi-caret-down-fill bi-caret-up-fill");
          ordenActual = "Proyecto_reforma.precio_aprox ASC";
        } else {
          iconoSelec.toggleClass("bi-caret-up-fill bi-caret-down-fill");
          ordenActual = "Proyecto_reforma.precio_aprox DESC";
        }
      cargarDatosReformas(paginaActual, ordenActual, filtroActual); 
        break;
      
      case 4:
        var iconoSelec = $("#triangleFechaInicio");
        var iconos = ["#triangleMetros", "#trianglePrecio", "#triangleIDReformas", "#triangleFechaFin"];
        for (var i = 0; i < iconos.length; i++) {
            var icono = $(iconos[i]);
            if (icono.hasClass("bi-caret-up-fill")) {
                icono.removeClass("bi-caret-up-fill").addClass("bi-caret-down-fill");
            }
        }
        
        if (iconoSelec.hasClass("bi-caret-down-fill")) {
          iconoSelec.toggleClass("bi-caret-down-fill bi-caret-up-fill");
          ordenActual = "Proyecto_reforma.fecha_inicio ASC";
        } else {
          iconoSelec.toggleClass("bi-caret-up-fill bi-caret-down-fill");
          ordenActual = "Proyecto_reforma.fecha_inicio DESC";
        }
      cargarDatosReformas(paginaActual, ordenActual, filtroActual); 
        break;
      
      case 5:
        var iconoSelec = $("#triangleFechaFin");
        var iconos = ["#triangleMetros", "#trianglePrecio", "#triangleFechaInicio", "#triangleIDReformas"];
        for (var i = 0; i < iconos.length; i++) {
            var icono = $(iconos[i]);
            if (icono.hasClass("bi-caret-up-fill")) {
                icono.removeClass("bi-caret-up-fill").addClass("bi-caret-down-fill");
            }
        }
        
        if (iconoSelec.hasClass("bi-caret-down-fill")) {
          iconoSelec.toggleClass("bi-caret-down-fill bi-caret-up-fill");
          ordenActual = "Proyecto_reforma.fecha_finalizacion ASC";
        } else {
          iconoSelec.toggleClass("bi-caret-up-fill bi-caret-down-fill");
          ordenActual = "Proyecto_reforma.fecha_finalizacion DESC";
        }
      cargarDatosReformas(paginaActual, ordenActual, filtroActual); 
        break;
    }
});

$(document).on('change', '#filtroReformasFinalizado, #filtroReformasAprobado, #filtroReformasZona, #filtroReformasTipo', function() {
  var filtroFinalizado = $('#filtroReformasFinalizado').val();
  var filtroAprobado = $('#filtroReformasAprobado').val();
  var filtroZona = $('#filtroReformasZona').val();
  var filtroTipo = $('#filtroReformasTipo').val();

  // Inicializar el objeto filtroActual
  filtroActual = {};

  // Agregar solo los filtros que están activos
  if (filtroFinalizado !== "0") {
    filtroActual.finalizado = filtroFinalizado;
  }
  if (filtroAprobado !== "0") {
    filtroActual.aprobado = filtroAprobado;
  }
  if (filtroZona !== "0") {
    filtroActual.zona = filtroZona;
  }
  if (filtroTipo !== "0") {
    filtroActual.tipo = filtroTipo;
  }

  cargarDatosReformas(paginaActual, ordenActual, filtroActual);
});

$(document).on("click", "#btnReiniciarTodasReformas", function(event) {
  event.preventDefault();
  paginaActual = 1;
  ordenActual = "Proyecto_reforma.id_reforma DESC";
  filtroActual = {};
  verTodasReformas();
});


  function verTodasReformas() {
    $("#divSeccionesAdmin").empty();
    crearFormularioTodasReformas();
    crearTablaReformas();
    cargarDatosReformas(paginaActual, ordenActual, filtroActual);

    $.ajax({
      type: "GET",
      url: "php/getTodosClientes.php",
      success: function (resultado) {
        var respuesta = JSON.parse(resultado);
        var elecciones = respuesta.datos;
        for (var todasElecs of elecciones) {
          usuariosReformaForm(todasElecs);
        }
      },
      error: function () {
        alert("Ha habido un error: getTodosClientes.php.");
      },
    });

    $.ajax({
      type: "GET",
      url: "php/mostrarSelectZonaReforma.php",
      success: function (resultado) {
        var elecciones = JSON.parse(resultado);
        for (var todasElecs of elecciones) {
          zonasReformaForm(todasElecs);
        }
      },
      error: function () {
        alert("Ha habido un error: mostrarSelectZonaReforma.php.");
      },
    });

    $.ajax({
      type: "GET",
      url: "php/mostrarSelectTipoReforma.php",
      success: function (resultado) {
        var elecciones = JSON.parse(resultado);
        for (var todasElecs of elecciones) {
          tipoReformaForm(todasElecs);
        }
      },
      error: function () {
        alert("Ha habido un error: mostrarSelectTipoReforma.php.");
      },
    });

    $.ajax({
      type: "GET",
      url: "php/mostrarSelectMetrosReforma.php",
      success: function (resultado) {
        var elecciones = JSON.parse(resultado);
        for (var todasElecs of elecciones) {
          metrosReformaForm(todasElecs);
        }
      },
      error: function () {
        alert("Ha habido un error: mostrarSelectMetrosReforma.php.");
      },
    });

    $.ajax({
      type: "GET",
      url: "php/mostrarSelectJefesReforma.php",
      success: function (resultado) {
        var elecciones = JSON.parse(resultado);
        for (var todasElecs of elecciones) {
          jefesReformaForm(todasElecs);
        }
      },
      error: function () {
        alert("Ha habido un error: mostrarSelectJefesReforma.php.");
      },
    });
  }

  function usuariosReformaForm(usuario) {
    $('<option value="' + usuario.id_usuario + '">' + usuario.nombre_usuario + ' - ' + usuario.dni_usuario + '</option>').appendTo("#usuarioSoli");
  }

  function zonasReformaForm(zona) {
    $('<option value="' + zona.id_zona + '">' + zona.nombre_zona + '</option>').appendTo("#selecZonaReforma");
    $('<option value="zona' + zona.id_zona + '">' + zona.nombre_zona + '</option>').appendTo("#filtroReformasZona");
  }

  function tipoReformaForm(tipo) {
    $('<option value="' + tipo.id_tipo_proyecto + '">' + tipo.nombre_proyecto + '</option>').appendTo("#selecTipoReforma");
    $('<option value="tipo' + tipo.id_tipo_proyecto + '">' + tipo.nombre_proyecto + '</option>').appendTo("#filtroReformasTipo");
  }

  function metrosReformaForm(metros) {
    $('<option value="' + metros.id_metros + '">' + metros.cantidad_metros + '</option>').appendTo("#selecMetrosReforma");
  }

  function jefesReformaForm(jefe) {
    $('<option value="' + jefe.id_jefe + '">' + jefe.nombre_completo_jefe + ' - ' + jefe.dni_jefe + '</option>').appendTo("#selecJefeReforma");
  }

  function crearFormularioTodasReformas() {
    $('<form id="formTodasReformas" class="mb-5 aspectForm" enctype="multipart/form-data">' +
      '<fieldset>' +
      '<legend>Introducir o editar solicitud de reforma (Los campos con * son obligatorios)</legend>' +
      '<div class="row mb-4 d-flex justify-content-center"><div class="col-auto text-center"><label for="usuarioSoli" class="form-label">Usuario de la solicitud *:</label><select id="usuarioSoli" class="form-select" name="usuarioSoli"><option selected disabled value="">Seleccione el usuario de la solicitud</option></select></div></div>' +
      '<div class="row mb-4">' +
      '<div class="col-md-3 mb-3 mb-md-0">' +
      '<label for="estadoSoli" class="form-label">Estado de la solicitud *:</label>' +
      '<select id="estadoSoli" class="form-select" name="estadoSoli">' +
      '<option disabled selected value="">Seleccione el estado de la solicitud</option>' +
      '<option value="0">No aprobada</option>' +
      '<option value="1">Aprobada</option>' +
      '<option value="2">Pendiente de aprobar</option>' +
      '</select>' +
      '</div>' +
      '<div class="col-md-3 mb-3 mb-md-0"><label for="selecZonaReforma" class="form-label">Zona de la reforma *:</label><select id="selecZonaReforma" class="form-select" name="selecZonaReforma">' +
      '<option disabled selected value="">Seleccione una zona de reforma</option>' +
      '</select></div>' +
      '<div class="col-md-3 mb-3 mb-md-0">' +
      '<label for="selecTipoReforma" class="form-label">Tipo de reforma *:</label><select id="selecTipoReforma" class="form-select" name="selecTipoReforma">' +
      '<option disabled selected value="">Seleccione un tipo de reforma</option>' +
      '</select></div>' +
      '<div class="col-md-3 mb-3 mb-md-0">' +
      '<label for="selecMetrosReforma" class="form-label">Metros cuadrados aproximados *:</label><select id="selecMetrosReforma" class="form-select" name="selecMetrosReforma">' +
      '<option disabled selected value="">Seleccione los metros aproximados</option>' +
      '</select></div>' +
      '</div><div class="row mb-4">' +
      '<div class="col-md-3 mb-3 mb-md-0">' +
      '<label for="selecJefeReforma" class="form-label">Jefe al mando (*Solo si es aprobado):</label>' +
      '<select id="selecJefeReforma" class="form-select" name="selecJefeReforma">' +
      '<option disabled selected value="">Seleccione el jefe al mando</option>' +
      '</select>' +
      '</div>' +
      '<div class="col-md-3 mb-3 mb-md-0"><label for="fechaInicioReforma" class="form-label">Fecha de inicio de la reforma (*Solo si es aprobado):</label><input type="date" id="fechaInicioReforma" class="form-control" name="fechaInicioReforma"></div>' +
      '<div class="col-md-3 mb-3 mb-md-0">' +
      '<label for="fechaFinalizacionReforma" class="form-label">Fecha de finalización de la reforma:</label><input type="date" id="fechaFinalizacionReforma" class="form-control" name="fechaFinalizacionReforma" disabled></div>' +
      '<div class="col-md-3 mb-3 mb-md-0">' +
      '<label for="precioReforma" class="form-label">Precio aproximado de la reforma *:</label><input type="number" id="precioReforma" class="form-control inputNoAppearance" placeholder="Introduce el precio aproximado..." name="precioReforma"></div>' +
      '</div><div class="row mb-4">' +
      '<div class="col-md-3 mb-3 mb-md-0">' +
      '<label for="descReforma" class="form-label">Descripción de la reforma (*Solo si es aprobado):</label>' +
      '<textarea placeholder="Introduce una descripción de la reforma..." id="descReforma" class="form-control" name="descReforma">' +
      '</textarea>' +
      '</div>' +
      '<div class="col-md-3 mb-3 mb-md-0"><label for="fotoAntesReforma" class="form-label">Foto antes de iniciar la reforma:</label><input class="form-control mb-2" type="file" id="fotoAntesReforma" name="fotoAntesReforma" accept="image/jpeg, image/png" disabled><input type="hidden" name="nombreImgAntes" id="nombreImgAntes"><input type="checkbox" class="form-check-input" id="checkboxEliminarImgAntes" name="checkboxImgAntes" disabled> Eliminar imagen ya subida del servidor (dejar reforma sin imagen).' +
      '</div>' +
      '<div class="col-md-3 mb-3 mb-md-0"><label for="fotoDespuesReforma" class="form-label">Foto después de finalizar la reforma:</label><input class="form-control mb-2" type="file" id="fotoDespuesReforma" name="fotoDespuesReforma" accept="image/jpeg, image/png" disabled> <input type="hidden" name="nombreImgDespues" id="nombreImgDespues"> <input type="checkbox" class="form-check-input" id="checkboxEliminarImgDespues" name="checkboxImgDespues" disabled> Eliminar imagen ya subida del servidor (dejar reforma sin imagen).' +
      '</div>' +
      '<div class="col-md-3 mb-3 mb-md-0">' +
      '<label for="finalizacionSolicitud" class="form-label">¿La solicitud ha finalizado? *:</label>' +
      '<select id="finalizacionSolicitud" class="form-select" name="finalizacionSolicitud">' +
      '<option disabled selected value="">Seleccione si ha finalizado la solicitud</option>' +
      '<option value="0" selected>Sin finalizar</option>' +
      '<option value="1">Finalizado</option>' +
      '</select></div>' +
      '</div>' +
      '<div class="d-flex justify-content-center align-items-center" id="divBotonForm"><button id="btnEnviarDatos" class="btn btn-outline-success mb-3">Enviar datos</button></div><div id="txtButtonForm" class="d-flex text-center flex-column"></div>' +
      '</fieldset>' +
      '</form>').appendTo("#divSeccionesAdmin");

    var fechaInicioInput = document.querySelector("#fechaInicioReforma");
    var fechaActual = new Date();
    var fechaLimite = new Date();
    fechaLimite.setDate(fechaActual.getDate() + 7);
    var limiteString = fechaLimite.toISOString().split('T')[0];
    fechaInicioInput.setAttribute("min", limiteString);
  }

  function crearFormularioClientes() {
    $('<form id="formClientes" class="mb-5 aspectForm">' +
      '<fieldset>' +
      '<legend>Introducir o editar información de clientes:</legend>' +
      '<div class="row mb-4 d-flex justify-content-center">' +
      '<div class="col-md-3 mb-3 mb-md-0">' +
      '<label for="usuarioForm" class="form-label">Nombre de usuario:</label><input type="text" id="usuarioForm" name="usuarioForm" class="form-control" placeholder="Introduce el nombre de usuario..."><div id="divUsuarioClienteForm"></div>' +
      '</div>' +
      '<div class="col-md-3 mb-3 mb-md-0"><label for="dniUsuario" class="form-label">DNI del usuario:</label><input type="text" id="dniUsuario" name="dniUsuario" class="form-control" placeholder="Introduce el DNI del usuario..."><div id="divDNIClienteForm"></div>' +
      '</div>' +
      '<div class="col-md-3 mb-3 mb-md-0">' +
      '<label for="emailUsuario" class="form-label">Email del usuario:</label><input type="email" id="emailUsuario" name="emailUsuario" class="form-control" placeholder="Introduce el email del usuario..."> <div id="divEmailClienteForm"></div>' +
      '</div>' +
      '</div><div class="row mb-4 d-flex justify-content-center">' +
      '<div class="col-md-3 mb-3 mb-md-0">' +
      '<label for="passUsuario" class="form-label" id="labelPass">Contraseña del usuario:</label>' +
      '<div class="input-group">' +
      '<input type="password" id="passUsuario" name="passUsuario" class="form-control" placeholder="Introduce la contraseña del usuario..."> <button id="verPass1" class="btn d-flex align-items-center botonVerPass" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">' +
      '<path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>' +
      '<path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>' +
      '</svg></button></div><div id="divPassClienteForm"></div>' +
      '</div>' +
      '<div class="col-md-3 mb-3 mb-md-0">' +
      '<label for="rePassUsuario" class="form-label">Volver a introducir la contraseña:</label>' +
      '<div class="input-group">' +
      '<input type="password" id="rePassUsuario" name="rePassUsuario" class="form-control" placeholder="Introduce de nuevo la contraseña del usuario..."> <button id="verPass2" class="btn d-flex align-items-center botonVerPass" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">' +
      '<path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>' +
      '<path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>' +
      '</svg></button></div><div id="divRePassClienteForm"></div>' +
      '</div>' +
      '<div class="col-md-3 mb-3 mb-md-0">' +
      '<label for="telUsuario" class="form-label">Teléfono del usuario:</label>' +
      '<input type="number" id="telUsuario" name="telUsuario" class="form-control inputNoAppearance" placeholder="Introduce el teléfono del usuario..."> <div id="divTelClienteForm"></div>' +
      '</div>' +
      '<div class="col-md-3 mb-3 mb-md-0">' +
      '<label for="cuentaActiva" class="form-label">Estado de la cuenta:</label>' +
      '<select id="cuentaActiva" name="cuentaActiva" class="form-select">' +
      '<option selected disabled value="">Selecciona si la cuenta está activa o no</option>' +
      '<option value="0">Cuenta desactivada</option>' +
      '<option value="1">Cuenta activada</option>' +
      '</select>' +
      '</div>' +
      '</div>' +
      '<div class="d-flex justify-content-center align-items-center" id="divBotonFormCliente"><button id="btnEnviarDatosCliente" class="btn btn-outline-success mb-3">Crear cliente</button></div><div id="txtButtonFormCliente" class="d-flex text-center flex-column"></div>' +
      '</fieldset>' +
      '</form>').appendTo("#divSeccionesAdmin");
  }

  function crearFormularioEmpleados() {
    $('<form id="formEmpleados" class="mb-5 aspectForm">' +
      '<fieldset>' +
      '<legend>Introducir o editar información de empleados:</legend>' +
      '<div class="row mb-4 d-flex justify-content-center">' +
      '<div class="col-md-3 mb-3 mb-md-0">' +
      '<label for="usuarioEmpleadoForm" class="form-label">Nombre de empleado:</label><input type="text" id="usuarioEmpleadoForm" name="usuarioEmpleadoForm" class="form-control" placeholder="Introduce el nombre del empleado..."><div id="divUsuarioEmpleadoForm"></div>' +
      '</div>' +
      '<div class="col-md-3 mb-3 mb-md-0"><label for="dniEmpleado" class="form-label">DNI del empleado:</label><input type="text" id="dniEmpleado" name="dniEmpleado" class="form-control" placeholder="Introduce el DNI del empleado..."><div id="divDNIEmpleadoForm"></div>' +
      '</div>' +
      '<div class="col-md-3 mb-3 mb-md-0">' +
      '<label for="emailEmpleado" class="form-label">Email del empleado:</label><input type="email" id="emailEmpleado" name="emailEmpleado" class="form-control" placeholder="Introduce el email del empleado..."> <div id="divEmailEmpleadoForm"></div>' +
      '</div>' +
      '<div class="col-md-3 mb-3 mb-md-0">' +
      '<label for="telEmpleado" class="form-label">Teléfono del empleado:</label>' +
      '<input type="number" id="telEmpleado" name="telEmpleado" class="form-control inputNoAppearance" placeholder="Introduce el teléfono del empleado..."> <div id="divTelEmpleadoForm"></div>' +
      '</div>' +
      '</div><div class="row mb-4 d-flex justify-content-center">' +
      '<div class="col-md-3 mb-3 mb-md-0">' +
      '<label for="passEmpleado" class="form-label" id="labelPassE">Contraseña del empleado:</label>' +
      '<div class="input-group">' +
      '<input type="password" id="passEmpleado" name="passEmpleado" class="form-control" placeholder="Introduce la contraseña del empleado..."> <button id="verPass3" class="btn d-flex align-items-center botonVerPass" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">' +
      '<path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>' +
      '<path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>' +
      '</svg></button></div><div id="divPassEmpleadoForm"></div>' +
      '</div>' +
      '<div class="col-md-3 mb-3 mb-md-0">' +
      '<label for="rePassEmpleado" class="form-label">Volver a introducir la contraseña:</label>' +
      '<div class="input-group">' +
      '<input type="password" id="rePassEmpleado" name="rePassEmpleado" class="form-control" placeholder="Introduce de nuevo la contraseña del empleado..."> <button id="verPass4" class="btn d-flex align-items-center botonVerPass" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">' +
      '<path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>' +
      '<path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>' +
      '</svg></button></div><div id="divRePassEmpleadoForm"></div>' +
      '</div>' +
      '<div class="col-md-3 mb-3 mb-md-0">' +
      '<label for="tipoEmpleado" class="form-label">Tipo de empleado:</label>' +
      '<select id="tipoEmpleado" name="tipoEmpleado" class="form-select">' +
      '<option selected disabled value="">Selecciona el tipo de empleado</option>' +
      '</select>' +
      '</div>' +
      '<div class="col-md-3 mb-3 mb-md-0">' +
      '<label for="supervisorEmpleado" class="form-label">Supervisor del empleado:</label>' +
      '<select id="supervisorEmpleado" name="supervisorEmpleado" class="form-select">' +
      '<option selected disabled value="">Selecciona el supervisor del empleado</option>' +
      '</select>' +
      '</div>' +
      '</div>' +
      '<div class="d-flex justify-content-center align-items-center" id="divBotonFormEmpleado"><button id="btnEnviarDatosEmpleado" class="btn btn-outline-success mb-3">Crear empleado</button></div><div id="txtButtonFormEmpleado" class="d-flex text-center flex-column"></div>' +
      '</fieldset>' +
      '</form>').appendTo("#divSeccionesAdmin");
  }

  function crearFormularioJefes() {
    $('<form id="formJefes" class="mb-5 aspectForm">' +
      '<fieldset>' +
      '<legend>Introducir o editar información de clientes:</legend>' +
      '<div class="row mb-4 d-flex justify-content-center">' +
      '<div class="col-md-3 mb-3 mb-md-0">' +
      '<label for="nombreJefeForm" class="form-label">Nombre de jefe:</label><input type="text" id="nombreJefeForm" name="nombreJefeForm" class="form-control" placeholder="Introduce el nombre del jefe..."><div id="divUsuarioJefeForm"></div>' +
      '</div>' +
      '<div class="col-md-3 mb-3 mb-md-0"><label for="dniJefe" class="form-label">DNI del jefe:</label><input type="text" id="dniJefe" name="dniJefe" class="form-control" placeholder="Introduce el DNI del jefe..."><div id="divDNIJefeForm"></div>' +
      '</div>' +
      '<div class="col-md-3 mb-3 mb-md-0">' +
      '<label for="jefeActivo" class="form-label">Jefe en activo:</label>' +
      '<select id="jefeActivo" name="jefeActivo" class="form-select">' +
      '<option selected disabled value="">Selecciona si el jefe está en activo en la empresa</option>' +
      '<option value="0">No</option>' +
      '<option value="1">Sí</option>' +
      '</select>' +
      '</div> </div>' +
      '<div class="d-flex justify-content-center align-items-center" id="divBotonFormJefe"><button id="btnEnviarDatosJefe" class="btn btn-outline-success mb-3">Crear jefe</button></div><div id="txtButtonFormJefe" class="d-flex text-center flex-column"></div>' +
      '</fieldset>' +
      '</form>').appendTo("#divSeccionesAdmin");
  }

  function checkSession() {
    $.ajax({
      type: "GET",
      url: "php/checkSession.php",
      success: function (resultado) {
        resultado = JSON.parse(resultado);
        if (resultado.user == false) {
          location.href = "index.html";
        } else if (resultado.rol != 1) {
          location.href = "index.html";
        } else {
          $(".bienvenidah1").html("¡Bienvenido/a <span class='nomUsuario'>" + resultado.user + "</span>!");
          id_usuario = resultado.id_user;
        }
      },
      error: function () {
        alert("Ha habido un error: checkSession.php.");
      },
    });
  }

  function mostrarCalendario() {
    $.ajax({
      type: "GET",
      url: "php/getReformasCalendarioAdmin.php",
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
        alert("Ha habido un error: getReformasCalendario.php.");
      },
    });
  }

  function verSolicitudesReforma() {
    mostrarCalendario();
    cargarSolicitudesReformas(paginaActual);
  }

  function cargarSolicitudesReformas(pagina) {
    $.ajax({
      type: "GET",
      url: "php/getSolicitudes.php",
      data: {pagina: pagina},
      success: function (resultado) {
        var respuesta = JSON.parse(resultado);
        var solicitud = respuesta.datos;
        var paginaActual = parseInt(respuesta.pagina_actual);
        var totalPaginas = parseInt(respuesta.total_paginas);
        if (solicitud.length == 0) {
          $('<h2 class="h2Cliente text-lg-start text-center">Reformas solicitadas</h2> <p class="fs-4 mb-5 text-lg-start text-center">No se han encontrado solicitudes de reformas entrantes.</p>').appendTo("#divSeccionesAdmin");
        } else {
          $("#divSeccionesAdmin").empty();
          $('<h2 class="h2Cliente text-lg-start text-center">Reformas solicitadas</h2>').appendTo("#divSeccionesAdmin");
          for (var solicitudes of solicitud) {
            mostrarSolicitudes(solicitudes);
          }

          $.ajax({
            type: "GET",
            url: "php/getSeleccionesAdmin.php",
            success: function (resultado) {
              var selecciones = JSON.parse(resultado);
              for (var selecJefe of selecciones) {
                mostrarSeleccionesAdmin(selecJefe);
              }
            },
            error: function () {
              alert("Ha habido un error: getSeleccionesAdmin.php.");
            },
          });

          $(`<nav aria-label="Paginacion mostrar tablas" class="mb-5">
          <ul class="pagination justify-content-center pagination-lg">
            <li class="page-item" id="liPagAnteriorSolicitudes">
              <button class="page-link" id="pagAnteriorSolicitudes"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill" viewBox="0 0 16 16">
              <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
            </svg></button>
            </li>
            <li class="page-item" id="liPagSiguienteSolicitudes">
              <button class="page-link" id="pagSiguienteSolicitudes"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
              <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
            </svg></button>
            </li>
          </ul>
          </nav>`).appendTo("#divSeccionesAdmin");

          if (paginaActual == 1) {
            $("#liPagAnteriorSolicitudes").addClass("disabled");
          } else {
            $("#liPagAnteriorSolicitudes").removeClass("disabled");
          }
  
          if (paginaActual == totalPaginas) {
            $("#liPagSiguienteSolicitudes").addClass("disabled");
          } else {
            $("#liPagSiguienteSolicitudes").removeClass("disabled");
          }
        }
      },
      error: function () {
        alert("Ha habido un error: getSolicitudes.php.");
      },
    });
  }

  $(document).on("click", "#pagAnteriorSolicitudes", function (event) {
    event.preventDefault();
    if (paginaActual > 1) {
      paginaActual--;
      cargarSolicitudesReformas(paginaActual);
    }
  });

  $(document).on("click", "#pagSiguienteSolicitudes", function (event) {
    event.preventDefault();
    paginaActual++;
    cargarSolicitudesReformas(paginaActual);
  });

  function mostrarSolicitudes(solicitud) {
    $('<div class="accordion mb-5" id="accordionExample' + solicitud.id_reforma + '">' +
      '<div class="accordion-item">' +
      '<h2 class="accordion-header">' +
      '<button class="accordion-button collapsed fs-4" type="button" data-bs-toggle="collapse"' +
      'data-bs-target="#collapse' + solicitud.id_reforma + '" aria-expanded="true" aria-controls="collapse' + solicitud.id_reforma + '">' +
      'Reforma solicitada #' + solicitud.id_reforma + '' +
      '</button>' +
      '</h2>' +
      '<div id="collapse' + solicitud.id_reforma + '" class="accordion-collapse collapse"' +
      'data-bs-parent="#accordionExample' + solicitud.id_reforma + '">' +
      '<div class="accordion-body" id="accordion' + solicitud.id_reforma + '" >' +
      '<div class="row d-flex align-items-center justify-content-center">' +
      '<div class="table-responsive-mobile col-md-7 me-md-4">' +
      '<table class="table tablaSolicitudes text-center">' +
      '<thead>' +
      '<tr>' +
      '<th scope="col">Usuario</th>' +
      '<th scope="col">Zona de reforma</th>' +
      '<th scope="col">Tipo de reforma</th>' +
      '<th scope="col">Metros cuadrados</th>' +
      '<th scope="col">Precio aprox.</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody>' +
      '<tr>' +
      '<td>' + solicitud.nombre_usuario + '</td>' +
      '<td>' + solicitud.nombre_zona + '</td>' +
      '<td>' + solicitud.nombre_proyecto + '</td>' +
      '<td>' + solicitud.cantidad_metros + '</td>' +
      '<td>' + solicitud.precio_aprox + '€</td>' +
      '</tr>' +
      '</tbody>' +
      '</table>' +
      '</div>' +
      '<div class="col-md-2 me-md-4 mb-md-0 mb-3">' +
      '<h4>Jefe a cargo: </h4> <select class="form-control seleccionesAdmin" data-solicitud="' + solicitud.id_reforma + '">' +
      '<option disabled selected>Selecciona el jefe a cargo de la reforma</option>' +
      '</select>' +
      '<h4 class="mt-3">Fecha de inicio:</h4> <input type="date" class="form-control seleccionFecha" name="fechaInicio' + solicitud.id_reforma + '" id="fechaInicio' + solicitud.id_reforma + '" data-solicitud="' + solicitud.id_reforma + '">' +
      '</div>' +
      '<div class="col-md-2">' +
      '<h4>Descripción de reforma:</h4>  <textarea class="form-control descAdmin" placeholder="Introduce la descripción de la reforma que verán los empleados..." data-solicitud="' + solicitud.id_reforma + '"></textarea></div>' +
      '</div>' +
      '</div>' +
      '<div class="p-3 p-md-0 mt-4 mb-4 d-flex justify-content-center">' +
      '<button type="button" class="btn btn-outline-success me-2 aceptarSolicitud" value="' + solicitud.id_reforma + '">Aceptar solicitud</button>' +
      '<button type="button" class="btn btn-outline-danger ms-2 cancelarSolicitud" value="' + solicitud.id_reforma + '" data-bs-toggle="modal" data-bs-target="#dialogSolicitud' + solicitud.id_reforma + '">Cancelar solicitud</button>' +
      '</div>' +
      '<div class="mt-4 d-none justify-content-center" id="divError' + solicitud.id_reforma + '"><p class="fs-5 error">Si aceptas la solicitud, debes seleccionar valores en los campos de jefe a cargo, fecha de inicio y escribir una descripción.</p></div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>').appendTo("#divSeccionesAdmin");

    var fechaInicioInput = document.querySelector("#fechaInicio" + solicitud.id_reforma);
    var fechaActual = new Date();
    var fechaLimite = new Date();
    fechaLimite.setDate(fechaActual.getDate() + 7);
    var limiteString = fechaLimite.toISOString().split('T')[0];
    fechaInicioInput.setAttribute("min", limiteString);
  }

  function mostrarSeleccionesAdmin(selecciones) {
    $('<option value="' + selecciones.id_jefe + '">' + selecciones.nombre_completo_jefe + ' - DNI: ' + selecciones.dni_jefe + '</option>').appendTo(".seleccionesAdmin");
  }

  function crearTablaReformas() {
    $(`
    <div class="d-flex justify-content-between align-items-center border-bottom mb-4">
    <h2 class="fs-2 text-lg-start text-center">Vista de todas las reformas</h2>
    <button class="btn btn-secondary" id="btnReiniciarTodasReformas">Reiniciar filtros</button>
    </div>
    <div class="row mb-5">
      <div class="col-md-3 mb-3 mb-md-0">
      <h3>Filtrar por finalización:</h3>
      <select class="form-select" id="filtroReformasFinalizado">
      <option selected value="0">Sin filtro</option>
      <option value="fin1">Solicitudes finalizadas</option>
      <option value="fin2">Solicitudes sin finalizar</option>
      </select></div>

      <div class="col-md-3 mb-3 mb-md-0">
      <h3>Filtrar por aprobadas:</h3>
      <select class="form-select" id="filtroReformasAprobado">
      <option selected value="0">Sin filtro</option>
      <option value="aprob1">Solicitudes aprobadas</option>
      <option value="aprob2">Solicitudes no aprobadas</option>
      <option value="aprob3">Solicitudes pendientes de aprobar</option>
      </select></div>
      <div class="col-md-3 mb-3 mb-md-0">
      <h3>Filtrar por zona:</h3>
      <select class="form-select" id="filtroReformasZona">
      <option selected value="0">Sin filtro</option>
      </select></div>
      <div class="col-md-3 mb-3 mb-md-0">
      <h3>Filtrar por tipo de reforma:</h3>
      <select class="form-select" id="filtroReformasTipo">
      <option selected value="0">Sin filtro</option>
      </select></div>
    </div>
    <div class="table-responsive-mobile d-md-flex flex-column align-items-center mb-5 divSolicitudes" id="divTablaReformas">
    <table class="tablaAdmin mb-5 fs-6" id="tablaTodasReformas">
    <thead>
    <tr>
    <th><span class="ordenarTodasReformas clickable user-select-none" data-value="1">ID reforma<i id="triangleIDReformas" class="bi bi-caret-down-fill align-middle"></i></span></th>
    <th>Usuario</th>
    <th>¿Fue aprobada?</th>
    <th>Zona reforma</th>
    <th>Tipo reforma</th>
    <th><span class="ordenarTodasReformas clickable user-select-none" data-value="2">Metros cuadrados<i id="triangleMetros" class="bi bi-caret-down-fill align-middle"></i></span></th>
    <th><span class="ordenarTodasReformas clickable user-select-none" data-value="3">Precio aprox.<i id="trianglePrecio" class="bi bi-caret-down-fill align-middle"></i></span></th>
    <th>Jefe al mando</th>
    <th>DNI Jefe</th>
    <th>Descripción adicional</th>
    <th><span class="ordenarTodasReformas clickable user-select-none" data-value="4">Fecha de inicio<i id="triangleFechaInicio" class="bi bi-caret-down-fill align-middle"></i></span></th>
    <th><span class="ordenarTodasReformas clickable user-select-none" data-value="5">Fecha de finalización<i id="triangleFechaFin" class="bi bi-caret-down-fill align-middle"></i></span></th>
    <th>¿Ha finalizado?</th>
    <th>Foto del antes</th>
    <th>Foto del después</th>
    <th>Editar</th>
    <th>Eliminar</th>
    <th>Generar PDF</th>
    </tr>
    </thead>
    <tbody id="bodyTabla">
    </tbody>
    </table>
    </div>`).appendTo("#divSeccionesAdmin");

    $(`<nav aria-label="Paginacion mostrar tablas" class="mb-5" id="navTablaReformas">
      <ul class="pagination justify-content-center pagination-lg">
        <li class="page-item" id="liPagAnteriorReformas">
          <button class="page-link" id="pagAnteriorReformas"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill" viewBox="0 0 16 16">
          <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
        </svg></button>
        </li>
        <li class="page-item" id="liPagSiguienteReformas">
          <button class="page-link" id="pagSiguienteReformas"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
          <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
        </svg></button>
        </li>
      </ul>
      </nav>`).appendTo("#divSeccionesAdmin");

      $(`<p class="fs-4 mb-5 d-none" id="pNoEncontrado">No se han encontrado reformas.</p>`).appendTo("#divSeccionesAdmin");
  }

  function mostrarTodasReformas(reforma) {
    var claseTr = '';
    if (reforma.reforma_aprobada === "Aprobada") {
      claseTr = 'reforma-aprobada';
    } else if (reforma.reforma_aprobada === "No aprobada") {
      claseTr = 'reforma-rechazada';
    } else {
      claseTr = 'reforma-pendiente';
    }

    var btnGenerarPDF = '';
    if (reforma.reforma_aprobada == "Aprobada" && reforma.finalizado == "Solicitud finalizada") {
      btnGenerarPDF = '<button class="btn btn-info btn-lg pdfSolicitudReforma" value="' + reforma.id_reforma + '"><i class="bi bi-file-earmark-pdf-fill"></i></button>'
    } else {
      btnGenerarPDF = '<button class="btn btn-info btn-lg" disabled><i class="bi bi-file-earmark-pdf-fill"></i></button>'
    }

    $('<tr class="' + claseTr + '">' +
      '<td>' + reforma.id_reforma + '</td>' +
      '<td>' + reforma.nombre_usuario + '</td>' +
      '<td>' + reforma.reforma_aprobada + '</td>' +
      '<td>' + reforma.nombre_zona + '</td>' +
      '<td>' + reforma.nombre_proyecto + '</td>' +
      '<td>' + reforma.cantidad_metros + '</td>' +
      '<td>' + reforma.precio_aprox + '€</td>' +
      '<td>' + reforma.nombre_completo_jefe + '</td>' +
      '<td>' + reforma.dni_jefe + '</td>' +
      '<td><div class="descReforma">' + reforma.descripcion_reforma + '</div></td>' +
      '<td>' + reforma.fecha_inicio + '</td>' +
      '<td>' + reforma.fecha_finalizacion + '</td>' +
      '<td>' + reforma.finalizado + '</td>' +
      '<td><img src="' + reforma.foto_antes + '" width="150" height="112.5"/></td>' +
      '<td><img src="' + reforma.foto_despues + '" width="150" height="112.5"/></td>' +
      '<td class="tdBlanco"><button class="btn btn-primary btn-lg editarSolicitudReforma" value="' + reforma.id_reforma + '"><i class="bi bi-pencil-square"></i></button></td>' +
      '<td class="tdBlanco"><button class="btn btn-danger btn-lg eliminarSolicitudReforma" value="' + reforma.id_reforma + '"><i class="bi bi-trash3-fill"></i></button></td>' +
      '<td class="tdBlanco">'+ btnGenerarPDF +'</td>' +
      '</tr>').appendTo("#bodyTabla");
  }

  function cargarDatosClientes(pagina, orden) {
    $.ajax({
      url: 'php/getTodosClientesTabla.php',
      type: 'GET',
      data: { pagina: pagina,
              orden: orden
            },
      success: function (resultado) {
        var respuesta = JSON.parse(resultado);
        var clientes = respuesta.datos;
        var paginaActual = parseInt(respuesta.pagina_actual);
        var totalPaginas = parseInt(respuesta.total_paginas);

        $("#bodyTabla").empty();
        for (var cliente of clientes) {
          mostrarTodosClientes(cliente);
        }

        if (paginaActual == 1) {
          $("#liPagAnteriorClientes").addClass("disabled");
        } else {
          $("#liPagAnteriorClientes").removeClass("disabled");
        }

        if (paginaActual == totalPaginas) {
          $("#liPagSiguienteClientes").addClass("disabled");
        } else {
          $("#liPagSiguienteClientes").removeClass("disabled");
        }
      },
      error: function () {
        alert("Ha habido un error: getTodosClientesTabla.php.");
      }
    });
  }

  $(document).on("click", "#pagAnteriorClientes", function (event) {
    event.preventDefault();
    if (paginaActual > 1) {
      paginaActual--;
      cargarDatosClientes(paginaActual, ordenActual);
    }
  });

  $(document).on("click", "#pagSiguienteClientes", function (event) {
    event.preventDefault();
    paginaActual++;
    cargarDatosClientes(paginaActual, ordenActual);
  });

  function verClientesReforma() {
    crearFormularioClientes();
    crearTablaClientes();
    cargarDatosClientes(paginaActual, ordenActual);
  }

  function selectJefes(jefe) {
    $('<option value="' + jefe.id_jefe + '">' + jefe.nombre_completo_jefe + ' - ' + jefe.dni_jefe + '</option>').appendTo("#supervisorEmpleado");
  }

  function selectTipoEmpleado(tipoE) {
    $('<option value="' + tipoE.id_rol_empleado + '">' + tipoE.nombre_rol_empleado + '</option>').appendTo("#tipoEmpleado");
  }

  function cargarDatosEmpleados(pagina, orden) {
    $.ajax({
      url: 'php/getTodosEmpleados.php',
      type: 'GET',
      data: { pagina: pagina,
              orden: orden
             },
      success: function (resultado) {
        var respuesta = JSON.parse(resultado);
        var empleados = respuesta.datos;
        var paginaActual = parseInt(respuesta.pagina_actual);
        var totalPaginas = parseInt(respuesta.total_paginas);

        $("#bodyTabla").empty();
        for (var empleado of empleados) {
          mostrarTodosEmpleados(empleado);
        }

        if (paginaActual == 1) {
          $("#liPagAnteriorEmpleados").addClass("disabled");
        } else {
          $("#liPagAnteriorEmpleados").removeClass("disabled");
        }

        if (paginaActual == totalPaginas) {
          $("#liPagSiguienteEmpleados").addClass("disabled");
        } else {
          $("#liPagSiguienteEmpleados").removeClass("disabled");
        }
      },
      error: function () {
        alert("Ha habido un error: getTodosEmpleados.php.");
      }
    });
  }

  $(document).on("click", "#pagAnteriorEmpleados", function (event) {
    event.preventDefault();
    if (paginaActual > 1) {
      paginaActual--;
      cargarDatosEmpleados(paginaActual, ordenActual);
    }
  });

  $(document).on("click", "#pagSiguienteEmpleados", function (event) {
    event.preventDefault();
    paginaActual++;
    cargarDatosEmpleados(paginaActual, ordenActual);
  });

  $(document).on("click", "#ordenarIDEmpleado", function(event) {
    event.preventDefault();
    paginaActual = 1;
    var iconoSelec = $("#triangleIDEmpleado");
    if (iconoSelec.hasClass("bi-caret-down-fill")) {
      iconoSelec.toggleClass("bi-caret-down-fill bi-caret-up-fill");
      ordenActual = "Empleados.id_empleado ASC";
    } else {
      iconoSelec.toggleClass("bi-caret-up-fill bi-caret-down-fill");
      ordenActual = "Empleados.id_empleado DESC";
    }

    cargarDatosEmpleados(paginaActual, ordenActual); 
  });


  function verEmpleadosReforma() {
    crearFormularioEmpleados();
    crearTablaEmpleados();
    cargarDatosEmpleados(paginaActual, ordenActual);

    $.ajax({
      type: "GET",
      url: "php/mostrarSelectJefesReforma.php",
      success: function (resultado) {
        var jefes = JSON.parse(resultado);
        for (var jefe of jefes) {
          selectJefes(jefe);
        }
      },
      error: function () {
        alert("Ha habido un error: mostrarSelectJefesReforma.php.");
      },
    });

    $.ajax({
      type: "GET",
      url: "php/getTipoEmpleado.php",
      success: function (resultado) {
        var tipoEmpleados = JSON.parse(resultado);
        for (var tipoEmpleado of tipoEmpleados) {
          selectTipoEmpleado(tipoEmpleado);
        }

      },
      error: function () {
        alert("Ha habido un error: getTipoEmpleado.php.");
      },
    });
  }

  function cargarDatosJefes(pagina, orden) {
    $.ajax({
      url: 'php/getTodosJefes.php',
      type: 'GET',
      data: { pagina: pagina,
              orden: orden
             },
      success: function (resultado) {
        var respuesta = JSON.parse(resultado);
        var jefes = respuesta.datos;
        var paginaActual = parseInt(respuesta.pagina_actual);
        var totalPaginas = parseInt(respuesta.total_paginas);

        $("#bodyTabla").empty();
        for (var jefe of jefes) {
          mostrarTodosJefes(jefe);
        }

        if (paginaActual == 1) {
          $("#liPagAnteriorJefes").addClass("disabled");
        } else {
          $("#liPagAnteriorJefes").removeClass("disabled");
        }

        if (paginaActual == totalPaginas) {
          $("#liPagSiguienteJefes").addClass("disabled");
        } else {
          $("#liPagSiguienteJefes").removeClass("disabled");
        }
      },
      error: function () {
        alert("Ha habido un error: getTodosJefes.php.");
      }
    });
  }

  $(document).on("click", "#pagAnteriorJefes", function (event) {
    event.preventDefault();
    if (paginaActual > 1) {
      paginaActual--;
      cargarDatosJefes(paginaActual, ordenActual);
    }
  });

  $(document).on("click", "#pagSiguienteJefes", function (event) {
    event.preventDefault();
    paginaActual++;
    cargarDatosJefes(paginaActual, ordenActual);
  });

  $(document).on("click", "#ordenarIDJefe", function(event) {
    event.preventDefault();
    paginaActual = 1;
    var iconoSelec = $("#triangleIDJefe");
    if (iconoSelec.hasClass("bi-caret-down-fill")) {
      iconoSelec.toggleClass("bi-caret-down-fill bi-caret-up-fill");
      ordenActual = "Jefes.id_jefe ASC";
    } else {
      iconoSelec.toggleClass("bi-caret-up-fill bi-caret-down-fill");
      ordenActual = "Jefes.id_jefe DESC";
    }

    cargarDatosJefes(paginaActual, ordenActual); 
  });

  function verJefesReforma() {
    crearFormularioJefes();
    crearTablaJefes();
    cargarDatosJefes(paginaActual, ordenActual);

  }

  function verReseñasAprobar() {
    cargarDatosReseñas(paginaActual);
  }

  function cargarDatosReseñas(pagina) {
    $.ajax({
      url: 'php/getTodasResenasAprobar.php',
      type: 'GET',
      data: { pagina: pagina },
      success: function (resultado) {
        var respuesta = JSON.parse(resultado);
        var reseñas = respuesta.datos;
        var paginaActual = parseInt(respuesta.pagina_actual);
        var totalPaginas = parseInt(respuesta.total_paginas);

        if (reseñas.length == 0) {
          $('<h2 class="h2Cliente text-lg-start text-center">Reseñas por aprobar</h2> <p class="fs-4 mb-5 text-lg-start text-center">No se han encontrado reseñas pendientes de aprobar.</p>').appendTo("#divSeccionesAdmin");
        } else {
        $("#divReseñas").empty();
        $('<h2 class="h2Cliente text-lg-start text-center">Reseñas por aprobar</h2>').appendTo("#divSeccionesAdmin");
        crearDivReseñas();
        for (var reseña of reseñas) {
          mostrarTodasReseñas(reseña);
        }
      }

      if (paginaActual == 1) {
        $("#liPagAnteriorReseñas").addClass("disabled");
      } else {
        $("#liPagAnteriorReseñas").removeClass("disabled");
      }

      if (paginaActual == totalPaginas) {
        $("#liPagSiguienteReseñas").addClass("disabled");
      } else {
        $("#liPagSiguienteReseñas").removeClass("disabled");
      }
      },
      error: function () {
        alert("Ha habido un error: getTodasReseñasAprobar.php.");
      }
    });
  }

  $(document).on("click", "#liPagAnteriorReseñas", function (event) {
    event.preventDefault();
    if (paginaActual > 1) {
      paginaActual--;
      cargarDatosReseñas(paginaActual);
    }
  });

  $(document).on("click", "#liPagSiguienteReseñas", function (event) {
    event.preventDefault();
    paginaActual++;
    cargarDatosReseñas(paginaActual);
  });

  function crearDivReseñas() {
    $(`<div id="divReseñas"></div>`).appendTo("#divSeccionesAdmin");


    $(`<nav aria-label="Paginacion mostrar tablas" class="mb-5">
    <ul class="pagination justify-content-center pagination-lg">
      <li class="page-item" id="liPagAnteriorReseñas">
        <button class="page-link" id="pagAnteriorReseñas"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill" viewBox="0 0 16 16">
        <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
      </svg></button>
      </li>
      <li class="page-item" id="liPagSiguienteReseñas">
        <button class="page-link" id="pagSiguienteReseñas"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
        <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
      </svg></button>
      </li>
    </ul>
    </nav>`).appendTo("#divSeccionesAdmin");
  }

  function mostrarTodasReseñas(reseña){
    var comentario = "";
    if (reseña.comentario_reseña == "") {
      comentario = "<h3>El usuario no ha añadido comentarios a la reseña</h3>";
    } else {
      comentario = `<q class="h3">${reseña.comentario_reseña}</q>`;
    }

    $(`<div class="divCampoReseñas mb-5">
    <table class="table d-flex table-borderless">
      <tr>
      <td><p class="fs-4 mb-0">Usuario de la reseña:</p></td>
      <td><h3>${reseña.nombre_usuario}</h3></td>
      </tr>
      <tr>
      <td><p class="fs-4 mb-0">ID del proyecto reseñado:</p></td>
      <td><h3>${reseña.proyecto_reseñado}</h3></td>
      </tr>
      <tr>
      <td><p class="fs-4 mb-0">Puntuación de la reseña:</p></td>
      <td><h3>${reseña.puntuacion} / 5</h3></td>
      </tr>
      <tr>
      <td><p class="fs-4 mb-0">Comentario de la reseña:</p></td>
      <td>`+ comentario +`</td>
      </tr>
      </table>
      <div id="divBotonesReseña" class="d-flex justify-content-center"><button class="btn btn-outline-success me-2 aprobarReseña" value="${reseña.id_reseña}">Aprobar</button> <button class="btn btn-outline-danger ms-2 denegarReseña" value="${reseña.id_reseña}">Denegar</button></div>
    </div>
    `).appendTo("#divReseñas");
  }

  function crearTablaClientes() {
    $('<h2 class="h2Cliente text-lg-start text-center">Vista de todos los clientes</h2>' +
      '<div class="table-responsive-mobile d-md-flex flex-column align-items-center mb-5 divSolicitudes">' +
      '<table class="tablaAdmin mb-5 fs-5">' +
      '<thead>' +
      '<tr>' +
      '<th><span class="clickable user-select-none" id="ordenarIDCliente">ID cliente<i id="triangleIDCliente" class="bi bi-caret-down-fill align-middle"></i></span></th>' +
      '<th>Nombre del usuario</th>' +
      '<th>DNI del usuario</th>' +
      '<th>Email</th>' +
      '<th>Número de teléfono</th>' +
      '<th>¿La cuenta está activa?</th>' +
      '<th>Editar</th>' +
      '<th>Eliminar</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody id="bodyTabla">' +
      '</tbody>' +
      '</table>' +
      '</div>').appendTo("#divSeccionesAdmin");

      $(`<nav aria-label="Paginacion mostrar tablas" class="mb-5">
      <ul class="pagination justify-content-center pagination-lg">
        <li class="page-item" id="liPagAnteriorClientes">
          <button class="page-link" id="pagAnteriorClientes"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill" viewBox="0 0 16 16">
          <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
        </svg></button>
        </li>
        <li class="page-item" id="liPagSiguienteClientes">
          <button class="page-link" id="pagSiguienteClientes"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
          <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
        </svg></button>
        </li>
      </ul>
      </nav>`).appendTo("#divSeccionesAdmin");
  }

  function crearTablaEmpleados() {
    $('<h2 class="h2Cliente text-lg-start text-center">Vista de todos los empleados</h2>' +
      '<div class="table-responsive-mobile d-md-flex flex-column align-items-center mb-5 divSolicitudes">' +
      '<table class="tablaAdmin mb-5 fs-5">' +
      '<thead>' +
      '<tr>' +
      '<th><span class="clickable user-select-none" id="ordenarIDEmpleado">ID empleado<i id="triangleIDEmpleado" class="bi bi-caret-down-fill align-middle"></i></span></th>' +
      '<th>Nombre del empleado</th>' +
      '<th>DNI del empleado</th>' +
      '<th>Email</th>' +
      '<th>Número de teléfono</th>' +
      '<th>Tipo de empleado</th>' +
      '<th>Supervisor del empleado</th>' +
      '<th>Editar</th>' +
      '<th>Eliminar</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody id="bodyTabla">' +
      '</tbody>' +
      '</table>' +
      '</div>').appendTo("#divSeccionesAdmin");

      $(`<nav aria-label="Paginacion mostrar tablas" class="mb-5">
      <ul class="pagination justify-content-center pagination-lg">
        <li class="page-item" id="liPagAnteriorEmpleados">
          <button class="page-link" id="pagAnteriorEmpleados"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill" viewBox="0 0 16 16">
          <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
        </svg></button>
        </li>
        <li class="page-item" id="liPagSiguienteEmpleados">
          <button class="page-link" id="pagSiguienteEmpleados"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
          <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
        </svg></button>
        </li>
      </ul>
      </nav>`).appendTo("#divSeccionesAdmin");
  }

  function crearTablaJefes() {
    $('<h2 class="h2Cliente text-lg-start text-center">Vista de todos los jefes</h2>' +
      '<div class="table-responsive-mobile d-md-flex flex-column align-items-center mb-5 divSolicitudes">' +
      '<table class="tablaAdmin mb-5 fs-5">' +
      '<thead>' +
      '<tr>' +
      '<th><span class="clickable user-select-none" id="ordenarIDJefe">ID jefe<i id="triangleIDJefe" class="bi bi-caret-down-fill align-middle"></i></span></th>' +
      '<th>Nombre del jefe</th>' +
      '<th>DNI del jefe</th>' +
      '<th>¿Sigue en activo en la empresa?</th>' +
      '<th>Editar</th>' +
      '<th>Eliminar</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody id="bodyTabla">' +
      '</tbody>' +
      '</table>' +
      '</div>').appendTo("#divSeccionesAdmin");

      $(`<nav aria-label="Paginacion mostrar tablas" class="mb-5">
      <ul class="pagination justify-content-center pagination-lg">
        <li class="page-item" id="liPagAnteriorJefes">
          <button class="page-link" id="pagAnteriorJefes"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill" viewBox="0 0 16 16">
          <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
        </svg></button>
        </li>
        <li class="page-item" id="liPagSiguienteJefes">
          <button class="page-link" id="pagSiguienteJefes"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
          <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
        </svg></button>
        </li>
      </ul>
      </nav>`).appendTo("#divSeccionesAdmin");
  }

  function mostrarTodosClientes(cliente) {
    var clienteActivo = "";
    if (cliente.cuenta_activa == 1) {
      clienteActivo = "Sí"
    } else {
      clienteActivo = "No"
    }

    $('<tr>' +
      '<td>' + cliente.id_usuario + '</td>' +
      '<td>' + cliente.nombre_usuario + '</td>' +
      '<td>' + cliente.dni_usuario + '</td>' +
      '<td>' + cliente.email + '</td>' +
      '<td>' + cliente.num_tlf + '</td>' +
      '<td>' + clienteActivo + '</td>' +
      '<td><button class="btn btn-primary btn-lg editarCliente" value="' + cliente.id_usuario + '"><i class="bi bi-pencil-square"></i></button></td>' +
      '<td><button class="btn btn-danger btn-lg eliminarCliente" value="' + cliente.id_usuario + '"><i class="bi bi-trash3-fill"></i></button></td>' +
      '</tr>').appendTo("#bodyTabla");
  }

  function mostrarTodosEmpleados(empleado) {
    var jefeEmpleado = "";
    if (empleado.supervisor_empleado == null) {
      jefeEmpleado = "Sin jefe asignado";
    } else {
      jefeEmpleado = empleado.nombre_completo_jefe + ' - ' + empleado.dni_jefe;
    }

    $('<tr>' +
      '<td>' + empleado.id_empleado + '</td>' +
      '<td>' + empleado.nombre_empleado + '</td>' +
      '<td>' + empleado.dni_empleado + '</td>' +
      '<td>' + empleado.email_empleado + '</td>' +
      '<td>' + empleado.num_tlf_empleado + '</td>' +
      '<td>' + empleado.nombre_rol_empleado + '</td>' +
      '<td>' + jefeEmpleado + '</td>' +
      '<td><button class="btn btn-primary btn-lg editarEmpleado" value="' + empleado.id_empleado + '"><i class="bi bi-pencil-square"></i></button></td>' +
      '<td><button class="btn btn-danger btn-lg eliminarEmpleado" value="' + empleado.id_empleado + '"><i class="bi bi-trash3-fill"></i></button></td>' +
      '</tr>').appendTo("#bodyTabla");
  }

  function mostrarTodosJefes(jefe) {
    var jefeActivo = "";
    if (jefe.jefe_activo == 1) {
      jefeActivo = "Sí"
    } else {
      jefeActivo = "No"
    }

    $('<tr>' +
      '<td>' + jefe.id_jefe + '</td>' +
      '<td>' + jefe.nombre_completo_jefe + '</td>' +
      '<td>' + jefe.dni_jefe + '</td>' +
      '<td>' + jefeActivo + '</td>' +
      '<td><button class="btn btn-primary btn-lg editarJefe" value="' + jefe.id_jefe + '"><i class="bi bi-pencil-square"></i></button></td>' +
      '<td><button class="btn btn-danger btn-lg eliminarJefe" value="' + jefe.id_jefe + '"><i class="bi bi-trash3-fill"></i></button></td>' +
      '</tr>').appendTo("#bodyTabla");
  }
});