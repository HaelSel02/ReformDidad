<?php
include("conexion.php");

$user = (int)($_GET['id_usuario'] ?? 0);

$query_verificar_reformas = "SELECT COUNT(*) as total_finalizadas FROM Proyecto_reforma WHERE usuario_solicitante = '$user' AND finalizado = 0";
$result = $conexion->query($query_verificar_reformas);

if ($result) {
    $row = $result->fetch_assoc();
    $total_finalizadas = $row['total_finalizadas'];

    if ($total_finalizadas >= 2) {
        echo "true";
    } else {
        echo "false";
    }
}

$conexion->close();
?>
