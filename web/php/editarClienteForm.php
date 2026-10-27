<?php
include("conexion.php");

$idUsuario = $_GET['id_usuario'];

$nombreUsuario = $_POST['usuarioForm'];
$dniUsuario = $_POST['dniUsuario'];
$passwordUsuario = $_POST['passUsuario'];
$emailUsuario = $_POST['emailUsuario'];
$telefonoUsuario = $_POST['telUsuario'];
$cuentaUsuario = $_POST['cuentaActiva'];

$passwordUsuarioCifrada = ($passwordUsuario === PASS_SIN_CAMBIOS) ? null : hash_password($passwordUsuario);

// Verificar si el nombre de usuario ya está en uso por otro usuario en la tabla Usuarios
$query_verificar_nombre_usuarios = "SELECT * FROM Usuarios WHERE nombre_usuario = ? AND id_usuario != ?";
$stmt_verificar_nombre_usuarios = $conexion->prepare($query_verificar_nombre_usuarios);
$stmt_verificar_nombre_usuarios->bind_param("si", $nombreUsuario, $idUsuario);
$stmt_verificar_nombre_usuarios->execute();
$resultado_nombre_usuarios = $stmt_verificar_nombre_usuarios->get_result();
$nombre_existente_usuarios = $resultado_nombre_usuarios->fetch_assoc();

// Verificar si el DNI ya está en uso por otro usuario en la tabla Usuarios
$query_verificar_dni_usuarios = "SELECT * FROM Usuarios WHERE dni_usuario = ? AND id_usuario != ?";
$stmt_verificar_dni_usuarios = $conexion->prepare($query_verificar_dni_usuarios);
$stmt_verificar_dni_usuarios->bind_param("si", $dniUsuario, $idUsuario);
$stmt_verificar_dni_usuarios->execute();
$resultado_dni_usuarios = $stmt_verificar_dni_usuarios->get_result();
$dni_existente_usuarios = $resultado_dni_usuarios->fetch_assoc();

// Verificar si el email ya está en uso por otro usuario en la tabla Usuarios
$query_verificar_email_usuarios = "SELECT * FROM Usuarios WHERE email = ? AND id_usuario != ?";
$stmt_verificar_email_usuarios = $conexion->prepare($query_verificar_email_usuarios);
$stmt_verificar_email_usuarios->bind_param("si", $emailUsuario, $idUsuario);
$stmt_verificar_email_usuarios->execute();
$resultado_email_usuarios = $stmt_verificar_email_usuarios->get_result();
$email_existente_usuarios = $resultado_email_usuarios->fetch_assoc();

// Verificar si el nombre de usuario ya está en uso por otro empleado en la tabla Empleados
$query_verificar_nombre_empleados = "SELECT * FROM Empleados WHERE nombre_empleado = ?";
$stmt_verificar_nombre_empleados = $conexion->prepare($query_verificar_nombre_empleados);
$stmt_verificar_nombre_empleados->bind_param("s", $nombreUsuario);
$stmt_verificar_nombre_empleados->execute();
$resultado_nombre_empleados = $stmt_verificar_nombre_empleados->get_result();
$nombre_existente_empleados = $resultado_nombre_empleados->fetch_assoc();

// Verificar si el DNI ya está en uso por otro empleado en la tabla Empleados
$query_verificar_dni_empleados = "SELECT * FROM Empleados WHERE dni_empleado = ?";
$stmt_verificar_dni_empleados = $conexion->prepare($query_verificar_dni_empleados);
$stmt_verificar_dni_empleados->bind_param("s", $dniUsuario);
$stmt_verificar_dni_empleados->execute();
$resultado_dni_empleados = $stmt_verificar_dni_empleados->get_result();
$dni_existente_empleados = $resultado_dni_empleados->fetch_assoc();

// Verificar si el email ya está en uso por otro empleado en la tabla Empleados
$query_verificar_email_empleados = "SELECT * FROM Empleados WHERE email_empleado = ?";
$stmt_verificar_email_empleados = $conexion->prepare($query_verificar_email_empleados);
$stmt_verificar_email_empleados->bind_param("s", $emailUsuario);
$stmt_verificar_email_empleados->execute();
$resultado_email_empleados = $stmt_verificar_email_empleados->get_result();
$email_existente_empleados = $resultado_email_empleados->fetch_assoc();

// Verificar si el DNI ya está en uso por otro empleado en la tabla Jefes
$query_verificar_dni_jefes = "SELECT * FROM Jefes WHERE dni_jefe = ?";
$stmt_verificar_dni_jefes = $conexion->prepare($query_verificar_dni_jefes);
$stmt_verificar_dni_jefes->bind_param("s", $dniUsuario);
$stmt_verificar_dni_jefes->execute();
$resultado_dni_jefes = $stmt_verificar_dni_jefes->get_result();
$dni_existente_jefes = $resultado_dni_jefes->fetch_assoc();

// Verificar si hay algún campo repetido
if ($nombre_existente_usuarios || $nombre_existente_empleados) {
    echo "El nombre de usuario ya está en uso por otro usuario o empleado.";
} elseif ($dni_existente_usuarios || $dni_existente_empleados || $dni_existente_jefes) {
    echo "El DNI ya está en uso por otro usuario, empleado o jefe.";
} elseif ($email_existente_usuarios || $email_existente_empleados) {
    echo "El email ya está en uso por otro usuario o empleado.";
} else {
    $query_verificar_pass = "SELECT password FROM Usuarios WHERE id_usuario = ?";
    $stmt_verificar_pass = $conexion->prepare($query_verificar_pass);
    $stmt_verificar_pass->bind_param("i", $idUsuario);
    $stmt_verificar_pass->execute();
    $resultado_pass = $stmt_verificar_pass->get_result();
    $row = $resultado_pass->fetch_assoc();

    // Si no hay campos repetidos, procedemos a actualizar la información del usuario en la tabla Usuarios
    if ($passwordUsuarioCifrada === null) {
        $query = "UPDATE Usuarios SET nombre_usuario = ?, dni_usuario = ?, email = ?, num_tlf = ?, cuenta_activa = ? WHERE id_usuario = ?";
        $stmt_update = $conexion->prepare($query);
        $stmt_update->bind_param("sssssi", $nombreUsuario, $dniUsuario, $emailUsuario, $telefonoUsuario, $cuentaUsuario, $idUsuario);
    } else {
        $query = "UPDATE Usuarios SET nombre_usuario = ?, dni_usuario = ?, password = ?, email = ?, num_tlf = ?, cuenta_activa = ? WHERE id_usuario = ?";
        $stmt_update = $conexion->prepare($query);
        $stmt_update->bind_param("ssssssi", $nombreUsuario, $dniUsuario, $passwordUsuarioCifrada, $emailUsuario, $telefonoUsuario, $cuentaUsuario, $idUsuario);
    }

    if ($stmt_update->execute()) {
        echo "correct";
    } else {
        echo "Error: " . $stmt_update->error;
    }
}

$conexion->close();
?>
