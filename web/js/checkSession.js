$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "php/checkSession.php",
        success: function (resultado) {
            resultado = JSON.parse(resultado);
            $("#liDocumentos").addClass("noDisplay");
            $("#liDocumentosF").addClass("noDisplay");
            if (resultado.user == false) {
                $("#linkCuenta").html('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-circle me-2 mb-1" viewBox="0 0 16 16"><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/><path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/></svg>Iniciar sesión');
                $("#linkCuenta").attr({ href: "iniciar_sesion.html" });
                $("#linkCuentaF").html("Iniciar sesión");
                $("#linkCuentaF").attr({ href: "iniciar_sesion.html" });
            } else {
                $("#linkCuentaF").html(resultado.user);
                $("#linkCuenta").html('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-circle me-2 mb-1" viewBox="0 0 16 16"><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/><path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/></svg>' + resultado.user);
                var newListItem = $("<li class='nav-item p-2'> <a class='nav-link cerrarSession' href=''> <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' class='bi bi-box-arrow-left mb-1 me-1' viewBox='0 0 16 16'><path fill-rule='evenodd' d='M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z'/><path fill-rule='evenodd' d='M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z'/></svg> Cerrar sesión</a> </li>");
                var newListItemF = $("<li class='nav-item p-2'> <a class='nav-link cerrarSession' href=''>Cerrar sesión</a></li>");
                $("ul#navMenuUser").append(newListItem);
                $("ul#navMenuUserF").append(newListItemF);
                if (resultado.rol == 2) {
                    $("#linkCuenta").attr({ href: "empleado.html" });
                    $("#linkCuentaF").attr({ href: "empleado.html" });
                } else if (resultado.rol == 3) {
                    $("#linkCuenta").attr({ href: "cliente.html" });
                    $("#linkCuentaF").attr({ href: "cliente.html" });
                    $("#liDocumentos").removeClass("noDisplay");
                    $("#liDocumentosF").removeClass("noDisplay");
                } else {
                    $("#linkCuenta").attr({ href: "admin.html" });
                    $("#linkCuentaF").attr({ href: "admin.html" });
                }
            }
        },
        error: function () {
            alert("Ha habido un error al iniciar sesión: checkSession.php.");
        },
    });

    $(document).on("click", ".cerrarSession", function (event) {
        event.preventDefault();
        $.ajax({
            type: "GET",
            url: "php/cerrarSesion.php",
            success: function () {
                location.href = "index.html";
            },
            error: function () {
                alert("Ha habido un error al cerrar sesión: cerrarSesion.php.");
            },
        });
    });
});