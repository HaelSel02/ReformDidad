<?php
include("conexion.php");

$user = isset($_POST['user']) ? trim($_POST['user']) : '';
$pass = isset($_POST['pass']) ? $_POST['pass'] : '';
$errorCredenciales = "Error de credenciales. Inténtelo de nuevo.";

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || $user === '' || $pass === '') {
    echo $errorCredenciales;
    exit;
}

$r = q($conexion, "SELECT * FROM Usuarios WHERE nombre_usuario = ? AND cuenta_activa = 1", 's', array($user));
$fila = ($r instanceof mysqli_result) ? $r->fetch_assoc() : null;

if ($fila && password_ok($pass, $fila['password'])) {
    if (password_es_antigua($fila['password'])) {
        q($conexion, "UPDATE Usuarios SET password = ? WHERE id_usuario = ?", 'si', array(hash_password($pass), $fila['id_usuario']));
    }
    session_regenerate_id(true);
    $_SESSION['user'] = $fila['nombre_usuario'];
    $_SESSION['rol'] = $fila['tipo_usuario'];
    $_SESSION['id_user'] = $fila['id_usuario'];
    echo "Success";
    $conexion->close();
    exit;
}

$r = q($conexion, "SELECT * FROM Empleados WHERE nombre_empleado = ?", 's', array($user));
$fila = ($r instanceof mysqli_result) ? $r->fetch_assoc() : null;

if ($fila && password_ok($pass, $fila['password_empleado'])) {
    if (password_es_antigua($fila['password_empleado'])) {
        q($conexion, "UPDATE Empleados SET password_empleado = ? WHERE id_empleado = ?", 'si', array(hash_password($pass), $fila['id_empleado']));
    }
    session_regenerate_id(true);
    $_SESSION['user'] = $fila['nombre_empleado'];
    $_SESSION['rol'] = $fila['tipo_usuario_global'];
    $_SESSION['id_user'] = $fila['id_empleado'];
    $_SESSION['id_supervisor'] = $fila['supervisor_empleado'];
    echo "Success";
} else {
    echo $errorCredenciales;
}

$conexion->close();
?>