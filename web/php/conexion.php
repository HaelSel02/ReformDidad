<?php
require_once __DIR__ . '/includes/bootstrap.php';

mysqli_report(MYSQLI_REPORT_OFF);
$conexion = new mysqli(
    cfg('DB_HOST', 'localhost'),
    cfg('DB_USER', 'tu_usuario'),
    cfg('DB_PASS', ''),
    cfg('DB_NAME', 'reformdidad_db')
);
if ($conexion->connect_error) {
    error_log('Conexión BBDD: ' . $conexion->connect_error);
    http_response_code(500);
    die('No se pudo conectar a la base de datos');
}
$conexion->set_charset('utf8mb4');

aplicar_politica(preg_replace('/\.php$/', '', basename($_SERVER['SCRIPT_NAME'])));
