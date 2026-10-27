<?php
include("conexion.php");

$idEmpleado = $_GET['id_empleado'];

$nombreEmpleado = $_POST['usuarioEmpleadoForm'];
$dniEmpleado = $_POST['dniEmpleado'];
$passwordEmpleado = $_POST['passEmpleado'];
$emailEmpleado = $_POST['emailEmpleado'];
$telefonoEmpleado = $_POST['telEmpleado'];
$tipoEmpleado = $_POST['tipoEmpleado'];
$supervisorEmpleado = $_POST['supervisorEmpleado'];

$passwordEmpleadoCifrada = ($passwordEmpleado === PASS_SIN_CAMBIOS) ? null : hash_password($passwordEmpleado);

// Verificar si el nombre de usuario ya está en uso por otro usuario en la tabla Usuarios
$query_verificar_nombre_usuarios = "SELECT * FROM Usuarios WHERE nombre_usuario = ?";
$stmt_verificar_nombre_usuarios = $conexion->prepare($query_verificar_nombre_usuarios);
$stmt_verificar_nombre_usuarios->bind_param("s", $nombreEmpleado);
$stmt_verificar_nombre_usuarios->execute();
$resultado_nombre_usuarios = $stmt_verificar_nombre_usuarios->get_result();
$nombre_existente_usuarios = $resultado_nombre_usuarios->fetch_assoc();

// Verificar si el DNI ya está en uso por otro usuario en la tabla Usuarios
$query_verificar_dni_usuarios = "SELECT * FROM Usuarios WHERE dni_usuario = ?";
$stmt_verificar_dni_usuarios = $conexion->prepare($query_verificar_dni_usuarios);
$stmt_verificar_dni_usuarios->bind_param("s", $dniEmpleado);
$stmt_verificar_dni_usuarios->execute();
$resultado_dni_usuarios = $stmt_verificar_dni_usuarios->get_result();
$dni_existente_usuarios = $resultado_dni_usuarios->fetch_assoc();

// Verificar si el email ya está en uso por otro usuario en la tabla Usuarios
$query_verificar_email_usuarios = "SELECT * FROM Usuarios WHERE email = ?";
$stmt_verificar_email_usuarios = $conexion->prepare($query_verificar_email_usuarios);
$stmt_verificar_email_usuarios->bind_param("s", $emailEmpleado);
$stmt_verificar_email_usuarios->execute();
$resultado_email_usuarios = $stmt_verificar_email_usuarios->get_result();
$email_existente_usuarios = $resultado_email_usuarios->fetch_assoc();

// Verificar si el nombre de usuario ya está en uso por otro empleado en la tabla Empleados
$query_verificar_nombre_empleados = "SELECT * FROM Empleados WHERE nombre_empleado = ? AND id_empleado != ?";
$stmt_verificar_nombre_empleados = $conexion->prepare($query_verificar_nombre_empleados);
$stmt_verificar_nombre_empleados->bind_param("si", $nombreEmpleado, $idEmpleado);
$stmt_verificar_nombre_empleados->execute();
$resultado_nombre_empleados = $stmt_verificar_nombre_empleados->get_result();
$nombre_existente_empleados = $resultado_nombre_empleados->fetch_assoc();

// Verificar si el DNI ya está en uso por otro empleado en la tabla Empleados
$query_verificar_dni_empleados = "SELECT * FROM Empleados WHERE dni_empleado = ? AND id_empleado != ?";
$stmt_verificar_dni_empleados = $conexion->prepare($query_verificar_dni_empleados);
$stmt_verificar_dni_empleados->bind_param("si", $dniEmpleado, $idEmpleado);
$stmt_verificar_dni_empleados->execute();
$resultado_dni_empleados = $stmt_verificar_dni_empleados->get_result();
$dni_existente_empleados = $resultado_dni_empleados->fetch_assoc();

// Verificar si el email ya está en uso por otro empleado en la tabla Empleados
$query_verificar_email_empleados = "SELECT * FROM Empleados WHERE email_empleado = ? AND id_empleado != ?";
$stmt_verificar_email_empleados = $conexion->prepare($query_verificar_email_empleados);
$stmt_verificar_email_empleados->bind_param("si", $emailEmpleado, $idEmpleado);
$stmt_verificar_email_empleados->execute();
$resultado_email_empleados = $stmt_verificar_email_empleados->get_result();
$email_existente_empleados = $resultado_email_empleados->fetch_assoc();

// Verificar si el DNI ya está en uso por otro empleado en la tabla Jefes
$query_verificar_dni_jefes = "SELECT * FROM Jefes WHERE dni_jefe = ?";
$stmt_verificar_dni_jefes = $conexion->prepare($query_verificar_dni_jefes);
$stmt_verificar_dni_jefes->bind_param("s", $dniEmpleado); // Asegúrate de usar $dniEmpleado
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
    $query_verificar_pass = "SELECT password_empleado FROM Empleados WHERE id_empleado = ?";
    $stmt_verificar_pass = $conexion->prepare($query_verificar_pass);
    $stmt_verificar_pass->bind_param("i", $idEmpleado);
    $stmt_verificar_pass->execute();
    $resultado_pass = $stmt_verificar_pass->get_result();
    $row = $resultado_pass->fetch_assoc();

    // Si no hay campos repetidos, procedemos a actualizar la información del usuario en la tabla Usuarios
    if ($passwordEmpleadoCifrada === null) {
        $query = "UPDATE Empleados SET nombre_empleado = ?, dni_empleado = ?, email_empleado = ?, num_tlf_empleado = ?, tipo_empleado = ?, supervisor_empleado = ? WHERE id_empleado = ?";
        $stmt_update = $conexion->prepare($query);
        $stmt_update->bind_param("ssssssi", $nombreEmpleado, $dniEmpleado, $emailEmpleado, $telefonoEmpleado, $tipoEmpleado, $supervisorEmpleado, $idEmpleado);
    } else {
        $query = "UPDATE Empleados SET nombre_empleado = ?, dni_empleado = ?, password_empleado = ?, email_empleado = ?, num_tlf_empleado = ?, tipo_empleado = ?, supervisor_empleado = ? WHERE id_empleado = ?";
        $stmt_update = $conexion->prepare($query);
        $stmt_update->bind_param("sssssssi", $nombreEmpleado, $dniEmpleado, $passwordEmpleadoCifrada, $emailEmpleado, $telefonoEmpleado, $tipoEmpleado, $supervisorEmpleado, $idEmpleado);
    }

    if ($stmt_update->execute()) {
        echo "correct";
    } else {
        echo "Error: " . $stmt_update->error;
    }
}

$conexion->close();
?>
