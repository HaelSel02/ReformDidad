<?php
include("conexion.php");

$idUsuario = (int)($_GET['id_usuario'] ?? 0);
$idJefe = (int)($_GET['id_supervisor'] ?? 0);

$query_verificar = "SELECT * FROM `Proyecto_reforma` JOIN Usuarios ON Proyecto_reforma.usuario_solicitante = Usuarios.id_usuario JOIN Jefes ON Proyecto_reforma.jefe_seleccionado = Jefes.id_jefe JOIN Empleados ON Empleados.supervisor_empleado = Jefes.id_jefe WHERE reforma_aprobada = '1' AND finalizado = '0' AND jefe_seleccionado = '$idJefe'";
$resultado = $conexion->query($query_verificar);

$jsonData=array();

while($row = mysqli_fetch_assoc($resultado)){
 $jsonData[] = quitar_secretos($row);
}

echo json_encode($jsonData);

$conexion->close();
?>