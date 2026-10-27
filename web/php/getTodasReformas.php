<?php
include("conexion.php");

$ordenTabla = orden_seguro(isset($_GET['orden']) ? $_GET['orden'] : '', array('Proyecto_reforma.id_reforma','Proyecto_reforma.fecha_inicio','Proyecto_reforma.fecha_finalizacion','Proyecto_reforma.metros_aprox_reforma','Proyecto_reforma.precio_aprox'), 'Proyecto_reforma.id_reforma DESC');
$filtros = isset($_GET['filtros']) && is_array($_GET['filtros']) ? $_GET['filtros'] : [];
$limite_por_pagina = 5; // Número de filas por página

// Obtener el número de página actual
$pagina_actual = pagina_actual();
$offset = ($pagina_actual - 1) * $limite_por_pagina;

$query_base = "SELECT *, 
    IFNULL(Jefes.nombre_completo_jefe, 'Sin asignar') AS nombre_completo_jefe, 
    IFNULL(Jefes.dni_jefe, 'Sin asignar') AS dni_jefe, 
    IFNULL(Proyecto_reforma.descripcion_reforma, 'Sin descripción') AS descripcion_reforma,
    IFNULL(Proyecto_reforma.foto_antes, 'img-pagina/no_image.jpg') AS foto_antes, 
    IFNULL(Proyecto_reforma.foto_despues, 'img-pagina/no_image.jpg') AS foto_despues, 
    CASE 
        WHEN Proyecto_reforma.reforma_aprobada = 1 THEN 'Aprobada' 
        WHEN Proyecto_reforma.reforma_aprobada = 0 THEN 'No aprobada' 
        ELSE 'Pendiente de aprobar' 
    END AS reforma_aprobada,
    CASE 
        WHEN Proyecto_reforma.finalizado = 1 THEN 'Solicitud finalizada' 
        ELSE 'Solicitud sin finalizar' 
    END AS finalizado
FROM Proyecto_reforma 
JOIN Usuarios ON Proyecto_reforma.usuario_solicitante = Usuarios.id_usuario 
JOIN Zonas_Valencia ON Proyecto_reforma.zona_reforma = Zonas_Valencia.id_zona
JOIN Tipo_proyecto ON Proyecto_reforma.tipo_reforma = Tipo_proyecto.id_tipo_proyecto 
JOIN Metros_reforma ON Proyecto_reforma.metros_aprox_reforma = Metros_reforma.id_metros 
LEFT JOIN Jefes ON Proyecto_reforma.jefe_seleccionado = Jefes.id_jefe";

$conditions = [];

// Agregar condiciones basadas en los filtros
if (isset($filtros['finalizado'])) {
    if ($filtros['finalizado'] == 'fin1') {
        $conditions[] = "Proyecto_reforma.finalizado = 1";
    } elseif ($filtros['finalizado'] == 'fin2') {
        $conditions[] = "Proyecto_reforma.finalizado = 0";
    }
}

if (isset($filtros['aprobado'])) {
    if ($filtros['aprobado'] == 'aprob1') {
        $conditions[] = "Proyecto_reforma.reforma_aprobada = 1";
    } elseif ($filtros['aprobado'] == 'aprob2') {
        $conditions[] = "Proyecto_reforma.reforma_aprobada = 0";
    } elseif ($filtros['aprobado'] == 'aprob3') {
        $conditions[] = "Proyecto_reforma.reforma_aprobada IS NULL";
    }
}

    $total_zonas_query = "SELECT COUNT(*) AS total_zonas FROM Zonas_Valencia";
    $resultado = $conexion->query($total_zonas_query);
    $total_zonas_data = $resultado->fetch_assoc();
    $total_zonas = (int) $total_zonas_data['total_zonas'];

    if (isset($filtros['zona'])) {
        for ($i=1; $i <= $total_zonas; $i++) { 
            if ($filtros['zona'] == 'zona'.$i) {
                $conditions[] = "Proyecto_reforma.zona_reforma = $i";
            }
        }
    }

    $total_tipos_query = "SELECT COUNT(*) AS total_tipo FROM Zonas_Valencia";
    $resultado = $conexion->query($total_tipos_query);
    $total_tipos_data = $resultado->fetch_assoc();
    $total_tipos = (int) $total_tipos_data['total_tipo'];

    if (isset($filtros['tipo'])) {
        for ($i=1; $i <= $total_tipos; $i++) { 
            if ($filtros['tipo'] == 'tipo'.$i) {
                $conditions[] = "Proyecto_reforma.tipo_reforma = $i";
            }
        }
    }

// Construir la consulta final con las condiciones si existen
if (count($conditions) > 0) {
    $query_base .= " WHERE " . implode(" AND ", $conditions);
}

$query_base .= " ORDER BY $ordenTabla LIMIT $offset, $limite_por_pagina";

// Ejecutar la consulta
$resultado = $conexion->query($query_base);

$jsonData = array();

while ($row = mysqli_fetch_assoc($resultado)) {
    $row['fecha_inicio'] = $row['fecha_inicio'] ? date("d/m/Y", strtotime($row['fecha_inicio'])) : 'Sin fecha de inicio';
    $row['fecha_finalizacion'] = $row['fecha_finalizacion'] ? date("d/m/Y", strtotime($row['fecha_finalizacion'])) : 'Sin fecha de finalización';
    $jsonData[] = quitar_secretos($row);
}

// Obtener el total de filas considerando los filtros
$total_filas_query = "SELECT COUNT(*) AS total_filas FROM Proyecto_reforma";
if (count($conditions) > 0) {
    $total_filas_query .= " WHERE " . implode(" AND ", $conditions);
}
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
