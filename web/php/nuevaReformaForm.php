<?php
include("conexion.php");

$usuarioForm = $_POST['usuarioSoli'];
$estadoForm = $_POST['estadoSoli'];
$zonaForm = $_POST['selecZonaReforma'];
$tipoForm = $_POST['selecTipoReforma'];
$metrosForm = $_POST['selecMetrosReforma'];
$jefeForm = isset($_POST['selecJefeReforma']) ? $_POST['selecJefeReforma'] : null;
$fechaInicioForm = $_POST['fechaInicioReforma'];
$fechaFinForm = isset($_POST['fechaFinalizacionReforma']) ? $_POST['fechaFinalizacionReforma'] : null;
$precioForm = $_POST['precioReforma'];
$descForm = $_POST['descReforma'];
$finSoliForm = $_POST['finalizacionSolicitud'];

// Preparar valores finales
$estadoFormFinal = ($estadoForm == 2) ? null : $estadoForm;
$jefeFormFinal = empty($jefeForm) ? null : $jefeForm;
$fechaInicioFormFinal = empty($fechaInicioForm) ? null : $fechaInicioForm;
$fechaFinFormFinal = empty($fechaFinForm) ? null : $fechaFinForm;
$descFormFinal = empty($descForm) ? null : $descForm;

// Contar el número de reformas no finalizadas para el usuario
$query_count = "SELECT COUNT(*) AS num_reformas FROM Proyecto_reforma WHERE usuario_solicitante = ? AND finalizado = 0";
$stmt_count = $conexion->prepare($query_count);
$stmt_count->bind_param("s", $usuarioForm);
$stmt_count->execute();
$result_count = $stmt_count->get_result();

if ($result_count) {
    $row = $result_count->fetch_assoc();
    $num_reformas = $row['num_reformas'];

    // Verificar si el usuario ha alcanzado el límite de 2 inserciones
    if ($num_reformas < 2) {
        $query = "INSERT INTO Proyecto_reforma (usuario_solicitante, reforma_aprobada, zona_reforma, tipo_reforma, metros_aprox_reforma, precio_aprox, jefe_seleccionado, descripcion_reforma, fecha_inicio, fecha_finalizacion, finalizado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt_insert = $conexion->prepare($query);
        $stmt_insert->bind_param(
            "sisssdsdsss",
            $usuarioForm,
            $estadoFormFinal,
            $zonaForm,
            $tipoForm,
            $metrosForm,
            $precioForm,
            $jefeFormFinal,
            $descFormFinal,
            $fechaInicioFormFinal,
            $fechaFinFormFinal,
            $finSoliForm
        );
        if ($stmt_insert->execute()) {
            echo "correct"; // Insert realizado
        } else {
            echo "error";
        }
        $stmt_insert->close();
    } else {
        echo "errorLimit"; // El usuario ha alcanzado el límite de inserciones
    }
    $stmt_count->close();
} else {
    echo "error";
}

$conexion->close();
?>