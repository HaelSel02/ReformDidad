<?php
include("conexion.php");

$idUsuario = $_GET['id_user'];
$passwordPlano = isset($_POST['pass']) ? $_POST['pass'] : '';
$emailUsuario = $_POST['email'];
$telefonoUsuario = $_POST['telefono'];

// Verificar si el email ya existe y pertenece a otro usuario en la tabla de Usuarios
$query_verificar_email_usuarios = "SELECT * FROM Usuarios WHERE email = ? AND id_usuario != ?";
$stmt_email_usuarios = $conexion->prepare($query_verificar_email_usuarios);
$stmt_email_usuarios->bind_param("si", $emailUsuario, $idUsuario);
$stmt_email_usuarios->execute();
$resultado_email_usuarios = $stmt_email_usuarios->get_result();
$usuario_existente_usuarios = $resultado_email_usuarios->fetch_assoc();

// Verificar si el email ya existe y pertenece a otro usuario en la tabla de Empleados
$query_verificar_email_empleados = "SELECT * FROM Empleados WHERE email_empleado = ? AND id_empleado != ?";
$stmt_email_empleados = $conexion->prepare($query_verificar_email_empleados);
$stmt_email_empleados->bind_param("si", $emailUsuario, $idUsuario);
$stmt_email_empleados->execute();
$resultado_email_empleados = $stmt_email_empleados->get_result();
$usuario_existente_empleados = $resultado_email_empleados->fetch_assoc();

// Si el email ya está en uso por otro usuario en alguna de las tablas, mostrar un mensaje de error
if ($usuario_existente_usuarios || $usuario_existente_empleados) {
    echo "El correo electrónico proporcionado ya está en uso por otro usuario.";
} else {
    // Si el email no está en uso por otro usuario, proceder con la actualización del usuario
    $query_verificar_pass = "SELECT * FROM Usuarios WHERE id_usuario = ?";
    $stmt_verificar_pass = $conexion->prepare($query_verificar_pass);
    $stmt_verificar_pass->bind_param("i", $idUsuario);
    $stmt_verificar_pass->execute();
    $resultado_user = $stmt_verificar_pass->get_result();
    $row = $resultado_user->fetch_assoc();

    if (password_ok($passwordPlano, $row['password'])) {
        $query = "UPDATE Usuarios SET email = ?, num_tlf = ? WHERE id_usuario = ?";
        $stmt_update = $conexion->prepare($query);
        $stmt_update->bind_param("ssi", $emailUsuario, $telefonoUsuario, $idUsuario);
    } else {
        $passwordUsuario = hash_password($passwordPlano);
        $query = "UPDATE Usuarios SET password = ?, email = ?, num_tlf = ? WHERE id_usuario = ?";
        $stmt_update = $conexion->prepare($query);
        $stmt_update->bind_param("sssi", $passwordUsuario, $emailUsuario, $telefonoUsuario, $idUsuario);
    }

    if ($stmt_update->execute()) {
        echo "correct";
    } else {
        echo "error";
    }

    $stmt_update->close();
}

$stmt_email_usuarios->close();
$stmt_email_empleados->close();
if (isset($stmt_verificar_pass)) { $stmt_verificar_pass->close(); }
$conexion->close();
?>
