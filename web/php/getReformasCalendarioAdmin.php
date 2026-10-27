<?php
include("conexion.php");

$query_verificar = "SELECT * FROM `Proyecto_reforma` JOIN Usuarios ON Proyecto_reforma.usuario_solicitante = Usuarios.id_usuario WHERE reforma_aprobada = 1 AND finalizado = 0";
$resultado = $conexion->query($query_verificar);

$jsonData=array();

while($row = mysqli_fetch_assoc($resultado)){
 $jsonData[] = quitar_secretos($row);
}

echo json_encode($jsonData);

$conexion->close();
?>