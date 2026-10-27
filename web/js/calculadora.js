$(document).ready(function() {
  var selectTipoReforma = document.querySelector("#selectTipoReforma");
  var selectMetrosReforma = document.querySelector("#selectMetrosReforma");
  var selectZonaReforma = document.querySelector("#selectZonaReforma");
  var btnCalcular = document.querySelector("#btnCalcular");
  var idUsuario;

  $.ajax({
    type: "GET",
    url: "php/checkSession.php",
    success: function (resultado) {
        resultado = JSON.parse(resultado);
        if(resultado.user == false){
          location.href = "iniciar_sesion.html";
        }
        else if (resultado.rol != 3){
          location.href = "index.html";
        } else {
          idUsuario = resultado.id_user
        }
      }
    });

    $.ajax({
        type: "GET",
        url: "php/mostrarSelectTipoReforma.php",
        success: function (resultado) {
          var tipo_reforma = jQuery.parseJSON(resultado);
          for (var tipRefor of tipo_reforma) {
            mostrarSelectTipoReforma(tipRefor);
          }
        },
    
        error: function () {
          alert("Atencion: se ha producido un error (mostrarSelectTipoReforma.php)");
        },
      });

      $.ajax({
        type: "GET",
        url: "php/mostrarSelectMetrosReforma.php",
    
        success: function (resultado) {
          var metros_reforma = jQuery.parseJSON(resultado);
          for (var mrefor of metros_reforma) {
            mostrarSelectMetrosReforma(mrefor);
          }
        },
    
        error: function () {
          alert("Atencion: se ha producido un error (mostrarSelectMetrosReforma.php)");
        },
      });

      $.ajax({
        type: "GET",
        url: "php/mostrarSelectZonaReforma.php",
    
        success: function (resultado) {
          var zona_reforma = jQuery.parseJSON(resultado);
          for (var zonRefor of zona_reforma) {
            mostrarSelectZonaReforma(zonRefor);
          }
        },
    
        error: function () {
          alert("Atencion: se ha producido un error (mostrarSelectZonaReforma.php)");
        },
      });

    selectTipoReforma.addEventListener('change', verificarSeleccion);
    selectMetrosReforma.addEventListener('change', verificarSeleccion);
    selectZonaReforma.addEventListener('change', verificarSeleccion);

      function mostrarSelectTipoReforma(tipo){
        $("<option value='"+ tipo.id_tipo_proyecto +"' data-calculo1='"+ tipo.calculo_proyecto +"'>"+ tipo.nombre_proyecto +"</option>").appendTo("#selectTipoReforma");
      };

      function mostrarSelectMetrosReforma(metros){
        $("<option value='"+ metros.id_metros +"' data-calculo2='"+ metros.calculo_metros +"'>"+ metros.cantidad_metros +"</option>").appendTo("#selectMetrosReforma");
      };

      function mostrarSelectZonaReforma(zona){
        $("<option value='"+ zona.id_zona +"' data-calculo3='"+ zona.calculo_zona +"'>"+ zona.nombre_zona +"</option>").appendTo("#selectZonaReforma");
      };

      $("#btnCalcular").click(function(event) {
        event.preventDefault()
        $("#divCalculoFinal").html('<div class="spinner-border" role="status"></div><h3 class="colorTextoLogo mt-4">Realizando cálculo...</h3>');

          var numTipo = parseInt(selectTipoReforma.options[selectTipoReforma.selectedIndex].getAttribute('data-calculo1'));
          var numMetros = parseInt(selectMetrosReforma.options[selectMetrosReforma.selectedIndex].getAttribute('data-calculo2'));
          var numZona = parseInt(selectZonaReforma.options[selectZonaReforma.selectedIndex].getAttribute('data-calculo3'));

          setTimeout(function() {
            var resultado = numTipo * numMetros * numZona;
            // Mostrar el resultado
            $("#divCalculoFinal").html('<h2 class="fs-1 text-center">El precio de la reforma sería aproximadamente:</h2>' +
                '<h2 class="fs-1 colorTextoLogo">' + resultado + '.00€</h2> <button class="btn btn-success mt-2" id="btnSolicitar" value="'+ resultado +'.00">Solicitar reforma</button>');
        }, 2000);
      });

      $(document).on("click", "#btnSolicitar", function(event) {
        event.preventDefault();
        var idTipo = parseInt(selectTipoReforma.options[selectTipoReforma.selectedIndex].getAttribute('value'));
        var idZona = parseInt(selectZonaReforma.options[selectZonaReforma.selectedIndex].getAttribute('value'));
        var idMetros = parseInt(selectMetrosReforma.options[selectMetrosReforma.selectedIndex].getAttribute('value'));
        var precioAprox = parseFloat($(this).val());
        var datos = {
          usuario: idUsuario,
          tipoReforma: idTipo,
          zonaReforma: idZona,
          metrosReforma: idMetros,
          precioReforma: precioAprox
      };

        $.ajax({
          type: "POST",
          url: "php/nuevaReforma.php",
          data: datos,
          success: function (resultado) {
            if (resultado == "true") {
              $("#divCalculoFinal").append("<p class='colorTextoLogo fs-5 text-center mt-4 mb-0'>Reforma solicitada correctamente. El administrador la aceptará si ve conveniente la reforma.</p>");
              $("#btnSolicitar").attr("disabled", true);
            } else if(resultado == "false") {
              $("#divCalculoFinal").append("<p class='colorTextoLogo fs-5 text-center mt-4 mb-0'>Ha habido un error al soliciar la reforma. Contacte con el administrador para solucionarlo.</p>");
            } else if(resultado == "errorLimit"){
              $("#divCalculoFinal").append("<p class='colorTextoLogo fs-5 text-center mt-4 mb-0'>Límite de reformas solicitadas alcanzada. El máximo es de 2 simultáneas. Una vez terminada una reforma, puede solicitar otra.</p>");
              $("#btnSolicitar").attr("disabled", true);
            }
          },
      
          error: function () {
            alert("Atencion: se ha producido un error (nuevaReforma.php)");
          },
        });

      });

      function verificarSeleccion() {
        if (selectTipoReforma.value !="0" && selectMetrosReforma.value !="0" && selectZonaReforma.value !="0") {
            btnCalcular.disabled = false;
        } else {
            btnCalcular.disabled = true;
        }
    }
});