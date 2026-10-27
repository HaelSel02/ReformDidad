<?php
include("conexion.php");

// Sin paginación para asegurar que se devuelven todos los usuarios
$query = "SELECT * FROM `Usuarios` JOIN Rol ON Usuarios.tipo_usuario = Rol.id_rol WHERE tipo_usuario = 3 ORDER BY id_usuario DESC";
$resultado = $conexion->query($query);

$jsonData = array();

while ($row = mysqli_fetch_assoc($resultado)) {
    $jsonData[] = quitar_secretos($row);
}

echo json_encode([
    'datos' => $jsonData
]);

$conexion->close();
?>