<?php
include("conexion.php");

// Parámetros de paginación
$limite_por_pagina = 1; // Número de filas por página

// Obtener el número de página actual
$pagina_actual = pagina_actual();
$offset = ($pagina_actual - 1) * $limite_por_pagina;

// Consulta para obtener los datos con paginación
$query_verificar = "SELECT * FROM `Proyecto_reforma` 
                    JOIN Reseñas ON Proyecto_reforma.id_reforma = Reseñas.proyecto_reseñado JOIN Usuarios ON Proyecto_reforma.usuario_solicitante = Usuarios.id_usuario
                    WHERE Proyecto_reforma.foto_antes IS NOT NULL 
                    AND Proyecto_reforma.foto_despues IS NOT NULL 
                    AND Reseñas.reseña_aprobada = 1
                    ORDER BY id_reforma DESC
                    LIMIT $offset, $limite_por_pagina";
$resultado = $conexion->query($query_verificar);

$jsonData = array();

while ($row = mysqli_fetch_assoc($resultado)) {
    $row['fecha_inicio'] = $row['fecha_inicio'] ? date("d/m/Y", strtotime($row['fecha_inicio'])) : 'Sin fecha de inicio';
    $row['fecha_finalizacion'] = $row['fecha_finalizacion'] ? date("d/m/Y", strtotime($row['fecha_finalizacion'])) : 'Sin fecha de finalización';
    $jsonData[] = quitar_secretos($row, true);
}

// Obtener el total de filas
$total_filas_query = "SELECT COUNT(*) AS total_filas FROM `Proyecto_reforma` JOIN Reseñas ON Proyecto_reforma.id_reforma = Reseñas.proyecto_reseñado
                        JOIN Usuarios ON Proyecto_reforma.usuario_solicitante = Usuarios.id_usuario
                        WHERE Proyecto_reforma.foto_antes IS NOT NULL 
                        AND Proyecto_reforma.foto_despues IS NOT NULL
                        AND Reseñas.reseña_aprobada = 1";
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
