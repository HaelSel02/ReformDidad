<?php
include("conexion.php");

$idReforma = $_POST['idSolicitud'];
$jefeSeleccionado = $_POST['jefeSeleccionado'];
$fechaSeleccionada = $_POST['fechaSeleccionada'];
$seleccionAdmin = $_POST['seleccionAdmin'];
$textoDescripcion = $_POST['textoDescripcion'];

if ($seleccionAdmin == "true") {
    $query = "UPDATE Proyecto_reforma SET reforma_aprobada=?, jefe_seleccionado=?, fecha_inicio=?, descripcion_reforma=? WHERE id_reforma=?";
    $stmt = $conexion->prepare($query);
    $reforma_aprobada = 1;
    $stmt->bind_param("isssi", $reforma_aprobada, $jefeSeleccionado, $fechaSeleccionada, $textoDescripcion, $idReforma);
} else {
    $query = "UPDATE Proyecto_reforma SET reforma_aprobada=?, finalizado=? WHERE id_reforma=?";
    $stmt = $conexion->prepare($query);
    $reforma_aprobada = 0;
    $finalizado = 1;
    $stmt->bind_param("iii", $reforma_aprobada, $finalizado, $idReforma);
}

if ($stmt->execute()) {
    echo ($seleccionAdmin == "true") ? "true" : "false";
} else {
    echo "error: " . $stmt->error;
}

$stmt->close();
$conexion->close();
?>
