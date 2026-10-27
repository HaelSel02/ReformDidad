<?php
include("conexion.php");

$user = $_POST['usuarioForm'];
$password = hash_password($_POST['passUsuario']);
$email = $_POST['emailUsuario'];
$telefono = $_POST['telUsuario'];
$dni = $_POST['dniUsuario'];
$cuentaActiva = $_POST['cuentaActiva'];

$query_verificar_user_usuarios = "SELECT * FROM Usuarios WHERE nombre_usuario = ?";
$stmt_user_usuarios = $conexion->prepare($query_verificar_user_usuarios);
$stmt_user_usuarios->bind_param("s", $user);
$stmt_user_usuarios->execute();
$resultado_user_usuarios = $stmt_user_usuarios->get_result();

$query_verificar_email_usuarios = "SELECT * FROM Usuarios WHERE email = ?";
$stmt_email_usuarios = $conexion->prepare($query_verificar_email_usuarios);
$stmt_email_usuarios->bind_param("s", $email);
$stmt_email_usuarios->execute();
$resultado_email_usuarios = $stmt_email_usuarios->get_result();

$query_verificar_dni_usuarios = "SELECT * FROM Usuarios WHERE dni_usuario = ?";
$stmt_dni_usuarios = $conexion->prepare($query_verificar_dni_usuarios);
$stmt_dni_usuarios->bind_param("s", $dni);
$stmt_dni_usuarios->execute();
$resultado_dni_usuarios = $stmt_dni_usuarios->get_result();

$query_verificar_user_empleados = "SELECT * FROM Empleados WHERE nombre_empleado = ?";
$stmt_user_empleados = $conexion->prepare($query_verificar_user_empleados);
$stmt_user_empleados->bind_param("s", $user);
$stmt_user_empleados->execute();
$resultado_user_empleados = $stmt_user_empleados->get_result();

$query_verificar_email_empleados = "SELECT * FROM Empleados WHERE email_empleado = ?";
$stmt_email_empleados = $conexion->prepare($query_verificar_email_empleados);
$stmt_email_empleados->bind_param("s", $email);
$stmt_email_empleados->execute();
$resultado_email_empleados = $stmt_email_empleados->get_result();

$query_verificar_dni_empleados = "SELECT * FROM Empleados WHERE dni_empleado = ?";
$stmt_dni_empleados = $conexion->prepare($query_verificar_dni_empleados);
$stmt_dni_empleados->bind_param("s", $dni);
$stmt_dni_empleados->execute();
$resultado_dni_empleados = $stmt_dni_empleados->get_result();

$query_verificar_dni_jefes = "SELECT * FROM Jefes WHERE dni_jefe = ?";
$stmt_dni_jefes = $conexion->prepare($query_verificar_dni_jefes);
$stmt_dni_jefes->bind_param("s", $dni);
$stmt_dni_jefes->execute();
$resultado_dni_jefes = $stmt_dni_jefes->get_result();

if ($resultado_user_usuarios && $resultado_email_usuarios && $resultado_dni_usuarios && $resultado_user_empleados && $resultado_email_empleados && $resultado_dni_empleados && $resultado_dni_jefes) {
    $row_user_usuarios = $resultado_user_usuarios->fetch_assoc();
    $row_email_usuarios = $resultado_email_usuarios->fetch_assoc();
    $row_dni_usuarios = $resultado_dni_usuarios->fetch_assoc();
    $row_user_empleados = $resultado_user_empleados->fetch_assoc();
    $row_email_empleados = $resultado_email_empleados->fetch_assoc();
    $row_dni_empleados = $resultado_dni_empleados->fetch_assoc();
    $row_dni_jefes = $resultado_dni_jefes->fetch_assoc();

    if(($row_user_usuarios['nombre_usuario'] == $user || $row_user_empleados['nombre_empleado'] == $user) && ($row_email_usuarios['email'] == $email || $row_email_empleados['email_empleado'] == $email) && ($row_dni_usuarios['dni_usuario'] == $dni || $row_dni_empleados['dni_empleado'] == $dni || $row_dni_jefes['dni_jefe'] == $dni)){
        echo "El usuario, el correo electrónico y/o el DNI / NIE ya existen en la BBDD. Por favor, introduzca otro nombre de usuario, otro correo electrónico y/o DNI / NIE.";
    }
    elseif ($row_user_usuarios['nombre_usuario'] == $user || $row_user_empleados['nombre_empleado'] == $user) {
        echo "El nombre de usuario ya existe en la BBDD. Por favor, introduzca otro nombre de usuario.";
    }
    elseif ($row_dni_usuarios['dni_usuario'] == $dni || $row_dni_empleados['dni_empleado'] == $dni || $row_dni_jefes['dni_jefe'] == $dni) {
        echo "El DNI / NIE ya existe en la BBDD. Por favor, introduzca otro DNI / NIE.";
    }
    elseif ($row_email_usuarios['email'] == $email || $row_email_empleados['email_empleado'] == $email) {
        echo "El correo electrónico ya está registrado. Por favor, introduzca otro correo electrónico.";
    }
    else {
        $query_insert = "INSERT INTO Usuarios (nombre_usuario, dni_usuario, email, password, num_tlf, tipo_usuario, cuenta_activa) VALUES (?, ?, ?, ?, ?, '3', ?)";
        $stmt_insert = $conexion->prepare($query_insert);
        $stmt_insert->bind_param("ssssss", $user, $dni, $email, $password, $telefono, $cuentaActiva);
        
        if ($stmt_insert->execute()) {
            echo "correct";
        } else {
            echo "error";
        }
    }
}

$stmt_user_usuarios->close();
$stmt_email_usuarios->close();
$stmt_dni_usuarios->close();
$stmt_user_empleados->close();
$stmt_email_empleados->close();
$stmt_dni_empleados->close();
$stmt_dni_jefes->close();

$conexion->close();
?>
