<?php
include("conexion.php");

$idEmpleado = (int)($_GET['idEmpleado'] ?? 0);

$query_verificar = "SELECT * FROM `Empleados` WHERE id_empleado = $idEmpleado";
$resultado = $conexion->query($query_verificar);

$jsonData=array();

while($row = mysqli_fetch_assoc($resultado)){
 $row = quitar_secretos($row);
 $row['password_empleado'] = PASS_SIN_CAMBIOS;
 $jsonData[] = $row;
}

echo json_encode($jsonData);

$conexion->close();
?>