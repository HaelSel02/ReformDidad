<?php
include("conexion.php");

$idEmpleado = (int)($_GET['idEmpleado'] ?? 0);

    $query_eliminar = "DELETE FROM Empleados WHERE id_empleado = '$idEmpleado'";
    if ($conexion->query($query_eliminar) === TRUE) {
        echo "eliminado";
    } else {
        echo "error";
    }
    
$conexion->close();
?>
