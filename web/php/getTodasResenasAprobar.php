<?php
include("conexion.php");

// Parámetros de paginación
$limite_por_pagina = 3; // Número de filas por página

// Obtener el número de página actual
$pagina_actual = pagina_actual();
$offset = ($pagina_actual - 1) * $limite_por_pagina;

// Consulta para obtener los datos con paginación
$query_verificar = "SELECT * FROM `Reseñas` JOIN Usuarios ON Reseñas.usuario_reseña = Usuarios.id_usuario WHERE reseña_aprobada IS NULL ORDER BY id_reseña DESC LIMIT $offset, $limite_por_pagina";
$resultado = $conexion->query($query_verificar);

$jsonData = array();

while ($row = mysqli_fetch_assoc($resultado)) {
    $jsonData[] = quitar_secretos($row);
}

// Obtener el total de filas
$total_filas_query = "SELECT COUNT(*) AS total_filas FROM `Reseñas` WHERE reseña_aprobada IS NULL";
$total_filas_resultado = $conexion->query($total_filas_query);
$total_filas_data = $total_filas_resultado->fetch_assoc();
$total_filas = $total_filas_data['total_filas'];

// Calcular el total de páginas
$total_paginas = ceil($total_filas / $limite_por_pagina);

echo json_encode([
    'datos' => $jsonData,
    'total_paginas' => $total_paginas,
    'pagina_actual' => $pagina_actual
]);

$conexion->close();
?>
