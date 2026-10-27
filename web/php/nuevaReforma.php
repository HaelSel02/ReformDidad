<?php
include("conexion.php");

$user = (int)$_SESSION['id_user'];
$tipoReforma = (int)($_POST['tipoReforma'] ?? 0);
$zonaReforma = (int)($_POST['zonaReforma'] ?? 0);
$metrosReforma = (int)($_POST['metrosReforma'] ?? 0);
$precioReforma = (float)($_POST['precioReforma'] ?? 0);

// Consulta para contar el número de inserciones realizadas por el usuario
$query_count = "SELECT COUNT(*) AS num_reformas FROM Proyecto_reforma WHERE usuario_solicitante = '$user'AND finalizado = 0";
$result_count = $conexion->query($query_count);

if ($result_count) {
    $row = $result_count->fetch_assoc();
    $num_reformas = $row['num_reformas'];

    // Verificar si el usuario ha alcanzado el límite de 2 inserciones
    if ($num_reformas < 2) {
        // Si no ha alcanzado el límite, realizar la inserción
        $query_insert = "INSERT INTO Proyecto_reforma (usuario_solicitante, zona_reforma, tipo_reforma, metros_aprox_reforma, precio_aprox, finalizado) VALUES ('$user', '$zonaReforma', '$tipoReforma', '$metrosReforma', '$precioReforma', '0')";
        if ($conexion->query($query_insert)) {
            echo "true"; // insert realizado
        } else {
            echo "false"; // Error al insertar
        }
    } else {
        echo "errorLimit"; // El usuario ha alcanzado el límite de inserciones
    }
}

$conexion->close();
?>
