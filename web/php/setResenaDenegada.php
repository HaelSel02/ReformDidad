<?php
include("conexion.php");

$idResena = (int)($_GET['idResena'] ?? ($_GET['idReseña'] ?? 0));

    $query_actualizar = "UPDATE Reseñas SET reseña_aprobada = 0 WHERE id_reseña = $idResena";

    if ($conexion->query($query_actualizar) === TRUE) {
        echo "correct";
    } else {
        echo "error";
    }

$conexion->close();
?>
