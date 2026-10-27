<?php
include("conexion.php");

$idUsuario = (int)($_GET['id_user'] ?? 0);

	$sql=$conexion->query("SELECT * FROM `Usuarios` WHERE id_usuario = $idUsuario");
	$jsonData=array();

while($row = mysqli_fetch_assoc($sql)){
 $jsonData[] = quitar_secretos($row);
}

echo json_encode($jsonData);

$conexion->close();

?>