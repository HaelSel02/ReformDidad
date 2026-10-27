<?php
include("conexion.php");

// Número de registros a mostrar por página
$limite_por_pagina = 5;

// Obtener el número de página actual desde la URL, si no está presente, se asume la página 1
if (isset($_GET['pagina'])) {
    $pagina = pagina_actual();
} else {
    $pagina = 1;
}

// Calcular el desplazamiento (offset)
$offset = ($pagina-1) * $limite_por_pagina;

// Consulta para obtener el número total de filas
$query_total = "SELECT COUNT(*) as total_filas FROM Proyecto_reforma";
$resultado_total = $conexion->query($query_total);
$row_total = $resultado_total->fetch_assoc();
$total_filas = $row_total['total_filas'];

// Calcular el número total de páginas
$total_paginas = ceil($total_filas / $limite_por_pagina);

// Consulta para obtener los datos de la página actual
$query_datos = "SELECT * FROM Proyecto_reforma LIMIT $offset, $limite_por_pagina";
$resultado_datos = $conexion->query($query_datos);

$datos = [];
if ($resultado_datos->num_rows > 0) {
    while($row = $resultado_datos->fetch_assoc()) {
        $datos[] = $row;
    }
}
$conexion->close();

echo json_encode([
    'datos' => $datos,
    'total_paginas' => $total_paginas,
    'pagina_actual' => $pagina
]);
?>
