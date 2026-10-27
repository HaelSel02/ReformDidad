<?php
include("conexion.php");
$idUsuario = (int)($_GET['id_usuario'] ?? 0);
$query_verificar = "SELECT * FROM `Proyecto_reforma` JOIN Zonas_Valencia ON Proyecto_reforma.zona_reforma = Zonas_Valencia.id_zona JOIN Tipo_proyecto ON Proyecto_reforma.tipo_reforma = Tipo_proyecto.id_tipo_proyecto JOIN Metros_reforma ON Proyecto_reforma.metros_aprox_reforma = Metros_reforma.id_metros JOIN Jefes ON Proyecto_reforma.jefe_seleccionado = Jefes.id_jefe WHERE `reforma_aprobada` = 1 AND `finalizado` = 0 AND `usuario_solicitante` = $idUsuario";
$resultado = $conexion->query($query_verificar);

$jsonData=array();

while($row = mysqli_fetch_assoc($resultado)){
    $row['fecha_inicio'] = $row['fecha_inicio'] ? date("d/m/Y", strtotime($row['fecha_inicio'])) : 'Sin fecha de inicio';
    $row['fecha_finalizacion'] = $row['fecha_finalizacion'] ? date("d/m/Y", strtotime($row['fecha_finalizacion'])) : 'Sin fecha de finalización';
 $jsonData[] = quitar_secretos($row);
}

echo json_encode($jsonData);

$conexion->close();
?>