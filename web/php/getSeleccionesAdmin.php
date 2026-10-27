<?php
include("conexion.php");

$query_verificar = "SELECT * FROM `Jefes`";
$resultado = $conexion->query($query_verificar);

$jsonData=array();

while($row = mysqli_fetch_assoc($resultado)){
 $jsonData[] = quitar_secretos($row);
}

echo json_encode($jsonData);

$conexion->close();
?>