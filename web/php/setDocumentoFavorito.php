<?php
include("conexion.php");

$idFavorito = (int)($_POST['idFavorito'] ?? 0);
$idUsuarioSesion = (int)$_SESSION['id_user'];

// Consultar el valor actual de es_favorito
$query_verificacion = "SELECT es_favorito FROM Documentos_favoritos WHERE id_documento_reforma = $idFavorito AND id_usuario_documento = $idUsuarioSesion";
$resultado = $conexion->query($query_verificacion);

if ($resultado->num_rows > 0) {
    $row = $resultado->fetch_assoc();
    if ($row['es_favorito'] == 0) {
        $nuevoValor = 1;
    } else {
        $nuevoValor = 0;
    }

    $query_actualizar = "UPDATE Documentos_favoritos SET es_favorito = $nuevoValor WHERE id_documento_reforma = $idFavorito AND id_usuario_documento = $idUsuarioSesion";

    if ($conexion->query($query_actualizar) === TRUE) {
        echo "correct";
    } else {
        echo "error";
    }
} else {
    echo "No se encontró el favorito.";
}

$conexion->close();
?>
