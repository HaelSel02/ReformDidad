<?php
include("conexion.php");

$idCliente = (int)($_GET['idCliente'] ?? 0);

$query_verificar = "SELECT COUNT(*) as reformas FROM Proyecto_reforma WHERE usuario_solicitante = '$idCliente'";
$resultado_verificacion = $conexion->query($query_verificar);

if ($resultado_verificacion) {
    $row = $resultado_verificacion->fetch_assoc();
    if ($row['reformas'] > 0) {
        // Si tiene proyectos de reforma, actualizamos el campo del usuario
        $query_actualizar = "UPDATE Usuarios SET cuenta_activa = '0' WHERE id_usuario = '$idCliente'";
        if ($conexion->query($query_actualizar) === TRUE) {
            echo "inactivo";
        } else {
            echo "error"; // . $conexion->error
        }
    } else {
        // Si no tiene proyectos de reforma, procedemos a eliminar el usuario
        $query_eliminar = "DELETE FROM Usuarios WHERE id_usuario = '$idCliente'";
        if ($conexion->query($query_eliminar) === TRUE) {
            echo "eliminado";
        } else {
            echo "error"; // . $conexion->error
        }
    }
} else {
    echo "error"; // . $conexion->error
}

$conexion->close();
?>
