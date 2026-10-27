<?php
include("conexion.php");

$id_reforma = (int)($_GET['idReforma'] ?? 0);

$dir_imagenes = '../img_reformas/';
$dir_reportes = '../reportes_reformas/';

$imagenesReformaAntes = [
    $dir_imagenes . "reforma_antes_" . $id_reforma . ".jpg",
    $dir_imagenes . "reforma_antes_" . $id_reforma . ".png",
    $dir_imagenes . "reforma_antes_" . $id_reforma . ".jpeg"
];

$imagenesReformaDespues = [
    $dir_imagenes . "reforma_despues_" . $id_reforma . ".jpg",
    $dir_imagenes . "reforma_despues_" . $id_reforma . ".png",
    $dir_imagenes . "reforma_despues_" . $id_reforma . ".jpeg"
];

$pdfReforma = $dir_reportes . "reporte_reforma_" . $id_reforma . ".pdf";

foreach ($imagenesReformaAntes as $imagen1) {
    if (file_exists($imagen1)) {
        unlink($imagen1);
    }
}

foreach ($imagenesReformaDespues as $imagen2) {
    if (file_exists($imagen2)) {
        unlink($imagen2);
    }
}

// Eliminar el reporte PDF
if (file_exists($pdfReforma)) {
    unlink($pdfReforma);
}

// Eliminar la reforma de la base de datos
$query_eliminar = "DELETE FROM Proyecto_reforma WHERE id_reforma = '$id_reforma'";

if ($conexion->query($query_eliminar) === TRUE) {
    echo "true";
} else {
    echo "error";
}

$conexion->close();
?>
