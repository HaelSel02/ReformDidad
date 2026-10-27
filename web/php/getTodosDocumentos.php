<?php
include("conexion.php");

$idUsuario = (int)($_GET['id_usuario'] ?? 0);
$ordenTabla = orden_seguro(isset($_GET['orden']) ? $_GET['orden'] : '', array('fecha_inicio','precio_aprox','id_reforma'), 'id_reforma DESC');
$filtroTabla = (int)($_GET['filtro'] ?? 0);

// Parámetros de paginación
$limite_por_pagina = 10; // Número de filas por página

// Obtener el número de página actual
$pagina_actual = pagina_actual();
$offset = ($pagina_actual - 1) * $limite_por_pagina;

// Inicializar la variable para la consulta SQL
$query_verificar = "";

// Construir la consulta SQL basada en el filtro
switch ($filtroTabla) {
    case 1:
        // Si filtroTabla es 1, ejecutar esta consulta
        $query_verificar = "SELECT * FROM `Proyecto_reforma` 
                            JOIN Documentos_favoritos ON Proyecto_reforma.id_reforma = Documentos_favoritos.id_reforma_documento
                            JOIN Tipo_proyecto ON Proyecto_reforma.tipo_reforma = Tipo_proyecto.id_tipo_proyecto
                            JOIN Zonas_Valencia ON Proyecto_reforma.zona_reforma = Zonas_Valencia.id_zona
                            WHERE usuario_solicitante = $idUsuario
                            AND campo_reforma_pdf IS NOT NULL
                            AND es_favorito = 1
                            ORDER BY $ordenTabla
                            LIMIT $offset, $limite_por_pagina";
        break;

    default:
        // Si el filtro no coincide con ningún caso, ejecutar una consulta predeterminada
        $query_verificar = "SELECT * FROM `Proyecto_reforma` 
                            JOIN Documentos_favoritos ON Proyecto_reforma.id_reforma = Documentos_favoritos.id_reforma_documento
                            JOIN Tipo_proyecto ON Proyecto_reforma.tipo_reforma = Tipo_proyecto.id_tipo_proyecto
                            JOIN Zonas_Valencia ON Proyecto_reforma.zona_reforma = Zonas_Valencia.id_zona
                            WHERE usuario_solicitante = $idUsuario
                            AND campo_reforma_pdf IS NOT NULL
                            ORDER BY $ordenTabla
                            LIMIT $offset, $limite_por_pagina";
        break;
}

$resultado = $conexion->query($query_verificar);

$jsonData = array();

while ($row = mysqli_fetch_assoc($resultado)) {
    $row['fecha_inicio'] = $row['fecha_inicio'] ? date("d/m/Y", strtotime($row['fecha_inicio'])) : 'Sin fecha de inicio';
    $row['fecha_finalizacion'] = $row['fecha_finalizacion'] ? date("d/m/Y", strtotime($row['fecha_finalizacion'])) : 'Sin fecha de finalización';
    $jsonData[] = quitar_secretos($row);
}

// Obtener el total de filas
$total_filas_query = "SELECT COUNT(*) AS total_filas FROM `Proyecto_reforma` WHERE usuario_solicitante = $idUsuario AND campo_reforma_pdf IS NOT NULL";
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
