<?php
include("conexion.php");

$idUsuario = (int)($_GET['id_usuario'] ?? 0);
$idJefe = (int)($_GET['id_supervisor'] ?? 0);

	$sql=$conexion->query("SELECT * FROM `Empleados` JOIN Jefes ON Empleados.supervisor_empleado = Jefes.id_jefe JOIN Rol_empleado ON Empleados.tipo_empleado = Rol_empleado.id_rol_empleado WHERE id_empleado = $idUsuario");
	$jsonData=array();

while($row = mysqli_fetch_assoc($sql)){
 $jsonData[] = quitar_secretos($row);
}

echo json_encode($jsonData);

$conexion->close();

?>