$(document).ready(function() {
    var imgsArray = [
        { url: "img-pagina/reformas-1.jpg" },
        { url: "img-pagina/reformas-2.jpg" },
        { url: "img-pagina/reformas-3.jpg" },
        { url: "img-pagina/reformas-4.jpg" }
    ];
    
    imgsArray.forEach(function(image, index) {
        var activeClass = index == 0 ? ' active' : ''; //Si la primera imagen es index 0, item active
        var carouselItem = `
            <div class="carousel-item${activeClass}">
                <img src="${image.url}" class="d-block w-100" alt="imagen inicio ${(index + 1)} reformdidad ">
                <div class="carousel-caption d-block">
                    <h1 class="display-1 fw-semibold mb-md-5" id="titDiv">ReformDidad</h1>
                    <a href="calculadora_reforma.html" class="btn btn-secondary btn-lg display-1 fw-semibold p-2 p-md-4" id="btnInicio">Solicitar reforma</a>
                </div>
            </div>
        `;
        $('#carouselReformdidad').append(carouselItem);
    });
});