$(document).ready(function () {
    var id_usuario;
    var paginaActual = 1;
    var orden = 'id_reforma DESC';
    var filtro = 0;

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
                    $(".nombreUserH1").html("Documentos de las reformas finalizadas de <span class='nomUsuario'>" + resultado.user + "</span>");
                    id_usuario = resultado.id_user;
                    cargarDatosDocumentos(paginaActual, orden, filtro);
                }
            },
            error: function () {
                alert("Ha habido un error al iniciar sesión: checkSession.php.");
            },
        });
    }

    checkSession();
    function cargarDatosDocumentos(pagina, orden, filtro) {
        $.ajax({
            url: 'php/getTodosDocumentos.php',
            type: 'GET',
            data: {
                pagina: pagina,
                id_usuario: id_usuario,
                orden: orden,
                filtro: filtro
            },
            success: function (resultado) {
                var respuesta = JSON.parse(resultado);
                var tablaDocumentos = respuesta.datos;
                var paginaActual = parseInt(respuesta.pagina_actual);
                var totalPaginas = parseInt(respuesta.total_paginas);
                if (tablaDocumentos.length == 0) {
                    $("#divTablaDocumentos").empty();
                    if ($("#navPaginacion").hasClass("d-none") == false) {
                        $("#navPaginacion").addClass("d-none");
                    }
                    $(`<p class="pReformasInfo text-center">No se han encontrado documentos con los filtros añadidos.</p>`).appendTo("#divTablaDocumentos");
                } else {
                $("#divTablaDocumentos").empty();
                crearTablaDocumentos();
                if ($("#navPaginacion").hasClass("d-none")) {
                    $("#navPaginacion").removeClass("d-none");
                }
                for (var documentos of tablaDocumentos) {
                    mostrarTodosDocumentos(documentos);
                }
            }

            if (paginaActual == 1) {
                $("#liPagAnteriorDocumentos").addClass("disabled");
            } else {
                $("#liPagAnteriorDocumentos").removeClass("disabled");
            }

            if (paginaActual == totalPaginas) {
                $("#liPagSiguienteDocumentos").addClass("disabled");
            } else {
                $("#liPagSiguienteDocumentos").removeClass("disabled");
            }

            },
            error: function () {
                alert("Ha habido un error: getTodosDocumentos.php.");
            }
        });
    }

    $(document).on("click", "#pagAnteriorDocumentos", function (event) {
        event.preventDefault();
        if (paginaActual > 1) {
            paginaActual--;
            cargarDatosDocumentos(paginaActual, orden, filtro);
        }
    });

    $(document).on("click", "#pagSiguienteDocumentos", function (event) {
        event.preventDefault();
        paginaActual++;
        cargarDatosDocumentos(paginaActual, orden, filtro);
    });

    $(document).on("click", ".favorite-btn", function (event) {
        event.preventDefault();
        var button = $(this);
        var idFavorito = $(this).val();
        $.ajax({
            url: 'php/setDocumentoFavorito.php',
            type: 'POST',
            data: { idFavorito: idFavorito },
            success: function (resultado) {
                if (resultado == "correct") {
                    if (button.find('i').hasClass('bi-heart-fill')) {
                        button.find('i').removeClass('bi-heart-fill').addClass('bi-heart');
                    } else {
                        button.find('i').removeClass('bi-heart').addClass('bi-heart-fill');
                    }
                } else {
                    console.log("Error, no se funciona la marcación de favoritos.");
                }
            },
            error: function () {
                console.log("Ha habido un error: setDocumentoFavorito.php.");
            }
        });
    })

    $(document).on("click", "#ordenarFecha", function () {
        paginaActual = 1;
        var iconoFecha = $("#triangleFecha");
        var iconoPrecio = $("#trianglePrecio");

        if (iconoPrecio.hasClass("bi-caret-up-fill")) {
            iconoPrecio.removeClass("bi-caret-up-fill").addClass("bi-caret-down-fill");
        }

        if (iconoFecha.hasClass("bi-caret-down-fill")) {
            iconoFecha.removeClass("bi-caret-down-fill").addClass("bi-caret-up-fill");
            orden = "fecha_inicio ASC";
            cargarDatosDocumentos(paginaActual, orden, filtro);
        } else {
            iconoFecha.removeClass("bi-caret-up-fill").addClass("bi-caret-down-fill");
            orden = "fecha_inicio DESC";
            cargarDatosDocumentos(paginaActual, orden, filtro);
        }
    });

    $(document).on("click", "#ordenarPrecio", function () {
        paginaActual = 1;
        var iconoPrecio = $("#trianglePrecio");
        var iconoFecha = $("#triangleFecha");

        if (iconoFecha.hasClass("bi-caret-up-fill")) {
            iconoFecha.removeClass("bi-caret-up-fill").addClass("bi-caret-down-fill");
        }

        if (iconoPrecio.hasClass("bi-caret-down-fill")) {
            iconoPrecio.removeClass("bi-caret-down-fill").addClass("bi-caret-up-fill");
            orden = "precio_aprox ASC";
            cargarDatosDocumentos(paginaActual, orden, filtro);
        } else {
            iconoPrecio.removeClass("bi-caret-up-fill").addClass("bi-caret-down-fill");
            orden = "precio_aprox DESC";
            cargarDatosDocumentos(paginaActual, orden, filtro);
        }
    });

    $("#selectFiltrosDocumentos").on("change", function() {
        var seleccionFiltro = $(this).val();
        filtro = seleccionFiltro;
        switch (seleccionFiltro) {
            case "1":
                paginaActual = 1;
                cargarDatosDocumentos(paginaActual, orden, filtro);
                break;
        
            default:
                filtro = 0;
                paginaActual = 1;
                cargarDatosDocumentos(paginaActual, orden, filtro);
                break;
        }
    })

    function crearTablaDocumentos() {
        $(`
        <table class="table table-hover text-center mb-5 fs-5" id="tableDocumentos">
        <thead>
            <tr>
                <th>Tipo de reforma</th>
                <th>Zona de reforma</th>
                <th><span id="ordenarFecha" class="clickable user-select-none">Fecha de inicio <i id="triangleFecha" class="bi bi-caret-down-fill align-middle"></i></span></th>
                <th><span id="ordenarPrecio" class="clickable user-select-none">Precio aproximado <i id="trianglePrecio" class="bi bi-caret-down-fill align-middle"></i></span></th>
                <th>Marcar como favorito</th>
                <th>Descargar PDF</th>
            </tr>
        </thead>
        <tbody id="bodyTablaDocumentos" class="table-group-divider">
        </tbody>
    </table>`).appendTo("#divTablaDocumentos");
    }

    function mostrarTodosDocumentos(documento) {
        var btnFavorito = "";
        if (documento.es_favorito == 0) {
            btnFavorito = `<button class="btn btn-info btn-lg favorite-btn text-light" value="${documento.id_documento_reforma}"><i class="bi bi-heart align-middle"></i></button>`
        } else {
            btnFavorito = `<button class="btn btn-info btn-lg favorite-btn text-light" value="${documento.id_documento_reforma}"><i class="bi bi-heart-fill align-middle"></i></button>`
        }

        var iconoFecha = $("#triangleFecha");
        var iconoPrecio = $("#trianglePrecio");
    
        if (orden == "fecha_inicio DESC") {
            iconoFecha.removeClass("bi-caret-up-fill").addClass("bi-caret-down-fill");
        } else if (orden == "fecha_inicio ASC") {
            iconoFecha.removeClass("bi-caret-down-fill").addClass("bi-caret-up-fill");
        } else if (orden == "precio_aprox DESC") {
            iconoPrecio.removeClass("bi-caret-up-fill").addClass("bi-caret-down-fill");
        } else if (orden == "precio_aprox ASC") {
            iconoPrecio.removeClass("bi-caret-down-fill").addClass("bi-caret-up-fill");
        }

        $(`<tr class="align-middle">
        <td>${documento.nombre_proyecto}</td>
        <td>${documento.nombre_zona}</td>
        <td>${documento.fecha_inicio}</td>
        <td>${documento.precio_aprox}€</td>
        <td>`+ btnFavorito + `</td>
        <td><a href="${documento.campo_reforma_pdf}" download><button class="btn btn-danger btn-lg"><i class="bi bi-file-earmark-pdf-fill align-middle"></i></button></a></td>
        </tr>`).appendTo("#bodyTablaDocumentos");
    }
});