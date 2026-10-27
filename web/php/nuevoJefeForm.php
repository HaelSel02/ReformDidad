<?php
include("conexion.php");

$nombre = isset($_POST['nombreJefeForm']) ? trim($_POST['nombreJefeForm']) : '';
$dni = isset($_POST['dniJefe']) ? trim($_POST['dniJefe']) : '';
$jefeActivo = (int)(isset($_POST['jefeActivo']) ? $_POST['jefeActivo'] : 0);

$existe = false;
foreach (array(array('Usuarios', 'dni_usuario'), array('Empleados', 'dni_empleado'), array('Jefes', 'dni_jefe')) as $t) {
    $r = q($conexion, "SELECT 1 FROM " . $t[0] . " WHERE " . $t[1] . " = ?", 's', array($dni));
    if ($r instanceof mysqli_result && $r->num_rows > 0) {
        $existe = true;
    }
}

if ($existe) {
    echo "El DNI / NIE ya existe en la BBDD. Por favor, introduzca otro DNI / NIE.";
} else {
    $ok = q($conexion, "INSERT INTO Jefes (nombre_completo_jefe, dni_jefe, jefe_activo) VALUES (?, ?, ?)", 'ssi', array($nombre, $dni, $jefeActivo));
    echo $ok ? "correct" : "error";
}

$conexion->close();
?>