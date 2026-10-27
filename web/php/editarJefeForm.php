<?php
include("conexion.php");

$idJefe = $_GET['id_jefe'];

$nombreJefe = $_POST['nombreJefeForm'];
$dniJefe = $_POST['dniJefe'];
$jefeActivo = $_POST['jefeActivo'];

// Verificar si el DNI ya está en uso por otro usuario en la tabla Usuarios
$query_verificar_dni_usuarios = "SELECT * FROM Usuarios WHERE dni_usuario = ?";
$stmt_verificar_dni_usuarios = $conexion->prepare($query_verificar_dni_usuarios);
$stmt_verificar_dni_usuarios->bind_param("s", $dniJefe);
$stmt_verificar_dni_usuarios->execute();
$resultado_dni_usuarios = $stmt_verificar_dni_usuarios->get_result();
$dni_existente_usuarios = $resultado_dni_usuarios->fetch_assoc();

// Verificar si el DNI ya está en uso por otro empleado en la tabla Empleados
$query_verificar_dni_empleados = "SELECT * FROM Empleados WHERE dni_empleado = ?";
$stmt_verificar_dni_empleados = $conexion->prepare($query_verificar_dni_empleados);
$stmt_verificar_dni_empleados->bind_param("s", $dniJefe);
$stmt_verificar_dni_empleados->execute();
$resultado_dni_empleados = $stmt_verificar_dni_empleados->get_result();
$dni_existente_empleados = $resultado_dni_empleados->fetch_assoc();

// Verificar si el DNI ya está en uso por otro empleado en la tabla Jefes
$query_verificar_dni_jefes = "SELECT * FROM Jefes WHERE dni_jefe = ? AND id_jefe != ?";
$stmt_verificar_dni_jefes = $conexion->prepare($query_verificar_dni_jefes);
$stmt_verificar_dni_jefes->bind_param("si", $dniJefe, $idJefe);
$stmt_verificar_dni_jefes->execute();
$resultado_dni_jefes = $stmt_verificar_dni_jefes->get_result();
$dni_existente_jefes = $resultado_dni_jefes->fetch_assoc();

// Verificar si hay algún campo repetido
if ($dni_existente_usuarios || $dni_existente_empleados || $dni_existente_jefes) {
    echo "El DNI ya está en uso por otro usuario, empleado o jefe.";
} else {
    $query = "UPDATE Jefes SET nombre_completo_jefe = ?, dni_jefe = ?, jefe_activo = ? WHERE id_jefe = ?";
    $stmt_update = $conexion->prepare($query);
    $stmt_update->bind_param("sssi", $nombreJefe, $dniJefe, $jefeActivo, $idJefe);
    if ($stmt_update->execute()) {
        echo "correct";
    } else {
        echo "error";
    }
}

$conexion->close();
?>