<?php
include("conexion.php");
require_once '../dompdf/autoload.inc.php';

use Dompdf\Dompdf;

$dompdf = new Dompdf();

$path = '../templates/logo_prov.png';
$type = pathinfo($path, PATHINFO_EXTENSION);
$data = file_get_contents($path);
$base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);

$idReforma = (int)($_GET['idReforma'] ?? 0);

$query_verificar = "SELECT * FROM `Proyecto_reforma` JOIN Usuarios ON Proyecto_reforma.usuario_solicitante = Usuarios.id_usuario
JOIN Zonas_Valencia ON Proyecto_reforma.zona_reforma = Zonas_Valencia.id_zona
JOIN Tipo_proyecto ON Proyecto_reforma.tipo_reforma = Tipo_proyecto.id_tipo_proyecto JOIN Metros_reforma ON Proyecto_reforma.metros_aprox_reforma = Metros_reforma.id_metros
JOIN Jefes ON Proyecto_reforma.jefe_seleccionado = Jefes.id_jefe WHERE id_reforma = $idReforma";

$resultado = $conexion->query($query_verificar);

if ($resultado->num_rows > 0) {
    $row = $resultado->fetch_assoc();
    $fecha_inicio = date('d/m/Y', strtotime($row['fecha_inicio']));
    $fecha_finalizacion = date('d/m/Y', strtotime($row['fecha_finalizacion']));
    
    // Generar el contenido del PDF con CSS optimizado para Dompdf
    $html = '<!DOCTYPE html>
    <html lang="es">
    <head>
    <meta charset="UTF-8">
    <title>Reporte de Reforma</title>
    <style>
        /* Aplicar fuente por defecto a todo el documento */
        body {
            font-family: Helvetica, Arial, sans-serif;
            font-size: 18px;
            color: #333333;
            line-height: 1.3;
        }
        
        /* Estructura general de la tabla de datos */
        table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 15px;
        }
        
        td {
            border: 1px solid #d3d3d3;
            padding: 8px 10px; /* Reducir ligeramente el padding para evitar espacios exagerados */
        }
        
        .bolderTd {
            font-weight: bold;
            color: #111111;
        }

        /* Encabezado limpio usando tablas o bloques seguros para Dompdf */
        #headerPdf {
            margin-bottom: 15px;
            text-align: center;
            width: 100%;
        }

        .header-table {
            width: 100%;
            border: none;
        }

        .header-table td {
            border: none;
            text-align: center;
            vertical-align: middle;
        }

        #headerPdf h1 {
            color: #B16305;
            font-size: 48px;
            margin: 0;
        }
        
        #txtReporte {
            text-align: center;
            font-size: 24px;
            color: #444444;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div id="divPdf">
        <table class="header-table" id="headerPdf">
            <tr>
                <td>
                    <h1>ReformDidad</h1>
                </td>

        <td><img src="'. $base64 .'" width="90"/></td>
            </tr>
        </table>
        
        <div id="txtReporte"><strong>Reporte de reforma #'.$idReforma.'</strong></div>
        
        <table>
            <tr><td>Usuario de la solicitud:</td><td class="bolderTd">' . $row['nombre_usuario'] . '</td></tr>
            <tr><td>DNI del usuario:</td><td class="bolderTd">' . $row['dni_usuario']. '</td></tr>
            <tr><td>Zona de la reforma:</td><td class="bolderTd">' . $row['nombre_zona'] . '</td></tr>
            <tr><td>Tipo de reforma:</td><td class="bolderTd">' . $row['nombre_proyecto'] . '</td></tr>
            <tr><td>Metros cuadrados aproximados:</td><td class="bolderTd">' . $row['cantidad_metros'] . '</td></tr>
            <tr><td>Jefe al mando:</td><td class="bolderTd">' . $row['nombre_completo_jefe'] . '</td></tr>
            <tr><td>DNI del jefe al mando:</td><td class="bolderTd">' . $row['dni_jefe'] . '</td></tr>
            <tr><td>Fecha de inicio de la reforma:</td><td class="bolderTd">' . $fecha_inicio . '</td></tr>
            <tr><td>Fecha de finalización de la reforma:</td><td class="bolderTd">' . $fecha_finalizacion . '</td></tr>
            <tr><td>Precio total de la reforma:</td><td class="bolderTd">' . $row['precio_aprox'] . '€</td></tr>
        </table>
    </div>
</body>
</html>';

    $dompdf->loadHtml($html);
    $dompdf->setPaper('A4', 'portrait');
    $dompdf->render();

    $file_path = '../reportes_reformas/reporte_reforma_'. $idReforma .'.pdf';

    if (file_exists($file_path)) {
        unlink($file_path);
    }
    
    $output = $dompdf->output();
    file_put_contents($file_path, $output);

    $file_path2 = 'reportes_reformas/reporte_reforma_'. $idReforma .'.pdf';
    $query_update = "UPDATE `Proyecto_reforma` SET `campo_reforma_pdf` = '$file_path2' WHERE `id_reforma` = $idReforma";
    $conexion->query($query_update);

    $query_check_favoritos = "SELECT * FROM `Documentos_favoritos` WHERE `id_reforma_documento` = $idReforma";
    $resultado_favoritos = $conexion->query($query_check_favoritos);

    if ($resultado_favoritos->num_rows == 0) {
        $query_insert_favoritos = "INSERT INTO `Documentos_favoritos` (`id_usuario_documento`, `id_reforma_documento`, `es_favorito`)
                                   VALUES (" . $row['usuario_solicitante'] . ", '$idReforma', '0')";
        $conexion->query($query_insert_favoritos);
    }
    
    $mensaje = "correct";
} else {
    $mensaje = 'No se encontraron datos para el ID de reforma proporcionado.';
}

$response = array(
    'file_path' => $file_path2 ?? '',
    'message' => $mensaje
);

echo json_encode($response);
$conexion->close();
?>