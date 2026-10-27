$(document).ready(function() {
    
        $.ajax({
            type: "GET",
            url: "php/mostrarFAQ.php",
            success: function (resultado) {
              var faqs = JSON.parse(resultado);
              for (var allFaq of faqs) {
                mostrarFaq(allFaq);
              }
            },
            error: function () {
              alert("Ha habido un error al iniciar sesión: mostrarFAQ.php.");
            },
          });
   
          function mostrarFaq(faq){
            $("<a data-bs-toggle='collapse' href='#respuesta"+ faq.id_faq +"' role='button' aria-expanded='false' aria-controls='respuesta"+ faq.id_faq +"' class='linkPregunta'> <p class='pregunta'>"+ faq.pregunta +" <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-caret-down-square' viewBox='0 0 16 16'>" +
            "<path d='M3.626 6.832A.5.5 0 0 1 4 6h8a.5.5 0 0 1 .374.832l-4 4.5a.5.5 0 0 1-.748 0z'/>" + 
            "<path d='M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z'/>"+
          "</svg></p></a>" +
            "<div class='collapse multi-collapse divWrapRespuestas' id='respuesta"+ faq.id_faq +"'>"+
              "<div class='card card-body divRespuestas'>"+
              "<p class='mb-0'>"+faq.respuesta+"</p>" + 
              "</div>"+
            "</div>").appendTo("#divFaqs");
          }
});