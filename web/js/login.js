$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "php/checkSession.php",
        success: function (resultado) {
            resultado = JSON.parse(resultado);
            if (resultado.user != false) {
                location.href = "index.html";
            }
        },
        error: function () {
            alert("Ha habido un error al iniciar sesión: checkSession.php.");
        },
    });

    $("#btnAcceder").click(function (event) {
        event.preventDefault();
        $("#div-error").empty();
        var user = $("#inputUsuarioLog").val();
        var password = $("#inputPassLog").val();

        if (user == "" || password == "") {
            $("<p class='error mb-0 mt-3'>Hay algunos campos vacíos, rellénalos.</p>").appendTo(
                "#div-error"
            );
        } else {
            var datos_user = $("#myLog").serialize();
            $.ajax({
                type: "POST",
                url: "php/getUsuarios.php",
                data: datos_user,
                success: function (resultado) {
                    if (typeof resultado === "string" && resultado.startsWith("Error")) {
                        $("<p class='error mb-0 mt-3'>" + resultado + "</p>").appendTo("#div-error"); // Mostrar el mensaje de error
                    } else {
                        location.href = "index.html";
                    }
                },
                error: function () {
                    alert("Ha habido un error al iniciar sesión: getUsuarios.php.");
                },
            });
        }
    });

});