<?php
include("conexion.php");

$idReforma = (int)($_GET['id_reforma'] ?? 0);

$query_verificar = "SELECT * FROM `Proyecto_reforma` WHERE id_reforma = $idReforma";
$resultado = $conexion->query($query_verificar);

$jsonData=array();

while($row = mysqli_fetch_assoc($resultado)){
 $jsonData[] = quitar_secretos($row);
}

echo json_encode($jsonData);

$conexion->close();
?>