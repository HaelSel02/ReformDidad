<?php
include("conexion.php");

$idUsuario = (int)($_GET['idUsuario'] ?? 0);

$query_verificar = "SELECT * FROM `Usuarios` WHERE id_usuario = $idUsuario";
$resultado = $conexion->query($query_verificar);

$jsonData=array();

while($row = mysqli_fetch_assoc($resultado)){
 $row = quitar_secretos($row);
 $row['password'] = PASS_SIN_CAMBIOS;
 $jsonData[] = $row;
}

echo json_encode($jsonData);

$conexion->close();
?>