<?php
include("conexion.php");

	$sql=$conexion->query("SELECT * FROM FAQ");
	$jsonData=array();

while($row = mysqli_fetch_assoc($sql)){
 $jsonData[] = quitar_secretos($row);
}

echo json_encode($jsonData);

$conexion->close();

?>