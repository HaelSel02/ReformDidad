<?php
include("conexion.php");

$idEmpleado = (int)(isset($_POST['id_empleado']) ? $_POST['id_empleado'] : 0);
$passAntigua = isset($_POST['passAntigua']) ? $_POST['passAntigua'] : '';
$passNueva = isset($_POST['passNueva']) ? $_POST['passNueva'] : '';

$r = q($conexion, "SELECT password_empleado FROM Empleados WHERE id_empleado = ?", 'i', array($idEmpleado));
$row = ($r instanceof mysqli_result) ? $r->fetch_assoc() : null;

if (!$row) {
    echo "error";
} elseif (password_ok($passAntigua, $row['password_empleado'])) {
    $ok = q($conexion, "UPDATE Empleados SET password_empleado = ? WHERE id_empleado = ?", 'si', array(hash_password($passNueva), $idEmpleado));
    echo $ok ? "correct" : "error";
} elseif (password_ok($passNueva, $row['password_empleado'])) {
    echo "esMisma";
} else {
    echo "error";
}

$conexion->close();
?>