$(document).ready(function () {
    var container = document.querySelector('.mycontainer');
    $(document).on('input','.slider', (e) => {
        container.style.setProperty('--position', `${e.target.value}%`);
    });

    var paginaActual = 1;

    function cargarDatosPagina(pagina) {
        $.ajax({
            url: 'php/getReformasGaleria.php',
            type: 'GET',
            data: { pagina: pagina },
            success: function (resultado) {
                var respuesta = JSON.parse(resultado);
                var galeria = respuesta.datos;
                var paginaActual = parseInt(respuesta.pagina_actual);
                var totalPaginas = parseInt(respuesta.total_paginas);
                if (galeria.length == 0) {
                    $("#mainDiv").empty();
                    $(`<h1 class="mt-5 mb-5 text-center">Galería de reformas</h1>
                        <p class="fs-4">No hay reseñas para mostrar actualmente.</p>`).appendTo("#mainDiv");
                } else {
                    $("#imgsGaleria, #infoGaleria, #sliderImgs").fadeOut(500, function () {
                        // Limpiar el contenedor después de que se complete el fadeOut
                        $("#imgsGaleria").empty();
                        $("#infoGaleria").empty();
                        $("#sliderImgs").empty();
                        container.style.setProperty('--position', `50%`);
                        
                        // Agregar las nuevas imágenes y mostrarlas con fadeIn
                        for (var reformaGaleria of galeria) {
                            mostrarReformaGaleria(reformaGaleria);
                        }
                        $("#imgsGaleria, #infoGaleria, #sliderImgs").fadeIn(500); // Mostrar las nuevas imágenes
                    });
                }
                // Deshabilitar botón "Anterior" si estamos en la primera página
                if (paginaActual == 1) {
                    $('#liImgsAnterior').addClass('disabled');
                } else {
                    $('#liImgsAnterior').removeClass('disabled');
                }

                // Deshabilitar botón "Siguiente" si estamos en la última página
                if (paginaActual == totalPaginas) {
                    $('#liImgsSiguiente').addClass('disabled');
                } else {
                    $('#liImgsSiguiente').removeClass('disabled');
                }
            },
            error: function () {
                alert("Ha habido un error al iniciar sesión: getReformasGaleria.php.");
            }
        });
    }

    function mostrarReformaGaleria(galeria) {
        $(`<img class="image-before slider-image" src="${galeria.foto_antes}" alt="foto antes" />
        <img class="image-after slider-image" src="${galeria.foto_despues}" alt="foto después" />`).appendTo("#imgsGaleria");

        $(`<input type="range" min="0" max="100" value="50" aria-label="Percentage of before photo shown"
        class="slider" />
    <div class="slider-line" aria-hidden="true"></div>
    <div class="slider-button" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
            viewBox="0 0 256 256">
            <rect width="256" height="256" fill="none"></rect>
            <line x1="128" y1="40" x2="128" y2="216" fill="none" stroke="currentColor"
                stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line>
            <line x1="96" y1="128" x2="16" y2="128" fill="none" stroke="currentColor"
                stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line>
            <polyline points="48 160 16 128 48 96" fill="none" stroke="currentColor"
                stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline>
            <line x1="160" y1="128" x2="240" y2="128" fill="none" stroke="currentColor"
                stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line>
            <polyline points="208 96 240 128 208 160" fill="none" stroke="currentColor"
                stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline>
        </svg>
    </div>`).appendTo("#sliderImgs");

        var comentarioUsuario = "";
        if (galeria.comentario_reseña == "") {
            comentarioUsuario = '<p class="fs-5">No hay comentarios añadidos.</p>';
        } else {
            comentarioUsuario = '<q class="fs-5">'+ galeria.comentario_reseña +'</q>';
        }
        
        $(`<div id="reseñaUsuario" class="text-lg-start text-center w-100">
        <h2 class="fs-3 colorUsuario">${galeria.nombre_usuario}</h2>
        <p class="fs-5">Fecha de inicio de la reforma: <br><span class="fw-bold">${galeria.fecha_inicio}</span></p>
        <p class="fs-5">Fecha de finalizacion de la reforma: <br><span class="fw-bold">${galeria.fecha_finalizacion}</span></p>
        <input type="hidden" id="cantidadValoracion" value="${galeria.puntuacion}">
        <div id="valoracionReseña" class="fs-3 mb-3">
            <span data-value="1" class="valorReforma"><i class="bi bi-star"></i></span>
            <span data-value="2" class="valorReforma"><i class="bi bi-star"></i></span>
            <span data-value="3" class="valorReforma"><i class="bi bi-star"></i></span>
            <span data-value="4" class="valorReforma"><i class="bi bi-star"></i></span>
            <span data-value="5" class="valorReforma"><i class="bi bi-star"></i></span>
            </div>
        ${comentarioUsuario}
    </div>`).appendTo("#infoGaleria");

    var valor = parseInt($('#cantidadValoracion').val());
    var estrellas = $('#valoracionReseña .valorReforma i');
    for (var i = 0; i < valor; i++) {
        $(estrellas[i]).removeClass('bi-star').addClass('bi-star-fill');
    }
    }

    $(document).on("click", "#imgsAnterior", function () {
        if (paginaActual > 1) {
            paginaActual--;
            cargarDatosPagina(paginaActual);
        }
    });

    $(document).on('click', '#imgsSiguiente', function () {
        paginaActual++;
        cargarDatosPagina(paginaActual);
    });

    cargarDatosPagina(paginaActual);

});