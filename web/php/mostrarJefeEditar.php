<?php
include("conexion.php");

$idJefe = (int)($_GET['idJefe'] ?? 0);

$query_verificar = "SELECT * FROM `Jefes` WHERE id_jefe = $idJefe";
$resultado = $conexion->query($query_verificar);

$jsonData=array();

while($row = mysqli_fetch_assoc($resultado)){
 $jsonData[] = quitar_secretos($row);
}

echo json_encode($jsonData);

$conexion->close();
?>